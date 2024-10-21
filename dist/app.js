"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Database connection
const db_1 = __importDefault(require("./config/db"));
(0, db_1.default)();
// Routes
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const todosRoutes_1 = __importDefault(require("./routes/todosRoutes"));
app.use('/api/v1/todos', todosRoutes_1.default);
app.use('/api/v1/auth', usersRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map