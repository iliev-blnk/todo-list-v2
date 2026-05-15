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
