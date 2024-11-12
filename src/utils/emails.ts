import nodemailer from "nodemailer";
import { emailVerificationToken } from "./tokens";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_EMAIL_PASSWORD
    }
});

export const sendEmail = (email: string, subject: string, text: string) => {
    return transporter.sendMail({
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject,
        text
    });
}

// Email verification
export const sendVerificationEmail = (email: string, token: string) => {
    const url = `http://localhost:8000/api/v1/auth/verify/${token}`;
    const subject = "Email Verification";
    const text = `Click here to verify your email: ${url}`;
    return sendEmail(email, subject, text);
}

// Sucessful Email verification
export const sendVerificationSuccessEmail = (email: string) => {
    const subject = "Email Verification";
    const text = "Your email has been verified successfully";
    return sendEmail(email, subject, text);
}

// Password reset
export const sendPasswordResetEmail = (email: string, token: string) => {
    const url = `http://localhost:8000/api/v1/auth/reset-password/${token}`;
    const subject = "Password Reset";
    const text = `Click here to reset your password: ${url}`;
    return sendEmail(email, subject, text);
}

// Password reset success
export const sendPasswordResetSuccessEmail = (email: string) => {
    const subject = "Password Reset";
    const text = "Your password has been reset successfully";
    return sendEmail(email, subject, text);
}