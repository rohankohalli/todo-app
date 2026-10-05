import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export function TodoDetails() {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Read `id` query parameter from window.location.search (?id=...)
  const urlParams = new URLSearchParams(window.location.search);
  const todoId = urlParams.get('id');

  const loadTodoDetail = async () => {
    if (!todoId) {
      setError('No task ID provided in URL query parameter (?id=...)');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.getTodoById(todoId);
      const data = res.data;
      setTodo(data);

      setTitle(data.title || '');
      setDescription(data.description || '');
      setStatus(data.status || 'PENDING');
      setPriority(data.priority || 'MEDIUM');
      setCategory(data.category || '');
      setDueDate(data.due_date || data.dueDate || '');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodoDetail();
  }, [todoId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateTodo(todoId, {
        title,
        description,
        status,
        priority,
        category,
        dueDate: dueDate || null
      });
      setIsEditing(false);
      loadTodoDetail();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTodo(todoId);
      window.location.href = '/index.html';
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <header>
        <div className="container header-content">
          <h1>Todo Details</h1>
          <a href="/index.html" className="btn btn-secondary btn-sm">All Tasks</a>
        </div>
      </header>

      <main className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <a href="/index.html" className="btn btn-secondary btn-sm">
            ← Back to Tasks List
          </a>
        </div>

        {loading && <p className="card">Loading task details...</p>}
        {error && (
          <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
            <h2>Error</h2>
            <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</p>
          </div>
        )}

        {!loading && !error && todo && (
          <article className="card">
            {!isEditing ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{todo.title}</h2>
                    <div className="meta-info" style={{ marginBottom: '1rem' }}>
                      <span className={`badge badge-${todo.status.toLowerCase()}`}>{todo.status}</span>
                      <span className={`badge badge-${todo.priority.toLowerCase()}`}>{todo.priority} Priority</span>
                      {todo.category && <span style={{ fontSize: '0.875rem', color: '#64748b' }}>📁 {todo.category}</span>}
                    </div>
                  </div>
                  <div className="actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                      Edit Task
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                      Delete
                    </button>
                  </div>
                </div>

                <div style={{ margin: '1.5rem 0', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '0.5rem' }}>Description</h3>
                  <p style={{ whiteSpace: 'pre-wrap', color: '#334155' }}>
                    {todo.description ? todo.description : <em style={{ color: '#94a3b8' }}>No description provided.</em>}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>Due Date</strong>
                    <span>{todo.due_date || todo.dueDate || 'No due date set'}</span>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>Created At</strong>
                    <span>{new Date(todo.created_at || todo.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2>Edit Task Details</h2>
                <form onSubmit={handleUpdate} style={{ marginTop: '1rem' }}>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Status</label>
                      <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Priority</label>
                      <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div className="actions" style={{ marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </article>
        )}
      </main>
    </div>
  );
}
