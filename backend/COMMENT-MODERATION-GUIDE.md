# Comment & Reply Moderation Guide

## Overview
This document explains the AI-powered content moderation and rate limiting system for comments and replies.

## Features Implemented

### 1. AI Content Moderation (Moder8r.app)
Both comments and replies are checked for inappropriate content before being posted.

**Moderation Categories:**
- Violence (threshold: 0.85)
- Self-harm (threshold: 0.8)
- Harassment (threshold: 0.95, or 0.85 with profanity > 0.9)
- Hate speech (threshold: 0.9)
- Toxicity (threshold: 0.95)

**Behavior:**
- ✅ **Approved content**: Comment/reply is posted normally
- ❌ **Flagged content**: User receives error message with reason
- ⚠️ **API failure**: Content is allowed (fail-open approach)

### 2. Rate Limiting
Prevents spam and abuse by limiting comment frequency per user.

**Rules:**
- **Rule 1**: Maximum 5 comments/replies per minute
  - Error: "You're commenting too fast. Please wait a moment..."
  
- **Rule 2**: Maximum 20 comments/replies per 10 minutes
  - Error: "You've reached the maximum number of comments..."

**Implementation:**
- Counts both comments AND replies together
- Uses database timestamps for accuracy
- Works across server restarts
- Compatible with multi-server deployments

## API Endpoints Affected

### POST `/api/posts/:id/comment`
**Before:** No moderation, no rate limiting
**After:** 
1. Check rate limits (1 min & 10 min)
2. Check content with AI moderation
3. Create comment if both pass

### POST `/api/comments/:commentId/reply`
**Before:** No moderation, no rate limiting
**After:**
1. Check rate limits (1 min & 10 min)
2. Check content with AI moderation
3. Create reply if both pass

## Error Responses

### Rate Limit Exceeded (HTTP 429)
```json
{
  "status": "fail",
  "message": "You're commenting too fast. Please wait a moment before commenting again."
}
```

### Content Flagged (HTTP 400)
```json
{
  "status": "fail",
  "message": "Your comment cannot be posted due to violence, harassment. Please review our community guidelines."
}
```

## Database Schema

Comments and replies store moderation metadata:

```javascript
moderation: {
  isChecked: true,      // Was content checked?
  isFlagged: false,     // Was it blocked?
  checkedAt: Date       // When was it checked?
}
```

## Testing

### Test Rate Limiting
1. Post 5 comments quickly → 6th should be blocked
2. Post 20 comments in 10 minutes → 21st should be blocked
3. Wait 1 minute → Should be able to comment again

### Test Content Moderation
Try posting comments with:
- ✅ Normal text → Should pass
- ❌ Violent threats → Should be blocked
- ❌ Hate speech → Should be blocked
- ❌ Harassment → Should be blocked

### Test API Failure
1. Set invalid `MODER8R_API_KEY` in `.env`
2. Try posting comment
3. Should allow content with warning in logs

## Configuration

### Environment Variables
```env
MODER8R_API_KEY=your_api_key_here
```

### Adjusting Thresholds
Edit `backend/utils/moder8rIntegration.js` to change moderation sensitivity.

### Adjusting Rate Limits
Edit `backend/controllers/postController.js`:
- Change `60 * 1000` for 1-minute window
- Change `10 * 60 * 1000` for 10-minute window
- Change `>= 5` for comments per minute
- Change `>= 20` for comments per 10 minutes

## Performance Considerations

**Database Queries Added:**
- 2 count queries per comment/reply (rate limiting)
- 1 API call to Moder8r (content moderation)

**Optimization Tips:**
- Rate limit queries use indexed `createdAt` field
- Moderation API has 10-second timeout
- Consider adding Redis cache for high-traffic apps

## Future Enhancements

**Possible additions:**
- [ ] Store detailed moderation scores for analytics
- [ ] Manual review queue for borderline content
- [ ] User reputation system (track repeat offenders)
- [ ] Temporary bans for excessive violations
- [ ] Whitelist trusted users (skip rate limits)
- [ ] Per-post comment limits (prevent brigading)

## Monitoring

**Key metrics to track:**
- Number of comments blocked by moderation
- Number of rate limit violations
- Most common violation categories
- API failure rate

**Logs to watch:**
```
🤖 Moder8r AI: Checking content...
✅ Content APPROVED by custom thresholds
❌ Content BLOCKED by custom thresholds
⚠️ Moderation API failed, allowing content (fail-open)
```

## Support

For issues or questions:
1. Check logs for moderation decisions
2. Verify `MODER8R_API_KEY` is set correctly
3. Test with simple text first
4. Review thresholds in `moder8rIntegration.js`
