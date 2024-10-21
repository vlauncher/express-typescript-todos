"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.getTodo = exports.getTodos = exports.createTodo = void 0;
const todos_1 = require("../models/todos");
const users_1 = require("../models/users");
/**
 * DESC: Create a new todo
 * METHOD: POST
 * URL: http://localhost:8000/api/v1/todos
 * ACCESS: Private
 */
const createTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            res.json({ message: "All fields are required" });
        }
        const newTodo = new todos_1.Todos({ title, description, userId: req.user._id });
        yield newTodo.save();
        res.json({ message: "Todo created successfully", todo: newTodo });
    }
    catch (error) {
        next(error);
    }
});
exports.createTodo = createTodo;
/**
 * DESC: Get all todos
 * METHOD: GET
 * URL: http://localhost:8000/api/v1/todos
 * ACCESS: Private
 */
const getTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get requested user
        const user = yield users_1.Users.findById(req.user.id);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const todos = yield todos_1.Todos.find({ userId: user._id });
        res.json({ todos });
    }
    catch (error) {
        next(error);
    }
});
exports.getTodos = getTodos;
/**
 * DESC: Get a todo
 * METHOD: GET
 * URL: http://localhost:8000/api/v1/todos/:id
 * ACCESS: Private
 */
const getTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield todos_1.Todos.findOne({ _id: req.params.id, userId: req.user.id });
        if (!todo) {
            res.json({ message: "Todo not found" });
        }
        res.json({ todo });
    }
    catch (error) {
        next(error);
    }
});
exports.getTodo = getTodo;
/**
 * DESC: Update a todo
 * METHOD: PUT
 * URL: http://localhost:8000/api/v1/todos/:id
 * ACCESS: Private
 */
const updateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const todo = yield todos_1.Todos.findOne({ _id: req.params.id, userId: req.user.id });
        if (!todo) {
            res.json({ message: "Todo not found" });
        }
        todo.title = title;
        todo.description = description;
        yield todo.save();
        res.json({ message: "Todo updated successfully", todo });
    }
    catch (error) {
        next(error);
    }
});
exports.updateTodo = updateTodo;
/**
 * DESC: Delete a todo
 * METHOD: DELETE
 * URL: http://localhost:8000/api/v1/todos/:id
 * ACCESS: Private
 */
const deleteTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield todos_1.Todos.findOne({ _id: req.params.id, userId: req.user.id });
        if (!todo) {
            res.json({ message: "Todo not found" });
        }
        yield todo.remove();
        res.json({ message: "Todo deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTodo = deleteTodo;
//# sourceMappingURL=todosControllers.js.map