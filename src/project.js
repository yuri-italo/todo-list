import Todo from "./todo.js";

export default class Project {
  #name;
  #todoList;

  constructor(name = "default") {
    this.name = name;
    this.#todoList = [];
  }

  add(todo) {
    if (!(todo instanceof Todo)) {
      throw new Error("Invalid Todo");
    }

    this.#todoList.push(todo);
  }

  edit(todo, todoIndex) {
    if (!(todo instanceof Todo)) {
      throw new Error("Invalid Todo");
    }

    if (typeof todoIndex !== "number" || todoIndex < 0) {
      throw new Error("Invalid todo index");
    }

    if (this.#todoList[todoIndex]) {
      this.#todoList[todoIndex] = todo;
    } else {
      throw new Error(`The todo at index ${todoIndex} does not exist`);
    }
  }

  remove(todoIndex) {
    if (typeof todoIndex !== "number" || todoIndex < 0) {
      throw new Error("Invalid todo index");
    }

    return this.#todoList.splice(todoIndex, 1);
  }

  set name(newName) {
    if (typeof newName === "string" && newName.trim() !== "") {
      this.#name = newName.trim();
    } else {
      throw new Error("Name must be a non-empty string.");
    }
  }

  get name() {
    return this.#name;
  }

  get todoList() {
    return [...this.#todoList];
  }
}
