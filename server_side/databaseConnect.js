const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'moviearena.c94ckwwumw1x.us-east-1.rds.amazonaws.com',
	user: 'tarek',
	port: '3306',
	password: process.env.DB_PASSWORD,
	database: 'my_db'
});
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors({
	origin: 'http://127.0.0.1:5501'
}));
app.use(express.json());


connection.connect((error) => {
	if (error) {
		console.error(error);
	} else {
		console.log('Connected to the database');
	}
});
// const alterUsersTable = 'ALTER TABLE users ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP';
// connection.query(alterUsersTable, (error, results, fields) => {
// 	if (error) throw error;
// 	console.log('users table altered');
// })

app.post('/login', (req, res) => {
	const { username, password } = req.body;
	const getUser = `SELECT * FROM users WHERE username = ?;`;
	connection.query(getUser, [username], (error, results, fields) => {
		if (error) throw error;
		if (results.length > 0) {
			if (results[0].password === password) {
				res.send(results);
			} else {
				res.send({ message: 'wrong password or username' });
			}
			//res.send(results);
		} else {
			const modifiedResults = { username: results[0].username, fullname: results[0].fullname, id: results[0].id };
			res.send({ message: 'User not found', result: modifiedResults });
		}
	});
})

// sign-up
app.post('/signup', (req, res) => {
	///.log(req.body);
	const { username, fullname, password } = req.body;
	const getUser = `SELECT * FROM users WHERE username = ?;`;
	connection.query(getUser, [username], (error, results, fields) => {
		if (error) throw error;
		if (results.length > 0) {
			res.send({ message: 'User already exists', status: 'fail' });
		} else {
			const insertUser = `INSERT INTO users (fullname, username, password) VALUES (?, ?, ?);`;
			connection.query(insertUser, [fullname, username, password], (error, results, fields) => {
				if (error) throw error;
				const getUserID = `SELECT * FROM users WHERE username = ?;`;
				connection.query(getUserID, [username], (error, results, fields) => {
					if (error) throw error;
					const userID = results[0].id;
					res.send({ message: 'User created', id: userID, username: username, status: 'success' });
				});
				//res.send({ message: 'User created', username: username, status: 'success' });
			});
		}
	});
	// getAllUsers((users) => {
	// 	console.log(users);
	// })
})


function getAllUsers(callback) {
	const getAllusers = 'SELECT * FROM users';
	connection.query(getAllusers, (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		callback(results);
	});
}

// creating movies table
// const createMoviesTable = `CREATE TABLE IF NOT EXISTS movies (title VARCHAR(255), id INT , user_id INT, poster_path VARCHAR(255))`;
// connection.query(createMoviesTable, (error, results, fields) => {
// 	if (error) throw error;
// 	console.log('movies table created');
// });
// // creating series table
// const createSeriesTable = `CREATE TABLE IF NOT EXISTS series (title VARCHAR(255), id INT, user_id INT, poster_path VARCHAR(255))`;
// connection.query(createSeriesTable, (error, results, fields) => {
// 	if (error) throw error;
// 	console.log('series table created');
// });
const alterMovies = `ALTER TABLE movies ADD movieID INT PRIMARY KEY AUTO_INCREMENT;`
const alterSeries = `ALTER TABLE series ADD serieID INT PRIMARY KEY AUTO_INCREMENT;`
// connection.query(alterSeries, (error, results, fields) => {
// 	if (error) throw error;
// 	console.log('series table altered');
// })
//const ratingTable = `ALTER TABLE ratings ADD FOREIGN KEY (movieID) REFERENCES movies(movie_id);`
// const commentTable = `CREATE TABLE comments (
//     commentID INT PRIMARY KEY AUTO_INCREMENT,
//     movieID INT,
//     userID INT,
// 	username VARCHAR(255),
//     content TEXT,
//     timestamp DATETIME,
// 	FOREIGN KEY(movieID) REFERENCES movies(movieID),
// 	FOREIGN KEY(userID) REFERENCES users(id)
// );`


app.post('/addToFavs', (req, res) => {
	//console.log(req.body);
	const { movieId, moviePoster, movieTitle, username, contentType } = req.body;
	const getUserId = `SELECT * FROM users WHERE username = ?;`;
	let userID;
	connection.query(getUserId, [username], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}
		userID = results[0].id;
		const isMovieOrSerie = contentType === 'movie' ? 'movies' : 'series';
		const getMovie = `SELECT * FROM ${isMovieOrSerie} WHERE id = ? AND user_id = ?;`;
		connection.query(getMovie, [movieId, userID], (error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send({ message: 'Database error' });
				return;
			}
			if (results.length > 0) {
				res.send({ message: 'Movie already exists' });
				return;
			} else {
				const insertMovie = `INSERT INTO ${isMovieOrSerie} (title, id, user_id, poster_path) VALUES (?, ?, ?, ?);`;
				connection.query(insertMovie, [movieTitle, movieId, userID, moviePoster], (error, results, fields) => {
					if (error) {
						console.error(error);
						res.status(500).send({ message: 'Database error' });
						return;
					}
					res.send({ message: 'success' });
				});
			}
		});
		//getAllMovies(userID);

	});
})

