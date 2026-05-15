export default function About() {
  return (
    <div className="about">
      <h1>About this project</h1>
      <p>
        To-Do List v2 is the final project for SEN204 - Internet and Web Programming.
        It's the second version of my mid-term project, rewritten as a fullstack app.
      </p>

      <h2>What's new vs. v1</h2>
      <ul>
        <li>React frontend with multiple pages instead of a single HTML file.</li>
        <li>Django REST API backend with SQLite, replacing localStorage.</li>
        <li>Priorities and due dates for each task.</li>
        <li>Filter tasks by All / Active / Completed.</li>
        <li>Runs in Docker with one command.</li>
      </ul>

      <h2>Tech stack</h2>
      <ul>
        <li>Frontend: React 18 + Vite + React Router</li>
        <li>Backend: Django 5 + Django REST Framework</li>
        <li>Database: SQLite</li>
        <li>Docker + Docker Compose</li>
      </ul>

      <p>
        Original v1: <a href="https://github.com/iliev-blnk/todo-list">github.com/iliev-blnk/todo-list</a>
      </p>
    </div>
  );
}
