import { Router } from "express";
import { protect } from "../middlewares/auth";
import { createTodo, getTodos, getTodo, updateTodo, deleteTodo } from "../controllers/todosControllers";

const router = Router();

router.post('/', protect, createTodo);
router.get('/', protect, getTodos);
router.get('/:id', protect, getTodo);
router.put('/:id', protect, updateTodo);
router.delete('/:id', protect, deleteTodo);

export default router