import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../Header";
import { BrowserRouter } from "react-router-dom";

 
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

 
jest.mock("../ProfileModal", () => ({ isOpen }) => {
  return isOpen ? <div data-testid="profile-modal">Profile Modal Open</div> : null;
});

const renderHeader = () =>
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );

describe("Header Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders app title", () => {
    renderHeader();
    expect(screen.getByText("NotesApp")).toBeInTheDocument();
  });

  test("renders Create Note button", () => {
    renderHeader();
    const button = screen.getByRole("button", { name: /create note/i });
    expect(button).toBeInTheDocument();
  });

  test("navigates to /note/new when Create Note button clicked", () => {
    renderHeader();
    const button = screen.getByRole("button", { name: /create note/i });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith("/note/new");
  });

  test("opens profile modal when user icon clicked", () => {
    renderHeader();
    expect(screen.queryByTestId("profile-modal")).not.toBeInTheDocument();

    const userIcon = screen.getByTestId("profile-icon");
    fireEvent.click(userIcon);

    expect(screen.getByTestId("profile-modal")).toBeInTheDocument();
  });

  test("toggles profile modal open/close", () => {
    renderHeader();

    
    const userIcon = screen.getByTestId("profile-icon");

   
    fireEvent.click(userIcon);
    expect(screen.getByTestId("profile-modal")).toBeInTheDocument();

    
    fireEvent.click(userIcon);
    expect(screen.queryByTestId("profile-modal")).not.toBeInTheDocument();
  });
});
