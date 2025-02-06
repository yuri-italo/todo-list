export default (function () {
  const STORAGE_KEY = "projects";

  function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, projects);
  }

  function loadProjects() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  return {
    saveProjects,
    loadProjects,
  };
})();
