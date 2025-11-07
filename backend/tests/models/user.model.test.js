import mongoose from "mongoose";
import mockingoose from "mockingoose";
import User from "../../models/user.model.js";

describe("User Model Tests", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("should require email, password, and name", async () => {
    const user = new User({});
    let err;
    try {
      await user.validate();
    } catch (e) {
      err = e;
    }

    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  test("should set default values for lastLogin and isVerified", async () => {
    const user = new User({
      email: "test@example.com",
      password: "securepassword",
      name: "Test User",
    });

    expect(user.email).toBe("test@example.com");
    expect(user.isVerified).toBe(false);
    expect(user.lastLogin).toBeInstanceOf(Date);
  });

  test("should mock User.findOne() correctly", async () => {
    const mockUser = {
      _id: new mongoose.Types.ObjectId(),
      email: "mock@example.com",
      password: "hashedpass",
      name: "Mock User",
      isVerified: true,
    };

    mockingoose(User).toReturn(mockUser, "findOne");

    const result = await User.findOne({ email: "mock@example.com" });

    expect(result.email).toBe("mock@example.com");
    expect(result.name).toBe("Mock User");
    expect(result.isVerified).toBe(true);
  });

  test("should include optional token fields if provided", async () => {
    const userData = {
      email: "user@example.com",
      password: "mypassword",
      name: "Optional User",
      resetPasswordToken: "abc123",
      verificationToken: "verify123",
    };

    const user = new User(userData);

    expect(user.resetPasswordToken).toBe("abc123");
    expect(user.verificationToken).toBe("verify123");
  });
});