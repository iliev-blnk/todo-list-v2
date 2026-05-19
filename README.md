# To-Do List v2

Final project submission for **SEN204 - Internet and Web Programming** by Ilie Beleniuc.

This is the second version of my [mid-term To-Do List project](https://github.com/iliev-blnk/todo-list). The mid-term version was a single HTML page with vanilla JavaScript and `localStorage`. This version turns it into a fullstack web application with a React frontend, a Django REST API backend, and Docker.

## Research Problem

Managing daily tasks is a common problem for students. The mid-term version stored tasks in the browser's `localStorage`, which means the tasks were tied to one device and would disappear if the browser data was cleared. The goal of v2 is to keep the same simple "add a task, check it off, delete it" experience but back it with a real database, so the tasks survive a refresh and live outside the browser.

## Motivation

The SEN204 course covered HTML, CSS, and JavaScript in the first weeks, then React, and finally backend development with FastAPI and Django. This final project pulls those pieces together into one application that demonstrates all of them.

## Control Flow

1. User opens the app and lands on the Dashboard.
2. The Dashboard fetches the current list of tasks from the API.
3. The user adds a task with a title, optional description, priority, and due date.
4. The user can toggle a task as complete, edit its title, or delete it.
5. The user can filter the list by All / Active / Completed.

## Implementation Strategy

### Backend

The backend is a Django 5 project with one app called `api`. I chose Django REST Framework because it makes it straightforward to turn Django models into a JSON API without writing a lot of boilerplate.

The `Task` model (`api/models.py`) stores the title, description, completion status, priority, due date, and creation timestamp. There is no user model — tasks are shared, which keeps the app simple.

Views are written as plain functions using the `@api_view` decorator instead of class-based views. This makes it easier to read the logic top to bottom without jumping between methods. There are two view functions:
- `task_list` handles `GET` (list all tasks, with optional `?completed=` filter) and `POST` (create a task).
- `task_detail` handles `GET`, `PUT` (partial update), and `DELETE` for a single task.

The `TaskSerializer` handles converting the model to and from JSON, and validates incoming data before it touches the database.

URLs are defined in `api/urls.py` and included under `/api/` in the main `todoapi/urls.py`.

### Frontend

The frontend is a React 18 single-page app built with Vite. React Router handles navigation between the Dashboard and About pages. I kept it in plain JavaScript (no TypeScript) to stay close to what was taught in class.

`api.js` is a small wrapper around the browser `fetch` API. Every request goes through `apiRequest()`, which sets the `Content-Type` header and throws an error with the response data attached if the server returns a non-OK status. This keeps the fetch logic in one place instead of repeating it in every component.

`App.jsx` sets up the router and the shared navbar. The navbar is defined in the same file because it's small and only used in one place.

`Dashboard.jsx` is the main page. It has three sections:
- An add-task form with a title, notes, priority dropdown, and due date.
- Filter buttons (All / Active / Completed) that re-fetch tasks from the API when clicked.
- The task list, where each item shows the priority badge, due date, and edit / delete buttons. Clicking Edit switches the title to an inline text input; pressing Enter or clicking Save sends a `PUT` request.

All styles are in a single `App.css` file using plain CSS. The dark colour scheme (#1a1a1a background, #4a90d9 accent) matches the v1 project.

### Docker

Each service has its own Dockerfile. The backend image installs Python dependencies and runs `migrate` then `runserver` on startup. The frontend image installs Node dependencies, builds the static files with `npm run build`, and serves them with `npm run preview`.

`VITE_API_URL` is passed as a Docker build argument so the frontend knows where to send API requests. In the Docker Compose setup this is set to `http://localhost:8000/api`.

## Tech Stack

- **Frontend**: React 18, React Router, Vite, plain JavaScript
- **Backend**: Django 5, Django REST Framework
- **Database**: SQLite
- **Containers**: Docker, Docker Compose

## Project Structure

```
todo-list-v2/
├── backend/
│   ├── api/               # Django app (models, views, serializers)
│   ├── todoapi/           # Django project settings
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/         # Dashboard, About
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Run with Docker (recommended)

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/

To stop:
```bash
docker compose down
```

## Run locally (without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

## API Endpoints

| Method | URL                    | Description                  |
| ------ | ---------------------- | ---------------------------- |
| GET    | `/api/tasks/`          | List tasks                   |
| POST   | `/api/tasks/`          | Create a task                |
| PUT    | `/api/tasks/<id>/`     | Update a task                |
| DELETE | `/api/tasks/<id>/`     | Delete a task                |

The `/api/tasks/` endpoint accepts `?completed=true` or `?completed=false` to filter by status.

## What's new compared to v1

- Multiple pages instead of one (Dashboard, About).
- Real database (SQLite) instead of browser `localStorage`.
- Each task has a priority (low / medium / high) and an optional due date.
- Filter buttons for All / Active / Completed tasks.
- Runs in Docker with a single command.
