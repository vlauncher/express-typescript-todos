import express,{ Application } from 'express';
import { config } from 'dotenv';

config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
import connectDB from './config/db';
connectDB();

// Routes
import todosRoutes from './routes/todosRoutes';
app.use('/todos', todosRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});