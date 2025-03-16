import { Task } from "./Task.js";

class Todos {
	// Private properties
	#tasks = []; // Array to store task objects
	#backend_url = ""; // Backend API URL

	// Constructor initializes the backend URL
	constructor(url) {
		this.#backend_url = url;
	}

	// Method to fetch tasks from the backend
	getTasks = () => {
		return new Promise(async (resolve, reject) => {
			// Fetch tasks from the backend API
			fetch(this.#backend_url)
				.then((response) => response.json()) // Parse response as JSON
				.then(
					(json) => {
						this.#readJson(json); // Process JSON response into task objects
						resolve(this.#tasks); // Resolve the promise with the task list
					},
					(error) => {
						reject(error); // Reject the promise in case of an error
					}
				);
		});
	};

	// Private method to convert JSON data into Task objects and store them in #tasks
	#readJson = (tasksAsJson) => {
		tasksAsJson.forEach((node) => {
			const task = new Task(node.id, node.description); // Create a new Task object
			this.#tasks.push(task); // Add it to the tasks array
		});
	};

	// Private method to add a task to the array
	#addToArray = (id, text) => {
		const task = new Task(id, text); // Create a new Task object
		this.#tasks.push(task); // Add it to the tasks array
		return task; // Return the newly created task
	};

	#removeFromArray = (id) => {
		const arrayWithoutRemoved = this.#tasks.filter((task) => task.id !== id);
		this.#tasks = arrayWithoutRemoved;
	};

	// Method to add a new task to the backend and store it in the local array
	addTask = (text) => {
		return new Promise(async (resolve, reject) => {
			const json = JSON.stringify({ description: text }); // Convert task description to JSON

			// Send a POST request to add a new task
			fetch(this.#backend_url + "/new", {
				method: "post",
				headers: { "Content-Type": "application/json" }, // Set request headers
				body: json, // Send the task description as JSON
			})
				.then((response) => response.json()) // Parse the response JSON
				.then(
					(json) => {
						resolve(this.#addToArray(json.id, text)); // Add the new task to the array and resolve
					},
					(error) => {
						reject(error); // Reject the promise in case of an error
					}
				);
		});
	};

	// Method to remov etask from the backend
	removeTask = (id) => {
		return new Promise(async (resolve, reject) => {
			fetch(this.#backend_url + "/delete/" + id, {
				method: "delete",
			})
				.then((response) => response.json())
				.then(
					(json) => {
						this.#removeFromArray(id);
						resolve(json.id);
					},
					(error) => {
						reject(error);
					}
				);
		});
	};
}

// Export the Todos class so it can be imported in other files
export { Todos };
