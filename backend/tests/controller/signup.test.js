import { jest } from '@jest/globals';
import { signup } from "../../controller/auth.controller.js";

const mockRequest = (body = {}) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller - Signup", () => {
  it("should return 400 if fields are missing", async () => {
    const req = mockRequest({ email: "", password: "", name: "" });
    const res = mockResponse();

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "All fields are required" });
  });
});
