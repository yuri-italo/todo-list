import Todo from "./todo.js";
import Project from "./project.js";
import App from "./app.js";

const todo = new Todo(
  "Do the dishes",
  "I need to do it now",
  "2025-08-09",
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

const yetAnotherTodo = new Todo(
  "Pay bills",
  "Electricity and internet",
  "2025-02-05",
  "High",
  "Do it before midnight"
);

const app = new App();

// add
const defaultProject = app.projects[0];
const project = new Project("My project");
project.add(todo);
console.log(project.todoList);
project.add(anotherTodo);
console.log(project.todoList);
defaultProject.add(yetAnotherTodo);
console.log(defaultProject.todoList);

// remove
// const removed = project.remove(1);
// console.log(project.todoList);
// console.log(removed);

// edit
// project.edit(anotherTodo, 0);
// console.log(project.todoList);

// add project
console.log(app.projects);
console.log(app.addProject(project));
console.log(app.projects);

// remove project
// app.removeProject("My PROject");

// get todos
console.log(app.getAllTodos());
console.log(app.getTodayTodos());
