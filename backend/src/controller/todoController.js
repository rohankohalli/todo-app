import { todoService } from '../service/todo.service.js'

export const todoController = {
    getAllTodos(req, res, next) {
        try {
            const { status, priority, search } = req.query
            const todos = todoService.findAll({ status, priority, search })
            res.status(200).json({ success: true, count: todos.length, data: todos })
        } catch (error) {
            next(error)
        }
    },

    getTodoById(req, res, next) {
        try {
            const { id } = req.params
            const todo = todoService.findById(id)

            if (!todo) {
                return res.status(404).json({ success: false, error: `Todo with ID ${id} not found` })
            }

            res.status(200).json({ success: true, data: todo })
        } catch (error) {
            next(error)
        }
    },

    createTodo(req, res, next) {
        try {
            const { title, description, status, priority, category, dueDate } = req.body

            if (!title || typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({ success: false, error: "Title is required and must be a valid string" })
            }

            const newTodo = todoService.create({
                title: title.trim(),
                description,
                status,
                priority,
                category,
                dueDate
            })

            res.status(201).json({ success: true, message: "Todo created successfully", data: newTodo })
        } catch (error) {
            next(error)
        }
    },

    updateTodo(req, res, next) {
        try {
            const { id } = req.params
            const { title, description, status, priority, category, dueDate } = req.body

            if (title !== undefined && (!title || typeof title !== 'string' || !title.trim())) {
                return res.status(400).json({ success: false, error: "Title cannot be empty" })
            }

            const updated = todoService.update(id, {
                ...(title !== undefined && { title: title.trim() }),
                ...(description !== undefined && { description }),
                ...(status !== undefined && { status }),
                ...(priority !== undefined && { priority }),
                ...(category !== undefined && { category }),
                ...(dueDate !== undefined && { dueDate })
            })

            if (!updated) {
                return res.status(404).json({ success: false, error: `Todo with ID ${id} not found` })
            }

            res.status(200).json({ success: true, message: "Todo updated successfully", data: updated })
        } catch (error) {
            next(error)
        }
    },

    deleteTodo(req, res, next) {
        try {
            const { id } = req.params
            const deleted = todoService.delete(id)

            if (!deleted) {
                return res.status(404).json({ success: false, error: `Todo with ID ${id} not found` })
            }

            res.status(200).json({ success: true, message: `Todo with ID ${id} deleted successfully` })
        } catch (error) {
            next(error)
        }
    }
}