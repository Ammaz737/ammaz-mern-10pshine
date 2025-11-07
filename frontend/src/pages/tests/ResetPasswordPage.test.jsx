import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';

import ResetPasswordPage from '../ResetPasswordPage';
import { useAuthStore } from '../../../store/authStore';

jest.mock('../../../store/authStore');
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('ResetPasswordPage', () => {
  const mockResetPassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      resetPassword: mockResetPassword,
      isLoading: false,
      error: null,
      message: null,
    });
  });

  test('renders form inputs and button', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/testtoken']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText(/password/i);
    expect(inputs[0]).toBeInTheDocument();  
    expect(inputs[1]).toBeInTheDocument();  
    expect(screen.getByRole('button', { name: /set new password/i })).toBeInTheDocument();
  });

  test('shows error toast if passwords do not match', async () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/testtoken']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(inputs[0], { target: { value: 'pass1' } });
    fireEvent.change(inputs[1], { target: { value: 'pass2' } });

    fireEvent.click(screen.getByRole('button', { name: /set new password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
      expect(mockResetPassword).not.toHaveBeenCalled();
    });
  });

  test('calls resetPassword with token and new password when matched', async () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/testtoken']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(inputs[0], { target: { value: 'password123' } });
    fireEvent.change(inputs[1], { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /set new password/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('testtoken', 'password123');
      expect(toast.success).toHaveBeenCalledWith(
        'Password reset successfully, redirecting to login page...'
      );
    });
  });

  test('disables button while loading', () => {
    useAuthStore.mockReturnValueOnce({
      resetPassword: mockResetPassword,
      isLoading: true,
      error: null,
      message: null,
    });

    render(
      <MemoryRouter initialEntries={['/reset-password/testtoken']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent(/resetting/i);
  });
});
