require("dotenv").config();
const { Pool } = require("pg");

const query = (sql, values = []) => {
	return new Promise(async (resolve, reject) => {
		try {
			const pool = openDb();
			const result = await pool.query(sql, values);
			resolve(result);
		} catch (error) {
			reject(error.message);
		}
	});
};

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

module.exports = {
	query,
};
