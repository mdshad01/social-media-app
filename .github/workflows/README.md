# GitHub Actions Workflows

## Overview

This project has 3 CI/CD workflows:

---

## 1. Backend Tests (`backend-tests.yml`)

**Scope:** Backend only

**Triggers:**
- Push to `main` or `develop` with backend changes
- Pull requests to `main` or `develop` with backend changes

**What it does:**
- ✅ Runs on Node.js 18.x and 20.x
- ✅ Installs dependencies
- ✅ Runs all Jest tests (27 tests)
- ✅ Generates coverage report
- ✅ Comments coverage on PR
- ✅ Blocks merge if tests fail

**Files watched:**
- `backend/**` (any file in backend folder)

---

## 2. Frontend Tests (`frontend-tests.yml`)

**Scope:** Frontend only

**Triggers:**
- Push to `main` or `develop` with frontend changes
- Pull requests to `main` or `develop` with frontend changes

**What it does:**
- ✅ Runs on Node.js 18.x and 20.x
- ✅ Installs dependencies
- ✅ Runs ESLint
- ✅ Type checks TypeScript
- ✅ Builds Next.js project
- ⏸️ Runs tests (commented out - add when you have tests)
- ✅ Blocks merge if build fails

**Files watched:**
- `frontend/**` (any file in frontend folder)

---

## 3. Code Quality (`code-quality.yml`)

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
         |  └─ Run backend-tests.yml ✓
         |
         ├─ Frontend changes?
         |  └─ Run frontend-tests.yml ✓
         |
         └─ Always run code-quality.yml ✓
```

---

## Status Checks Required for Merge

Before merging to `main` or `develop`, these must pass:

### Backend Changes:
- ✅ Backend Tests (Node 18.x)
- ✅ Backend Tests (Node 20.x)
- ✅ Code Quality / lint (backend)
- ✅ Code Quality / security (backend)

### Frontend Changes:
- ✅ Frontend Tests (Node 18.x) - Build
- ✅ Frontend Tests (Node 20.x) - Build
- ✅ Code Quality / lint (frontend)
- ✅ Code Quality / security (frontend)

### Both:
- All of the above must pass!

---

## Adding Frontend Tests

When you add Vitest tests to frontend:

1. Uncomment test steps in `frontend-tests.yml`
2. Add test scripts to `frontend/package.json`:
   ```json
   "test": "vitest",
   "test:coverage": "vitest --coverage"
   ```
3. Tests will run automatically on every PR!

---

## Local Testing

Before pushing, run locally:

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run lint
npm run build
npm test  # When you add tests
```

---

## Troubleshooting

### Workflow not running?

**Check:**
1. File path: `.github/workflows/` (exact)
2. YAML syntax is valid
3. Branch name matches trigger
4. File changes match `paths:` filter

### Tests pass locally but fail on CI?

**Common issues:**
1. Missing environment variables
2. Different Node.js version
3. Missing dependencies in package.json

**Solution:**
Add env vars to workflow:
```yaml
env:
  NODE_ENV: test
  NEXT_PUBLIC_API_URL: http://localhost:5000
```

### Build fails on frontend?

**Check:**
1. All dependencies in package.json
2. TypeScript errors
3. Environment variables needed for build

---

## Performance

**Current build times:**
- Backend tests: ~30 seconds
- Frontend build: ~1-2 minutes
- Code quality: ~20 seconds

**Total time:** ~2-3 minutes per PR

---

## Cost

GitHub Actions is FREE for public repos!

**Free tier:**
- 2,000 minutes/month for private repos
- Unlimited for public repos

Your workflows use ~3 minutes per run, so you can run:
- Public repo: Unlimited ✅
- Private repo: ~600 runs/month ✅

---

## Next Steps

1. ✅ Backend tests working
2. ⏸️ Add frontend tests (Vitest)
3. ⏸️ Add E2E tests (Cypress)
4. ⏸️ Add deployment workflow
5. ⏸️ Add performance monitoring

---

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Marketplace](https://github.com/marketplace?type=actions)
