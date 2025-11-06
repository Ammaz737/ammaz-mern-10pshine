import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    folder: {
      type: String,
      default: null,
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);
export default Note;
