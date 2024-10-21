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
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.login = exports.register = void 0;
const users_1 = require("../models/users");
const tokens_1 = require("../utils/tokens");
const emails_1 = require("../utils/emails");
/**
 * DESC: Register a new user
 * METHOD: POST
 * URL: http://localhost:8000/api/v1/auth/register
 */
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure req.body
        const { firstName, lastName, email, password } = req.body;
        // Check for empty fields
        if (!firstName || !lastName || !email || !password) {
            res.json({ message: "All fields are required" });
        }
        //  Validate email
        if (!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            res.json({ message: "Invalid email" });
        }
        // Validate password
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            res.json({ message: "Password must be at least 8 characters long" });
        }
        // Check if user already exists
        const user = yield users_1.Users.findOne({ email });
        if (user) {
            res.json({ message: "User already exists" });
        }
        //  Create new user
        const newUser = new users_1.Users({
            firstName,
            lastName,
            email,
            password
        });
        // send verification email
        const token = yield (0, tokens_1.emailVerificationToken)(newUser);
        yield (0, emails_1.sendVerificationEmail)(email, token);
        // Save user
        yield newUser.save();
        // Send response
        res.json({ message: "User created successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
/**
 * DESC: Login a user
 * METHOD: POST
 * URL: http://localhost:8000/api/v1/auth/login
 */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.json({ message: "All fields are required" });
        }
        const user = yield users_1.Users.findOne({ email });
        if (!user) {
            res.json({ message: "User not found" });
        }
        if (!user.isVerified) {
            res.json({ message: "Please verify your email" });
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.json({ message: "Invalid credentials" });
        }
        const access = (0, tokens_1.generateAccessToken)(user);
        const refresh = (0, tokens_1.generateRefreshToken)(user);
        res.json({ access, refresh });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
/**
 * DESC: Verify a user
 * METHOD: GET
 * URL: http://localhost:8000/api/v1/auth/verify/:token
 */
const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const decoded = (0, tokens_1.verifyAccessToken)(token);
        const user = yield users_1.Users.findById(decoded.id);
        if (!user) {
            res.json({ message: "User not found" });
        }
        user.isVerified = true;
        yield user.save();
        yield (0, emails_1.sendVerificationSuccessEmail)(user.email);
        res.json({ message: "Email verified successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyEmail = verifyEmail;
/**
 * DESC: Forgot password
 * METHOD: POST
 * URL: http://localhost:8000/api/v1/auth/forgot-password
 */
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield users_1.Users.findOne({ email });
        if (!user) {
            res.json({ message: "User not found" });
        }
        const token = yield (0, tokens_1.emailVerificationToken)(user);
        yield (0, emails_1.sendPasswordResetEmail)(email, token);
        res.json({ message: "Email sent successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
/**
 * DESC: Reset password
 * METHOD: POST
 * URL: http://localhost:8000/api/v1/auth/reset-password/:token
 */
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const { token } = req.params;
        const decoded = (0, tokens_1.verifyAccessToken)(token);
        const user = yield users_1.Users.findById(decoded.id);
        if (!user) {
            res.json({ message: "User not found" });
        }
        user.password = password;
        yield user.save();
        yield (0, emails_1.sendPasswordResetSuccessEmail)(user.email);
        res.json({ message: "Password reset successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
/**
 * DESC: Change password
 * METHOD: PUT
 * URL: http://localhost:8000/api/v1/auth/change-password
 */
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = yield users_1.Users.findById(req.user.id);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const isMatch = yield user.comparePassword(oldPassword);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        user.password = newPassword;
        yield user.save();
        res.json({ message: "Password changed successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.changePassword = changePassword;
//# sourceMappingURL=usersControllers.js.map