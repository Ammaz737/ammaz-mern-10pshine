import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '../ForgotPasswordPage';
import { useAuthStore } from '../../../store/authStore';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

 
jest.mock('../../../store/authStore');

describe('ForgotPasswordPage', () => {
  const mockForgotPassword = jest.fn();

  beforeEach(() => {
    useAuthStore.mockReturnValue({
      isLoading: false,
      forgotPassword: mockForgotPassword,
    });
    jest.clearAllMocks();
  });

  test('renders form correctly', () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  test('allows typing into email input', () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('calls forgotPassword on form submit and shows confirmation', async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const button = screen.getByRole('button', { name: /send reset link/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText(/you will receive a password reset link/i)).toBeInTheDocument();
    });
  });

  test('Back to Login link is present', () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    const link = screen.getByText(/back to login/i);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/login');
  });
});
