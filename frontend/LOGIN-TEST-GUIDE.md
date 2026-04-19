# 📚 Login Test Guide - Understanding Frontend Testing Concepts

> A comprehensive guide to understanding the Login component tests and frontend testing patterns used in this project.

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Key Differences: Frontend vs Backend Testing](#key-differences-frontend-vs-backend-testing)
3. [Core Concepts](#core-concepts)
4. [Testing Patterns](#testing-patterns)
5. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
6. [Quick Reference](#quick-reference)

---

## Overview

The Login component tests demonstrate how to test React components with:
- User interactions (typing, clicking)
- Form submissions
- API calls (mocked)
- Redux state management
- Async operations
- Error handling
- Accessibility

**Test File:** `frontend/tests/components/Auth/Login.test.tsx`  
**Component:** `frontend/components/Auth/Login.tsx`  
**Total Tests:** 15 tests covering all major functionality

---

## Key Differences: Frontend vs Backend Testing

| Aspect | Backend (Jest + Supertest) | Frontend (Vitest + RTL) |
|--------|---------------------------|-------------------------|
| **What we test** | API endpoints, HTTP responses | UI components, user interactions |
| **Requests** | `request(app).post('/api/...')` | `userEvent.click(button)` |
| **Assertions** | `expect(res.status).toBe(200)` | `expect(element).toBeInTheDocument()` |
| **Async handling** | `await request(...)` | `await waitFor(...)` |
| **Mocking** | Mock database, email service | Mock API calls, navigation |
| **Setup** | In-memory MongoDB | Mock Redux store |
| **Focus** | Business logic, data validation | User experience, UI behavior |

---

## Core Concepts

### 1. 🖱️ `userEvent` - Simulating Real User Interactions

`userEvent` simulates **real user behavior** more accurately than `fireEvent`.

#### Basic Usage:

```typescript
import userEvent from '@testing-library/user-event';

it('should handle user input', async () => {
  const user = userEvent.setup();  // ⚠️ Always call setup() first
  
  await user.type(emailInput, 'test@example.com');
  await user.click(submitButton);
});
```

#### Why Use `userEvent`?

- ✅ Mimics real user behavior (focus, blur, change events)
- ✅ More realistic than `fireEvent`
- ✅ Catches edge cases that `fireEvent` misses
- ⚠️ **Always async** - must use `await`

#### Common Methods:

```typescript
// Typing text
await user.type(input, 'Hello World')

// Clicking elements
await user.click(button)
await user.dblClick(element)

// Clearing input
await user.clear(input)

// Hovering
await user.hover(element)

// Selecting options
await user.selectOptions(select, 'option-value')

// Keyboard interactions
await user.keyboard('{Enter}')
await user.keyboard('{Escape}')

// Tab navigation
await user.tab()
```

#### Real Example from Login Tests:

```typescript
it('should update email input when user types', async () => {
  const user = userEvent.setup();
  renderLogin();

  const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
  await user.type(emailInput, 'test@example.com');

  expect(emailInput.value).toBe('test@example.com');
});
```

---

### 2. 🔍 `screen` - Querying the DOM

`screen` is a global object that queries the **entire rendered DOM**.

#### Query Types:

| Query | Returns | Throws Error? | Use Case |
|-------|---------|---------------|----------|
| `getBy...` | Single element | ✅ Yes (if not found) | Element **should** exist |
| `getAllBy...` | Array of elements | ✅ Yes (if none found) | Multiple elements exist |
| `queryBy...` | Single element or `null` | ❌ No | Element **might not** exist |
| `queryAllBy...` | Array or empty `[]` | ❌ No | Check absence |
| `findBy...` | Promise<element> | ✅ Yes (after timeout) | Async elements (appears later) |

#### Query Methods (Priority Order):

```typescript
// 1. ⭐ By Role (BEST - semantic HTML)
screen.getByRole('button', { name: /sign in/i })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('heading', { name: /welcome back/i })

// 2. ⭐ By Label (BEST for form inputs)
screen.getByLabelText(/email address/i)
screen.getByLabelText(/password/i)

// 3. ⭐ By Text (visible text content)
screen.getByText('Welcome Back')
screen.getByText(/forgot password/i)

// 4. By Placeholder
screen.getByPlaceholderText('Enter your email')

// 5. By Alt Text (for images)
screen.getByAltText('banner')

// 6. ⚠️ By Test ID (LAST RESORT)
screen.getByTestId('submit-button')
```

#### Regex Patterns:

```typescript
// Case-insensitive matching
/email/i          // Matches "Email", "email", "EMAIL ADDRESS"
/sign in/i        // Matches "Sign In", "SIGN IN", "sign in"
/welcome back/i   // Matches "Welcome Back", "welcome back"

// Exact match (no regex)
screen.getByText('Welcome Back')  // Must match exactly
```

#### Multiple Elements:

```typescript
// When element appears multiple times (desktop + mobile)
const seamlessSharing = screen.getAllByText('Seamless Sharing');
expect(seamlessSharing.length).toBeGreaterThan(0);

// Check element doesn't exist
expect(screen.queryByText('Error Message')).not.toBeInTheDocument();
```

#### Real Example from Login Tests:

```typescript
it('should render login form with all elements', () => {
  renderLogin();

  expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});
```

---

### 3. ⏳ `waitFor` - Handling Async Updates

`waitFor` waits for assertions to pass (retries multiple times).

#### Basic Usage:

```typescript
await waitFor(() => {
  expect(mockFunction).toHaveBeenCalled();
});
```

#### When to Use:

- ✅ After API calls
- ✅ After state updates
- ✅ After navigation
- ✅ After async side effects
- ✅ When element appears/disappears

#### Configuration:

```typescript
await waitFor(() => {
  expect(element).toBeInTheDocument();
}, {
  timeout: 3000,      // Max wait time (default: 1000ms)
  interval: 50,       // Retry interval (default: 50ms)
});
```

#### Common Mistakes:

```typescript
// ❌ Wrong - might fail due to timing
await user.click(submitButton);
expect(mockPush).toHaveBeenCalled();

// ✅ Correct - waits for async operation
await user.click(submitButton);
await waitFor(() => {
  expect(mockPush).toHaveBeenCalled();
});
```

#### Real Example from Login Tests:

```typescript
it('should redirect to home page after successful login', async () => {
  const user = userEvent.setup();
  const mockResponse = {
    data: {
      data: {
        user: {
          _id: '123',
          email: 'test@example.com',
          isDeleted: false,
        },
      },
      message: 'Login successful',
    },
  };

  (axios.post as any).mockResolvedValue(mockResponse);

  renderLogin();

  await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  // ⚠️ Must use waitFor for async navigation
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
```

---

### 4. 🎭 Mocking with Vitest

Mocking prevents real API calls, navigation, and external dependencies.

#### Mocking Modules:

```typescript
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');

// Mock Next.js navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
```

#### Mocking Function Return Values:

```typescript
import axios from 'axios';

// Success response
(axios.post as any).mockResolvedValue({
  data: {
    data: { user: { id: '123' } },
    message: 'Success',
  },
});

// Error response
(axios.post as any).mockRejectedValue({
  response: {
    data: { message: 'Invalid credentials' },
  },
});

// Custom implementation
(axios.post as any).mockImplementation((url, data) => {
  if (data.email === 'test@example.com') {
    return Promise.resolve({ data: { success: true } });
  }
  return Promise.reject({ response: { data: { message: 'Error' } } });
});

// Delayed response (for testing loading states)
(axios.post as any).mockImplementation(() => 
  new Promise(resolve => setTimeout(() => resolve({
    data: { data: { user: { isDeleted: false } } }
  }), 100))
);
```

#### Common Mock Methods:

```typescript
vi.fn()                          // Create mock function
mockFn.mockReturnValue(value)    // Return value immediately
mockFn.mockResolvedValue(value)  // Return promise (success)
mockFn.mockRejectedValue(error)  // Return promise (error)
mockFn.mockImplementation(fn)    // Custom implementation
mockFn.mockClear()               // Clear call history
mockFn.mockReset()               // Reset to initial state
```

#### Checking Mock Calls:

```typescript
// Check if called
expect(mockPush).toHaveBeenCalled();

// Check call count
expect(mockPush).toHaveBeenCalledTimes(1);

// Check arguments
expect(axios.post).toHaveBeenCalledWith(
  expect.stringContaining('/users/login'),
  { email: 'test@example.com', password: 'password123' },
  { withCredentials: true }
);
```

#### Real Example from Login Tests:

```typescript
it('should call API with correct data on successful login', async () => {
  const user = userEvent.setup();
  const mockResponse = {
    data: {
      data: {
        user: {
          _id: '123',
          email: 'test@example.com',
          username: 'testuser',
          isDeleted: false,
        },
      },
      message: 'Login successful',
    },
  };

  (axios.post as any).mockResolvedValue(mockResponse);

  renderLogin();

  // Fill form
  await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');

  // Submit
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  // Wait for API call
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/users/login'),
      { email: 'test@example.com', password: 'password123' },
      { withCredentials: true }
    );
  });
});
```

---

### 5. 🏪 Redux Store Setup

Testing components with Redux requires wrapping them with a `Provider`.

#### Creating Mock Store:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import authReducer from '@/store/authSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};
```

#### Rendering with Redux:

```typescript
describe('Login Component', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();  // Fresh store for each test
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
  };

  it('should render', () => {
    renderLogin();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });
});
```

#### Why Use Real Store (Not Mocked)?

- ✅ Tests real state management logic
- ✅ Ensures component works with actual Redux
- ✅ More confidence in integration
- ✅ Catches Redux-related bugs

#### Checking Redux State:

```typescript
it('should update Redux state', async () => {
  renderLogin();
  
  // Perform action
  await user.click(submitButton);
  
  // Check state
  await waitFor(() => {
    const state = store.getState();
    expect(state.auth.user).toBeDefined();
  });
});
```

---

### 6. 📝 Type Assertions in Tests

TypeScript doesn't know exact element types, so we use type assertions.

#### Basic Type Assertions:

```typescript
// For input elements
const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
expect(emailInput.value).toBe('test@example.com');

// For buttons
const submitButton = screen.getByRole('button') as HTMLButtonElement;
expect(submitButton.disabled).toBe(false);

// For checkboxes
const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
expect(checkbox.checked).toBe(true);
```

#### Common HTML Element Types:

```typescript
HTMLInputElement      // <input>
HTMLButtonElement     // <button>
HTMLTextAreaElement   // <textarea>
HTMLSelectElement     // <select>
HTMLFormElement       // <form>
HTMLAnchorElement     // <a>
HTMLImageElement      // <img>
```

#### Real Example from Login Tests:

```typescript
it('should update email input when user types', async () => {
  const user = userEvent.setup();
  renderLogin();

  const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
  await user.type(emailInput, 'test@example.com');

  expect(emailInput.value).toBe('test@example.com');
});
```

---

### 7. 🔄 Async/Await Pattern

Frontend tests are heavily async due to user interactions and state updates.

#### Why Everything is Async:

- `userEvent` methods are async
- State updates are async
- API calls are async
- React re-renders are async
- Navigation is async

#### Basic Pattern:

```typescript
it('should handle async operations', async () => {
  //                                  ^^^^^ Must be async
  const user = userEvent.setup();
  
  await user.type(input, 'text');    // await user interactions
  await user.click(button);          // await clicks
  
  await waitFor(() => {              // await state updates
    expect(mockFn).toHaveBeenCalled();
  });
});
```

#### Common Mistakes:

```typescript
// ❌ Wrong - missing async
it('should work', () => {
  await user.click(button);  // Error: await in non-async function
});

// ❌ Wrong - missing await
it('should work', async () => {
  user.click(button);  // Doesn't wait for click to complete
  expect(button).toBeDisabled();  // Might fail
});

// ✅ Correct
it('should work', async () => {
  await user.click(button);
  await waitFor(() => {
    expect(button).toBeDisabled();
  });
});
```

---

## Testing Patterns

### Pattern 1: Testing Form Submission

```typescript
it('should submit form with correct data', async () => {
  const user = userEvent.setup();
  
  // 1. Mock API response
  (axios.post as any).mockResolvedValue({
    data: { data: { user: { id: '123' } }, message: 'Success' }
  });
  
  // 2. Render component
  renderLogin();
  
  // 3. Fill form
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  
  // 4. Submit
  await user.click(screen.getByRole('button', { name: /sign in/i }));
  
  // 5. Assert API was called correctly
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/users/login'),
      { email: 'test@example.com', password: 'password123' },
      { withCredentials: true }
    );
  });
});
```

---

### Pattern 2: Testing Loading States

```typescript
it('should show loading state during submission', async () => {
  const user = userEvent.setup();
  
  // Mock delayed response
  (axios.post as any).mockImplementation(() => 
    new Promise(resolve => setTimeout(() => resolve({
      data: { data: { user: { isDeleted: false } }, message: 'Success' }
    }), 100))
  );

  renderLogin();

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  
  const submitButton = screen.getByRole('button', { name: /sign in/i });
  await user.click(submitButton);

  // Button should be disabled during loading
  expect(submitButton).toBeDisabled();
});
```

---

### Pattern 3: Testing Error Handling

```typescript
it('should handle API errors gracefully', async () => {
  const user = userEvent.setup();
  
  // Mock error response
  (axios.post as any).mockRejectedValue({
    response: {
      data: { message: 'Invalid credentials' }
    }
  });

  renderLogin();

  await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
  await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  // Button should be enabled again after error
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled();
  });
});
```

---

### Pattern 4: Testing Conditional Rendering

```typescript
it('should show reactivate modal for deactivated account', async () => {
  const user = userEvent.setup();
  
  // Mock deactivated user response
  const mockResponse = {
    data: {
      data: {
        user: {
          _id: '123',
          email: 'test@example.com',
          isDeleted: true,
          deletionExecuteAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
      message: 'Login successful',
    },
  };

  (axios.post as any).mockResolvedValue(mockResponse);

  renderLogin();

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  // Modal should appear
  await waitFor(() => {
    expect(screen.getByText('Account Deactivated')).toBeInTheDocument();
  });
});
```

---

### Pattern 5: Testing Navigation

```typescript
it('should redirect to home page after successful login', async () => {
  const user = userEvent.setup();
  
  (axios.post as any).mockResolvedValue({
    data: {
      data: { user: { _id: '123', isDeleted: false } },
      message: 'Login successful',
    },
  });

  renderLogin();

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
```

---

### Pattern 6: Testing Accessibility

```typescript
it('should have proper labels for form inputs', () => {
  renderLogin();

  // Labels should be associated with inputs
  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

it('should have submit button with proper role', () => {
  renderLogin();

  const submitButton = screen.getByRole('button', { name: /sign in/i });
  expect(submitButton).toHaveAttribute('type', 'submit');
});
```

---

## Common Pitfalls & Solutions

### ❌ Pitfall 1: Not Using `await` with `userEvent`

```typescript
// ❌ Wrong
it('should work', async () => {
  user.type(input, 'text');  // Missing await
  expect(input.value).toBe('text');  // Fails!
});

// ✅ Correct
it('should work', async () => {
  await user.type(input, 'text');
  expect(input.value).toBe('text');
});
```

---

### ❌ Pitfall 2: Not Using `waitFor` for Async Assertions

```typescript
// ❌ Wrong
it('should call API', async () => {
  await user.click(button);
  expect(axios.post).toHaveBeenCalled();  // Might fail due to timing
});

// ✅ Correct
it('should call API', async () => {
  await user.click(button);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
  });
});
```

---

### ❌ Pitfall 3: Using `getBy` for Elements That Don't Exist

```typescript
// ❌ Wrong - throws error if modal is not shown
expect(screen.getByText('Modal Title')).not.toBeInTheDocument();

// ✅ Correct - returns null if not found
expect(screen.queryByText('Modal Title')).not.toBeInTheDocument();
```

---

### ❌ Pitfall 4: Not Clearing Mocks Between Tests

```typescript
describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();  // ⚠️ Always clear mocks
    store = createMockStore();  // Fresh store
  });

  it('test 1', async () => {
    // ...
  });

  it('test 2', async () => {
    // Without clearAllMocks(), this test might see calls from test 1
  });
});
```

---

### ❌ Pitfall 5: Forgetting Type Assertions

```typescript
// ❌ Wrong - TypeScript error
const input = screen.getByLabelText(/email/i);
expect(input.value).toBe('test@example.com');  // Error: Property 'value' does not exist

