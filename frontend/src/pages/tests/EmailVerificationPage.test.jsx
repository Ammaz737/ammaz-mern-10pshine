import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmailVerificationPage from '../EmailVerificationPage';
import { useAuthStore } from '../../../store/authStore';

 
jest.mock('../../../store/authStore');

const mockVerifyEmail = jest.fn();
const mockNavigate = jest.fn();

 
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('EmailVerificationPage', () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue({
      error: null,
      isLoading: false,
      verifyEmail: mockVerifyEmail,
    });
    jest.clearAllMocks();
  });

  test('renders 6 input fields and verify button', () => {
    render(
      <MemoryRouter>
        <EmailVerificationPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);

    const button = screen.getByRole('button', { name: /verify email/i });
    expect(button).toBeInTheDocument();
  });

  test('allows typing into inputs and auto-focuses next input', () => {
    render(
      <MemoryRouter>
        <EmailVerificationPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByRole('textbox');

     
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[0].value).toBe('1');

   
    expect(document.activeElement).toBe(inputs[1]);

  
    fireEvent.change(inputs[0], { target: { value: '123456' } });
    expect(inputs.map(input => input.value)).toEqual(['1','2','3','4','5','6']);
  });

  test('calls verifyEmail and navigates on full code submission', async () => {
    render(
      <MemoryRouter>
        <EmailVerificationPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });
    fireEvent.change(inputs[4], { target: { value: '5' } });
    fireEvent.change(inputs[5], { target: { value: '6' } });

    await waitFor(() => {
      expect(mockVerifyEmail).toHaveBeenCalledWith('123456');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows error message if error exists in auth store', () => {
    useAuthStore.mockReturnValueOnce({
      error: 'Invalid code',
      isLoading: false,
      verifyEmail: mockVerifyEmail,
    });

    render(
      <MemoryRouter>
        <EmailVerificationPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });
});
