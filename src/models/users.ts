import { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isVerified: boolean;
    comparePassword: (password: string) => Promise<boolean>;
    hashPassword: (password: string) => Promise<string>;
}

const usersSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(value);
            },
            message: "Invalid email address"
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => {
                return value.length >= 8;
            },
            message: "Password must be at least 8 characters long"
        },
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

usersSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

// Hash password pre save
usersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});


export const Users = model<IUser>('Users', usersSchema);


