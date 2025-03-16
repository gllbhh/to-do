/*
.\js\index.js
JavaScript that runs on the index.html page
*/

// Backend API base URL
const BACKEND_ROOT_URL = "http://localhost:3001";

// Import the Todos class from the class directory
import { Todos } from "./class/Todos.js";

// Create a new instance of the Todos class with the backend URL
const todos = new Todos(BACKEND_ROOT_URL);

// Select the necessary DOM elements
const list = document.querySelector("ul"); // The <ul> element where tasks will be displayed
const input = document.querySelector("input"); // The input field for adding new tasks

// Function to create and render a task in the UI
const renderTask = (task) => {
	const li = document.createElement("li"); // Create a new <li> element
	li.setAttribute("class", "list-group-item");
	li.setAttribute("data-key", task.getId().toString());
	renderSpan(li, task.getText());
	renderLink(li, task.getId());
	list.appendChild(li); // Append the task to the <ul> list
};

const renderSpan = (li, text) => {
	const span = li.appendChild(document.createElement("span"));
	span.innerHTML = text;
};

const renderLink = (li, id) => {
	const a = li.appendChild(document.createElement("a"));
	a.innerHTML = '<i class="bi bi-trash"></i>';
	a.setAttribute("style", "float: right");
	a.addEventListener("click", (event) => {
		todos
			.removeTask(id)
			.then((removed_id) => {
				const li_to_remove = document.querySelector(`[data-key='${removed_id}']`);
				if (li_to_remove) {
					list.removeChild(li_to_remove);
				}
			})
			.catch((error) => {
				alert(error);
			});
	});
};

// Function to retrieve tasks from the backend and render them
const getTasks = async () => {
	todos
		.getTasks()
		.then((tasks) => {
			// Loop through each task and render it in the UI
			tasks.forEach((task) => {
				renderTask(task);
			});
			input.disabled = false; // Enable input field after tasks are loaded
		})
		.catch((error) => {
			alert(error); // Show an alert if an error occurs
		});
};

// Function to save a new task to the backend
const saveTask = async (task) => {
	try {
		const json = JSON.stringify({ description: task }); // Convert task description to JSON format

		// Send a POST request to the backend to save the task
		const response = await fetch(BACKEND_ROOT_URL + "/new", {
			method: "post",
			headers: {
				"Content-Type": "application/json", // Specify JSON format
			},
			body: json, // Send task data in request body
		});
		return response.json(); // Parse and return the JSON response
	} catch (error) {
		alert("Error retrieving tasks:" + error.message); // Show an error alert if request fails
	}
};

// Event listener for the input field to handle "Enter" key press
input.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		event.preventDefault(); // Prevent the default form submission behavior
		const task = input.value.trim(); // Trim whitespace from the input value

		if (task !== "") {
			// If the input is not empty, add the task
			todos.addTask(task).then((task) => {
				renderTask(task); // Render the new task in the UI
				input.value = ""; // Clear the input field
				input.focus(); // Focus the input field for the next entry
			});
		}
	}
});

// Call the function to fetch and display tasks when the page loads
getTasks();
