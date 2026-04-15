# Testing Guide - Social Media App Backend

## Overview
This project uses **Jest** for testing with **Supertest** for API testing and **MongoDB Memory Server** for database isolation.

**Test Results:** 13/13 tests passing ✅

---

## Project Structure

```
backend/
├── tests/
│   ├── unit/                    # Unit tests (individual functions)
│   │   └── generateOtp.test.js
│   ├── integration/             # Integration tests (API endpoints)
│   │   └── auth.test.js
│   └── __mocks__/              # Mock files
│       └── email.js
├── jest.config.js              # Jest configuration
├── .env.test                   # Test environment variables
└── package.json                # Test scripts
```

---

## Installation

```bash
npm install --save-dev jest supertest mongodb-memory-server
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm test -- tests/unit

# Run only integration tests
npm test -- tests/integration

# Run with coverage
npm test -- --coverage
```

---

## Key Packages

### 1. Jest
**What:** Testing framework  
**Why:** Runs tests, provides assertions (expect), and mocking  
**Usage:**
```js
import { describe, it, expect } from '@jest/globals';

describe('My Test Suite', () => {
  it('should do something', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### 2. Supertest
**What:** HTTP testing library  
**Why:** Tests API endpoints without starting a server  
**Usage:**
```js
import request from 'supertest';
import app from './app.js';

const res = await request(app)
  .post('/api/v1/users/signup')
  .send({ email: 'test@test.com' });

expect(res.statusCode).toBe(200);
```

### 3. MongoDB Memory Server
**What:** In-memory MongoDB database  
**Why:** Fast, isolated tests without touching real database  
**Usage:**
```js
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoServer = await MongoMemoryServer.create();
const uri = mongoServer.getUri();
await mongoose.connect(uri);
```

---

## Test Lifecycle Hooks

### beforeAll()
**When:** Runs ONCE before all tests  
**Purpose:** Setup (create test database)  
**Example:**
```js
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});
```

### afterAll()
**When:** Runs ONCE after all tests  
**Purpose:** Cleanup (destroy test database)  
**Example:**
```js
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

### beforeEach()
**When:** Runs BEFORE EVERY test  
**Purpose:** Reset data (clean database)  
**Example:**
```js
beforeEach(async () => {
  await User.deleteMany({});  // Clear all users
});
```

### afterEach()
**When:** Runs AFTER EVERY test  
**Purpose:** Clean up test-specific data  
**Example:**
```js
afterEach(async () => {
  // Clean up files, close connections, etc.
});
```

---

## Mocking

### Why Mock?
- Prevent sending real emails during tests
- Avoid external API calls
- Make tests faster and isolated

### Email Mocking
```js
// Mock email service before importing app
jest.unstable_mockModule('../../utils/email.js', () => ({
  default: jest.fn().mockResolvedValue(true)
}));

// Now import app (it will use mocked email)
const { default: app } = await import('../../app.js');
```

**What it does:** Replaces real email function with fake one that always succeeds

---

## Test Types

### 1. Unit Tests
**What:** Test individual functions in isolation  
**Example:** `tests/unit/generateOtp.test.js`

```js
import generateOtp from '../../utils/generateOtp.js';

describe('generateOtp Utility', () => {
  it('should generate a 6-digit OTP', () => {
    const otp = generateOtp();
    expect(otp.length).toBe(6);
  });
});
```

**Why:** Fast, simple, test one thing at a time

---

### 2. Integration Tests
**What:** Test multiple components together (API + Database)  
**Example:** `tests/integration/auth.test.js`

```js
describe('POST /api/v1/users/signup', () => {
  it('should create a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/users/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
```

**Why:** Test real user flows, catch integration bugs

---

## Common Assertions

```js
// Equality
expect(value).toBe(5);                    // Exact match
expect(value).toEqual({ name: 'John' }); // Object match

// Truthiness
expect(value).toBeTruthy();              // Is true
expect(value).toBeFalsy();               // Is false
expect(value).toBeDefined();             // Not undefined
expect(value).toBeUndefined();           // Is undefined

// Numbers
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThan(100);

// Strings
expect(string).toContain('hello');       // Contains substring
expect(string).toMatch(/pattern/);       // Regex match

// Arrays
expect(array).toContain('item');         // Array contains
expect(array.length).toBe(3);

// Functions
expect(fn).toHaveBeenCalled();           // Function was called
expect(fn).toHaveBeenCalledWith(arg);    // Called with argument
```

