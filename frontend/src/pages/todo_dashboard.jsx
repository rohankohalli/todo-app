import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadTodos = async () => {
    try {
      setLoading(true);
      const res = await api.getTodos({ status: statusFilter, search: searchQuery });
      setTodos(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [statusFilter, searchQuery]);

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.createTodo({
        title: title.trim(),
        description,
        priority,
        category,
        dueDate: dueDate || null
      });

      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('General');
      setDueDate('');
      setShowAddModal(false);
      loadTodos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (todo) => {
    const nextStatus = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.updateTodo(todo.id, { status: nextStatus });
      loadTodos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTodo(id);
      loadTodos();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <header>
        <div className="container header-content">
          <h1>Todo App</h1>
        </div>
      </header>

      <main className="container">
        <div style={{ marginBottom: '1.25rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: '30px', padding: '0.8rem 1.25rem' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'PENDING', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '20px', padding: '0.4rem 1rem' }}
              >
                {st === 'ALL' ? 'All Tasks' : st === 'PENDING' ? 'Pending' : 'Completed'}
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(!showAddModal)}
            style={{ borderRadius: '20px' }}
          >
            {showAddModal ? '✕ Close' : '+ Add Task'}
          </button>
        </div>

        {showAddModal && (
          <section className="card" style={{ borderLeft: '4px solid #2563eb', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>New Task Details</h3>
            <form onSubmit={handleCreateTodo}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="Optional notes or details..."
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
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
              </div>
              <button type="submit" className="btn btn-primary">Save Task</button>
            </form>
          </section>
        )}

        <section>
          {loading && <p style={{ textAlign: 'center', color: '#64748b' }}>Loading tasks...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {!loading && !error && todos.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              No tasks found. Click "+ Add Task" to create one!
            </div>
          )}

          {!loading && todos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.status === 'COMPLETED' ? 'completed' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="checkbox"
                  checked={todo.status === 'COMPLETED'}
                  onChange={() => handleToggleStatus(todo)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <a href={`/todo.html?id=${todo.id}`} className="todo-title">
                    {todo.title}
                  </a>
                  <div className="meta-info" style={{ marginTop: '0.2rem' }}>
                    <span className={`badge badge-${todo.status.toLowerCase()}`}>{todo.status}</span>
                    <span className={`badge badge-${todo.priority.toLowerCase()}`}>{todo.priority}</span>
                    {todo.category && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>📁 {todo.category}</span>}
                    {todo.due_date && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>📅 {todo.due_date}</span>}
                  </div>
                </div>
              </div>

              <div className="actions">
                <a href={`/todo.html?id=${todo.id}`} className="btn btn-secondary btn-sm">View Details</a>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(todo.id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
