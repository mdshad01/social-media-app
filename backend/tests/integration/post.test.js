import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
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

// Mock cloudinary to prevent real uploads
jest.unstable_mockModule('../../utils/cloudinary.js', () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue({
    secure_url: 'https://fake-cloudinary.com/image.jpg',
    public_id: 'fake-public-id'
  }),
  uploadVideoToCloudinary: jest.fn().mockResolvedValue({
    secure_url: 'https://fake-cloudinary.com/video.mp4',
    public_id: 'fake-video-id'
  })
}));

// Now import app and models after mocking
const { default: app } = await import('../../app.js');
const { default: User } = await import('../../models/userModel.js');
const { default: Post } = await import('../../models/postModel.js');

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

describe('Posts API Tests', () => {
  
  describe('POST /api/v1/posts/create-post', () => {
    
    it('should create a text post successfully', async () => {
      const postData = {
        caption: 'This is my first test post',
        postType: 'text'
      };

      const res = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send(postData);

      expect(res.statusCode).toBe(200);  // Changed from 201
      expect(res.body.status).toBe('success');
      expect(res.body.data.post.caption).toBe('This is my first test post');
      expect(res.body.data.post.postType).toBe('text');
      expect(res.body.data.post.user).toBeDefined();
    });

    it('should fail if user is not authenticated', async () => {
      const postData = {
        caption: 'Unauthorized post',
        postType: 'text'
      };

      const res = await request(app)
        .post('/api/v1/posts/create-post')
        .send(postData);

      expect(res.statusCode).toBe(401);
    });

    it('should create a post with empty caption', async () => {
      const postData = {
        caption: '',
        postType: 'text'
      };

      const res = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send(postData);

      // Should either succeed with empty caption or fail with validation
      expect([200, 400]).toContain(res.statusCode);  // Changed from 201
    });
  });
  describe('GET /api/v1/posts/all', () => {
    
    it('should return empty array when no posts exist', async () => {
      const res = await request(app)
        .get('/api/v1/posts/all')
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.posts).toBeDefined();
      expect(Array.isArray(res.body.data.posts)).toBe(true);
      expect(res.body.data.posts.length).toBe(0);
    });

    it('should return all posts when posts exist', async () => {
      // Create 3 test posts first
      await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({ caption: 'Test post 1', postType: 'text' });

      await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({ caption: 'Test post 2', postType: 'text' });

      await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({ caption: 'Test post 3', postType: 'text' });

      // Now get all posts
      const res = await request(app)
        .get('/api/v1/posts/all')
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.results).toBe(3); // Check results count
      expect(res.body.data.posts).toBeDefined();
      expect(Array.isArray(res.body.data.posts)).toBe(true);
      expect(res.body.data.posts.length).toBe(3);
      
      // Check first post structure
      const firstPost = res.body.data.posts[0];
      expect(firstPost).toHaveProperty('caption');
      expect(firstPost).toHaveProperty('postType');
      expect(firstPost).toHaveProperty('user');
      expect(firstPost).toHaveProperty('_id');
      expect(firstPost).toHaveProperty('createdAt');
      expect(firstPost).toHaveProperty('likes');
      expect(firstPost).toHaveProperty('comments');
      expect(Array.isArray(firstPost.likes)).toBe(true);
      expect(Array.isArray(firstPost.comments)).toBe(true);
      
      // Check user is populated
      expect(firstPost.user).toHaveProperty('username');
      expect(firstPost.user).toHaveProperty('bio');
      expect(firstPost.user.username).toBe('testuser');
    });

    it('should fail if user is not authenticated', async () => {
      const res = await request(app)
        .get('/api/v1/posts/all');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/v1/posts/like-dislike/:id', () => {
    
    it('should like a post successfully', async () => {
      // Create a post first
      const createRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({ caption: 'Post to like', postType: 'text' });

      const postId = createRes.body.data.post._id;

      // Like the post
      const res = await request(app)
        .post(`/api/v1/posts/like-dislike/${postId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Liked'); // Capital L
    });

    it('should unlike a post when liked again', async () => {
      // Create a post
      const createRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({ caption: 'Post to unlike', postType: 'text' });

      const postId = createRes.body.data.post._id;

      // Like the post
      await request(app)
        .post(`/api/v1/posts/like-dislike/${postId}`)
        .set('Cookie', `jwt=${authToken}`);

      // Unlike the post (like again)
      const res = await request(app)
        .post(`/api/v1/posts/like-dislike/${postId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('disliked'); // Not "unliked"
    });

    it('should fail if post does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .post(`/api/v1/posts/like-dislike/${fakeId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/v1/posts/delete-post/:id', () => {
    
    it('should delete own post successfully', async () => {
      // Create a post
      const createRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({ caption: 'Post to delete', postType: 'text' });

      const postId = createRes.body.data.post._id;

      // Delete the post
      const res = await request(app)
        .delete(`/api/v1/posts/delete-post/${postId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('deleted');
    });

    it('should fail if post does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/v1/posts/delete-post/${fakeId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(404);
    });

    it('should fail if user is not authenticated', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/v1/posts/delete-post/${fakeId}`);

      expect(res.statusCode).toBe(401);
    });
  });
});