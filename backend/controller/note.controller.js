
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
  try {
    console.log("Request body:", req.body);
    const { title, content, tags, folder } = req.body;
    const userId = req.userId;

    const newNote = new Note({
      title,
      content,
      tags,
      user: userId,
      folder,
    });
    const savedNote = await newNote.save();
    console.log("Note saved successfully");
    res.status(201).json({ success: true, note: savedNote });
  } catch (error) {
    console.error("Error creating note:", error);
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
    console.log(error);
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


export const moveNoteToFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { folderId } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(id, { folder: folderId }, { new: true });

    res.status(200).json({ message: "Note moved successfully", note: updatedNote });
  } catch (error) {
    res.status(500).json({ message: "Error moving note", error });
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