// sending back user's fav movies
app.get('/getFavs', (req, res) => {
	const username = req.query.username;
	//console.log('server username', username);
	const getUserId = `SELECT * FROM users WHERE username = ?;`;
	connection.query(getUserId, [username], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}
		if (results[0]) {
			let all_content = [];
			const userID = results[0].id;
			const getMovies = `SELECT * FROM movies WHERE user_id = ?;`;
			connection.query(getMovies, [userID], (error, results, fields) => {
				if (error) {
					console.error(error);
					res.status(500).send({ message: 'Database error' });
					return;
				}
				all_content.push({ 'movies': results });
			});
			const getSeries = `SELECT * FROM series WHERE user_id = ?;`;
			connection.query(getSeries, [userID], (error, results, fields) => {
				if (error) {
					console.error(error);
					res.status(500).send({ message: 'Database error' });
					return;
				}
				all_content.push({ 'series': results });
				res.send(all_content);
			});
		} else {
			console.log('no user was found');
			res.status(404).send({ message: 'User not found' })
		}

	});
})

// check favs
app.get('/checkFav', (req, res) => {
	const { username, movieId, contentType } = req.query;
	//console.log(username, movieId, contentType);
	let userID;
	const getUserId = `SELECT * FROM users WHERE username = ?;`;
	connection.query(getUserId, [username], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}
		userID = results[0].id;
		if (userID) {
			//console.log('userID', userID);
			const isMovieOrSerie = contentType === 'movie' ? 'movies' : 'series';
			const getMovie = `SELECT * FROM ${isMovieOrSerie} WHERE id = ? AND user_id = ?;`;
			connection.query(getMovie, [parseInt(movieId), parseInt(userID)], (error, results, fields) => {
				//console.log(results);
				if (error) {
					console.error(error);
					res.status(500).send({ message: 'Database error' });
					return;
				}
				if (results.length > 0) {
					res.send({ message: 'success' });
				} else {
					res.send({ message: 'fail' });
				}
			});
		}
	});

});

// remove from favs
app.post('/removeFav', (req, res) => {
	const { movieId, username, contentType } = req.body;
	let userID;
	const getUserId = `SELECT * FROM users WHERE username = ?;`;
	connection.query(getUserId, [username], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}
		userID = results[0].id;
		if (userID) {
			const isMovieOrSerie = contentType === 'movie' ? 'movies' : 'series';
			const removeMovie = `DELETE FROM ${isMovieOrSerie} WHERE id = ? AND user_id = ?;`;
			connection.query(removeMovie, [movieId, userID], (error, results, fields) => {
				if (error) {
					console.error(error);
					res.status(500).send({ message: 'Database error' });
					return;
				}
				res.send({ message: 'success' });
			});
		}
	});
});
//create a moviesCommentTable
const addCommentsTable = `CREATE TABLE IF NOT EXISTS comments (
	commentID INT PRIMARY KEY AUTO_INCREMENT,
	movieID INT,
	userID INT,
	username VARCHAR(255),
	content TEXT,
	timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
);`


// adding comments 
app.post('/addComment', (req, res) => {
	const { contentType, contentID, username, comment } = req.body;
	const isMovieOrSerie = contentType === 'movie' ? 'movie' : 'series';
	const getUserId = `SELECT * FROM users WHERE username = ?;`;
	connection.query(getUserId, [username], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}

		const userID = results[0].id;
		movieID = parseInt(contentID);

		const checkMovieExists = `SELECT * FROM ${isMovieOrSerie}s WHERE id = ? AND user_id = ?;`;
		movieID = contentID;
		//console.log(contentID, movieID, userID, username,);
		const insertComment = `INSERT INTO comments (movieID, userID, username, content, type, timestamp) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP);`;
		connection.query(insertComment, [movieID, userID, username, comment, isMovieOrSerie], (error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send({ message: 'Database error' });
				return;
			}
			res.send({ message: 'success' });
		});
	});
});
// get comments
app.get('/getComments', (req, res) => {
	const { contentType, contentID } = req.query;
	const isMovieOrSerie = contentType === 'movie' ? 'movie' : 'series';
	const getComments = `SELECT * FROM comments WHERE movieID = ? AND type = ?;`;
	connection.query(getComments, [contentID, isMovieOrSerie], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}
		//console.log(results);
		res.send(results);
	});
});

