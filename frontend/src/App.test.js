import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios to avoid ES module issues
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
  post: jest.fn(),
  get: jest.fn(),
}));

describe('App Component', () => {
  it('renders welcome page by default', () => {
    render(<App />);
    
    expect(screen.getByText('Welcome to Our App')).toBeInTheDocument();
    expect(screen.getByText(/Please log in or register/i)).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<App />);
    
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
