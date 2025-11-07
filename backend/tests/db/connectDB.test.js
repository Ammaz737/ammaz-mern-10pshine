import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { connectDB } from "../../db/connectDB.js";

describe("Database Connection", () => {
  let mockConnect;

  beforeEach(() => {
    mockConnect = jest.spyOn(mongoose, "connect");
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(process, "exit").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should connect to MongoDB successfully", async () => {
    mockConnect.mockResolvedValueOnce({ connection: { host: "localhost" } });

    await connectDB();

    expect(mockConnect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(console.log).toHaveBeenCalledWith(
      "MongoDB connected successfully with $(mongoose.connection.host)"
    );
  });

  test("should handle connection failure and exit process", async () => {
    const mockError = new Error("Connection failed");
    mockConnect.mockRejectedValueOnce(mockError);

    await connectDB();

    expect(console.log).toHaveBeenCalledWith(
      `MongoDB connection failed: ${mockError.message}`
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
