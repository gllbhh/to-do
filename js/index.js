/*
.\js\index.js
Java script that runs on the index.html page
*/

//const { json } = require("body-parser");

const BACKEND_ROOT_URL = "http://localhost:3001";

const list = document.querySelector("ul");
const input = document.querySelector("input");

const renderTask = (task) => {
	const li = document.createElement("li");
	li.setAttribute("class", "list-group-item");
	li.innerHTML = task;
	list.appendChild(li);
};

const getTasks = async () => {
	try {
		const response = await fetch(BACKEND_ROOT_URL);
		const json = await response.json();
		json.forEach((task) => {
			renderTask(task.description);
		});
		input.disabled = false;
	} catch (error) {
		alert("Error retrieveing tasks:" + error.message);
	}
};

const saveTask = async (task) => {
	try {
		const json = JSON.stringify({ description: task });
		const response = await fetch(BACKEND_ROOT_URL + "/new", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: json,
		});
		return response.json();
	} catch (error) {
		alert("Error retrieveing tasks:" + error.message);
	}
};

input.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
		const task = input.value.trim();
		if (task !== "") {
			saveTask(task).then((json) => {
				renderTask(task);
				input.value = "";
			});
		}
	}
});

getTasks();
