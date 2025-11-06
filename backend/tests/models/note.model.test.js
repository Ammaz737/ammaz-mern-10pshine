import mongoose from "mongoose";
import mockingoose from "mockingoose";
import Note from "../../models/note.model.js";

describe("Note Model Tests", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("should validate required fields", async () => {
    const note = new Note({});
    let err;
    try {
      await note.validate();
    } catch (e) {
      err = e;
    }

    expect(err.errors.user).toBeDefined();
    expect(err.errors.title).toBeDefined();
    expect(err.errors.content).toBeDefined();
  });

  test("should create a note with default values", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const noteData = {
      user: mockUserId,
      title: "Meeting Notes",
      content: "Discuss project milestones",
      tags: ["work", "important"],
    };

    const note = new Note(noteData);

    expect(note.title).toBe("Meeting Notes");
    expect(note.content).toBe("Discuss project milestones");
    expect(note.tags).toContain("work");
    expect(note.folder).toBeNull();  
    expect(note.isPinned).toBe(false);  
  });

  test("should mock Note.findOne() correctly", async () => {
    const mockUserId = new mongoose.Types.ObjectId();

    const mockNote = {
      _id: new mongoose.Types.ObjectId(),
      user: mockUserId,
      title: "Test Note",
      content: "Mocked note content",
      tags: ["mock"],
      folder: "f1",
      isPinned: true,
    };

    mockingoose(Note).toReturn(mockNote, "findOne");

    const result = await Note.findOne({ title: "Test Note" });

    expect(result.title).toBe("Test Note");
    expect(result.isPinned).toBe(true);
    expect(result.folder).toBe("f1");
  });
});