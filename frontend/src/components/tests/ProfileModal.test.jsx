import { render, screen, fireEvent } from "@testing-library/react";
import ProfileModal from "../ProfileModal";
import { useAuthStore } from "../../../store/authStore";

 
jest.mock("../../../store/authStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("../../utils/date", () => ({
  formatDate: jest.fn((date) => `Formatted(${date})`),
}));

describe("ProfileModal Component", () => {
  const mockLogout = jest.fn();
  const mockOnClose = jest.fn();

  const mockUser = {
    name: "Test User",
    email: "test@example.com",
    createdAt: "2023-05-01T00:00:00Z",
    lastLogin: "2023-06-01T12:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing when user is not available", () => {
    useAuthStore.mockReturnValue({ user: null });
    const { container } = render(<ProfileModal isOpen={true} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders user profile information when open", () => {
    useAuthStore.mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<ProfileModal isOpen={true} onClose={mockOnClose} />);

   
    expect(screen.getByText("Profile")).toBeInTheDocument();
 
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();

  
    expect(screen.getByText(/Joined:/)).toBeInTheDocument();
    expect(screen.getByText(/Last Login:/)).toBeInTheDocument();

   
    expect(screen.getByText("Formatted(2023-06-01T12:00:00Z)")).toBeInTheDocument();
  });

  test("does not render when isOpen is false", () => {
    useAuthStore.mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<ProfileModal isOpen={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  test("calls logout and onClose on Logout button click", () => {
    useAuthStore.mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<ProfileModal isOpen={true} onClose={mockOnClose} />);

    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
