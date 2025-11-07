
import Note from "../models/note.model.js";

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId });
    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createNote = async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const note = new Note({
      user: req.userId,
      title,
      content,
      tags,
    });
    const newNote = await note.save();
    res.status(201).json({ success: true, note: newNote });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateNote = async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    note.title = title || note.title;
    note.content = content || note.content;
    note.tags = tags || note.tags;
    const updatedNote = await note.save();
    res.status(200).json({ success: true, note: updatedNote });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const pinNote = async (req, res) => {
    const { isPinned } = req.body;
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.userId });
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        note.isPinned = isPinned;
        const updatedNote = await note.save();
        res.status(200).json({ success: true, note: updatedNote });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
