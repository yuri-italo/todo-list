import Todo from "./todo.js";
import Project from "./project.js";
import App from "./app.js";

const todo = new Todo(
  "Do the dishes",
  "I need to do it now",
  "2025-08-07",
  "High",
  "Nothing to say"
);

const anotherTodo = new Todo(
  "Buy groceries",
  "Get milk, eggs, and bread",
  "2025-08-08",
  "Medium",
  "Check for discounts"
);

// add
const project = new Project("My project");
project.add(todo);
console.log(project.todoList);
project.add(anotherTodo);
console.log(project.todoList);

// remove
const removed = project.remove(1);
console.log(project.todoList);
console.log(removed);

// edit
project.edit(anotherTodo, 0);
console.log(project.todoList);

// app logic
const app = new App();
console.log(app.projects);
console.log(app.addProject(project));
app.removeProject("My PROject");
console.log(app.projects);