// ✅ Correct
const input = screen.getByLabelText(/email/i) as HTMLInputElement;
expect(input.value).toBe('test@example.com');
```

---

### ❌ Pitfall 6: Testing Implementation Details

```typescript
// ❌ Wrong - testing internal state
expect(component.state.email).toBe('test@example.com');

// ✅ Correct - testing user-visible behavior
const input = screen.getByLabelText(/email/i) as HTMLInputElement;
expect(input.value).toBe('test@example.com');
```

---

### ❌ Pitfall 7: Multiple Elements with Same Text

```typescript
// ❌ Wrong - throws error if text appears multiple times
expect(screen.getByText('Seamless Sharing')).toBeInTheDocument();

// ✅ Correct - use getAllByText
const elements = screen.getAllByText('Seamless Sharing');
expect(elements.length).toBeGreaterThan(0);
```

---

## Quick Reference

### Essential Imports

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
```

---

### Test Structure

```typescript
describe('Component Name', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <Component />
      </Provider>
    );
  };

  describe('Feature Group', () => {
    it('should do something', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      // Test logic here
    });
  });
});
```

---

### Common Assertions

```typescript
// Element existence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Element visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Element state
expect(button).toBeDisabled();
expect(button).toBeEnabled();
expect(checkbox).toBeChecked();

// Attributes
expect(link).toHaveAttribute('href', '/path');
expect(input).toHaveAttribute('type', 'email');

// Values
expect(input.value).toBe('test@example.com');
expect(textarea.value).toContain('some text');

// Mock calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
```

