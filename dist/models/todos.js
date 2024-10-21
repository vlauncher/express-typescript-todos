"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todos = void 0;
const mongoose_1 = require("mongoose");
const users_1 = require("./users");
const todoSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: users_1.Users,
        required: true,
        autopopulate: true
    }
});
exports.Todos = (0, mongoose_1.model)("Todo", todoSchema);
//# sourceMappingURL=todos.js.map