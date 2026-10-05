import { db } from '../config/db.js'

export const todoModel = {
    findAll({ status, search } = {}) {
        let query = 'SELECT * FROM todos WHERE 1=1'
        const params = []

        if (status && status !== 'ALL') {
            query += ' AND status = ?'
            params.push(status)
        }
        if (search) {
            query += ' AND (title LIKE ? OR description LIKE ?)'
            params.push(`%${search}%`, `%${search}%`)
        }

        query += ' ORDER BY created_at DESC'
        return db.prepare(query).all(...params)
    },

    findById(id) {
        return db.prepare('SELECT * FROM todos WHERE id = ?').get(id) || null
    },

    create(todo) {
        const id = String(Date.now())
        const createdAt = new Date().toISOString()

        const stmt = db.prepare(`
      INSERT INTO todos (id, title, description, status, priority, category, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

        stmt.run(
            id,
            todo.title,
            todo.description || '',
            todo.status || 'PENDING',
            todo.priority || 'MEDIUM',
            todo.category || 'General',
            todo.dueDate || null,
            createdAt,
            createdAt
        )

        return this.findById(id)
    },

    update(id, updates) {
        const updatedAt = new Date().toISOString()
        const stmt = db.prepare(`
      UPDATE todos 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          status = COALESCE(?, status),
          priority = COALESCE(?, priority),
          category = COALESCE(?, category),
          due_date = COALESCE(?, due_date),
          updated_at = ?
      WHERE id = ?
    `)

        stmt.run(
            updates.title,
            updates.description,
            updates.status,
            updates.priority,
            updates.category,
            updates.dueDate,
            updatedAt,
            id
        )

        return this.findById(id)
    },

    delete(id) {
        const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id)
        return result.changes > 0
    }
}