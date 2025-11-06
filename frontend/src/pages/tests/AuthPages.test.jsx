import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import LoginPage from '../LoginPage';
import ForgotPasswordPage from '../ForgotPasswordPage';
import EmailVerificationPage from '../EmailVerificationPage';

import { useAuthStore } from '../../../store/authStore';

jest.mock('../../../store/authStore');

describe('Auth Pages', () => {
  const mockLogin = jest.fn();
  const mockForgotPassword = jest.fn();
  const mockVerifyEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      forgotPassword: mockForgotPassword,
      verifyEmail: mockVerifyEmail,
    });
  });

  
  test('LoginPage renders correctly and submits login', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /login/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'password123');
    });
  });

   
  test('ForgotPasswordPage submits email and shows confirmation', async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const submitBtn = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('user@test.com');
      expect(screen.getByText(/you will receive a password reset link/i)).toBeInTheDocument();
    });

 
    expect(screen.getByText(/back to login/i).closest('a')).toHaveAttribute('href', '/login');
  });

  
  test('EmailVerificationPage handles 6-digit code and calls verifyEmail', async () => {
    render(
      <MemoryRouter>
        <EmailVerificationPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);

    
    const code = ['1','2','3','4','5','6'];
    code.forEach((digit, idx) => {
      fireEvent.change(inputs[idx], { target: { value: digit } });
    });

    await waitFor(() => {
      expect(mockVerifyEmail).toHaveBeenCalledWith('123456');
    });
  });
});
