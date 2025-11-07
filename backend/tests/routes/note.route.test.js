import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const mockCreateNote = jest.fn((req, res) => res.status(201).json({ message: "Note created" }));
const mockGetNotes = jest.fn((req, res) => res.status(200).json([{ title: "Note 1" }]));
const mockGetNote = jest.fn((req, res) => res.status(200).json({ title: "Single Note" }));
const mockUpdateNote = jest.fn((req, res) => res.status(200).json({ message: "Note updated" }));
const mockDeleteNote = jest.fn((req, res) => res.status(200).json({ message: "Note deleted" }));
const mockPinNote = jest.fn((req, res) => res.status(200).json({ message: "Note pinned" }));
const mockMoveNoteToFolder = jest.fn((req, res) => res.status(200).json({ message: "Note moved to folder" }));

jest.unstable_mockModule("../../controller/note.controller.js", () => ({
  createNote: mockCreateNote,
  getNotes: mockGetNotes,
  getNote: mockGetNote,
  updateNote: mockUpdateNote,
  deleteNote: mockDeleteNote,
  pinNote: mockPinNote,
  moveNoteToFolder: mockMoveNoteToFolder,
}));


jest.unstable_mockModule("../../middleware/verifyToken.js", () => ({
  verifyToken: (req, res, next) => next(),
}));

const { default: noteRoutes } = await import("../../routes/note.route.js");

const app = express();
app.use(express.json());
app.use("/api/notes", noteRoutes);

describe("Note Routes", () => {
  test("POST /api/notes → createNote", async () => {
    const res = await request(app).post("/api/notes").send({ title: "New Note", content: "Hello" });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Note created");
    expect(mockCreateNote).toHaveBeenCalled();
  });

  test("GET /api/notes → getNotes", async () => {
    const res = await request(app).get("/api/notes");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ title: "Note 1" }]);
    expect(mockGetNotes).toHaveBeenCalled();
  });

  test("GET /api/notes/:id → getNote", async () => {
    const res = await request(app).get("/api/notes/123");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Single Note");
    expect(mockGetNote).toHaveBeenCalled();
  });

  test("PUT /api/notes/:id → updateNote", async () => {
    const res = await request(app).put("/api/notes/123").send({ title: "Updated Note" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Note updated");
    expect(mockUpdateNote).toHaveBeenCalled();
  });

  test("DELETE /api/notes/:id → deleteNote", async () => {
    const res = await request(app).delete("/api/notes/123");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Note deleted");
    expect(mockDeleteNote).toHaveBeenCalled();
  });

  test("PUT /api/notes/:id/pin → pinNote", async () => {
    const res = await request(app).put("/api/notes/123/pin");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Note pinned");
    expect(mockPinNote).toHaveBeenCalled();
  });

  test("PUT /api/notes/move/:id → moveNoteToFolder", async () => {
    const res = await request(app).put("/api/notes/move/123").send({ folderId: "f1" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Note moved to folder");
    expect(mockMoveNoteToFolder).toHaveBeenCalled();
  });
});
