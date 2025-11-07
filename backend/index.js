import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {connectDB}  from './db/connectDB.js';
import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/note.route.js";

dotenv.config();

const app =  express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // This will allow us to parse incoming request:body
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port', PORT);
} )

