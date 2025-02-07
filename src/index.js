import Todo from "./todo.js";
import Project from "./project.js";
import App from "./app.js";

const todo = new Todo(
  "Do the dishes",
  "I need to do it now",
  "2025-02-09",
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
  "2025-02-08",
  "High",
  "Do it before midnight"
);

const app = new App();
const project = new Project("Project One");
project.add(todo);
project.add(anotherTodo);
// app.addProject(project);
// app.removeProject("Project One");
