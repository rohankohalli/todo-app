const API_BASE_URL = 'http://localhost:3000/api/todos';

export const api = {
  async getTodos({ status = '', priority = '', search = '' } = {}) {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    if (priority && priority !== 'ALL') params.append('priority', priority);
    if (search) params.append('search', search);

    const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch todos');
    return await res.json();
  },

  async getTodoById(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('Todo item not found');
      throw new Error('Failed to fetch todo item');
    }
    return await res.json();
  },

  async createTodo(todoData) {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create todo');
    return data;
  },

  async updateTodo(id, updates) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update todo');
    return data;
  },

  async deleteTodo(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete todo');
    return data;
  }
};
