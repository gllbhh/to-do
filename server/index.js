/*
.\server\index.js

A JavaScript file containing code to work with the database
*/

// Import required modules
const express = require("express"); // Express framework for handling HTTP requests
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
const { Pool } = require("pg"); // PostgreSQL client for database interaction
require("dotenv").config(); // Load environment variables from .env file

const app = express(); // Initialize Express application
app.use(cors()); // Enable CORS to allow cross-origin requests
app.use(express.json()); // Middleware to parse incoming JSON requests

const port = 3001; // Define the port number where the server will run

// Route to fetch all tasks from the database
app.get("/", (req, res) => {
	const pool = openDb(); // Open database connection

	// Execute SQL query to get all tasks
	pool.query("SELECT * FROM task", (error, result) => {
		if (error) {
			res.status(500).json({ error: error.message }); // Send an error response if query fails
		} else {
			res.status(200).json(result.rows); // Send retrieved tasks as JSON response
		}
	});
});

// Route to add a new task to the database
app.post("/new", (req, res) => {
	const pool = openDb(); // Open database connection

	// SQL query to insert a new task with provided description
	pool.query(
		"INSERT INTO task (description) VALUES ($1) RETURNING *",
		[req.body.description], // Extract description from request body
		(error, result) => {
			if (error) {
				res.status(500).json({ error: error.message }); // Send an error response if insertion fails
			} else {
				res.status(200).json({ id: result.rows[0].id }); // Send back the ID of the newly inserted task
			}
		}
	);
});

// Function to establish a connection with the PostgreSQL database
const openDb = () => {
	const pool = new Pool({
		user: process.env.DB_USER, // Database username from environment variables
		host: process.env.DB_HOST, // Database host
		database: process.env.DB_NAME, // Database name
		password: process.env.DB_PASSWORD, // Database password
		port: process.env.DB_PORT, // Database port number
	});
	return pool;
};

// Start the Express server and listen on the specified port
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
