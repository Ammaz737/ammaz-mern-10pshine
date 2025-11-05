
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createNote, getNotes, getNote, updateNote, deleteNote, pinNote, moveNoteToFolder } from "../controller/note.controller.js";

const router = express.Router();

router.post("/", verifyToken, createNote);
router.get("/", verifyToken, getNotes);
router.get("/:id", verifyToken, getNote);
router.put("/:id", verifyToken, updateNote);
router.delete("/:id", verifyToken, deleteNote);
router.put("/:id/pin", verifyToken, pinNote);
router.put("/move/:id", verifyToken, moveNoteToFolder);

export default router;
