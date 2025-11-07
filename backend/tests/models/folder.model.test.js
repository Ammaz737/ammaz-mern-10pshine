import mongoose from "mongoose";
import mockingoose from "mockingoose";
import Folder from "../../models/folder.model.js";

describe("Folder Model Tests", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("should validate required fields", async () => {
    const folder = new Folder({}); 
    let err;
    try {
      await folder.validate();
    } catch (e) {
      err = e;
    }
    expect(err.errors.name).toBeDefined();
    expect(err.errors.user).toBeDefined();
  });

  test("should create a folder document successfully", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const folderData = {
      name: "Work Projects",
      user: mockUserId,
    };

    const savedFolder = new Folder(folderData);
    expect(savedFolder.name).toBe("Work Projects");
    expect(savedFolder.user).toEqual(mockUserId);
  });

  test("should mock Folder.findOne()", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const folder = {
      _id: "507f191e810c19729de860ea",
      name: "Personal",
      user: mockUserId,
    };

    mockingoose(Folder).toReturn(folder, "findOne");

    const result = await Folder.findOne({ name: "Personal" });
    expect(result.name).toBe("Personal");
    expect(result.user).toEqual(mockUserId);
  });
});