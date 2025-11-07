import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

 
const mockCreateFolder = jest.fn((req, res) => res.status(201).json({ message: "Folder created" }));
const mockGetFolders = jest.fn((req, res) => res.status(200).json([{ name: "My Folder" }]));
const mockRenameFolder = jest.fn((req, res) => res.status(200).json({ message: "Folder renamed" }));
const mockDeleteFolder = jest.fn((req, res) => res.status(200).json({ message: "Folder deleted" }));

jest.unstable_mockModule("../../controller/folder.controller.js", () => ({
  createFolder: mockCreateFolder,
  getFolders: mockGetFolders,
  renameFolder: mockRenameFolder,
  deleteFolder: mockDeleteFolder,
}));

 
jest.unstable_mockModule("../../middleware/verifyToken.js", () => ({
  verifyToken: (req, res, next) => next(),
}));

 
const { default: folderRoutes } = await import("../../routes/folder.route.js");

 
const app = express();
app.use(express.json());
app.use("/api/folders", folderRoutes);

 
describe("Folder Routes", () => {
  test("POST /api/folders should call createFolder", async () => {
    const res = await request(app)
      .post("/api/folders")
      .send({ name: "New Folder" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Folder created");
    expect(mockCreateFolder).toHaveBeenCalled();
  });

  test("GET /api/folders should call getFolders", async () => {
    const res = await request(app).get("/api/folders");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ name: "My Folder" }]);
    expect(mockGetFolders).toHaveBeenCalled();
  });

  test("PUT /api/folders/:id should call renameFolder", async () => {
    const res = await request(app)
      .put("/api/folders/123")
      .send({ name: "Renamed Folder" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Folder renamed");
    expect(mockRenameFolder).toHaveBeenCalled();
  });

  test("DELETE /api/folders/:id should call deleteFolder", async () => {
    const res = await request(app).delete("/api/folders/123");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Folder deleted");
    expect(mockDeleteFolder).toHaveBeenCalled();
  });
});