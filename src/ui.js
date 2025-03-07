import App from "./app.js";

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
    projects.forEach((p, index) => {
      const li = this.#createProjectLi(p, index);
      this.#projectList.appendChild(li);
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

  #displayTodos(todos) {
    todos.forEach((t, index) => {
      const todo = this.#createTodoCard(t, index);
      this.#main.appendChild(todo);
    });
  }

  #createTodoCard(todo, index) {
    const card = document.createElement("div");
    card.dataset.index = index;

    const title = document.createElement("h2");
    title.textContent = `${todo.title}`;

    const description = document.createElement("p");
    description.textContent = todo.description;

    const dueDate = document.createElement("p");
    dueDate.textContent = `Due: ${todo.dueDate}`;

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

  #createForm() {
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
        this.#displayProjects(projects);
        modal.remove();
      }
    });

    document.getElementById("cancel-project").addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.remove();
    });
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
      .addEventListener("click", this.#createForm.bind(this));
  
    this.#displayTodos(this.#app.getAllTodos());
    this.#displayProjects(this.#app.getProjects());
  }

  #handleAllClick() {
    this.#displayTodos(this.#app.getAllTodos());
  }

  #handleTodayClick() {
    this.#displayTodos(this.#app.getTodayTodos());
  }

  #handleWeekClick() {
    this.#displayTodos(this.#app.getWeekTodos());
  }

  #handleMonthClick() {
    this.#displayTodos(this.#app.getWeekTodos());
  }
}
