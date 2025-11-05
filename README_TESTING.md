# Testing Documentation

This document provides information about the automated testing setup for the KracKShacK Security project.

## Overview

The project includes comprehensive automated testing for both frontend and backend components, along with a CI/CD pipeline that runs tests automatically on push and pull requests.

## Backend Testing

### Setup

Backend tests use **Jest** and **Supertest** for API testing.

### Running Tests

```bash
cd backend
npm install
npm test                 # Run all tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

### Test Files

- `backend/__tests__/auth.test.js` - Authentication API tests (login, register)
- `backend/__tests__/payment.test.js` - Payment processing API tests
- `backend/__tests__/db.test.js` - Database connection tests

### Test Coverage

Backend tests cover:
- User registration with validation
- User login with authentication
- Payment creation and validation
- Database connectivity
- Error handling

## Frontend Testing

### Setup

Frontend tests use **React Testing Library** and **Jest** (included with Create React App).

### Running Tests

```bash
cd frontend
npm install
npm test                 # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

### Test Files

- `frontend/src/App.test.js` - Main App component tests
- `frontend/src/components/__tests__/login.test.js` - Login component tests
- `frontend/src/components/__tests__/register.test.js` - Register component tests

### Test Coverage

Frontend tests cover:
- Component rendering
- User interactions (form inputs, button clicks)
- Navigation between pages
- API integration
- Error handling

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline is configured in `.github/workflows/ci.yml` and runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Pipeline Stages

1. **Backend Tests**
   - Sets up MongoDB service
   - Installs dependencies
   - Runs backend test suite
   - Generates coverage report

2. **Frontend Tests**
   - Installs dependencies
   - Runs frontend test suite
   - Generates coverage report
   - Builds the frontend application

3. **Lint Check**
   - Runs linting (if configured) on both frontend and backend

4. **Security Audit**
   - Runs `npm audit` to check for known vulnerabilities

### Viewing Pipeline Results

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Select a workflow run to see detailed results

## Writing New Tests

### Backend Test Example

```javascript
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

describe('My API Endpoint', () => {
  it('should return 200 on success', async () => {
    const response = await request(app)
      .post('/endpoint')
      .send({ data: 'test' });
    
    expect(response.status).toBe(200);
  });
});
```

### Frontend Test Example

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  
  it('handles user interaction', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    // Assert expected behavior
  });
});
```

## Best Practices

1. **Test Coverage**: Aim for at least 70% code coverage
2. **Test Isolation**: Each test should be independent and not rely on other tests
3. **Clear Test Names**: Use descriptive test names that explain what is being tested
4. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
5. **Mock External Dependencies**: Mock API calls, database connections, and external services

## Troubleshooting

### Backend Tests Failing

- Ensure MongoDB service is running (for CI/CD)
- Check that all environment variables are set correctly
- Verify that test database is properly configured

### Frontend Tests Failing

- Make sure all required dependencies are installed
- Check that React Testing Library is properly configured
- Verify that mocks are set up correctly for API calls

### CI/CD Pipeline Failing

- Check the Actions tab in GitHub for detailed error messages
- Ensure all dependencies are listed in package.json
- Verify that test scripts are correctly configured

## Coverage Reports

Coverage reports are generated automatically:
- Backend: `backend/coverage/`
- Frontend: `frontend/coverage/`

To view coverage reports:
1. Run tests with coverage: `npm run test:coverage`
2. Open `coverage/lcov-report/index.html` in a browser

## Continuous Integration

The pipeline automatically:
- Runs all tests on every push/PR
- Generates coverage reports
- Checks for security vulnerabilities
- Validates that the application builds successfully

This ensures code quality and prevents bugs from being merged into the main branch.

