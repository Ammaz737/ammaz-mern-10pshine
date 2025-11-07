import { jest } from "@jest/globals";

 
const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockFindOneAndDelete = jest.fn();
const mockFindByIdAndUpdate = jest.fn();

 
class Note {
  constructor(data) {
    Object.assign(this, data);
  }

  save() {
    return mockSave(this);
  }

  static find = mockFind;
  static findOne = mockFindOne;
  static findOneAndDelete = mockFindOneAndDelete;
  static findByIdAndUpdate = mockFindByIdAndUpdate;
}

 
jest.unstable_mockModule("../../models/note.model.js", () => ({
  __esModule: true,
  default: Note,
}));

 
const {
  getNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
  moveNoteToFolder,
  pinNote,
} = await import("../../controller/note.controller.js");

describe(" Note Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      userId: "fakeUserId",
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

 
  test("should get all notes for a user", async () => {
    mockFind.mockResolvedValueOnce([{ title: "Note 1" }]);

    await getNotes(req, res);

    expect(mockFind).toHaveBeenCalledWith({ user: "fakeUserId" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      notes: [{ title: "Note 1" }],
    });
  });

 
  test("should create a new note successfully", async () => {
    mockSave.mockResolvedValueOnce({
      _id: "1",
      title: "Test Note",
      content: "Hello",
    });

    req.body = { title: "Test Note", content: "Hello", tags: ["tag1"], folder: "f1" };

    await createNote(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      note: expect.objectContaining({ title: "Test Note" }),
    });
  });

 
  test("should get a single note by id", async () => {
    mockFindOne.mockResolvedValueOnce({ _id: "1", title: "My Note" });
    req.params.id = "1";

    await getNote(req, res);

    expect(mockFindOne).toHaveBeenCalledWith({ _id: "1", user: "fakeUserId" });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 404 if note not found in getNote", async () => {
    mockFindOne.mockResolvedValueOnce(null);
    req.params.id = "99";

    await getNote(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Note not found",
    });
  });

  
  test("should update a note successfully", async () => {
    const mockNote = {
      _id: "1",
      title: "Old",
      content: "Old",
      tags: [],
      save: jest.fn().mockResolvedValue({
        _id: "1",
        title: "New",
        content: "Updated",
        tags: ["t"],
      }),
    };

    mockFindOne.mockResolvedValueOnce(mockNote);
    req.params.id = "1";
    req.body = { title: "New", content: "Updated", tags: ["t"] };

    await updateNote(req, res);

    expect(mockFindOne).toHaveBeenCalledWith({ _id: "1", user: "fakeUserId" });
    expect(mockNote.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 404 if note not found in updateNote", async () => {
    mockFindOne.mockResolvedValueOnce(null);
    req.params.id = "404";

    await updateNote(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  
  test("should delete a note successfully", async () => {
    mockFindOneAndDelete.mockResolvedValueOnce({ _id: "1" });
    req.params.id = "1";

    await deleteNote(req, res);

    expect(mockFindOneAndDelete).toHaveBeenCalledWith({
      _id: "1",
      user: "fakeUserId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 404 if note not found in deleteNote", async () => {
    mockFindOneAndDelete.mockResolvedValueOnce(null);
    req.params.id = "404";

    await deleteNote(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  
  test("should move a note to a folder", async () => {
    mockFindByIdAndUpdate.mockResolvedValueOnce({ _id: "1", folder: "f1" });
    req.params.id = "1";
    req.body = { folderId: "f1" };

    await moveNoteToFolder(req, res);

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { folder: "f1" },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

 
  test("should pin a note successfully", async () => {
    const mockNote = {
      _id: "1",
      title: "Note",
      isPinned: false,
      save: jest.fn().mockResolvedValue({ _id: "1", isPinned: true }),
    };

    mockFindOne.mockResolvedValueOnce(mockNote);
    req.params.id = "1";
    req.body = { isPinned: true };

    await pinNote(req, res);

    expect(mockFindOne).toHaveBeenCalledWith({ _id: "1", user: "fakeUserId" });
    expect(mockNote.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 404 if note not found in pinNote", async () => {
    mockFindOne.mockResolvedValueOnce(null);
    req.params.id = "404";

    await pinNote(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
