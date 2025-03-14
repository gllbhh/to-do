// Define the Task class
class Task {
	// Private properties (only accessible within the class)
	#id;
	#text;

	// Constructor to initialize a new Task instance with an ID and text
	constructor(id, text) {
		(this.#id = id), (this.#text = text);
	}

	// Method to retrieve the task ID
	getId() {
		return this.#id;
	}

	// Method to retrieve the task description (text)
	getText() {
		return this.#text;
	}
}

// Export the Task class so it can be imported in other files
export { Task };