// get user data
app.get('/getUser', (req, res) => {
	const { id } = req.query;
	const getUserId = `SELECT * FROM users WHERE id = ?;`;
	connection.query(getUserId, [id], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}
		if (results.length > 0) {
			const userdata = [{ 'username': results[0].username, 'fullname': results[0].fullname, 'id': results[0].id }];
			res.send(userdata);
		} else {
			res.status(404).send({ message: 'User not found' });
		}
	});
})
// follow user
app.post('/followUser', (req, res) => {
	const { toFollow, follower } = req.body;
	const getFollowerId = `SELECT * FROM users WHERE username = ?;`;
	connection.query(getFollowerId, [follower], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}
		const toFollowId = results[0].id;
		const insertToRelationships = `INSERT INTO relationships (followerID, followingID) VALUES (?, ?);`;
		connection.query(insertToRelationships, [toFollowId, toFollow], (error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send({ message: 'Database error' });
				return;
			}
			res.send({ message: 'success' });
		});
	})
})
// check if following current user
app.get('/checkIfFollowing', (req, res) => {
	const { userId, follower } = req.query;
	const getFollowerId = `SELECT * FROM users WHERE username = ?;`;
	connection.query(getFollowerId, [follower], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}
		const followerID = results[0].id;
		const checkIfFollowing = `SELECT * FROM relationships WHERE followerID = ? AND followingID = ?;`;
		connection.query(checkIfFollowing, [followerID, userId], (error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send({ message: 'Database error' });
				return;
			}
			if (results.length > 0) {
				res.send({ message: 'success' });
			} else {
				res.send({ message: 'fail' });
			}
		});
	})
})
// get followCount
app.get('/getFollowCount', (req, res) => {
	const { userId } = req.query;
	const getFollowCount = `SELECT * FROM relationships WHERE followerID = ?;`;
	let userdata = {};
	connection.query(getFollowCount, [userId], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}
		userdata.followers = results.length;
		const getFollowingCount = `SELECT * FROM relationships WHERE followingID = ?;`;
		connection.query(getFollowingCount, [userId], (error, results, fields) => {
			if (error) {
				console.error(error);
				res.status(500).send({ message: 'Database error' });
				return;
			}
			userdata.following = results.length;

			res.send(userdata);
		});
	});
});

// add rating
app.post('/addRating', (req, res) => {
	const { contentType, contentID, username, rating } = req.body;
	const getUserID = `SELECT * FROM users where username = ?`;
	connection.query(getUserID, [username], (error, results, fields) => {
		if (error) {
			console.log(error)
			res.status(500).send({ message: 'Database error' })
			return;
		}
		const userID = results[0].id;
		const dbType = contentType == 'tv' ? 'ratingsTV' : 'ratings';
		const colName = contentType == 'tv' ? 'tvID' : 'movieID';
		const addRatingQuery = `INSERT INTO ${dbType} (userID, rating, ${colName}) values (?, ?, ?)`;
		connection.query(addRatingQuery, [userID, rating, contentID], (error, results, fields) => {
			if (error) {
				console.log(error)
				res.status(500).send({ message: 'Database error' })
				return;
			}
			res.send({ message: 'success' });
		})
	})
})
app.get('/getRating', (req, res) => {
	const { contentType, contentID, username } = req.query;
	const getUserID = `SELECT * FROM users where username = ?`;
	connection.query(getUserID, [username], (error, results, fields) => {
		if (error) {
			console.log(error)
			res.status(500).send({ message: 'Database error' })
			return;
		}
		const userID = results[0].id;
		const dbType = contentType == 'tv' ? 'ratingsTV' : 'ratings';
		const colName = contentType == 'tv' ? 'tvID' : 'movieID';
		const getRatingQuery = `SELECT * FROM ${dbType} WHERE userID = ? AND ${colName} = ?`;
		connection.query(getRatingQuery, [userID, contentID], (error, results, fields) => {
			if (error) {
				console.log(error)
				res.status(500).send({ message: 'Database error' })
				return;
			}
			res.send(results);
		})
	})
})
// get users accotding to query
app.get('/getUsers', (req, res) => {
	const { username } = req.query;
	const getUsers = `SELECT * FROM users WHERE fullname LIKE ?;`;
	connection.query(getUsers, [username + '%'], (error, results, fields) => {
		if (error) {
			console.error(error);
			res.status(500).send({ message: 'Database error' });
			return;
		}
		res.send(results);
	});
})


function getAllMovies(userID) {
	//console.log('getting movies', userID);
	const getMovies = `SELECT * FROM movies WHERE user_id = ?;`;
	connection.query(getMovies, [userID], (error, results, fields) => {
		if (error) {
			console.error(error);
			return [];
		}
		console.log(results);
	});
}


// function to check if user exists
function checkUser(username) {
	return new Promise((resolve, reject) => {
		const getUserId = `SELECT * FROM users WHERE username = ?;`;
		connection.query(getUserId, [username], (error, results, fields) => {
			if (error) {
				console.error(error);
				reject(error);
			}
			if (results.length > 0) {
				resolve(results[0].id);
				//return (results[0].id);
			} else {
				resolve(false);
			}
		});
	});
}

const port = process.env.PORT || 5000;

app.listen(5500, () => {
	console.log('Server is running on port 5500');
});
