import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';

describe('Database Connection Tests', () => {
  let dbModule;

  beforeAll(async () => {
    dbModule = await import('../DB/db.js');
  });

  afterAll(async () => {
    // Close mongoose connection after tests
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should validate database connection logic', () => {
    expect(dbModule).toBeDefined();
    expect(typeof dbModule.connectToDatabase).toBe('function');
  });

  it('should have connectToDatabase function', () => {
    expect(dbModule).toHaveProperty('connectToDatabase');
    expect(typeof dbModule.connectToDatabase).toBe('function');
  });

  // Removed the 'client' test since Mongoose doesn't export a client
  it('should export connectToDatabase as a function', () => {
    expect(dbModule.connectToDatabase).toBeInstanceOf(Function);
  });
});
