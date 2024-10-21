"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersControllers_1 = require("../controllers/usersControllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/register', usersControllers_1.register);
router.post('/login', usersControllers_1.login);
router.get('/verify/:token', usersControllers_1.verifyEmail);
router.post('/forgot-password', usersControllers_1.forgotPassword);
router.patch('/reset-password/:token', usersControllers_1.resetPassword);
router.put('/change-password', auth_1.protect, usersControllers_1.changePassword);
exports.default = router;
//# sourceMappingURL=usersRoutes.js.map