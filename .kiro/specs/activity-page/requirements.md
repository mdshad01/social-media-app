# Activity Page - Requirements Document

## Introduction

The Activity Page displays a user's activity history on the platform, including posts, comments, likes, and follows. Users can view statistics about their activity and filter activities by type.

## Glossary

- **Activity System**: The frontend component that displays user activities
- **Activity Item**: A single activity record (post, comment, like, or follow)
- **Activity Type**: The category of activity (all, posts, comments, likes, follows)
- **Backend API**: The server endpoint that provides activity data

## Requirements

### Requirement 1: Display Activity Statistics

**User Story:** As a user, I want to see statistics about my activities, so that I can understand my engagement on the platform

#### Acceptance Criteria

1. WHEN the Activity Page loads, THE Activity System SHALL fetch and display total counts for posts, comments, likes, and follows
2. THE Activity System SHALL display each statistic with an appropriate icon and label
3. THE Activity System SHALL show a loading state while statistics are being fetched
4. IF the statistics fetch fails, THEN THE Activity System SHALL display an error message

### Requirement 2: Filter Activities by Type

**User Story:** As a user, I want to filter my activities by type, so that I can focus on specific kinds of activities

#### Acceptance Criteria

1. THE Activity System SHALL provide filter tabs for "All", "Posts", "Comments", "Likes", and "Follows"
2. WHEN a user clicks a filter tab, THE Activity System SHALL display only activities of that type
3. THE Activity System SHALL highlight the currently active filter tab
4. WHEN the filter changes, THE Activity System SHALL fetch filtered data from the backend

### Requirement 3: Display Activity List

**User Story:** As a user, I want to see a chronological list of my activities, so that I can review my recent actions

#### Acceptance Criteria

1. THE Activity System SHALL display activities in reverse chronological order (newest first)
2. WHEN the activity list loads, THE Activity System SHALL show a loading state
3. THE Activity System SHALL display each activity with appropriate icon, description, and timestamp
4. IF no activities exist for the selected filter, THEN THE Activity System SHALL display a "No activities found" message
5. THE Activity System SHALL format timestamps in a human-readable relative format (e.g., "2 hours ago")

### Requirement 4: Handle Different Activity Types

**User Story:** As a user, I want to see different visual representations for different activity types, so that I can quickly identify what action I took

#### Acceptance Criteria

1. WHEN displaying a post activity, THE Activity System SHALL show a file icon and "Posted" text
2. WHEN displaying a comment activity, THE Activity System SHALL show a message icon and "Commented on" text
3. WHEN displaying a like activity, THE Activity System SHALL show a heart icon and "Liked" text
4. WHEN displaying a follow activity, THE Activity System SHALL show a user icon and "Followed" text
5. THE Activity System SHALL use distinct colors for each activity type icon

### Requirement 5: Integrate with Backend API

**User Story:** As a user, I want my activity data to be fetched from the server, so that I see accurate and up-to-date information

#### Acceptance Criteria

1. THE Activity System SHALL fetch activities from the `/api/user/activity` endpoint
2. THE Activity System SHALL include the activity type filter as a query parameter
3. THE Activity System SHALL handle authentication by including the auth token in requests
4. IF the API request fails, THEN THE Activity System SHALL display an appropriate error message
5. THE Activity System SHALL retry failed requests when the user refreshes or changes filters

## Technical Notes

### Backend API Endpoint
- **URL**: `GET /api/user/activity?type={type}`
- **Query Parameters**: 
  - `type`: Optional filter (all, posts, comments, likes, follows)
- **Response Format**:
```json
{
  "stats": {
    "posts": 15,
    "comments": 42,
    "likes": 128,
    "follows": 23
  },
  "activities": [
    {
      "_id": "...",
      "type": "post",
      "description": "Posted a new update",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Component Structure Suggestion
You can organize your components however you like, but here's a suggested structure:
- `ActivityPage` - Main container component
- `ActivityStats` - Statistics display component
- `ActivityTabs` - Filter tabs component
- `ActivityList` - List of activities
- `ActivityItem` - Individual activity item

### Styling Guidelines
- Use Tailwind CSS classes (already in your project)
- Match the existing design system (similar to profile pages)
- Use icons from `lucide-react` library
- Responsive design for mobile and desktop

### State Management
- Use React hooks (useState, useEffect)
- Manage loading, error, and data states
- Handle filter state changes

## Success Criteria

The Activity Page is complete when:
1. ✅ All statistics display correctly
2. ✅ Filter tabs work and update the activity list
3. ✅ Activities display with correct icons and formatting
4. ✅ Loading and error states are handled
5. ✅ Page is responsive and matches design system
6. ✅ Backend integration works correctly
