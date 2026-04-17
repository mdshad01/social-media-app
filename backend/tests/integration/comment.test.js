import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

jest.unstable_mockModule('../../utils/email.js', () => ({
  default: jest.fn().mockResolvedValue(true)
}));

// Mock cloudinary to prevent real uploads
jest.unstable_mockModule('../../utils/cloudinary.js', () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue({
    secure_url: 'https://fake-cloudinary.com/image.jpg',
    public_id: 'fake-public-id'
  })
}));

// Now import app and models after mocking
const { default: app } = await import('../../app.js');
const { default: User } = await import('../../models/userModel.js');
const { default: Post } = await import('../../models/postModel.js');
const {default: Comment} = await import('../../models/commentModel.js');

let mongoServer;
let authToken;
let testUser;

// Setup: Run before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  await mongoose.connect(mongoUri);
});

// Cleanup: Run after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database and create test user before each test
beforeEach(async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  
  // Create a verified test user and get auth token
  const signupRes = await request(app)
    .post('/api/v1/users/signup')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123'
    });
  
  authToken = signupRes.body.token;
  testUser = signupRes.body.data.user;
  
  // Verify the user manually in database
  await User.findByIdAndUpdate(testUser._id, { isVerified: true });
});

describe("Comment API Test",() => {
    describe("Post /api/v1/posts/comment/:id",() => {
        it("Should create a new comment",async () => {
            const comment = await request(app).post("/api/v1/posts/comment/:id").send({
                
            })
        })
    })
})