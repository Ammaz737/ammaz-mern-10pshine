import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {connectDB}  from './db/connectDB.js';
import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/note.route.js";
import folderRoutes from "./routes/folder.route.js";
import llmRoutes from "./routes/llm.route.js";
import cors from 'cors';

dotenv.config();

const app =  express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json()); // This will allow us to parse incoming request:body
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);
app.use('/api/llm', llmRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port', PORT);
} )

