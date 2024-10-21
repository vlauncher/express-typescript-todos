"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const todosControllers_1 = require("../controllers/todosControllers");
const router = (0, express_1.Router)();
router.post('/', auth_1.protect, todosControllers_1.createTodo);
router.get('/', auth_1.protect, todosControllers_1.getTodos);
router.get('/:id', auth_1.protect, todosControllers_1.getTodo);
router.put('/:id', auth_1.protect, todosControllers_1.updateTodo);
router.delete('/:id', auth_1.protect, todosControllers_1.deleteTodo);
exports.default = router;
//# sourceMappingURL=todosRoutes.js.map