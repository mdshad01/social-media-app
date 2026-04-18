# Frontend Testing Guide

## Setup

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Testing Stack

- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing
- **jsdom** - DOM environment for tests

## What to Test

### Priority 1: Critical Components
- [ ] Login form
- [ ] Signup form
- [ ] Post card
- [ ] Comment component
- [ ] Button component

### Priority 2: User Interactions
- [ ] Form validation
- [ ] Button clicks
- [ ] Like/unlike functionality
- [ ] Comment submission

### Priority 3: Edge Cases
- [ ] Error states
- [ ] Loading states
- [ ] Empty states

## Writing Tests

### Example: Testing a Button
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test user behavior, not implementation**
2. **Use semantic queries** (getByRole, getByLabelText)
3. **Mock external dependencies** (API calls, router)
4. **Keep tests simple and focused**
5. **Write descriptive test names**

## Coverage Goals

- **Target**: 60-70% for critical components
- **Focus**: User-facing components and interactions
- **Skip**: Complex state management, edge cases (if time-limited)
