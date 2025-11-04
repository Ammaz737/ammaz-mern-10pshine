
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getNotes, createNote, getNote, updateNote, deleteNote, pinNote } from "../controller/note.controller.js";

const router = express.Router();

router.use(verifyToken);

router.route("/").get(getNotes).post(createNote);
router.route("/:id").get(getNote).put(updateNote).delete(deleteNote);
router.route("/:id/pin").put(pinNote);

export default router;
