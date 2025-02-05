import Project from "./project.js";
import { compareAsc, isToday, isThisWeek, isThisMonth } from "date-fns";

export default class App {
  #projects;

  constructor() {
    this.#projects = [new Project()];
  }

  addProject(project) {
    if (!(project instanceof Project)) {
      throw new Error("Invalid project");
    }
    const projectName = project.name;

    if (this.#isProjectNameUnique(projectName)) {
      this.#projects.push(project);
      return this.projects;
    } else {
      throw new Error(`The project name '${projectName}' already exists`);
    }
  }

  removeProject(projectName) {
    if (typeof projectName !== "string") {
      throw new Error("Invalid project name");
    }

    projectName = projectName.toLowerCase();
    if (!this.#isTheDefaultProject(projectName)) {
      for (let i = 0; i < this.#projects.length; i++) {
        if (projectName === this.#projects[i].name.toLowerCase()) {
          this.#projects.splice(i, 1);
          return;
        }
      }
    } else {
      throw new Error("The default project can not be removed");
    }
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

  #getTodos() {
    return this.#projects.flatMap((project) => project.todoList);
  }

  #isProjectNameUnique(name) {
    if (typeof name !== "string") {
      throw new Error("Invalid project name");
    }

    return this.#projects.find((project) => project.name.toLowerCase() === name)
      ? false
      : true;
  }

  #isTheDefaultProject(name) {
    if (typeof name !== "string") {
      throw new Error("Invalid project name");
    }

    return name.toLocaleLowerCase() === "default" ? true : false;
  }

  get projects() {
    return [...this.#projects];
  }
}
