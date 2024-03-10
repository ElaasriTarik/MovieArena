const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'moviearena.c94ckwwumw1x.us-east-1.rds.amazonaws.com',
	user: 'tarek',
	port: '3306',
	password: 'tarek112233',
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

			res.send({ message: 'User not found', result: results });
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
			res.send({ message: 'User already exists' });
		} else {
			const insertUser = `INSERT INTO users (fullname, username, password) VALUES (?, ?, ?);`;
			connection.query(insertUser, [fullname, username, password], (error, results, fields) => {
				if (error) throw error;
				res.send({ message: 'User created', username: username, status: 'success' });
			});
		}
	});
	getAllUsers((users) => {
		console.log(users);
	})
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
const createMoviesTable = `CREATE TABLE IF NOT EXISTS movies (title VARCHAR(255), id INT, user_id INT, poster_path VARCHAR(255))`;
connection.query(createMoviesTable, (error, results, fields) => {
	if (error) throw error;
	console.log('movies table created');
});
// creating series table
const createSeriesTable = `CREATE TABLE IF NOT EXISTS series (title VARCHAR(255), id INT, user_id INT, poster_path VARCHAR(255))`;
connection.query(createSeriesTable, (error, results, fields) => {
	if (error) throw error;
	console.log('series table created');
});

app.post('/addToFavs', (req, res) => {
	console.log(req.body);
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
		const getMovie = `SELECT * FROM ${isMovieOrSerie} WHERE id = ?;`;
		connection.query(getMovie, [movieId], (error, results, fields) => {
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
		getAllMovies(userID);

	});
})

// sending back user's fav movies
app.get('/getFavs', (req, res) => {
	const username = req.query.username;
	console.log('server username', username);
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




function getAllMovies(userID) {
	console.log('getting movies', userID);
	const getMovies = `SELECT * FROM movies WHERE user_id = ?;`;
	connection.query(getMovies, [userID], (error, results, fields) => {
		if (error) {
			console.error(error);
			return [];
		}
		console.log(results);
	});

}
app.listen(5500, () => {
	console.log('Server is running on port 5500');
});
