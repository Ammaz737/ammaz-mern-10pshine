import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import { useNoteStore } from '../../../store/noteStore';
import '@testing-library/jest-dom';

 
jest.mock('../../../store/noteStore');

const notesMock = [
  {
    _id: '1',
    title: 'Work Note',
    content: 'This is a work note',
    tags: ['work'],
    isPinned: true,
    folder: ''
  },
  {
    _id: '2',
    title: 'Personal Task',
    content: 'This is a personal task',
    tags: ['personal'],
    isPinned: false,
    folder: ''
  }
];

const mockGetNotes = jest.fn();

describe('DashboardPage', () => {
  beforeEach(() => {
    useNoteStore.mockReturnValue({
      notes: notesMock,
      getNotes: mockGetNotes,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders notes after fetching', async () => {
    render(
      <MemoryRouter>
        <DashboardPage selectedFolder="" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Work Note')).toBeInTheDocument();
      expect(screen.getByText('Personal Task')).toBeInTheDocument();
    });

    expect(mockGetNotes).toHaveBeenCalledTimes(1);
  });

  test('filters notes by search query', async () => {
    render(
      <MemoryRouter>
        <DashboardPage selectedFolder="" />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Search notes by title, content, or tags...');
    fireEvent.change(input, { target: { value: 'work' } });

    await waitFor(() => {
      expect(screen.getByText('Work Note')).toBeInTheDocument();
      expect(screen.queryByText('Personal Task')).not.toBeInTheDocument();
    });
  });

  test('shows no notes message if none exist', async () => {
    useNoteStore.mockReturnValueOnce({
      notes: [],
      getNotes: mockGetNotes,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <DashboardPage selectedFolder="" />
      </MemoryRouter>
    );

    expect(screen.getByText('No notes found.')).toBeInTheDocument();
  });
});
