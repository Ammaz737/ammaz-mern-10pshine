import Folder from "../models/folder.model.js";

export const createFolder = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { name } = req.body;
    const userId = req.userId;

    const newFolder = new Folder({
      name,
      user: userId,
    });

    await newFolder.save();
    console.log("Folder saved successfully");

    res.status(201).json({ message: "Folder created successfully", folder: newFolder });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Error creating folder", error });
  }
};

export const getFolders = async (req, res) => {
  try {
    const userId = req.userId;
    const folders = await Folder.find({ user: userId });
    res.status(200).json({ folders });
  } catch (error) {
    res.status(500).json({ message: "Error getting folders", error });
  }
};

export const renameFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedFolder = await Folder.findByIdAndUpdate(id, { name }, { new: true });

    res.status(200).json({ message: "Folder renamed successfully", folder: updatedFolder });
  } catch (error) {
    res.status(500).json({ message: "Error renaming folder", error });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    await Folder.findByIdAndDelete(id);
    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting folder", error });
  }
};
