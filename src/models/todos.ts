import { Document, Schema, model } from "mongoose";

interface ITodos extends Document {
    title: string;
    description: string;
    completed: boolean;
}

const todosSchema = new Schema<ITodos>({
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
    }
});

export const Todos = model<ITodos>('Todos', todosSchema);
