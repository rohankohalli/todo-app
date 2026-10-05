import Database from 'better-sqlite3'

export const db = new Database('./data/todos.sqlite')

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'PENDING',
    priority TEXT DEFAULT 'MEDIUM',
    category TEXT DEFAULT 'General',
    due_date TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`)