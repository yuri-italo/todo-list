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
    if (todos.length > 0) {
      todos.forEach((t) => {
        const todo = this.#createTodoCard(t);
        this.#main.appendChild(todo);
      });
    } else {
      const p = document.createElement("p");
      p.innerText = "No to-dos here...";
      this.#main.appendChild(p);
    }
  }

  #displayProjectTodos(projectIndex) {
    this.#clearMain();
    console.log(projectIndex);
    
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

    todos.forEach((todo, todoIndex) => {
      this.#main.appendChild(
        this.#createTodoCard(todo, todoIndex, project.name)
      );
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
    this.#createDeleteProjectForm(projectName);
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

  #handleDeleteTodo(event) {
    const card = event.target.closest("div");
    const projectName = card.dataset.project;
    const todoIndex = card.dataset.index;

    this.#createDeleteTodoForm(projectName, todoIndex);
  }

  #handleEditTodo(event) {
    const card = event.target.closest(".todo-card");
    const projectName = card.dataset.project;
    const todoIndex = card.dataset.index;

    this.#createEditTodoForm(projectName, todoIndex);
  }

  #clearMain() {
    this.#main.innerHTML = "";
  }

  #createTodoCard(todo, todoIndex, projectName) {
    const card = document.createElement("div");

    const index =
      typeof todoIndex !== "undefined" && todoIndex !== null
        ? todoIndex
        : todo?.index ?? 0; 
    const project =
      typeof projectName !== "undefined" && projectName !== null
        ? projectName
        : todo?.project ?? "default";

    card.dataset.index = index;
    card.dataset.project = project;
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

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("todo-buttons");

    const editButton = document.createElement("button");
    editButton.textContent = "✏️";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", this.#handleEditTodo.bind(this));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", this.#handleDeleteTodo.bind(this));

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(dueDate);
    card.appendChild(priority);
    card.appendChild(notes);
    card.appendChild(status);
    card.appendChild(buttonContainer);

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
        <div id="project-error" class="error-message"></div>
        <div class="modal-buttons">
          <button id="save-project">Save</button>
          <button id="cancel-project">Cancel</button>
        </div>
      </div>
    `;

    this.#main.appendChild(modal);

    const projectInput = document.getElementById("project-name");
    const errorDisplay = document.getElementById("project-error");

    projectInput.addEventListener("input", () => {
      errorDisplay.textContent = "";
    });

    document.getElementById("save-project").addEventListener("click", () => {
      const projectName = projectInput.value.trim();
      errorDisplay.textContent = "";

      if (projectName) {
        try {
          const project = new Project(projectName);
          this.#app.addProject(project);

          modal.remove();
          this.#displayProjects(this.#app.getProjects());
          const projectIndex = this.#app.getProjects().length - 1;
          this.#displayProjectTodos(projectIndex);
        } catch (error) {
          errorDisplay.textContent = error.message;
          projectInput.focus();
        }
      } else {
        errorDisplay.textContent = "Project name cannot be empty";
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

  #createEditTodoForm(projectName, todoIndex) {
    const todo = this.#app.getProjects().find((p) => p.name === projectName)
      .todoList[todoIndex];

    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
    <div class="modal-content">
      <h2>Edit Todo</h2>
      <form id="edit-todo-form">
        <div class="form-group">
          <label for="edit-todo-title">Title</label>
          <input type="text" id="edit-todo-title" placeholder="Title" value="${
            todo.title
          }" required />
        </div>
        <div class="form-group">
          <label for="edit-todo-description">Description</label>
          <textarea id="edit-todo-description" placeholder="Description">${
            todo.description
          }</textarea>
        </div>
        <div class="form-group">
          <label for="edit-todo-due-date">Due Date</label>
          <input type="date" id="edit-todo-due-date" value="${format(
            todo.dueDate,
            "yyyy-MM-dd"
          )}" required />
        </div>
        <div class="form-group">
          <label for="edit-todo-priority">Priority</label>
          <select id="edit-todo-priority" required>
            <option value="High" ${
              todo.priority === "High" ? "selected" : ""
            }>High</option>
            <option value="Medium" ${
              todo.priority === "Medium" ? "selected" : ""
            }>Medium</option>
            <option value="Low" ${
              todo.priority === "Low" ? "selected" : ""
            }>Low</option>
          </select>
        </div>
        <div class="form-group">
          <label for="edit-todo-notes">Notes</label>
          <textarea id="edit-todo-notes" placeholder="Notes">${
            todo.notes
          }</textarea>
        </div>
        <div class="form-group">
          <label for="edit-todo-checklist">Status</label>
          <select id="edit-todo-checklist" required>
            <option value="Not Started" ${
              todo.checklist === "Not Started" ? "selected" : ""
            }>Not Started</option>
            <option value="In Progress" ${
              todo.checklist === "In Progress" ? "selected" : ""
            }>In Progress</option>
            <option value="Completed" ${
              todo.checklist === "Completed" ? "selected" : ""
            }>Completed</option>
          </select>
        </div>
        <div class="modal-buttons">
          <button type="submit" id="save-edit-todo">Save</button>
          <button type="button" id="cancel-edit-todo">Cancel</button>
        </div>
      </form>
    </div>
  `;

    this.#main.appendChild(modal);

    const form = document.getElementById("edit-todo-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const updatedTodo = new Todo(
        document.getElementById("edit-todo-title").value.trim(),
        document.getElementById("edit-todo-description").value.trim(),
        document.getElementById("edit-todo-due-date").value.trim(),
        document.getElementById("edit-todo-priority").value,
        document.getElementById("edit-todo-notes").value.trim(),
        document.getElementById("edit-todo-checklist").value
      );

      this.#app.updateTodo(projectName, todoIndex, updatedTodo);
      modal.remove();
      this.#displayProjectTodos(this.#app.getProjectIndex(projectName));
    });

    document
      .getElementById("cancel-edit-todo")
      .addEventListener("click", () => {
        modal.remove();
      });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
  }

  #createDeleteProjectForm(projectName) {
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

  #createDeleteTodoForm(projectName, todoIndex) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <p>Are you sure you want to delete it?</p>
        <div class="modal-buttons">
          <button id="confirm-delete">Yes</button>
          <button id="cancel-delete">No</button>
        </div>
      </div>
    `;
    this.#main.appendChild(modal);

    document.getElementById("confirm-delete").addEventListener("click", () => {
      this.#app.removeTodo(projectName, todoIndex);
      modal.remove();
      this.#displayProjects(this.#app.getProjects());
      this.#displayTodos(this.#app.getAllTodos());
    });

    document.getElementById("cancel-delete").addEventListener("click", () => {
      modal.remove();
    });
  }
}
