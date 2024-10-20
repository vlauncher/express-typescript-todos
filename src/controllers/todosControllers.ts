import { Request, Response, NextFunction } from 'express';
import { Todos } from '../models/todos';

/**
 * DESC: Get all todos
 * METHOD: GET
 * URL: http://localhost:3000/todos
 */
export const getTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todos = await Todos.find();
        res.status(200).json({ todos });
    } catch (error) {
        next(error);
    }
};

/**
 * DESC: Get a single todo
 * METHOD: GET
 * URL: http://localhost:3000/todos/:id
 */
export const getTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todos.findById(req.params.id);
        res.status(200).json({ todo });
    } catch (error) {
        next(error);
    }
};

/**
 * DESC: Create a new todo
 * METHOD: POST
 * URL: http://localhost:3000/todos
 */
export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todos.create(req.body);
        res.status(201).json({ todo });
    } catch (error) {
        next(error);
    }
};

/**
 * DESC: Update a todo
 * METHOD: PUT
 * URL: http://localhost:3000/todos/:id
 */
export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todos.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ todo });
    } catch (error) {
        next(error);
    }
};


/**
 * DESC: Delete a todo
 * METHOD: DELETE
 * URL: http://localhost:3000/todos/:id
 */
export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todos.findByIdAndDelete(req.params.id);
        res.status(200).json({ todo });
    } catch (error) {
        next(error);
    }
};


/**
 * DESC: Toggle completed to not completed and vice versa
 * METHOD: PATCH
 * URL: http://localhost:3000/todos/:id
 */
export const toggleCompleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todos.findById(req.params.id);
        todo!.completed = !todo!.completed;
        await todo!.save();
        res.status(200).json({ todo });
    } catch (error) {
        next(error);
    }
}