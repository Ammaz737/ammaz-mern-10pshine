
import express from "express";
import { createFolder, getFolders, renameFolder, deleteFolder } from "../controller/folder.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createFolder);
router.get("/", verifyToken, getFolders);
router.put("/:id", verifyToken, renameFolder);
router.delete("/:id", verifyToken, deleteFolder);

export default router;
