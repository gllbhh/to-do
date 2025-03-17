/*
.\server\index.js

A JavaScript file containing code to work with the database
*/

// Import required modules
const express = require("express"); // Express framework for handling HTTP requests
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
// const { Pool } = require("pg"); // PostgreSQL client for database interaction
require("dotenv").config(); // Load environment variables from .env file
const { query } = require("./helpers/db.js");
const app = express(); // Initialize Express application

app.use(cors()); // Enable CORS to allow cross-origin requests
app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT; // Define the port number where the server will run

// Route to fetch all tasks from the database
app.get("/", async (req, res) => {
	console.log(query);
	try {
		const result = await query("SELECT * FROM task");
		const rows = result.rows ? result.rows : [];
		res.status(200).json(rows);
	} catch (error) {
		console.log(error);
		res.statusMessage = error;
		res.status(500).json({ error: error });
	}
});

// Route to add a new task to the database
app.post("/new", async (req, res) => {
	try {
		const result = await query("INSERT INTO task (description) values ($1) RETURNING *", [req.body.description]);
		res.status(200).json({ id: result.rows[0].id });
	} catch (error) {
		console.log(error);
		res.statusMessage = error;
		res.status(500).json({ error: error });
	}
});

app.delete("/delete/:id", async (req, res) => {
	const id = Number(req.params.id);
	try {
		const result = await query("DELETE FROM task WHERE id = $1", [id]);
		res.status(200).json({ id: id });
	} catch (error) {
		console.log(error);
		res.statusMessage = error;
		res.status(500).json({ error: error });
	}
});

// Function to establish a connection with the PostgreSQL database
// const openDb = () => {
// 	const pool = new Pool({
// 		user: process.env.DB_USER, // Database username from environment variables
// 		host: process.env.DB_HOST, // Database host
// 		database: process.env.DB_NAME, // Database name
// 		password: process.env.DB_PASSWORD, // Database password
// 		port: process.env.DB_PORT, // Database port number
// 	});
// 	return pool;
// };

// Start the Express server and listen on the specified port
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
