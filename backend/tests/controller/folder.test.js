import { jest } from "@jest/globals";

const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();

 
class Folder {
  constructor(data) {
    Object.assign(this, data);
  }
  save() {
    return mockSave(this);
  }

  static find = mockFind;
  static findByIdAndUpdate = mockFindByIdAndUpdate;
  static findByIdAndDelete = mockFindByIdAndDelete;
}

 
jest.unstable_mockModule("../../models/folder.model.js", () => ({
  __esModule: true,
  default: Folder,
}));

 
const { createFolder, getFolders, renameFolder, deleteFolder } = await import(
  "../../controller/folder.controller.js"
);

describe("📁 Folder Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, userId: "fakeUserId" };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("should create a folder successfully", async () => {
    mockSave.mockResolvedValueOnce(true);

    req.body = { name: "My Folder" };
    await createFolder(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Folder created successfully" })
    );
  });

  test("should get folders successfully", async () => {
    mockFind.mockResolvedValueOnce([{ name: "Folder1" }]);

    await getFolders(req, res);

    expect(mockFind).toHaveBeenCalledWith({ user: "fakeUserId" });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should rename folder successfully", async () => {
    req.params.id = "folder123";
    req.body = { name: "Updated" };

    mockFindByIdAndUpdate.mockResolvedValueOnce({ name: "Updated" });

    await renameFolder(req, res);

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      "folder123",
      { name: "Updated" },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should delete folder successfully", async () => {
    req.params.id = "folder123";
    mockFindByIdAndDelete.mockResolvedValueOnce(true);

    await deleteFolder(req, res);

    expect(mockFindByIdAndDelete).toHaveBeenCalledWith("folder123");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
