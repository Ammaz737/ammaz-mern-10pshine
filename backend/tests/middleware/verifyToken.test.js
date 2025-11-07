import { jest } from "@jest/globals";

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(),
  },
}));


const { default: jwt } = await import("jsonwebtoken");
const { verifyToken } = await import("../../middleware/verifyToken.js");

describe("verifyToken Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("should return 401 if no token provided", () => {
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should verify token and call next()", () => {
    req.cookies.token = "validToken";
    jwt.verify.mockReturnValue({ id: "user123" });

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("validToken", process.env.JWT_SECRET);
    expect(req.userId).toBe("user123");
    expect(next).toHaveBeenCalled();
  });

  test("should return 401 if token verification fails", () => {
    req.cookies.token = "invalidToken";
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });
});