---

## Configuration Files

### jest.config.js
```js
export default {
  testEnvironment: 'node',           // Node.js environment
  transform: {},                     // No transformation (ES modules)
  testMatch: ['**/tests/**/*.test.js'], // Find test files
  collectCoverageFrom: [             // Coverage targets
    'controllers/**/*.js',
    'models/**/*.js',
    'utils/**/*.js'
  ],
  verbose: true                      // Show detailed output
};
```

### .env.test
```env
NODE_ENV=test
JWT_SECRET=test-secret-key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
EMAIL_HOST=smtp.test.com
EMAIL_PORT=587
EMAIL_USER=test@test.com
EMAIL_PASSWORD=testpassword
```

**Why:** Separate config for tests (don't use production secrets)

---

## Test Flow Example

```
1. beforeAll()
   └─ Create in-memory MongoDB
   └─ Connect to test database

2. beforeEach()
   └─ Clear all users from database

3. Test: "should create user"
   └─ POST /signup with user data
   └─ Check response is 200
   └─ Check user is created

4. beforeEach()
   └─ Clear all users (clean slate)

5. Test: "should login user"
   └─ Create user in database
   └─ POST /login with credentials
   └─ Check response is 200
   └─ Check token is returned

6. afterAll()
   └─ Disconnect from database
   └─ Stop MongoDB server
```

---

## Best Practices

### ✅ DO
- Write descriptive test names
- Test one thing per test
- Use beforeEach to reset data
- Mock external services (email, APIs)
- Test both success and failure cases

### ❌ DON'T
- Don't test third-party libraries
- Don't use real database in tests
- Don't make tests depend on each other
- Don't skip cleanup (afterAll)
- Don't test implementation details

---

## Troubleshooting

### Tests hang/don't finish
**Problem:** Database connection not closed  
**Solution:** Add `afterAll()` to disconnect

### Tests fail randomly
**Problem:** Tests sharing data  
**Solution:** Add `beforeEach()` to clear data

### "Cannot find module" error
**Problem:** Wrong import path  
**Solution:** Check relative paths (../../)

### Email errors in tests
**Problem:** Trying to send real emails  
**Solution:** Mock the email service

---

## Current Test Coverage

### Unit Tests (5 tests)
- ✅ generateOtp utility
  - Generates 6-digit OTP
  - Returns string
  - Contains only numbers
  - Generates different OTPs
  - Range validation (100000-999999)

### Integration Tests (8 tests)
- ✅ POST /api/v1/users/signup
  - Creates new user successfully
  - Fails if email exists
  - Fails if fields missing

- ✅ POST /api/v1/users/login
  - Logs in with correct credentials
  - Fails with wrong password
  - Fails if email doesn't exist
  - Fails if email/password missing

- ✅ POST /api/v1/users/logout
  - Logs out successfully

---

## Next Steps

### Add More Tests
1. **Post endpoints** (create, update, delete)
2. **User endpoints** (profile, follow/unfollow)
3. **Comment endpoints**
4. **File upload tests**

### Improve Coverage
```bash
npm test -- --coverage
```

Target: 70-80% coverage for controllers and models

---

## Quick Reference

```js
// Test structure
describe('Feature', () => {
  it('should do something', async () => {
    // Arrange: Setup
    const data = { email: 'test@test.com' };
    
    // Act: Execute
    const res = await request(app).post('/endpoint').send(data);
    
    // Assert: Verify
    expect(res.statusCode).toBe(200);
  });
});

// Lifecycle
beforeAll()    // Setup once
afterAll()     // Cleanup once
beforeEach()   // Reset before each test
afterEach()    // Clean after each test

// Mocking
jest.fn()                           // Mock function
jest.fn().mockResolvedValue(data)   // Mock async function
jest.unstable_mockModule()          // Mock ES module

// Supertest
await request(app)
  .post('/endpoint')                // HTTP method
  .send({ data })                   // Request body
  .set({ 'Authorization': token })  // Headers
  .expect(200);                     // Assert status
```

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest GitHub](https://github.com/ladjs/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

---

**Last Updated:** 2026-04-14  
**Test Status:** 13/13 passing ✅
