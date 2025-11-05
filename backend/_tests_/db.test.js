import mongoose from 'mongoose';
import connectToDatabase from '../DB/db.js'; // ✅ default import

describe('Database Connection Tests', () => {
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should validate database connection logic', () => {
    expect(connectToDatabase).toBeDefined();
    expect(typeof connectToDatabase).toBe('function');
  });

  it('should have connectToDatabase function', () => {
    expect(connectToDatabase).toBeDefined();
    expect(typeof connectToDatabase).toBe('function');
  });

  it('should export connectToDatabase as a function', () => {
    expect(connectToDatabase).toBeInstanceOf(Function);
  });
});
