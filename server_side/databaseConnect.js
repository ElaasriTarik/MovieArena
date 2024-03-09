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
app.use(cors());
app.use(express.json());
// use sessions
app.use(session({
	secret: 'mysecretcode',
	resave: false,
	saveUninitialized: true
}));

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
			res.send(results);
		} else {

			res.send({ message: 'User not found', result: results });
		}
	});
})

// sign-up
app.post('/signup', (req, res) => {
	console.log(req.body);
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
app.listen(5500, () => {
	console.log('Server is running on port 5500');
});
