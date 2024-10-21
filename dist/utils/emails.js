"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetSuccessEmail = exports.sendPasswordResetEmail = exports.sendVerificationSuccessEmail = exports.sendVerificationEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_EMAIL_PASSWORD
    }
});
const sendEmail = (email, subject, text) => {
    return transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject,
        text
    });
};
exports.sendEmail = sendEmail;
// Email verification
const sendVerificationEmail = (email, token) => {
    const url = `http://localhost:8000/api/v1/auth/verify/${token}`;
    const subject = "Email Verification";
    const text = `Click here to verify your email: ${url}`;
    return (0, exports.sendEmail)(email, subject, text);
};
exports.sendVerificationEmail = sendVerificationEmail;
// Sucessful Email verification
const sendVerificationSuccessEmail = (email) => {
    const subject = "Email Verification";
    const text = "Your email has been verified successfully";
    return (0, exports.sendEmail)(email, subject, text);
};
exports.sendVerificationSuccessEmail = sendVerificationSuccessEmail;
// Password reset
const sendPasswordResetEmail = (email, token) => {
    const url = `http://localhost:8000/api/v1/auth/reset-password/${token}`;
    const subject = "Password Reset";
    const text = `Click here to reset your password: ${url}`;
    return (0, exports.sendEmail)(email, subject, text);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
// Password reset success
const sendPasswordResetSuccessEmail = (email) => {
    const subject = "Password Reset";
    const text = "Your password has been reset successfully";
    return (0, exports.sendEmail)(email, subject, text);
};
exports.sendPasswordResetSuccessEmail = sendPasswordResetSuccessEmail;
//# sourceMappingURL=emails.js.map