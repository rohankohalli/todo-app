# 📝 Ziptrrip Todo Application

A full-stack **Multi-Page Application (MPA)** Todo management system built with **Node.js, Express, React, Vite, and SQLite**.

---

## 🚀 Table of Contents
1. [Overview & Architecture](#-overview--architecture)
2. [Features & Functionality](#-features--functionality)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Backend REST API Reference](#-backend-rest-api-reference)
6. [Database Schema (SQLite)](#-database-schema-sqlite)
7. [Installation & Setup](#-installation--setup)
8. [Running Tests](#-running-tests)
9. [Postman & REST Client Specs](#-postman--rest-client-specs)
10. [Assignment Rubric & Extra Points Checklist](#-assignment-rubric--extra-points-checklist)

---

## 🌟 Overview & Architecture

This application is built as a **Multiple Page Application (MPA)** rather than a Single Page Application (SPA), in accordance with the assignment requirements:

* **Page 1 (Dashboard - `/index.html`)**: Served as an independent HTML entry point. Mounts the Tasks Dashboard for listing, filtering, searching, and adding tasks.
* **Page 2 (Task Detail - `/todo.html?id=<task_id>`)**: Served as a separate HTML entry point. Reads the `id` query parameter from `window.location.search`, fetches specific task metadata from the backend, and provides full editing and deletion capabilities.
* **Backend**: Modular Node.js Express server using standard layered MVC architecture (`Routes` → `Controller` → `Model` → `DB Config`).
* **Database**: Embedded SQLite relational database (`data/todos.sqlite`) with parameterized SQL queries for persistent data storage across restarts.

---

## 🎯 Features & Functionality

### 1. Main Page: Todos Dashboard (`/index.html`)
- 🔍 **Real-time Search**: Instant keyword search filtering across titles and descriptions.
- 🏷️ **Status Filter Pills**: Quick toggle filters for `All Tasks`, `Pending`, and `Completed`.
- ➕ **Add Task Modal / Collapsible Form**: Create new tasks with title, description, priority (`LOW`, `MEDIUM`, `HIGH`), category, and due date.
- ⚡ **Inline Status Toggle**: Quick checkbox toggle to switch between `PENDING` and `COMPLETED`.
- 🗑️ **Task Deletion**: Immediate task removal with confirmation.
- 🔗 **MPA Navigation**: Clickable task titles and "View Details" buttons performing browser page transitions to `todo.html?id=<task_id>`.

### 2. Detail Page: Single Todo View (`/todo.html?id=<id>`)
- 📌 **Query Parameter Parsing**: Reads `?id=...` directly from the URL to load task-specific data.
- 📊 **Complete Metadata Display**:
  - Full title and expandable description
  - Status badge (`PENDING`, `IN_PROGRESS`, `COMPLETED`)
  - Priority badge (`LOW`, `MEDIUM`, `HIGH`)
  - Category tag
  - Due date
  - Created at & Last Updated at timestamps
- ✏️ **Full Edit Mode**: In-place editing of title, description, status, priority, category, and due date.
- 🗑️ **Delete Action**: Removes task with automatic redirect back to the dashboard.
- ⬅️ **Back Navigation**: Direct button to return to `/index.html`.

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite (Multi-Page Rollup configuration), CSS3 (Modern Responsive UI)
* **Backend**: Node.js (ES Modules), Express.js
* **Database**: SQLite (`better-sqlite3` / persistent file storage)
* **Testing**: Vitest, Supertest
* **API Tools**: Postman Collection, VS Code REST Client (`.http`)

---

## 📂 Project Structure

```
Todo/
├── backend/
│   ├── package.json               # Backend dependencies ("type": "module")
│   └── src/
│       ├── index.js               # Express server entry point
│       ├── config/
│       │   └── db.js              # SQLite connection & table schema
│       ├── routes/
│       │   └── todoRoutes.js      # REST API route mapping
│       ├── controller/
│       │   └── todoController.js  # Request validation & response logic
│       └── model/
│           └── todoModel.js       # SQLite SQL queries (SELECT, INSERT, UPDATE, DELETE)
│
├── frontend/
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.js             # Multi-Page (MPA) Rollup build config & /api proxy
│   ├── index.html                 # Page 1 Entry (Todos Dashboard)
│   ├── todo.html                  # Page 2 Entry (Single Todo Detail)
│   └── src/
│       ├── main-dashboard.jsx     # Mount script for Page 1
│       ├── main-details.jsx       # Mount script for Page 2
│       ├── services/
│       │   └── api.js             # Centralized frontend API client
│       ├── styles/
│       │   └── app.css            # Clean responsive styles
│       └── pages/
│           ├── todo_dashboard.jsx # Dashboard Component (Search, Filters, Tasks List)
│           └── todo-details.jsx   # Details Component (Query params, Metadata, Edit)
│
├── tests/
│   └── api.test.js                # Backend API integration tests (Vitest + Supertest)
├── todos.http                     # VS Code REST Client specification
├── todo_api.postman_collection.json # Importable Postman Collection
└── README.md                      # Complete Project Documentation
```

---

## 📡 Backend REST API Reference

**Base URL**: `http://localhost:3000/api/todos`

| Method | Endpoint | Description | Query / Body Params | Status Codes |
|---|---|---|---|---|
| `GET` | `/api/todos` | Fetch all tasks | Query: `status`, `priority`, `search` | `200 OK`, `500` |
| `GET` | `/api/todos/:id` | Fetch single task by ID | Path param: `id` | `200 OK`, `404 Not Found` |
| `POST` | `/api/todos` | Create a new task | Body: `{ title, description, priority, category, dueDate }` | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/todos/:id` | Update task by ID | Body: `{ title, description, status, priority, category, dueDate }` | `200 OK`, `400`, `404` |
| `DELETE` | `/api/todos/:id` | Delete task by ID | Path param: `id` | `200 OK`, `404 Not Found` |

### Sample Payloads

**Create Task (`POST /api/todos`)**:
```json
{
  "title": "Launch Marketing Campaign",
  "description": "Prepare graphics, email sequences, and analytics tracking.",
  "priority": "HIGH",
  "category": "Marketing",
  "dueDate": "2026-11-05"
}
```

**Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": "1728114000000",
    "title": "Launch Marketing Campaign",
    "description": "Prepare graphics, email sequences, and analytics tracking.",
    "status": "PENDING",
    "priority": "HIGH",
    "category": "Marketing",
    "dueDate": "2026-11-05",
    "createdAt": "2026-10-05T12:00:00.000Z",
    "updatedAt": "2026-10-05T12:00:00.000Z"
  }
}
```

---

## 💾 Database Schema (SQLite)

The database schema is initialized automatically in `data/todos.sqlite` on server startup:

```sql
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'PENDING',  -- PENDING, IN_PROGRESS, COMPLETED
  priority TEXT DEFAULT 'MEDIUM',  -- LOW, MEDIUM, HIGH
  category TEXT DEFAULT 'General',
  due_date TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

All queries use **parameterized statements (`?`)** to prevent SQL injection vulnerabilities.

---

## 💻 Installation & Setup

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (bundled with Node.js)

### 2. Setup & Run Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server
npm start
```
* Backend server will start on: **`http://localhost:3000`**

### 3. Setup & Run Frontend (In a separate terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite Multi-Page development server
npm run dev
```
* Frontend MPA will be accessible on: **`http://localhost:5173`**
  - **Dashboard**: `http://localhost:5173/index.html`
  - **Single Task Detail**: `http://localhost:5173/todo.html?id=<task_id>`

---

## 🧪 Running Tests

The backend includes a comprehensive unit & integration test suite using **Vitest** and **Supertest** covering all CRUD operations, validation rules, and error handling.

```bash
# Run unit & API integration tests
npm test
```

**Expected Test Output**:
```
 ✓ tests/api.test.js (5 tests)
   ✓ GET /api/todos - should return list of todos
   ✓ POST /api/todos - should create a new todo
   ✓ GET /api/todos/:id - should return single todo item
   ✓ PUT /api/todos/:id - should update todo item
   ✓ DELETE /api/todos/:id - should delete todo item

 Test Files  1 passed (1)
      Tests  5 passed (5)
```

---

## 📮 Postman & REST Client Specs

For manual and automated API verification, two spec files are provided in the repository:

1. **Postman Collection**: `todo_api.postman_collection.json`
   - Open Postman → Click **Import** → Select `todo_api.postman_collection.json`.
   - Pre-configured requests for `GET`, `POST`, `PUT`, `DELETE` endpoints with sample bodies.

2. **VS Code REST Client**: `todos.http`
   - Install the **REST Client** extension in VS Code.
   - Open `todos.http` and click **"Send Request"** above any endpoint for instant in-editor execution.

---

## ⭐ Assignment Rubric & Extra Points Checklist

| Assignment Requirement / Extra Points Criterion | Status | Implementation Details |
|---|---|---|
| **Multi-Page Application (MPA) instead of SPA** | ✅ **Done** | Separate `index.html` & `todo.html` entry points with real document transitions |
| **Page 1: Todos List Page with full features** | ✅ **Done** | Search, status filter pills, +Add modal, inline toggle, delete, MPA detail links |
| **Page 2: Single Todo Page receiving query parameter `?id=...`** | ✅ **Done** | Parses `window.location.search`, loads metadata, in-place edit mode, delete, back link |
| **JavaScript / TypeScript Backend Server** | ✅ **Done** | Node.js + Express with ES Modules (`"type": "module"`) |
| **CRUD APIs for Todos** | ✅ **Done** | `GET`, `POST`, `PUT`, `DELETE` endpoints with HTTP status codes (`200`, `201`, `400`, `404`) |
| **Usage of a Database (Extra Points ⭐)** | ✅ **Done** | SQLite relational database (`data/todos.sqlite`) with parameterized SQL queries |
| **Code Organization (Extra Points ⭐)** | ✅ **Done** | Clean layered MVC architecture (`Routes` → `Controller` → `Model` → `DB Config`) |
| **Unit Tests (Extra Points ⭐)** | ✅ **Done** | Vitest + Supertest integration test suite (`npm test`) |
| **Postman / REST Client files (Extra Points ⭐)** | ✅ **Done** | `todo_api.postman_collection.json` & `todos.http` |
| **Documentation in `.md` format** | ✅ **Done** | Fully documented in this `README.md` |
