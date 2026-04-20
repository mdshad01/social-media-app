# GitHub Actions Workflows

## Overview

This project has **4 CI/CD workflows** that automatically test your code:

---

## 1. Backend Tests (`backend-tests.yml`)

**Scope:** Backend only

**Triggers:**
- Push to `main`, `develop` with backend changes
- Pull requests to `main`, `develop` with backend changes

**What it does:**
- ✅ Runs on Node.js 18.x and 20.x
- ✅ Installs dependencies
- ✅ Runs all Jest tests (52 tests)
- ✅ Generates coverage report
- ✅ Comments coverage on PR
- ✅ Blocks merge if tests fail

**Files watched:**
- `backend/**` (any file in backend folder)

---

## 2. Frontend Tests (`frontend-tests.yml`)

**Scope:** Frontend only

**Triggers:**
- Push to `main`, `develop`, `e2e-cypress` with frontend changes
- Pull requests to `main`, `develop` with frontend changes

**What it does:**
- ✅ Runs on Node.js 18.x and 20.x
- ✅ Installs dependencies
- ✅ Runs ESLint
- ✅ Type checks TypeScript
- ✅ Builds Next.js project
- ✅ Runs Vitest unit tests (25 tests)
- ✅ Generates coverage report
- ✅ Blocks merge if tests fail

**Files watched:**
- `frontend/**` (any file in frontend folder)

---

## 3. E2E Tests (`e2e-tests.yml`) 🆕

**Scope:** Full-stack integration

**Triggers:**
- Push to `main`, `develop`, `e2e-cypress` with frontend/backend changes
- Pull requests to `main`, `develop` with frontend/backend changes
- Manual trigger

**What it does:**
- ✅ Starts backend server
- ✅ Starts frontend server
- ✅ Runs Cypress E2E tests (36 tests)
- ✅ Uploads screenshots on failure
- ✅ Uploads videos for debugging
- ✅ Blocks merge if tests fail

**Files watched:**
- `frontend/**` OR `backend/**` (any changes to either)

---

## 4. Code Quality (`code-quality.yml`)

**Scope:** Both Backend + Frontend

**Triggers:**
- Push to `main` or `develop` (any changes)
- Pull requests to `main` or `develop` (any changes)

**What it does:**
- ✅ Lints backend code
- ✅ Lints frontend code
- ✅ Security audit (npm audit) for both
- ⚠️ Warns about vulnerabilities (doesn't block)

**Files watched:**
- All files (runs on any change)

---

## Workflow Diagram

```
Push/PR to main or develop
         |
         ├─ Backend changes?
         |  ├─ Run backend-tests.yml ✓ (52 tests)
         |  └─ Run e2e-tests.yml ✓ (36 tests)
         |
         ├─ Frontend changes?
         |  ├─ Run frontend-tests.yml ✓ (25 tests)
         |  └─ Run e2e-tests.yml ✓ (36 tests)
         |
         └─ Always run code-quality.yml ✓
```

---

## Test Summary

**Total: 113 automated tests**

| Type | Tests | Tool | Workflow |
|------|-------|------|----------|
| Backend Unit/Integration | 52 | Jest + Supertest | backend-tests.yml |
| Frontend Unit | 25 | Vitest + RTL | frontend-tests.yml |
| E2E | 36 | Cypress | e2e-tests.yml |

---

## Status Checks Required for Merge

Before merging to `main` or `develop`, these must pass:

### Backend Changes:
- ✅ Backend Tests (Node 18.x) - 52 tests
- ✅ Backend Tests (Node 20.x) - 52 tests
- ✅ E2E Tests - 36 tests
- ✅ Code Quality / lint (backend)
- ✅ Code Quality / security (backend)

### Frontend Changes:
- ✅ Frontend Tests (Node 18.x) - 25 tests
- ✅ Frontend Tests (Node 20.x) - 25 tests
- ✅ E2E Tests - 36 tests
- ✅ Code Quality / lint (frontend)
- ✅ Code Quality / security (frontend)

### Both:
- All 113 tests must pass! ✅

---

## Local Testing

Before pushing, run locally:

```bash
# Backend (52 tests)
cd backend
npm test

# Frontend (25 tests)
cd frontend
npm run test:unit

# E2E (36 tests)
cd frontend
npm run e2e

# All tests
npm test              # Backend
cd ../frontend
npm run test:unit     # Frontend unit
npm run e2e           # E2E
```

---

## Performance

**Current build times:**
- Backend tests: ~30 seconds (52 tests)
- Frontend tests: ~1-2 minutes (25 tests + build)
- E2E tests: ~3-4 minutes (36 tests)
- Code quality: ~20 seconds

**Total time:** ~5-7 minutes per PR

---

## Debugging Failed Tests

### E2E Tests Failed?

1. Check the uploaded artifacts:
   - Screenshots (on failure)
   - Videos (always uploaded)

2. Download from GitHub Actions:
   - Go to failed workflow run
   - Scroll to "Artifacts" section
   - Download `cypress-screenshots` or `cypress-videos`

3. Run locally:
   ```bash
   cd frontend
   npm run cypress  # Opens Cypress UI
   ```

### Frontend Tests Failed?

Check coverage report in PR comment

### Backend Tests Failed?

Check test output in workflow logs

---

## Cost

GitHub Actions is FREE for public repos!

**Free tier:**
- 2,000 minutes/month for private repos
- Unlimited for public repos

Your workflows use ~7 minutes per run, so you can run:
- Public repo: Unlimited ✅
- Private repo: ~285 runs/month ✅

---

## Next Steps

1. ✅ Backend tests working (52 tests)
2. ✅ Frontend tests working (25 tests)
3. ✅ E2E tests working (36 tests)
4. ⏸️ Add deployment workflow (auto-deploy to Vercel)
5. ⏸️ Add performance monitoring (Lighthouse CI)

---

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Marketplace](https://github.com/marketplace?type=actions)
