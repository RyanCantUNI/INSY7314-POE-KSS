// ===== MOCKS =====
jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../login';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.alert = jest.fn();
  });

  describe('Rendering', () => {
    it('renders login form correctly', () => {
      renderLogin();
      
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/account number/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    });
  });

  describe('Form Input', () => {
    it('updates form fields when user types', () => {
      renderLogin();
      
      const accountInput = screen.getByPlaceholderText(/account number/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      
      fireEvent.change(accountInput, { target: { value: '123456' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      expect(accountInput).toHaveValue('123456');
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Form Submission - Success', () => {
    it('submits form with correct data on successful login', async () => {
      const mockResponse = {
        data: {
          UUID: 'test-uuid-123',
          message: 'Successfully logged in'
        }
      };
      
      axios.post.mockResolvedValueOnce(mockResponse);
      
      renderLogin();
      
      const accountInput = screen.getByPlaceholderText(/account number/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^login$/i });
      
      fireEvent.change(accountInput, { target: { value: '123456' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
      });

      expect(axios.post).toHaveBeenCalledWith(
        'https://localhost:443/login',
        expect.objectContaining({
          accountNumber: '123456',
          email: 'test@example.com',
          password: 'password123'
        })
      );
    });
  });

  describe('Form Submission - Error', () => {
    it('handles login error correctly', async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: 'Invalid credentials'
          }
        }
      });
      
      renderLogin();
      
      const accountInput = screen.getByPlaceholderText(/account number/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /^login$/i });
      
      fireEvent.change(accountInput, { target: { value: '123456' } });
      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
      });
    });
  });

  describe('Navigation', () => {
    it('navigates to register page when register button is clicked', () => {
      renderLogin();
      
      const registerButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(registerButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });
});
