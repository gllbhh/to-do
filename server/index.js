/*
.\server\index.js

A javaScript file containing code to work with the database

ISSUES:
1) password for PostgreSQL is stores in the code
2) in the code example there was typescript syntax but the task said that is should be a javascript file 
*/

// .\server\index.js

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;

app.get("/", (req, res) => {
	const pool = openDb();

	pool.query("SELECT * FROM task", (error, result) => {
		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(200).json(result.rows);
		}
	});
});

app.post("/new", (req, res) => {
	const pool = openDb();

	pool.query(
		"INSERT INTO task (description) VALUES ($1) RETURNING *",
		[req.body.description], // Fixed typo: `docy` → `body`
		(error, result) => {
			if (error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(200).json({ id: result.rows[0].id });
			}
		}
	);
});

const openDb = () => {
	const pool = new Pool({
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		password: process.env.DB_PASSWORD,
		port: process.env.DB_PORT,
	});
	return pool;
};

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
