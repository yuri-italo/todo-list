# Todo List Application

A Todo List web application built with JavaScript, featuring project organization, task management, and local storage persistence.

## Technologies Used

- **Core**

  - HTML5
  - CSS3 (Flexbox/Grid)
  - Modern JavaScript (ES6+)

- **Libraries**

  - date-fns (Date formatting)
  - Webpack (Module bundling)

- **Storage**
  - Web Storage API (localStorage)

## Features

- 📁 **Project Management**

  - Default project for immediate todo entry
  - Create/delete custom projects
  - Switch between project views
  - Automatic project persistence using localStorage

- ✅ **Task Management**

  - Create todos with:
    - Title
    - Description
    - Due Date (with date-fns integration)
    - Priority (High/Medium/Low)
    - Notes
    - Status (Not Started/In Progress/Completed)
  - Edit existing todos
  - Delete todos
  - Color-coded priority indicators

- 🗓️ **Smart Organization**

  - Filter todos by:
    - All tasks
    - Today's tasks
    - This week's tasks
    - Monthly view
  - Visual due date formatting
  - Responsive UI with clean interactions

- 🔒 **Data Persistence**
  - Automatic save to localStorage
  - Data recovery on page reload
  - JSON data serialization

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yuri-italo/todo-list.git
   ```

2. Navigate to the project directory:

   ```bash
   cd todo-list
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Development

1. Start the development server:

   ```bash
   npx webpack serve
   ```

2. Open [http://localhost:8080](http://localhost:8080) in your browser to view the project.

## Acknowledgments

This project is part of [The Odin Project](https://www.theodinproject.com/) curriculum.
