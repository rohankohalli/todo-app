import Express from 'express'
import { todoController } from '../controller/todoController'

const router = Express.Router()

router.get("/", todoController.getAllTodos())
router.get("/:id", todoController.getAllTodos())
router.post("/", todoController.createTodo())
router.put("/:id", todoController.updateTodo())
router.delete("/:id", todoController.deleteTodo())