---

### Debugging Tests

```typescript
// Print DOM structure
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Log all available roles
screen.logTestingPlaygroundURL();

// Check what queries are available
screen.getByRole('');  // Shows all available roles in error message
```

---

## 📊 Login Test Coverage Summary

**Total Tests: 15**

### Rendering (4 tests)
- ✅ All form elements present
- ✅ Forgot password link
- ✅ Signup link
- ✅ Features section

### Form Interaction (3 tests)
- ✅ Email input updates
- ✅ Password input updates
- ✅ Correct input types

### Form Submission (3 tests)
- ✅ API call with correct data
- ✅ Loading state during submission
- ✅ Redirect after successful login

### Deactivated Account Flow (2 tests)
- ✅ Show reactivate modal
- ✅ Close modal on cancel

### Error Handling (1 test)
- ✅ Handle API errors gracefully

### Accessibility (2 tests)
- ✅ Proper labels for inputs
- ✅ Submit button with proper role

---

## 🎯 Best Practices

1. **Test user behavior, not implementation**
   - ✅ Test what users see and do
   - ❌ Don't test internal state or methods

2. **Use semantic queries**
   - ✅ Prefer `getByRole`, `getByLabelText`
   - ❌ Avoid `getByTestId` unless necessary

3. **Always use `await` with `userEvent`**
   - ✅ `await user.click(button)`
   - ❌ `user.click(button)`

4. **Use `waitFor` for async assertions**
   - ✅ `await waitFor(() => expect(...))`
   - ❌ Direct assertions after async operations

5. **Clear mocks between tests**
   - ✅ `beforeEach(() => vi.clearAllMocks())`
   - ❌ Reusing mocks across tests

6. **Test accessibility**
   - ✅ Check labels, roles, ARIA attributes
   - ❌ Ignore accessibility concerns

7. **Mock external dependencies**
   - ✅ Mock API calls, navigation, external services
   - ❌ Make real API calls in tests

8. **Keep tests independent**
   - ✅ Each test should work in isolation
   - ❌ Tests depending on each other

---

## 📚 Additional Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Queries Cheatsheet](https://testing-library.com/docs/queries/about)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro)

---

**Created for:** Social Media App Frontend Testing  
**Last Updated:** April 2026  
**Author:** Development Team
