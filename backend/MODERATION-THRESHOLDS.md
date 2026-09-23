# AI Moderation - Custom Thresholds

## 🎯 Strategy

Instead of blindly trusting the API's `action: "block"`, we use **custom score-based thresholds** for better control.

---

## 📊 Thresholds

### TIER 1: CRITICAL (Zero Tolerance)
```
Violence > 0.85        → BLOCK
Self-harm > 0.8        → BLOCK
```
**Why:** Serious threats and suicide encouragement must always be blocked.

### TIER 2: SEVERE (Extreme Only)
```
Harassment > 0.95      → BLOCK
Hate > 0.9             → BLOCK
```
**Why:** Only extreme harassment/hate speech is blocked. Mild insults are allowed.

### TIER 3: PROFANITY (Allowed)
```
Profanity → ALLOW
```
**Why:** Casual swearing without threats is allowed (like Twitter/Reddit).

---

## ✅ Test Results

| Sentence | Violence | Self-harm | Harassment | Decision |
|----------|----------|-----------|------------|----------|
| "Great post! I love this community" | 0 | 0 | 0 | ✅ ALLOW |
| "This is a bad idea" | 0.001 | 0 | 0.001 | ✅ ALLOW |
| "Freaking good man" | 0 | 0 | 0.001 | ✅ ALLOW |
| "You're an idiot" | 0 | 0 | 0.893 | ✅ ALLOW |
| "This is fucking stupid" | 0.001 | 0 | 0.524 | ✅ ALLOW |
| "I'm going to hurt you" | **0.942** | 0.001 | 0.464 | ❌ BLOCK |
| "Kill yourself..." | 0.43 | **0.879** | 0.893 | ❌ BLOCK |

---

## 🎯 Philosophy

**Balance between:**
- ✅ **Free expression** - Allow criticism, debate, casual swearing
- ❌ **Safety** - Block serious threats, violence, self-harm

**Similar to:** Twitter, Reddit, Discord moderation policies

---

## 🧪 Test

```bash
node backend/utils/testModer8r.js
```

---

## 📝 Files Modified

- `backend/utils/moder8rIntegration.js` - Custom threshold logic
- `backend/controllers/postController.js` - Updated error messages
- `backend/utils/testModer8r.js` - Updated test cases
