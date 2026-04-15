import { describe, expect, test, it, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock the email utility BEFORE importing app
jest.unstable_mockModule('../../utils/email.js', () => ({
  default: jest.fn().mockResolvedValue(true)
}));

// Now import app after mocking
const { default: app } = await import('../../app.js');
const { default: User } = await import('../../models/userModel.js');

let mongoServer;

// Setup: Run before all tests
beforeAll(async () => {
  // Create in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Disconnect from real DB if connected
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Connect to test DB
  await mongoose.connect(mongoUri);
});

// Cleanup: Run after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database before each test
beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth API Tests', () => {
  
  describe('POST /api/v1/users/signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      };

      const res = await request(app)
        .post('/api/v1/users/signup')
        .send(userData);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.user.username).toBe('testuser');
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should fail if email already exists', async () => {
      // Create user first
      await User.create({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      });

      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          username: 'newuser',
          email: 'existing@example.com',
          password: 'password123',
          passwordConfirm: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Email already registerd');
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          username: 'testuser'
        });

      // Accepts either 400 (validation error) or 500 (server error)
      expect([400, 500]).toContain(res.statusCode);
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should login successfully with correct credentials', async () => {
      await User.create({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        isVerified: true
      });

      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe('login@example.com');
    });

    it('should fail with incorrect password', async () => {
      await User.create({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      });

      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Invalid email or password');
    });

    it('should fail if email does not exist', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should fail if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'test@example.com'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Please provide email and Password');
    });
  });

  describe('POST /api/v1/users/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users/logout');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Logged out successfully');
    });
  });
});
