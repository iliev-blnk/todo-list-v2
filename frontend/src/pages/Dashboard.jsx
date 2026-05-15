import { useEffect, useState } from 'react';
import { apiRequest } from '../api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState('');

  function loadTasks() {
    let path = '/tasks/';
    if (filter === 'active') path += '?completed=false';
    if (filter === 'completed') path += '?completed=true';

    apiRequest(path)
      .then(setTasks)
      .catch(() => setError('Could not load tasks.'));
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await apiRequest('/tasks/', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          due_date: dueDate || null,
        }),
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      loadTasks();
    } catch {
      setError('Could not add task.');
    }
  }

  async function toggleTask(task) {
    try {
      await apiRequest(`/tasks/${task.id}/`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !task.completed }),
      });
      loadTasks();
    } catch {
      setError('Could not update task.');
    }
  }

  async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    try {
      await apiRequest(`/tasks/${id}/`, { method: 'DELETE' });
      loadTasks();
    } catch {
      setError('Could not delete task.');
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
  }

  async function saveEdit(id) {
    if (!editTitle.trim()) return;
    try {
      await apiRequest(`/tasks/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      setEditingId(null);
      setEditTitle('');
      loadTasks();
    } catch {
      setError('Could not save changes.');
    }
  }

  return (
    <div>
      <h1>My Tasks</h1>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="add-form-row">
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </div>
      </form>

      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {tasks.length === 0 ? (
        <p className="empty">No tasks here yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task ${task.completed ? 'done' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />

              <div className="task-body">
                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    autoFocus
                  />
                ) : (
                  <span className="task-title">{task.title}</span>
                )}

                {task.description && <p className="task-desc">{task.description}</p>}

                <div className="task-meta">
                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                  {task.due_date && <span className="due">Due {task.due_date}</span>}
                </div>
              </div>

              <div className="task-actions">
                {editingId === task.id ? (
                  <>
                    <button onClick={() => saveEdit(task.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(task)}>Edit</button>
                    <button className="delete" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
