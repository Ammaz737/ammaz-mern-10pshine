import { render, screen, fireEvent } from "@testing-library/react";
import SignUpPage from "../SignUpPage";
import { MemoryRouter } from "react-router-dom";
import * as authStore from "../../../store/authStore";

 
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SignUpPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();  
  });

  test("renders all input fields and Sign Up button", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
  });

  test("calls signup with input values on form submit", () => {
    const signupSpy = jest.spyOn(authStore, "useAuthStore").mockReturnValue({
      signup: jest.fn(),
      error: null,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(signupSpy().signup).toHaveBeenCalledWith("john@example.com", "password123", "John Doe");
  });

  test("disables button while loading", () => {
    jest.spyOn(authStore, "useAuthStore").mockReturnValue({
      signup: jest.fn(),
      error: null,
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
