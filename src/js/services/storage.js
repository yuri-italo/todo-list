import Project from "../models/project.js";
import Todo from "../models/todo.js";

export default (function () {
  const STORAGE_KEY = "projects";

  function save(project) {
    try {
      const projects = load();
      projects.push(project);

      const serializedProjects = JSON.stringify(projects);
      localStorage.setItem(STORAGE_KEY, serializedProjects);
    } catch (error) {
      console.error("Error saving projects:", error);
    }
  }

  function saveMany(projects) {
    clearProjects();

    projects.forEach((p) => {
      save(p);
    });
  }

  function load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      return JSON.parse(data).map((p) => {
        const project = new Project(p.name);
        p.todoList.forEach((t) =>
          project.add(
            new Todo(
              t.title,
              t.description,
              t.dueDate,
              t.priority,
              t.notes,
              t.checklist
            )
          )
        );
        return project;
      });
    } catch (error) {
      console.error("Error loading projects:", error);
      return [];
    }
  }

  function clearProjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error cleaning projects:", error);
    }
  }

  return {
    save,
    saveMany,
    load,
  };
})();
