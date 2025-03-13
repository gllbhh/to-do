/*
.\js\index.js
Java script that runs on the index.html page
*/

const list = document.querySelector("ul");
const imput = document.querySelector("input");

imput.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
		const task = imput.value.trim();
		if (task !== "") {
			const li = document.createElement("li");
			li.setAttribute("class", "list-group-item");
			li.innerHTML = task;
			list.append(li);
			imput.value = "";
		}
	}
});
