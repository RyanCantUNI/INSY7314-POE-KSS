import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Mock login route
  app.post('/login', async (req, res) => {
    const { email, password, accountNumber } = req.body;
    
    // Validation
    if (!email || !password || !accountNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    
    // Mock user lookup
    const mockUser = {
      email: 'test@example.com',
      password: 'hashedPassword',
      accountNumber: 'hashedAccount',
      UUID: 'test-uuid-123'
    };
    
    if (email === 'test@example.com') {
      return res.status(200).json({ 
        UUID: mockUser.UUID, 
        Message: 'Successfully logged in'
      });
    }
    
    return res.status(401).json({ message: 'Ensure name and password are correct.' });
  });
  
  // Mock register route
  app.post('/register', async (req, res) => {
    const { fullName, email, idNumber, accountNumber, password } = req.body;
    
    // Validation
    if (!fullName || !email || !idNumber || !accountNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (fullName.length < 3 || fullName.length > 50) {
      return res.status(400).json({ message: 'Full name must be between 3 and 50 characters' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    
    if (accountNumber.length < 6 || accountNumber.length > 15) {
      return res.status(400).json({ message: 'Account number must be between 6 and 15 characters' });
    }
    
    // Mock existing user
    if (email === 'existing@example.com') {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    return res.status(201).json({ message: 'User registered successfully' });
  });
  
  return app;
};

describe('Authentication API Tests', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp();
  });
  
  describe('POST /login', () => {
    it('should successfully login with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
          accountNumber: '123456'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('UUID');
      expect(response.body).toHaveProperty('Message', 'Successfully logged in');
    });
    
    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'short',
          accountNumber: '123456'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123',
          accountNumber: '123456'
        });
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('POST /register', () => {
    it('should successfully register a new user', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          fullName: 'John Doe',
          email: 'newuser@example.com',
          idNumber: '123456789',
          accountNumber: '1234567890',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });
    
    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          fullName: 'John Doe',
          email: 'test@example.com'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          fullName: 'John Doe',
          email: 'test@example.com',
          idNumber: '123456789',
          accountNumber: '1234567890',
          password: 'short'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 400 for invalid full name length', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          fullName: 'Jo',
          email: 'test@example.com',
          idNumber: '123456789',
          accountNumber: '1234567890',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 400 for invalid account number length', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          fullName: 'John Doe',
          email: 'test@example.com',
          idNumber: '123456789',
          accountNumber: '123',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
    });
  });
});
