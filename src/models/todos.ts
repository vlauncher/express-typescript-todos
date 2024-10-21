import { Document, Schema, model } from "mongoose";
import { Users } from "./users";

interface ITodo {
    title: string;
    description: string;
    completed: boolean;
    userId: any;
}


const todoSchema = new Schema<ITodo>({
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
        type: Schema.Types.ObjectId,
        ref: Users,
        required: true,
        autopopulate: true
    }
});

export const Todos = model<ITodo>("Todo", todoSchema);
