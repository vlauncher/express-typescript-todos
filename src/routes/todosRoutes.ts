import { Router } from "express";
import  { getTodos, getTodo, createTodo, updateTodo, deleteTodo, toggleCompleted } from "../controllers/todosControllers";


const router = Router();

router.get('/', getTodos);
router.get('/:id', getTodo);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.patch('/:id', toggleCompleted);

export default router