/*
.\server\index.js

A JavaScript file containing code to work with the database
*/

// Import required modules
const express = require("express"); // Express framework for handling HTTP requests
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
// const { Pool } = require("pg"); // PostgreSQL client for database interaction
require("dotenv").config(); // Load environment variables from .env file
//const { query } = require("./helpers/db.js");
const { todoRouter } = require("./routes/todo.js");

const app = express(); // Initialize Express application

app.use(cors()); // Enable CORS to allow cross-origin requests
app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(express.urlencoded({ extended: false }));
app.use("/", todoRouter);

const port = process.env.PORT; // Define the port number where the server will run

// Start the Express server and listen on the specified port
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
