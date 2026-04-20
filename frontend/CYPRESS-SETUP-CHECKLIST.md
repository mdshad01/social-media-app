# ✅ Cypress Setup Checklist

## Day 1: Setup & Configuration (Today)

### Step 1: Install Cypress ⏱️ 5 minutes

```bash
cd frontend
npm install -D cypress @testing-library/cypress start-server-and-test
```

### Step 2: Verify Files Created ⏱️ 2 minutes

Check these files exist:
- ✅ `cypress.config.ts`
- ✅ `cypress/support/commands.ts`
- ✅ `cypress/support/e2e.ts`
- ✅ `cypress/e2e/auth/login.cy.ts`
- ✅ `cypress/e2e/auth/signup.cy.ts`
- ✅ `cypress/e2e/posts/create-post.cy.ts`
- ✅ `cypress/e2e/posts/interact-post.cy.ts`
- ✅ `cypress/e2e/user/logout.cy.ts`

### Step 3: Update Test User Credentials ⏱️ 5 minutes

**Important:** Replace test credentials in all test files:

```typescript
// Find and replace in all .cy.ts files:
cy.get('input[name="email"]').type('YOUR_TEST_EMAIL@example.com');
cy.get('input[name="password"]').type('YOUR_TEST_PASSWORD');
```

**Create a test user in your app:**
1. Go to http://localhost:3000/auth/signup
2. Create user: `cypresstest@example.com` / `Cypress123!`
3. Verify email
4. Use these credentials in tests

### Step 4: Delete Example Tests ⏱️ 1 minute

```bash
# Delete Cypress example files
rm -rf cypress/e2e/1-getting-started
rm -rf cypress/e2e/2-advanced-examples
```

Or on Windows:
```bash
rmdir /s /q cypress\e2e\1-getting-started
rmdir /s /q cypress\e2e\2-advanced-examples
```

---

## Day 2: Run & Fix Tests (Tomorrow)

### Step 1: Start Dev Server ⏱️ 1 minute

```bash
# Terminal 1
cd frontend
npm run dev
```

Wait for: `✓ Ready in X ms`

### Step 2: Open Cypress ⏱️ 1 minute

```bash
# Terminal 2
cd frontend
npm run cypress
```

### Step 3: Run Login Tests ⏱️ 10 minutes

1. Click "E2E Testing"
2. Choose browser (Chrome recommended)
3. Click `auth/login.cy.ts`
4. Watch tests run
5. Fix any failures:
   - Update selectors if needed
   - Adjust timeouts
   - Fix test data

### Step 4: Run All Tests ⏱️ 30 minutes

Run each test file:
- ✅ `auth/login.cy.ts` (8 tests)
- ✅ `auth/signup.cy.ts` (6 tests)
- ✅ `posts/create-post.cy.ts` (5 tests)
- ✅ `posts/interact-post.cy.ts` (7 tests)
- ✅ `user/logout.cy.ts` (5 tests)

**Fix common issues:**
- Element not found → Update selector
- Timeout → Increase timeout or add wait
- Test data conflicts → Use unique data

---

## Day 3: Polish & Document (Day After Tomorrow)

### Step 1: Add Data Test IDs ⏱️ 20 minutes

Add to your components for stable selectors:

```tsx
// In your components
<button data-testid="submit-button">Submit</button>
<div data-testid="user-menu">Menu</div>
<div data-testid="post-card">Post</div>
```

**Files to update:**
- `components/Auth/Login.tsx` → Add `data-testid="login-form"`
- `components/Navbar.tsx` → Add `data-testid="user-menu"`
- `components/Home/PostCard.tsx` → Add `data-testid="post-card"`

### Step 2: Run Headless Tests ⏱️ 5 minutes

```bash
npm run cypress:headless
```

All tests should pass ✅

### Step 3: Update Package.json ⏱️ Already Done ✅

Scripts already added:
```json
{
  "cypress": "cypress open",
  "cypress:headless": "cypress run",
  "e2e": "start-server-and-test dev http://localhost:3000 cypress",
  "e2e:headless": "start-server-and-test dev http://localhost:3000 cypress:headless"
}
```

### Step 4: Update README ⏱️ 10 minutes

Add to `frontend/README.md`:

```markdown
## E2E Testing

### Run Cypress Tests

```bash
# Open Cypress UI
npm run cypress

# Run headless
npm run cypress:headless

# Run with dev server
npm run e2e
```

### Test Coverage
- 31 E2E tests
- Auth flows (login, signup)
- Post creation & interaction
- User logout
```

---

## Quick Commands Reference

```bash
# Install
npm install -D cypress @testing-library/cypress start-server-and-test

# Open Cypress UI
npm run cypress

# Run all tests (headless)
npm run cypress:headless

# Run with dev server
npm run e2e

# Run specific test
npx cypress run --spec "cypress/e2e/auth/login.cy.ts"
```

---

## Common Issues & Fixes

### Issue: "Cannot find module 'cypress'"

**Fix:**
```bash
npm install -D cypress
```

### Issue: Tests fail with "baseUrl not set"

**Fix:** Check `cypress.config.ts`:
```typescript
baseUrl: 'http://localhost:3000'
```

### Issue: "Element not found"

**Fix:** Update selector or add `data-testid`:
```typescript
// Before
cy.get('.complex-class-name')

// After
cy.get('[data-testid="element-name"]')
```

### Issue: "Timed out"

**Fix:** Increase timeout:
```typescript
cy.get('button', { timeout: 10000 })
```

---

## Final Checklist Before Push

- [ ] All 31 tests passing
- [ ] Test user created and verified
- [ ] Data test IDs added to components
- [ ] Cypress scripts in package.json
- [ ] Documentation updated
- [ ] Screenshots folder in .gitignore
- [ ] Example tests deleted

---

## Time Estimate

| Day | Tasks | Time |
|-----|-------|------|
| Day 1 | Setup & Install | 1-2 hours |
| Day 2 | Run & Fix Tests | 2-3 hours |
| Day 3 | Polish & Document | 1-2 hours |
| **Total** | | **4-7 hours** |

---

## Next Steps After Setup

1. ✅ Push to GitHub
2. ✅ Add to CI/CD pipeline
3. ✅ Update resume with E2E testing
4. ✅ Practice explaining tests in interviews

---

**You're doing great! 🚀 This will make your resume stand out!**
