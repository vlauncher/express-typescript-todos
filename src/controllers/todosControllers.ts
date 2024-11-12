import { Request, Response, NextFunction } from "express";
import { Todos } from "../models/todos";
import { Users } from "../models/users";

/**
 * DESC: Create a new todo
 * METHOD: POST
 * URL: http://localhost:8000/api/v1/todos
 * ACCESS: Private
 */
export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            res.json({ message: "All fields are required" });
        }
        const newTodo = new Todos({ title, description, userId: req.user._id });
        await newTodo.save();
        res.json({ message: "Todo created successfully", todo: newTodo });
    } catch (error) {
        next(error);
    }
}

/**
 * DESC: Get all todos
 * METHOD: GET
 * URL: http://localhost:8000/api/v1/todos
 * ACCESS: Private
 */

export const getTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get requested user
        const user: any = await Users.findById(req.user.id);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const todos = await Todos.find({ userId: user._id });
        res.json({ todos });
    } catch (error) {
        next(error);
    }
}

/**
 * DESC: Get a todo
 * METHOD: GET
 * URL: http://localhost:8000/api/v1/todos/:id
 * ACCESS: Private
 */

export const getTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todos.findOne({ _id: req.params.id, userId: req.user.id });
        if (!todo) {
            res.json({ message: "Todo not found" });
        }
        res.json({ todo });
    } catch (error) {
        next(error);
    }
}


/**
 * DESC: Update a todo
 * METHOD: PUT
 * URL: http://localhost:8000/api/v1/todos/:id
 * ACCESS: Private
 */ 

export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;
        const todo : any = await Todos.findOne({ _id: req.params.id, userId: req.user.id });
        if (!todo) {
            res.json({ message: "Todo not found" });
        }
        todo.title = title;
        todo.description = description;
        await todo.save();
        res.json({ message: "Todo updated successfully", todo });
    } catch (error) {
        next(error);
    }
}


/**
 * DESC: Delete a todo
 * METHOD: DELETE
 * URL: http://localhost:8000/api/v1/todos/:id
 * ACCESS: Private
 */

export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo: any = await Todos.findOne({ _id: req.params.id, userId: req.user.id });
        if (!todo) {
            res.json({ message: "Todo not found" });
        }
        await todo.remove();
        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        next(error);
    }
}