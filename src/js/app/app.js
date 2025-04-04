import Project from "../models/project.js";
import projectStorage from "../services/storage.js";
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
    if (this.isTheDefaultProject(projectName)) {
      throw new Error("The default project cannot be removed");
    }

    const projects = this.#storage
      .load()
      .filter((project) => project.name.toLowerCase() !== projectName);

    this.#storage.saveMany(projects);
  }

  updateTodo(projectName, todoIndex, updatedTodo) {
    todoIndex = parseInt(todoIndex);

    if (typeof projectName !== "string" || projectName.trim() === "") {
      throw new Error("Invalid project name: must be a non-empty string");
    }

    if (
      typeof todoIndex !== "number" ||
      !Number.isInteger(todoIndex) ||
      todoIndex < 0
    ) {
      throw new Error("Invalid todo index: must be a positive integer");
    }

    if (!updatedTodo || typeof updatedTodo !== "object") {
      throw new Error("Invalid todo: must be a valid todo object");
    }
    const projects = this.#storage.load();

    const projectIndex = projects.findIndex(
      (p) => p.name.toLowerCase() === projectName.toLowerCase()
    );

    if (projectIndex === -1) {
      throw new Error(`Project "${projectName}" not found`);
    }
    const project = projects[projectIndex];

    if (todoIndex >= project.todoList.length) {
      throw new Error(`Invalid todo index: ${todoIndex} (out of bounds)`);
    }
    project.update(updatedTodo, todoIndex);

    this.#storage.saveMany(projects);
  }

  removeTodo(projectName, todoIndex) {
    if (typeof projectName !== "string") {
      throw new Error("Invalid project name");
    }

    const projects = this.#storage.load();

    const project = projects.find(
      (project) => project.name.toLowerCase() === projectName.toLowerCase()
    );

    if (!project) {
      throw new Error("Project not found");
    }

    if (todoIndex >= 0 && todoIndex < project.todoList.length) {
      project.remove(Number.parseInt(todoIndex));
    } else {
      throw new Error("Invalid todo index");
    }

    this.#storage.saveMany(projects);
  }

  isTheDefaultProject(name) {
    if (typeof name !== "string") {
      throw new Error("Invalid project name");
    }

    return name.toLocaleLowerCase() === "default" ? true : false;
  }

  getProjectIndex(projectName) {
    const projects = this.#storage.load();
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].name === projectName) {
        return i;
      }
    }
    return -1;
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
    return this.#storage.load().flatMap((project) => {
      return project.todoList.map((todo, index) => ({
        ...todo.toJSON(),
        index: index,
        project: project.name,
      }));
    });
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
}
