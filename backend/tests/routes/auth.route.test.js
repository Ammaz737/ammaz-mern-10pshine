import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const mockSignup = jest.fn((req, res) => res.status(201).json({ message: "Signup success" }));
const mockLogin = jest.fn((req, res) => res.status(200).json({ message: "Login success" }));
const mockLogout = jest.fn((req, res) => res.status(200).json({ message: "Logged out successfully" }));
const mockVerifyEmail = jest.fn((req, res) => res.status(200).json({ message: "Email verified" }));
const mockForgotPassword = jest.fn((req, res) => res.status(200).json({ message: "Reset link sent" }));
const mockResetPassword = jest.fn((req, res) => res.status(200).json({ message: "Password reset" }));
const mockCheckAuth = jest.fn((req, res) => res.status(200).json({ message: "Authenticated" }));

jest.unstable_mockModule("../../controller/auth.controller.js", () => ({
  signup: mockSignup,
  login: mockLogin,
  logout: mockLogout,
  verifyEmail: mockVerifyEmail,
  forgotPassword: mockForgotPassword,
  resetPassword: mockResetPassword,
  checkAuth: mockCheckAuth,
}));


jest.unstable_mockModule("../../middleware/verifyToken.js", () => ({
  verifyToken: (req, res, next) => next(),
}));


const { default: authRoutes } = await import("../../routes/auth.route.js");


const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);


describe("Auth Routes", () => {
  test("POST /signup should call signup controller", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Test", email: "test@example.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Signup success");
    expect(mockSignup).toHaveBeenCalled();
  });

  test("POST /login should call login controller", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login success");
    expect(mockLogin).toHaveBeenCalled();
  });

  test("POST /logout should call logout controller", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
    expect(mockLogout).toHaveBeenCalled();
  });

  test("POST /verify-email should call verifyEmail controller", async () => {
    const res = await request(app)
      .post("/api/auth/verify-email")
      .send({ token: "mockToken" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Email verified");
    expect(mockVerifyEmail).toHaveBeenCalled();
  });

  test("POST /forgot-password should call forgotPassword controller", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Reset link sent");
    expect(mockForgotPassword).toHaveBeenCalled();
  });

  test("POST /reset-password/:token should call resetPassword controller", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password/mockToken")
      .send({ newPassword: "new123456" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Password reset");
    expect(mockResetPassword).toHaveBeenCalled();
  });

  test("GET /check-auth should use verifyToken middleware and call checkAuth controller", async () => {
    const res = await request(app).get("/api/auth/check-auth");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Authenticated");
    expect(mockCheckAuth).toHaveBeenCalled();
  });
});