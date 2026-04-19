# Frontend Testing Guide - Complete Reference

## Table of Contents
1. [Introduction](#introduction)
2. [Testing Stack](#testing-stack)
3. [Project Setup](#project-setup)
4. [File Structure](#file-structure)
5. [Configuration Files](#configuration-files)
6. [Writing Tests](#writing-tests)
7. [Testing Patterns](#testing-patterns)
8. [Common Functions](#common-functions)
9. [Best Practices](#best-practices)
10. [Running Tests](#running-tests)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

This guide explains how frontend testing is implemented in this Next.js project using Vitest and React Testing Library. It covers setup, configuration, writing tests, and best practices.

### Why Frontend Testing?

- **Catch bugs early** - Find issues before users do
- **Confidence in changes** - Refactor without fear
- **Documentation** - Tests show how components work
- **Better code quality** - Testable code is better code

---

## Testing Stack

### Core Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Vitest** | 4.1.4 | Fast test runner (like Jest but faster) |
| **React Testing Library** | Latest | Test React components |
| **@testing-library/jest-dom** | Latest | Custom matchers for DOM testing |
| **@testing-library/user-event** | Latest | Simulate user interactions |
| **jsdom** | Latest | Simulates browser environment |
| **@vitejs/plugin-react** | Latest | React support for Vitest |

### Why These Tools?

- **Vitest**: Fast, modern, works great with Vite/Next.js
- **React Testing Library**: Tests components like users interact with them
- **jsdom**: Provides browser APIs in Node.js environment

---

## Project Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom happy-dom @vitest/ui
```

### Step 2: Verify Installation

```bash
npm test
```

You should see: `Test Files  1 passed (1)` ✅

---

## File Structure

```
frontend/
├── tests/
│   ├── setup.ts                    # Test configuration & mocks
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.test.tsx     # Button component tests
│   │   ├── Auth/
│   │   │   ├── Login.test.tsx      # Login form tests
│   │   │   └── Signup.test.tsx     # Signup form tests
│   │   └── Home/
│   │       └── Feed.test.tsx       # Feed component tests
│   └── utils/
│       └── helpers.test.ts         # Utility function tests
├── vitest.config.ts                # Vitest configuration
├── TESTING.md                      # Quick testing guide
└── FRONTEND-TESTING-GUIDE.md       # This file
```

---

## Configuration Files

### 1. vitest.config.ts

**Purpose:** Main configuration for Vitest test runner

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.*',
        '.next/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

**Key Settings Explained:**

- `environment: 'jsdom'` - Simulates browser environment
- `globals: true` - Makes `describe`, `it`, `expect` available globally
- `setupFiles` - Runs before each test file
- `css: true` - Allows importing CSS in tests
- `coverage` - Configuration for test coverage reports
- `alias` - Allows using `@/` for imports

---

### 2. tests/setup.ts

**Purpose:** Runs before every test, sets up mocks and utilities

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    return { type: 'img', props: { src, alt, ...props } };
  },
}));
```

**What It Does:**

1. **Imports jest-dom matchers** - Adds `toBeInTheDocument()`, `toBeDisabled()`, etc.
2. **Cleanup after tests** - Removes rendered components from memory
3. **Mocks Next.js router** - Prevents errors when components use `useRouter()`
4. **Mocks Next.js Image** - Prevents errors with `next/image` component

---

### 3. package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Commands:**

- `npm test` - Run tests in watch mode
- `npm run test:ui` - Open visual test runner
- `npm run test:coverage` - Generate coverage report

---

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render button with text', () => {
    // 1. Arrange - Set up test data
    const buttonText = 'Click me';
    
    // 2. Act - Render component
    render(<Button>{buttonText}</Button>);
    
    // 3. Assert - Check result
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });
});
```

**Test Structure (AAA Pattern):**

1. **Arrange** - Set up test data and conditions
2. **Act** - Perform the action being tested
3. **Assert** - Verify the result

---

### Example 1: Testing a Button Component

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have correct CSS class', () => {
    render(<Button className="custom-class">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('custom-class');
  });
});
```

---

### Example 2: Testing a Form Component

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/Auth/Login';

describe('LoginForm Component', () => {
  it('should render email and password inputs', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should show error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger blur event
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should disable submit button while loading', () => {
    render(<LoginForm isLoading={true} />);
    
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  });
});
```

---

### Example 3: Testing with API Calls

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PostCard } from '@/components/Home/PostCard';

// Mock API call
vi.mock('@/components/util/apiRequest', () => ({
  apiRequest: vi.fn(),
}));

describe('PostCard Component', () => {
  it('should display post data', () => {
    const post = {
      id: '1',
      caption: 'Test post',
      user: { username: 'testuser' },
      likes: [],
    };
    
    render(<PostCard post={post} />);
    
    expect(screen.getByText('Test post')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('should like post when like button is clicked', async () => {
    const { apiRequest } = await import('@/components/util/apiRequest');
    apiRequest.mockResolvedValue({ success: true });
    
    const user = userEvent.setup();
    const post = {
      id: '1',
      caption: 'Test post',
      likes: [],
    };
    
    render(<PostCard post={post} />);
    
    await user.click(screen.getByRole('button', { name: /like/i }));
    
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith({
        url: `/posts/like-dislike/${post.id}`,
        method: 'POST',
      });
    });
  });
});
```

---

## Testing Patterns

### 1. Query Methods

**Use the right query for the job:**

```typescript
// ✅ Preferred - Accessible to everyone
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)
screen.getByPlaceholderText(/enter email/i)

// ✅ Good - Semantic queries
screen.getByText(/welcome/i)
screen.getByAltText(/profile picture/i)

// ❌ Avoid - Implementation details
screen.getByTestId('submit-button')
screen.getByClassName('btn-primary')
```

**Query Types:**

| Query | Returns | When to Use |
|-------|---------|-------------|
| `getBy...` | Element or error | Element should exist |
| `queryBy...` | Element or null | Element might not exist |
| `findBy...` | Promise<Element> | Element appears async |

---

### 2. User Interactions

```typescript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

// Typing
await user.type(input, 'Hello');

// Clicking
await user.click(button);

// Selecting
await user.selectOptions(select, 'option1');

// Keyboard
await user.keyboard('{Enter}');
await user.tab();

// Clear input
await user.clear(input);
```

---

### 3. Async Testing

```typescript
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';

// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

// Find element (automatically waits)
const element = await screen.findByText('Async content');
```

---

### 4. Mocking

```typescript
import { vi } from 'vitest';

// Mock function
const mockFn = vi.fn();
mockFn.mockReturnValue('mocked value');
mockFn.mockResolvedValue('async value');

// Mock module
vi.mock('@/lib/api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ name: 'John' }),
}));

// Mock implementation
const mockFetch = vi.fn((url) => {
  if (url === '/api/user') {
    return Promise.resolve({ data: { name: 'John' } });
  }
});
```

---

## Common Functions

### Testing Library Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `render()` | Render component | `render(<Button />)` |
| `screen` | Query rendered output | `screen.getByText('Hello')` |
| `cleanup()` | Remove rendered components | `cleanup()` |
| `waitFor()` | Wait for async changes | `await waitFor(() => {...})` |
| `fireEvent` | Trigger DOM events | `fireEvent.click(button)` |

### Vitest Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `describe()` | Group tests | `describe('Button', () => {...})` |
| `it()` / `test()` | Define test | `it('should work', () => {...})` |
| `expect()` | Make assertion | `expect(value).toBe(5)` |
| `vi.fn()` | Create mock function | `const mock = vi.fn()` |
| `vi.mock()` | Mock module | `vi.mock('./api')` |
| `beforeEach()` | Run before each test | `beforeEach(() => {...})` |
| `afterEach()` | Run after each test | `afterEach(() => {...})` |

### Custom Matchers (from jest-dom)

| Matcher | Purpose | Example |
|---------|---------|---------|
| `toBeInTheDocument()` | Element exists | `expect(el).toBeInTheDocument()` |
| `toBeVisible()` | Element is visible | `expect(el).toBeVisible()` |
| `toBeDisabled()` | Element is disabled | `expect(el).toBeDisabled()` |
| `toHaveClass()` | Has CSS class | `expect(el).toHaveClass('active')` |
| `toHaveValue()` | Input has value | `expect(input).toHaveValue('text')` |
| `toBeChecked()` | Checkbox is checked | `expect(checkbox).toBeChecked()` |

---

## Best Practices

### 1. Test User Behavior, Not Implementation

```typescript
// ❌ Bad - Testing implementation
expect(component.state.count).toBe(5);

// ✅ Good - Testing behavior
expect(screen.getByText('Count: 5')).toBeInTheDocument();
```

### 2. Use Semantic Queries

```typescript
// ❌ Bad
screen.getByTestId('submit-btn');

// ✅ Good
screen.getByRole('button', { name: /submit/i });
```

### 3. Keep Tests Simple and Focused

```typescript
// ❌ Bad - Testing too much
it('should handle everything', () => {
  // 50 lines of test code
});

// ✅ Good - One thing per test
it('should render button', () => {
  render(<Button>Click</Button>);
  expect(screen.getByText('Click')).toBeInTheDocument();
});

it('should call onClick when clicked', async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click</Button>);
  await userEvent.click(screen.getByText('Click'));
  expect(onClick).toHaveBeenCalled();
});
```

### 4. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => {...});

// ✅ Good
it('should display error message when email is invalid', () => {...});
```

### 5. Avoid Testing Third-Party Libraries

```typescript
// ❌ Bad - Testing React itself
it('should update state', () => {
  // Testing React's useState
});

// ✅ Good - Testing your component
it('should display updated count when button is clicked', () => {
  // Testing your component's behavior
});
```

### 6. Mock External Dependencies

```typescript
// Mock API calls
vi.mock('@/lib/api', () => ({
  fetchPosts: vi.fn().mockResolvedValue([]),
}));

// Mock router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm test -- --watch

# Run specific test file
npm test button.test.tsx

# Run tests matching pattern
npm test -- --grep "Button"

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

### Watch Mode Commands

When running `npm test`, you can use these commands:

- `a` - Run all tests
- `f` - Run only failed tests
- `p` - Filter by filename
- `t` - Filter by test name
- `q` - Quit watch mode

### Coverage Report

After running `npm run test:coverage`, open:
```
frontend/coverage/index.html
```

**Coverage Metrics:**

- **Statements**: % of code statements executed
- **Branches**: % of if/else branches tested
- **Functions**: % of functions called
- **Lines**: % of lines executed

**Target Coverage:**
- Critical components: 80%+
- Overall: 60-70%

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find module '@/components/...'"

**Solution:** Check `vitest.config.ts` has correct alias:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './'),
  },
}
```

#### 2. "useRouter is not a function"

**Solution:** Add router mock to `tests/setup.ts`:
```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
```

#### 3. "Cannot read property 'toBeInTheDocument'"

**Solution:** Import jest-dom in `tests/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

#### 4. Tests timeout

**Solution:** Increase timeout in test:
```typescript
it('should load data', async () => {
  // ...
}, 10000); // 10 second timeout
```

#### 5. "Element not found"

**Solution:** Use `findBy` for async elements:
```typescript
// ❌ Bad
expect(screen.getByText('Loaded')).toBeInTheDocument();

// ✅ Good
expect(await screen.findByText('Loaded')).toBeInTheDocument();
```

---

## Testing Checklist

### Before Writing Tests

- [ ] Vitest installed and configured
- [ ] Test setup file created
- [ ] Mocks configured (router, API, etc.)
- [ ] Test scripts added to package.json

### When Writing Tests

- [ ] Test file named `*.test.tsx` or `*.test.ts`
- [ ] Tests grouped with `describe()`
- [ ] Each test has clear name
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Using semantic queries (getByRole, getByLabelText)
- [ ] Async operations use `await` and `waitFor`
- [ ] External dependencies mocked

### After Writing Tests

- [ ] All tests pass
- [ ] Coverage meets target (60-70%)
- [ ] Tests are readable and maintainable
- [ ] No console errors or warnings

---

## Quick Reference

### Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from '@/components/YourComponent';

describe('YourComponent', () => {
  it('should do something', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockFn = vi.fn();
    
    // Act
    render(<YourComponent onClick={mockFn} />);
    await user.click(screen.getByRole('button'));
    
    // Assert
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Common Patterns

```typescript
// Render component
render(<Component />);

// Find element
const button = screen.getByRole('button', { name: /submit/i });

// User interaction
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');

// Wait for async
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Mock function
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
expect(mockFn).toHaveBeenCalledWith('arg');

// Mock module
vi.mock('./api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: [] }),
}));
```

---

## Resources

### Official Documentation

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [jest-dom Matchers](https://github.com/testing-library/jest-dom)
- [User Event](https://testing-library.com/docs/user-event/intro)

### Learning Resources

- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://testingjavascript.com/)

---

## Conclusion

Frontend testing ensures your UI works correctly and gives you confidence to make changes. Start with critical components (forms, buttons) and gradually increase coverage.

**Remember:**
- Test user behavior, not implementation
- Keep tests simple and focused
- Use semantic queries
- Mock external dependencies
- Aim for 60-70% coverage

**Happy Testing! 🎉**

---

*Last Updated: April 2026*
*Version: 1.0*
