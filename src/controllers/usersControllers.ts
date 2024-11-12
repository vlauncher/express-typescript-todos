import { Request, Response, NextFunction } from "express";
import { Users } from "../models/users";
import { generateAccessToken, generateRefreshToken, emailVerificationToken, verifyAccessToken } from "../utils/tokens";
import { sendVerificationEmail, sendVerificationSuccessEmail,sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../utils/emails";

/**
 * DESC: Register a new user
 * METHOD: POST
 * URL: http://localhost:8000/api/v1/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
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
        const user = await Users.findOne({ email });
        if (user) {
            res.json({ message: "User already exists" });
        }

        //  Create new user
        const newUser: any = new Users({
            firstName,
            lastName,
            email,
            password
        });
        // send verification email
        const token = await emailVerificationToken(newUser);
        await sendVerificationEmail(email, token);
        // Save user
        await newUser.save();
        // Send response
        res.json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
}

/**
 * DESC: Login a user
 * METHOD: POST
 * URL: http://localhost:8000/api/v1/auth/login
 */

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.json({ message: "All fields are required" });
        }
        const user: any = await Users.findOne({ email });
        if (!user) {
            res.json({ message: "User not found" });
        }
        if (!user.isVerified) {
            res.json({ message: "Please verify your email" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.json({ message: "Invalid credentials" });
        }
        const access = generateAccessToken(user);
        const refresh = generateRefreshToken(user);
        res.json({ access, refresh });
    } catch (error) {
        next(error);
    }
}

/**
 * DESC: Verify a user
 * METHOD: GET
 * URL: http://localhost:8000/api/v1/auth/verify/:token
 */

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;
        const decoded: any = verifyAccessToken(token);
        const user: any = await Users.findById(decoded.id);
        if (!user) {
            res.json({ message: "User not found" });
        }
        user.isVerified = true;
        await user.save();
        await sendVerificationSuccessEmail(user.email);
        res.json({ message: "Email verified successfully" });
    } catch (error) {
        next(error);
    }
}

/**
 * DESC: Forgot password
 * METHOD: POST
 * URL: http://localhost:8000/api/v1/auth/forgot-password
 */

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user: any = await Users.findOne({ email });
        if (!user) {
            res.json({ message: "User not found" });
        }
        const token = await emailVerificationToken(user);
        await sendPasswordResetEmail(email, token);
        res.json({ message: "Email sent successfully" });
    } catch (error) {
        next(error);
    }
}

/**
 * DESC: Reset password
 * METHOD: POST
 * URL: http://localhost:8000/api/v1/auth/reset-password/:token
 */

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password } = req.body;
        const { token } = req.params;
        const decoded: any = verifyAccessToken(token);
        const user: any = await Users.findById(decoded.id);
        if (!user) {
            res.json({ message: "User not found" });
        }
        user.password = password;
        await user.save();
        await sendPasswordResetSuccessEmail(user.email);
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
}


/**
 * DESC: Change password
 * METHOD: PUT
 * URL: http://localhost:8000/api/v1/auth/change-password
 */

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user: any = await Users.findById(req.user.id);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
}
