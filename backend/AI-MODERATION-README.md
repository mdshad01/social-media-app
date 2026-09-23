# AI Content Moderation

## What's Implemented

Your app uses **Moder8r.app** for AI-powered content moderation (powered by OpenAI + GPT-4).

## Setup

1. Your API key is already in `backend/.env`:
   ```env
   MODER8R_API_KEY=m8r_sk_BpLJYt9idfhuhnr9MJpg2JOu7SPr3Mq0b5
   ```

2. Get your key from: https://moder8r.app/

## Test

```bash
node backend/utils/testModer8r.js
```

## Run Your App

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## How It Works

When a user creates a post, the caption is checked by AI. If inappropriate content is detected (violence, hate speech, harassment, etc.), the post is blocked.

## Files

- `backend/utils/moder8rIntegration.js` - API integration (ES modules)
- `backend/utils/testModer8r.js` - Test script (ES modules)
- `backend/controllers/postController.js` - Post creation with moderation

## Free Tier

- 1,000 requests/month
- No credit card required
- Uses OpenAI + GPT-4

## Test in Browser

Try creating posts:
- ✅ "Hello world" → Should work
- ❌ "I will kill you" → Should be blocked by AI
