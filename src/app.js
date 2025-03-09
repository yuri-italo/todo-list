import Project from "./project.js";
import projectStorage from "./storage.js";
import { compareAsc, isToday, isThisWeek, isThisMonth } from "date-fns";

export default class App {
  #storage;

  constructor() {
    this.#storage = projectStorage;
    this.#initialize();
  }

  addProject(project) {
    if (!(project instanceof Project)) {
      throw new Error("Invalid project");
    }

    if (!this.#isProjectNameUnique(project.name)) {
      throw new Error(`The project name '${project.name}' already exists`);
    }

    this.#storage.save(project);
    return project;
  }

  addProjectTodo(projectIndex, todo) {
    const projects = this.#storage.load();

    if (projectIndex < 0 || projectIndex >= projects.length) {
      throw new Error(`Invalid project index: ${projectIndex}`);
    }

    if (!todo || typeof todo !== "object" || Array.isArray(todo)) {
      throw new Error("Invalid todo object.");
    }

    const project = projects[projectIndex];
    project.add(todo);

    const updatedProjects = projects.with(projectIndex, project);
    this.#storage.saveMany(updatedProjects);
  }

  removeProject(projectName) {
    if (typeof projectName !== "string") {
      throw new Error("Invalid project name");
    }

    projectName = projectName.toLowerCase();
    if (this.#isTheDefaultProject(projectName)) {
      throw new Error("The default project cannot be removed");
    }

    const projects = this.#storage
      .load()
      .filter((project) => project.name.toLowerCase() !== projectName);

    this.#storage.saveMany(projects);
  }

  getProjects() {
    return this.#storage.load();
  }

  getAllTodos() {
    return this.#getTodos().sort((t1, t2) =>
      compareAsc(t1.dueDate, t2.dueDate)
    );
  }

  getTodayTodos() {
    return this.#getTodos().filter((todo) => isToday(todo.dueDate));
  }

  getWeekTodos() {
    return this.#getTodos().filter((todo) => isThisWeek(todo.dueDate));
  }

  getMonthTodos() {
    return this.#getTodos().filter((todo) => isThisMonth(todo.dueDate));
  }

  #initialize() {
    const projects = this.#storage.load();
    if (projects.length === 0) {
      this.#storage.save(new Project("default"));
    }
  }

  #getTodos() {
    return this.#storage.load().flatMap((project) => project.todoList);
  }

  #isProjectNameUnique(name) {
    if (typeof name !== "string") {
      throw new Error("Invalid project name");
    }

    return this.#storage
      .load()
      .find((project) => project.name.toLowerCase() === name)
      ? false
      : true;
  }

  #isTheDefaultProject(name) {
    if (typeof name !== "string") {
      throw new Error("Invalid project name");
    }

    return name.toLocaleLowerCase() === "default" ? true : false;
  }
}
