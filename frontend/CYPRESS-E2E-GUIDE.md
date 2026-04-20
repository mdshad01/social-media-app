# 🧪 Cypress E2E Testing Guide

> Complete guide for End-to-End testing with Cypress

---

## 📋 Table of Contents

1. [What is E2E Testing?](#what-is-e2e-testing)
2. [Setup Instructions](#setup-instructions)
3. [Running Tests](#running-tests)
4. [Test Structure](#test-structure)
5. [Custom Commands](#custom-commands)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## What is E2E Testing?

**E2E (End-to-End) Testing** tests the entire application flow from start to finish, simulating real user behavior.

### Testing Pyramid

```
        /\
       /  \
      / E2E \          ← Few tests, high confidence
     /--------\
    /Component\        ← More tests, medium confidence
   /------------\
  / Integration \      ← Many tests, fast
 /----------------\
/   Unit Tests    \    ← Most tests, very fast
--------------------
```

### What We Test

| Test Type | What | Example |
|-----------|------|---------|
| **Unit** | Individual functions | `generateOtp()` returns 6 digits |
| **Integration** | API endpoints | POST `/login` returns user data |
| **Component** | React components | Login form renders correctly |
| **E2E** | Complete user flows | User can signup → login → create post |

---

## Setup Instructions

### 1. Install Cypress

```bash
cd frontend
npm install -D cypress @testing-library/cypress
```

### 2. Initialize Cypress

```bash
npx cypress open
```

This creates:
- `cypress/` folder
- `cypress.config.ts`
- Example test files

### 3. Project Structure

```
frontend/
├── cypress/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.cy.ts        (8 tests)
│   │   │   └── signup.cy.ts       (6 tests)
│   │   ├── posts/
│   │   │   ├── create-post.cy.ts  (5 tests)
│   │   │   └── interact-post.cy.ts (7 tests)
│   │   └── user/
│   │       └── logout.cy.ts       (5 tests)
│   ├── fixtures/
│   │   └── users.json
│   ├── support/
│   │   ├── commands.ts
│   │   └── e2e.ts
│   └── screenshots/
├── cypress.config.ts
└── package.json
```

---

## Running Tests

### Option 1: Cypress UI (Recommended for Development)

```bash
npm run cypress
```

**What it does:**
- Opens Cypress Test Runner
- Shows all tests
- Click to run individual tests
- See tests run in real browser
- Time travel debugging

### Option 2: Headless Mode (For CI/CD)

```bash
npm run cypress:headless
```

**What it does:**
- Runs all tests in terminal
- No UI
- Faster
- Good for CI/CD pipelines

### Option 3: Run with Dev Server

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run Cypress
npm run cypress
```

### Option 4: All-in-One Command

```bash
npm run e2e
```

**What it does:**
- Starts dev server
- Waits for server to be ready
- Runs Cypress tests
- Stops server after tests

---

## Test Structure

### Basic Test Anatomy

```typescript
/// <reference types="cypress" />

describe('Feature Name', () => {
  beforeEach(() => {
    // Runs before each test
    cy.visit('/page');
  });

  it('should do something', () => {
    // 1. Arrange: Setup test data
    const email = 'test@example.com';
    
    // 2. Act: Perform actions
    cy.get('input[name="email"]').type(email);
    cy.get('button[type="submit"]').click();
    
    // 3. Assert: Verify results
    cy.url().should('include', '/success');
  });
});
```

---

## Our 5 E2E Test Suites

### 1. Login Tests (`auth/login.cy.ts`) - 8 tests

```typescript
✅ Display login form with all elements
✅ Show validation errors for empty fields
✅ Show error for invalid credentials
✅ Successfully login with valid credentials
✅ Navigate to signup page
✅ Navigate to forgot password page
✅ Toggle password visibility
✅ Show loading state during login
```

**What it tests:**
- Form rendering
- Validation
- Authentication flow
- Navigation
- UI interactions

---

### 2. Signup Tests (`auth/signup.cy.ts`) - 6 tests

```typescript
✅ Display signup form with all elements
✅ Show validation error for password mismatch
✅ Successfully signup with valid data
✅ Show error for existing email
✅ Navigate to login page
✅ Toggle password visibility
```

**What it tests:**
- User registration
- Form validation
- Duplicate email handling
- Password confirmation

---

### 3. Create Post Tests (`posts/create-post.cy.ts`) - 5 tests

```typescript
✅ Display create post form on home page
✅ Successfully create a text post
✅ Show validation error for empty post
✅ Allow adding emoji to post
✅ Display created post with user info
```

**What it tests:**
- Post creation flow
- Content validation
- Post display
- User attribution

---

### 4. Post Interaction Tests (`posts/interact-post.cy.ts`) - 7 tests

```typescript
✅ Like a post
✅ Unlike a post
✅ Add a comment to a post
✅ Display comment count
✅ Open post detail page
✅ Share a post
✅ Save a post
```

**What it tests:**
- Social interactions
- Like/unlike functionality
- Commenting system
- Post navigation

---

### 5. Logout Tests (`user/logout.cy.ts`) - 5 tests

```typescript
✅ Successfully logout
✅ Clear user session after logout
✅ Not allow access to protected routes after logout
✅ Show login form after logout
✅ Allow login again after logout
```

**What it tests:**
- Logout functionality
- Session management
- Route protection
- Re-authentication

---

## Custom Commands

We've created reusable commands in `cypress/support/commands.ts`:

### 1. Login Command

```typescript
cy.login('test@example.com', 'password123');
```

**What it does:**
- Visits login page
- Fills email and password
- Clicks submit
- Waits for redirect

**Usage:**
```typescript
beforeEach(() => {
  cy.login('test@example.com', 'password123');
});
```

---

### 2. Signup Command

```typescript
cy.signup('testuser', 'test@example.com', 'password123');
```

**What it does:**
- Visits signup page
- Fills all fields
- Submits form

---

### 3. Logout Command

```typescript
cy.logout();
```

**What it does:**
- Clicks user menu
- Clicks logout
- Verifies redirect to login

---

## Cypress Commands Cheatsheet

### Navigation

```typescript
cy.visit('/page')                    // Visit a page
cy.go('back')                        // Go back
cy.reload()                          // Reload page
```

### Selecting Elements

```typescript
cy.get('button')                     // By tag
cy.get('.class-name')                // By class
cy.get('#id')                        // By ID
cy.get('[name="email"]')             // By attribute
cy.contains('Text')                  // By text content
cy.get('button').first()             // First element
cy.get('button').last()              // Last element
```

### Actions

```typescript
cy.get('input').type('text')         // Type text
cy.get('button').click()             // Click
cy.get('input').clear()              // Clear input
cy.get('select').select('option')    // Select dropdown
cy.get('checkbox').check()           // Check checkbox
cy.get('checkbox').uncheck()         // Uncheck checkbox
```

### Assertions

```typescript
cy.get('button').should('be.visible')           // Visible
cy.get('button').should('be.disabled')          // Disabled
cy.get('button').should('have.text', 'Submit')  // Text content
cy.get('input').should('have.value', 'test')    // Input value
cy.url().should('include', '/home')             // URL contains
cy.url().should('eq', 'http://localhost:3000/') // URL equals
```

### Waiting

```typescript
cy.wait(1000)                        // Wait 1 second
cy.get('button', { timeout: 10000 }) // Wait up to 10s
```

---

## Best Practices

### 1. Use Data Attributes for Selectors

```typescript
// ❌ Bad - fragile
cy.get('.btn-primary-large-blue')

// ✅ Good - stable
cy.get('[data-testid="submit-button"]')
```

**Add to your components:**
```tsx
<button data-testid="submit-button">Submit</button>
```

---

### 2. Don't Use Hardcoded Waits

```typescript
// ❌ Bad
cy.wait(5000)
cy.get('button').click()

// ✅ Good
cy.get('button', { timeout: 10000 }).should('be.visible').click()
```

---

### 3. Use Custom Commands for Repeated Actions

```typescript
// ❌ Bad - repeated code
it('test 1', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type('test@example.com');
  cy.get('input[name="password"]').type('password123');
  cy.get('button').click();
});

// ✅ Good - reusable command
it('test 1', () => {
  cy.login('test@example.com', 'password123');
});
```

---

### 4. Clean Up Test Data

```typescript
afterEach(() => {
  // Delete test posts
  // Clear test user data
  // Reset database state
});
```

---

### 5. Use Unique Test Data

```typescript
// ❌ Bad - conflicts with other tests
const email = 'test@example.com';

// ✅ Good - unique per test
const email = `test${Date.now()}@example.com`;
```

---

### 6. Test User Flows, Not Implementation

```typescript
// ❌ Bad - testing implementation
cy.get('.login-form-component').should('exist');

// ✅ Good - testing user behavior
cy.get('input[name="email"]').type('test@example.com');
cy.get('button[type="submit"]').click();
cy.url().should('include', '/home');
```

---

## Troubleshooting

### Issue 1: Element Not Found

**Error:**
```
Timed out retrying: Expected to find element: 'button', but never found it.
```

**Solutions:**
1. Check if element exists in DOM
2. Increase timeout: `cy.get('button', { timeout: 10000 })`
3. Wait for page to load: `cy.wait(1000)`
4. Check selector is correct

---

### Issue 2: Element Not Visible

**Error:**
```
cy.click() failed because this element is not visible
```

**Solutions:**
1. Use `{ force: true }`: `cy.click({ force: true })`
2. Scroll to element: `cy.scrollIntoView()`
3. Wait for element: `cy.should('be.visible')`

---

### Issue 3: Tests Pass Locally But Fail in CI

**Causes:**
- Different screen sizes
- Slower CI environment
- Missing environment variables

**Solutions:**
1. Set viewport: `cy.viewport(1280, 720)`
2. Increase timeouts
3. Add `cy.wait()` for API calls
4. Check CI environment variables

---

### Issue 4: Flaky Tests

**Causes:**
- Race conditions
- Network delays
- Animations

**Solutions:**
1. Use proper waits: `cy.should('be.visible')`
2. Disable animations in test mode
3. Mock API responses
4. Use `cy.intercept()` for network requests

---

## Running Tests in CI/CD

### GitHub Actions Workflow

```yaml
name: E2E Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  e2e:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
    
    - name: Install dependencies
      working-directory: ./frontend
      run: npm ci
    
    - name: Run Cypress tests
      working-directory: ./frontend
      run: npm run e2e:headless
    
    - name: Upload screenshots
      if: failure()
      uses: actions/upload-artifact@v4
      with:
        name: cypress-screenshots
        path: frontend/cypress/screenshots
```

---

## Test Coverage Summary

```
Total E2E Tests: 31 tests

Auth Tests:     14 tests (login + signup)
Post Tests:     12 tests (create + interact)
User Tests:      5 tests (logout)

Total Coverage: Complete user flows
```

---

## Interview Questions & Answers

### Q: What is E2E testing?

**Answer:**
> "E2E testing tests the entire application from start to finish, simulating real user behavior. Unlike unit tests that test individual functions, E2E tests verify complete user flows like signup → login → create post → logout."

---

### Q: Why use Cypress over Selenium?

**Answer:**
> "Cypress is faster, easier to set up, and has better developer experience. It runs in the same run-loop as the application, provides automatic waiting, time-travel debugging, and real-time reloading. Selenium requires more configuration and is slower."

---

### Q: How do you handle flaky tests?

**Answer:**
> "I use proper waits with `cy.should()` instead of hardcoded `cy.wait()`, increase timeouts for slow operations, use data attributes for stable selectors, and mock API responses when needed. I also ensure tests are independent and don't rely on each other."

---

### Q: What's the difference between E2E and integration tests?

**Answer:**
> "Integration tests verify that different parts of the application work together (like API endpoints with database). E2E tests verify complete user workflows in a real browser environment, testing the entire stack from frontend to backend to database."

---

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Examples](https://example.cypress.io/)
- [Testing Library with Cypress](https://testing-library.com/docs/cypress-testing-library/intro/)

---

**Created for:** Social Media App E2E Testing  
**Last Updated:** April 2026  
**Total Tests:** 31 E2E tests covering critical user flows
