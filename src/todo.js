export default class Todo {
  #title;
  #description;
  #dueDate;
  #priority;
  #notes;
  #checklist;

  constructor(
    title,
    description,
    dueDate,
    priority,
    notes,
    checklist = "Not Started"
  ) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
  }

  get title() {
    return this.#title;
  }

  set title(newTitle) {
    if (typeof newTitle === "string" && newTitle.trim() !== "") {
      this.#title = newTitle.trim();
    } else {
      throw new Error("Title must be a non-empty string.");
    }
  }

  get description() {
    return this.#description;
  }

  set description(newDescription) {
    if (typeof newDescription === "string") {
      this.#description = newDescription;
    } else {
      throw new Error("Description must be a string.");
    }
  }

  get dueDate() {
    return this.#dueDate;
  }

  set dueDate(newDueDate) {
    if (typeof newDueDate === "string" && newDueDate.trim() !== "") {
      this.#dueDate = newDueDate.trim();
    } else {
      throw new Error("Due date must be a non-empty string.");
    }
  }

  get priority() {
    return this.#priority;
  }

  set priority(newPriority) {
    const validPriorities = ["High", "Medium", "Low"];
    if (validPriorities.includes(newPriority)) {
      this.#priority = newPriority;
    } else {
      throw new Error("Priority must be one of: High, Medium, Low.");
    }
  }

  get notes() {
    return this.#notes;
  }

  set notes(newNotes) {
    if (typeof newNotes === "string") {
      this.#notes = newNotes;
    } else {
      throw new Error("Notes must be a string.");
    }
  }

  get checklist() {
    return this.#checklist;
  }

  set checklist(newChecklist) {
    const validStatuses = ["Not Started", "In Progress", "Completed"];
    if (validStatuses.includes(newChecklist)) {
      this.#checklist = newChecklist;
    } else {
      throw new Error(
        "Checklist status must be one of: Not Started, In Progress, Completed."
      );
    }
  }
}
