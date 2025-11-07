import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NoteCard from "../NoteCard";

const mockDeleteNote = jest.fn();
const mockPinNote = jest.fn();

 
jest.mock("../../../store/noteStore", () => ({
  useNoteStore: () => ({
    deleteNote: mockDeleteNote,
    pinNote: mockPinNote,
  }),
}));

 
const renderNoteCard = (note) => {
  render(
    <BrowserRouter>
      <NoteCard note={note} />
    </BrowserRouter>
  );
};

const note = {
  _id: "123",
  title: "Test Note",
  content: "This is a test note content",
  tags: ["work", "important"],
  isPinned: false,
};

describe("NoteCard Component", () => {
  beforeEach(() => {
    mockDeleteNote.mockClear();
    mockPinNote.mockClear();
    window.confirm = jest.fn(() => true);
  });

  test("renders title and content", () => {
    renderNoteCard(note);
    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("This is a test note content")).toBeInTheDocument();
  });

  test("renders all tags", () => {
    renderNoteCard(note);
    expect(screen.getByText("work")).toBeInTheDocument();
    expect(screen.getByText("important")).toBeInTheDocument();
  });

  test("renders correct view and edit links", () => {
    renderNoteCard(note);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", `/note/view/${note._id}`);
    expect(links[1]).toHaveAttribute("href", `/note/edit/${note._id}`);
  });

  test("calls deleteNote when delete button clicked", () => {
    renderNoteCard(note);
    const deleteBtn = screen.getAllByRole("button")[2];  
    fireEvent.click(deleteBtn);
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this note?"
    );
    expect(mockDeleteNote).toHaveBeenCalledWith(note._id);
  });

  test("calls pinNote when pin button clicked", () => {
    renderNoteCard(note);
    const pinBtn = screen.getAllByRole("button")[3];
    fireEvent.click(pinBtn);
    expect(mockPinNote).toHaveBeenCalledWith(note._id, true);
  });

  test("shows green border when pinned", () => {
    const pinnedNote = { ...note, isPinned: true };
    renderNoteCard(pinnedNote);

    
    const card = screen.getByText("Test Note").closest(".bg-gray-800");
    expect(card?.className.includes("border-green-500")).toBe(true);
  });
});
