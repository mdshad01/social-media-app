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
  await Comment.deleteMany({});
  
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

describe("Comments API Tests", () => {
  
  describe("POST /api/v1/posts/comment/:id", () => {
    
    it("should create a new comment on a post", async () => {
      // First, create a post to comment on
      const postRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({
          caption: 'Test post for comments',
          postType: 'text'
        });

      const postId = postRes.body.data.post._id;

      // Now add a comment to the post
      const commentData = {
        text: 'This is a test comment'
      };

      const res = await request(app)
        .post(`/api/v1/posts/comment/${postId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send(commentData);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('comment added successfully');
      expect(res.body.data.comment).toBeDefined();
      expect(res.body.data.comment.text).toBe('This is a test comment');
      expect(res.body.data.comment.user).toBeDefined();
      expect(res.body.data.comment.user.username).toBe('testuser');
    });

    it("should fail if comment text is missing", async () => {
      // Create a post first
      const postRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({
          caption: 'Test post',
          postType: 'text'
        });

      const postId = postRes.body.data.post._id;

      // Try to add comment without text
      const res = await request(app)
        .post(`/api/v1/posts/comment/${postId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });

    it("should fail if post does not exist", async () => {
      const fakePostId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .post(`/api/v1/posts/comment/${fakePostId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({ text: 'Comment on non-existent post' });

      expect(res.statusCode).toBe(404);
    });

    it("should fail if user is not authenticated", async () => {
      const fakePostId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .post(`/api/v1/posts/comment/${fakePostId}`)
        .send({ text: 'Unauthorized comment' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/v1/posts/comment/like/:commentId", () => {
    
    it("should like a comment successfully", async () => {
      // Create a post
      const postRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({
          caption: 'Test post for comment likes',
          postType: 'text'
        });

      const postId = postRes.body.data.post._id;

      // Add a comment to the post
      const commentRes = await request(app)
        .post(`/api/v1/posts/comment/${postId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({ text: 'Comment to be liked' });

      const commentId = commentRes.body.data.comment._id;

      // Like the comment
      const res = await request(app)
        .post(`/api/v1/posts/comment/like/${commentId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Comment liked');
      expect(res.body.data.likes).toBeDefined();
      expect(Array.isArray(res.body.data.likes)).toBe(true);
      expect(res.body.data.likes.length).toBe(1);
    });

    it("should unlike a comment when liked again", async () => {
      // Create a post
      const postRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({
          caption: 'Test post',
          postType: 'text'
        });

      const postId = postRes.body.data.post._id;

      // Add a comment
      const commentRes = await request(app)
        .post(`/api/v1/posts/comment/${postId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({ text: 'Comment to be unliked' });

      const commentId = commentRes.body.data.comment._id;

      // Like the comment first
      await request(app)
        .post(`/api/v1/posts/comment/like/${commentId}`)
        .set('Cookie', `jwt=${authToken}`);

      // Unlike the comment (like again)
      const res = await request(app)
        .post(`/api/v1/posts/comment/like/${commentId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Comment unliked');
      expect(res.body.data.likes).toBeDefined();
      expect(res.body.data.likes.length).toBe(0);
    });

    it("should fail if comment does not exist", async () => {
      const fakeCommentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .post(`/api/v1/posts/comment/like/${fakeCommentId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(404);
    });

    it("should fail if user is not authenticated", async () => {
      const fakeCommentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .post(`/api/v1/posts/comment/like/${fakeCommentId}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/v1/posts/comment/reply/:commentId", () => {
    
    it("should create a reply on a comment successfully", async () => {
      // Create a post
      const postRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({
          caption: 'Test post for replies',
          postType: 'text'
        });

      const postId = postRes.body.data.post._id;

      // Add a comment to the post
      const commentRes = await request(app)
        .post(`/api/v1/posts/comment/${postId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({ text: 'Parent comment' });

      const commentId = commentRes.body.data.comment._id;

      // Reply to the comment
      const res = await request(app)
        .post(`/api/v1/posts/comment/reply/${commentId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({ text: 'This is a reply' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Reply added successfully');
      expect(res.body.data.reply).toBeDefined();
      expect(res.body.data.reply.text).toBe('This is a reply');
      expect(res.body.data.reply.user).toBeDefined();
      expect(res.body.data.reply.user.username).toBe('testuser');
    });

    it("should fail if reply text is missing", async () => {
      // Create a post
      const postRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({
          caption: 'Test post',
          postType: 'text'
        });

      const postId = postRes.body.data.post._id;

      // Add a comment
      const commentRes = await request(app)
        .post(`/api/v1/posts/comment/${postId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({ text: 'Parent comment' });

      const commentId = commentRes.body.data.comment._id;

      // Try to reply without text
      const res = await request(app)
        .post(`/api/v1/posts/comment/reply/${commentId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });

    it("should fail if parent comment does not exist", async () => {
      const fakeCommentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .post(`/api/v1/posts/comment/reply/${fakeCommentId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({ text: 'Reply to non-existent comment' });

      expect(res.statusCode).toBe(404);
    });

    it("should fail if user is not authenticated", async () => {
      const fakeCommentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .post(`/api/v1/posts/comment/reply/${fakeCommentId}`)
        .send({ text: 'Unauthorized reply' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("DELETE /api/v1/posts/comment/:commentId", () => {
    
    it("should delete own comment successfully", async () => {
      // Create a post
      const postRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({
          caption: 'Test post for comment deletion',
          postType: 'text'
        });

      const postId = postRes.body.data.post._id;

      // Add a comment
      const commentRes = await request(app)
        .post(`/api/v1/posts/comment/${postId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({ text: 'Comment to be deleted' });

      const commentId = commentRes.body.data.comment._id;

      // Delete the comment
      const res = await request(app)
        .delete(`/api/v1/posts/comment/${commentId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Comment deleted successfully');
    });

    it("should delete comment and all its replies", async () => {
      // Create a post
      const postRes = await request(app)
        .post('/api/v1/posts/create-post')
        .set('Cookie', `jwt=${authToken}`)
        .send({
          caption: 'Test post',
          postType: 'text'
        });

      const postId = postRes.body.data.post._id;

      // Add a parent comment
      const commentRes = await request(app)
        .post(`/api/v1/posts/comment/${postId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({ text: 'Parent comment' });

      const commentId = commentRes.body.data.comment._id;

      // Add a reply to the comment
      await request(app)
        .post(`/api/v1/posts/comment/reply/${commentId}`)
        .set('Cookie', `jwt=${authToken}`)
        .send({ text: 'Reply to be deleted' });

      // Delete the parent comment (should delete reply too)
      const res = await request(app)
        .delete(`/api/v1/posts/comment/${commentId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe('Comment deleted successfully');
    });

    it("should fail if comment does not exist", async () => {
      const fakeCommentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/v1/posts/comment/${fakeCommentId}`)
        .set('Cookie', `jwt=${authToken}`);

      expect(res.statusCode).toBe(404);
    });

    it("should fail if user is not authenticated", async () => {
      const fakeCommentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/v1/posts/comment/${fakeCommentId}`);

      expect(res.statusCode).toBe(401);
    });
  });
});
