import '@testing-library/jest-dom';

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress console.error in tests
  console.error = (...args) => {
    // Ignore specific errors you expect in tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Not implemented: HTMLFormElement.prototype.requestSubmit') ||
       args[0].includes('Login error:') ||
       args[0].includes('Registration error:'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  // Suppress React Router v7 future flag warnings
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React Router Future Flag Warning') ||
       args[0].includes('v7_startTransition') ||
       args[0].includes('v7_relativeSplatPath'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
