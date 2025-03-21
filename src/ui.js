import App from "./app.js";
import Todo from "./todo.js";
import Project from "./project.js";
import { format } from "date-fns";

export default class Ui {
  #app;
  #projectList;
  #main;

  constructor() {
    this.#app = new App();
    this.#main = document.querySelector(".main");
    this.#projectList = document.querySelector(".project-list");

    this.#initialize();
  }

  #displayProjects(projects) {
    this.#projectList.innerHTML = "";

    projects.forEach((p, index) => {
      const li = this.#createProjectLi(p, index);
      li.addEventListener("click", this.#handleProjectClick.bind(this));
      this.#projectList.appendChild(li);
    });
  }

  #displayTodos(todos) {
    this.#clearMain();

    todos.forEach((t, index) => {
      const todo = this.#createTodoCard(t, index);
      this.#main.appendChild(todo);
    });
  }

  #displayProjectTodos(projectIndex) {
    this.#clearMain();

    const project = this.#app.getProjects()[projectIndex];
    const todos = project.todoList;
    
    const btnAddTodo = document.createElement("button");
    btnAddTodo.textContent = "➕ add todo";
    
    const btnRemoveProject = document.createElement("button");
    if (!this.#app.isTheDefaultProject(project.name)) {
      btnRemoveProject.textContent = "🗑️ remove project";
    }

    btnAddTodo.addEventListener("click", () => {
      this.#createTodoForm(projectIndex);
    });

    btnRemoveProject.addEventListener("click", () => {
      this.#removeProject(project.name);
    });

    this.#main.appendChild(btnAddTodo);
    this.#main.appendChild(btnRemoveProject);

    todos.forEach((todo, index) => {
      this.#main.appendChild(this.#createTodoCard(todo, index));
    });
  }

  #createProjectLi(project, index) {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = project.name;
    a.href = "#";
    a.dataset.index = index;
    li.appendChild(a);

    return li;
  }

  #removeProject(projectName) {
    this.#createDeleteForm(projectName);
  }

  #initialize() {
    document
      .querySelector(".all")
      .addEventListener("click", this.#handleAllClick.bind(this));
    document
      .querySelector(".today")
      .addEventListener("click", this.#handleTodayClick.bind(this));
    document
      .querySelector(".week")
      .addEventListener("click", this.#handleWeekClick.bind(this));
    document
      .querySelector(".month")
      .addEventListener("click", this.#handleMonthClick.bind(this));
    document
      .querySelector(".add-project")
      .addEventListener("click", this.#createProjectForm.bind(this));

    this.#displayTodos(this.#app.getAllTodos());
    this.#displayProjects(this.#app.getProjects());
  }

  #handleAllClick(event) {
    event.preventDefault();
    this.#displayTodos(this.#app.getAllTodos());
  }

  #handleTodayClick(event) {
    event.preventDefault();
    this.#displayTodos(this.#app.getTodayTodos());
  }

  #handleWeekClick(event) {
    event.preventDefault();
    this.#displayTodos(this.#app.getWeekTodos());
  }

  #handleMonthClick(event) {
    event.preventDefault();
    this.#displayTodos(this.#app.getMonthTodos());
  }

  #handleProjectClick(event) {
    this.#displayProjectTodos(event.target.dataset.index);
  }

  #clearMain() {
    this.#main.innerHTML = "";
  }

  #createTodoCard(todo, index) {
    const card = document.createElement("div");
    card.dataset.index = index;
    card.classList.add("todo-card");
    card.classList.add(`todo-card-${todo.priority.toLowerCase()}`);

    const title = document.createElement("h2");
    title.textContent = `${todo.title}`;

    const description = document.createElement("p");
    description.textContent = todo.description;

    const dueDate = document.createElement("p");
    dueDate.textContent = `Due: ${format(todo.dueDate, "yyyy-MM-dd")}`;

    const priority = document.createElement("p");
    priority.textContent = `Priority: ${todo.priority}`;

    const notes = document.createElement("p");
    notes.textContent = `Notes: ${todo.notes}`;

    const status = document.createElement("p");
    status.textContent = `Status: ${todo.checklist}`;

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(dueDate);
    card.appendChild(priority);
    card.appendChild(notes);
    card.appendChild(status);

    return card;
  }

  #createProjectForm() {
    this.#clearMain();

    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
      <div class="modal-content">
        <h2>Add New Project</h2>
        <input type="text" id="project-name" placeholder="Project Name" />
        <div class="modal-buttons">
          <button id="save-project">Save</button>
          <button id="cancel-project">Cancel</button>
        </div>
      </div>
    `;

    this.#main.appendChild(modal);

    document.getElementById("save-project").addEventListener("click", () => {
      const projectName = document.getElementById("project-name").value.trim();
      if (projectName) {
        const project = new Project(projectName);
        this.#app.addProject(project);

        modal.remove();
        this.#displayProjects(this.#app.getProjects());
        const projectIndex = this.#app.getProjects().length - 1;
        this.#displayProjectTodos(projectIndex);
      }
    });

    document.getElementById("cancel-project").addEventListener("click", () => {
      modal.remove();
      this.#displayProjects(this.#app.getProjects());
      this.#displayTodos(this.#app.getAllTodos());
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
        this.#displayProjects(this.#app.getProjects());
        this.#displayTodos(this.#app.getAllTodos());
      }
    });
  }

  #createTodoForm(projectIndex) {
    this.#clearMain();

    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
      <div class="modal-content">
        <h2>Add New Todo</h2>
        <form id="todo-form">
          <div class="form-group">
            <label for="todo-title">Title</label>
            <input type="text" id="todo-title" placeholder="Title" required />
          </div>
          <div class="form-group">
            <label for="todo-description">Description</label>
            <textarea id="todo-description" placeholder="Description"></textarea>
          </div>
          <div class="form-group">
            <label for="todo-due-date">Due Date</label>
            <input type="date" id="todo-due-date" required />
          </div>
          <div class="form-group">
            <label for="todo-priority">Priority</label>
            <select id="todo-priority" required>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div class="form-group">
            <label for="todo-notes">Notes</label>
            <textarea id="todo-notes" placeholder="Notes"></textarea>
          </div>
          <div class="form-group">
            <label for="todo-checklist">Status</label>
            <select id="todo-checklist" required>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="submit" id="save-todo">Save</button>
            <button type="button" id="cancel-todo">Cancel</button>
          </div>
        </form>
      </div>
    `;

    this.#main.appendChild(modal);

    const form = document.getElementById("todo-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("todo-title").value.trim();
      const description = document
        .getElementById("todo-description")
        .value.trim();
      const dueDate = document.getElementById("todo-due-date").value.trim();
      const priority = document.getElementById("todo-priority").value;
      const notes = document.getElementById("todo-notes").value.trim();
      const checklist = document.getElementById("todo-checklist").value;

      const newTodo = new Todo(
        title,
        description,
        dueDate,
        priority,
        notes,
        checklist
      );

      this.#app.addProjectTodo(projectIndex, newTodo);
      modal.remove();
      this.#displayProjectTodos(projectIndex);
    });

    document.getElementById("cancel-todo").addEventListener("click", () => {
      modal.remove();
      this.#displayProjectTodos(projectIndex);
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
        this.#displayProjectTodos(projectIndex);
      }
    });
  }

  #createDeleteForm(projectName) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <p>Are you sure you want to delete "${projectName}"?</p>
        <div class="modal-buttons">
          <button id="confirm-delete">Yes</button>
          <button id="cancel-delete">No</button>
        </div>
      </div>
    `;
    this.#main.appendChild(modal);

    document.getElementById("confirm-delete").addEventListener("click", () => {
      this.#app.removeProject(projectName);
      modal.remove();
      this.#displayProjects(this.#app.getProjects());
      this.#displayTodos(this.#app.getAllTodos());
    });

    document.getElementById("cancel-delete").addEventListener("click", () => {
      modal.remove();
    });
  }
}
