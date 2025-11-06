import request from 'supertest';
import express from 'express';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Mock payment route
  app.post('/payment:id', async (req, res) => {
    const { amount, providerAccount, currency, SWIFTCode } = req.body;
    const userId = req.params.id.replace(':', '');
    
    // Validation
    if (!amount || !providerAccount || !currency || !SWIFTCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (!amount || Number.parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }
    
    if (providerAccount.length < 6 || providerAccount.length > 15) {
      return res.status(400).json({ message: 'Provider account must be between 6 and 15 characters' });
    }
    
    if (SWIFTCode.length < 4) {
      return res.status(400).json({ message: 'SWIFT code must be at least 4 characters' });
    }
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }
    
    const paymentID = 'mock-payment-uuid';
    const currentDate = new Date().toLocaleDateString();
    
    const payment = {
      paymentID,
      date: currentDate,
      userID: userId,
      amount,
      providerAccount,
      currency,
      SWIFTCode
    };
    
    return res.status(200).json({ 
      message: 'Payment made',
      payment 
    });
  });
  
  // Mock logs route
  app.get('/logs', async (req, res) => {
    const mockLogs = [
      {
        paymentID: 'test-payment-1',
        date: '2024-01-01',
        userID: 'test-uuid-123',
        amount: '1000',
        currency: 'USD',
        SWIFTCode: 'SWIFT123'
      }
    ];
    
    return res.status(200).json({ logs: mockLogs });
  });
  
  return app;
};

describe('Payment API Tests', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp();
  });
  
  describe('POST /payment:id', () => {
    it('should successfully create a payment', async () => {
      const response = await request(app)
        .post('/payment:test-uuid-123')
        .send({
          amount: '1000',
          providerAccount: '1234567890',
          currency: 'USD',
          SWIFTCode: 'SWIFT123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Payment made');
      expect(response.body.payment).toHaveProperty('paymentID');
      expect(response.body.payment).toHaveProperty('userID', 'test-uuid-123');
      expect(response.body.payment.amount).toBe('1000');
    });
    
    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/payment:test-uuid-123')
        .send({
          amount: '1000',
          currency: 'USD'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 400 for invalid amount', async () => {
      const response = await request(app)
        .post('/payment:test-uuid-123')
        .send({
          amount: '0',
          providerAccount: '1234567890',
          currency: 'USD',
          SWIFTCode: 'SWIFT123'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 400 for invalid provider account length', async () => {
      const response = await request(app)
        .post('/payment:test-uuid-123')
        .send({
          amount: '1000',
          providerAccount: '123',
          currency: 'USD',
          SWIFTCode: 'SWIFT123'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 400 for invalid SWIFT code length', async () => {
      const response = await request(app)
        .post('/payment:test-uuid-123')
        .send({
          amount: '1000',
          providerAccount: '1234567890',
          currency: 'USD',
          SWIFTCode: 'SW'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('should return 401 for missing user ID', async () => {
      const response = await request(app)
        .post('/payment:')
        .send({
          amount: '1000',
          providerAccount: '1234567890',
          currency: 'USD',
          SWIFTCode: 'SWIFT123'
        });
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /logs', () => {
    it('should successfully retrieve payment logs', async () => {
      const response = await request(app)
        .get('/logs');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('logs');
      expect(Array.isArray(response.body.logs)).toBe(true);
    });
  });
});
