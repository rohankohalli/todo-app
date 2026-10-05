import { todoModel } from '../model/todoModel.js'

export const todoService = {
    findAll: (filters) => todoModel.findAll(filters),
    findById: (id) => todoModel.findById(id),
    create: (todoData) => todoModel.create(todoData),
    update: (id, updates) => todoModel.update(id, updates),
    delete: (id) => todoModel.delete(id)
}