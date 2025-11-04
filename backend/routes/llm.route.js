
import express from 'express';
import { generateContent } from '../controllers/llm.controller.js';

const router = express.Router();

router.post('/generate', generateContent);

export default router;
