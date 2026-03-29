# 🌐 ShadSocial - Modern Social Media Platform

A full-stack social media application built with Next.js 16, Express.js, MongoDB, and TypeScript. Features real-time interactions, media sharing, polls, events, and comprehensive user management.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://social-media-app-6omb.vercel.app)
[![Backend API](https://img.shields.io/badge/API-live-blue)](https://social-media-app-snowy-xi.vercel.app)

---

## 📸 Screenshots

### Home Feed
![Home Feed](./frontend/screenshots/home-feed.png)
*Main feed with posts, stories, and create post section*

### Profile Page
![Profile Page](./frontend/screenshots/profile.png)
*User profile with customizable information and posts*

### Activity Dashboard
![Activity](./frontend/screenshots/activity.png)
*Track all interactions - likes, comments, and new followers*

### Post Creation
![Post Creation](./frontend/screenshots/post-creation.png)
*Create posts with text, images, videos, polls, and events*

### Post Detail & Comments
![Post Detail](./frontend/screenshots/post-detail.png)
*Detailed post view with engagement metrics*

![Comments](./frontend/screenshots/comments.png)
*Nested comments and replies system*

### Authentication
![Login](./frontend/screenshots/login.png)
*Secure login with JWT authentication*

![Signup](./frontend/screenshots/signup.png)
*User registration with email verification*

### Dark Mode
![Dark Mode](./frontend/screenshots/dark-mode.png)
*Beautiful dark theme for comfortable viewing*

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with HTTP-only cookies
- **Email verification** with OTP (One-Time Password)
- **Password reset** functionality with time-limited OTP
- **Session management** with automatic token refresh
- **Protected routes** with authentication guards
- **Account deactivation** (30-day recovery period)
- **Permanent account deletion** with complete data cleanup

### 👤 User Management
- **User profiles** with customizable bio, location, work, school, website
- **Profile & background images** with Cloudinary integration
- **Follow/Unfollow** system
- **Suggested users** discovery
- **Activity tracking** (likes, comments, follows, posts)
- **Account verification** status

### 📝 Post Features
- **Multiple post types:**
  - Text posts
  - Image posts (with optimization)
  - Video posts (streaming upload)
  - Polls (with voting and expiration)
  - Events (with RSVP functionality)
- **Like/Unlike** posts
- **Save/Unsave** posts
- **Share** posts
- **Delete** posts (with Cloudinary cleanup)
- **Comments** with nested replies
- **Comment likes** and deletion

### 🎨 UI/UX
- **Responsive design** (mobile, tablet, desktop)
- **Dark/Light mode** with next-themes
- **Smooth animations** with Tailwind CSS
- **Loading skeletons** for better UX
- **Toast notifications** with Sonner
- **Modal dialogs** for post creation and details
- **Infinite scroll** feed

### 🔔 Activity System
- **Activity dashboard** showing:
  - New followers
  - Post likes
  - Comments on posts
  - Replies to comments
- **Activity statistics** and filtering
- **Real-time updates**

### ⚙️ Settings
- **Account settings** (email, username)
- **Security settings** (password change)
- **Privacy settings**
- **Notification preferences**
- **Appearance settings** (theme, display)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **State Management:** Redux Toolkit with Redux Persist
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Icons:** Lucide React, React Icons
- **HTTP Client:** Axios
- **Notifications:** Sonner
- **Theme:** next-themes

### Backend
- **Runtime:** Node.js (>=18.0.0)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer
- **Image Processing:** Sharp
- **Cloud Storage:** Cloudinary
- **Email:** Nodemailer with Handlebars templates
- **Security:**
  - Helmet (HTTP headers)
  - CORS
  - Express Rate Limit
  - Express Mongo Sanitize
  - HPP (HTTP Parameter Pollution)
  - bcryptjs (password hashing)

### DevOps & Deployment
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Vercel Serverless Functions
- **Database:** MongoDB Atlas
- **CDN:** Cloudinary
- **Environment:** dotenv

---

## 📁 Project Structure

```
social-media-app/
├── frontend/
│   ├── app/                      # Next.js App Router
│   │   ├── activity/            # Activity page
│   │   ├── auth/                # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── verify/
│   │   │   ├── forget-password/
│   │   │   └── reset-password/
│   │   ├── post/[id]/           # Single post view
│   │   ├── profile/[id]/        # User profile
│   │   │   ├── edit/
│   │   │   ├── my-posts/
│   │   │   └── saved-posts/
│   │   ├── settings/            # Settings pages
│   │   │   ├── account/
│   │   │   ├── security/
│   │   │   ├── privacy/
│   │   │   ├── notifications/
│   │   │   └── appearance/
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/
│   │   ├── Activity/            # Activity components
│   │   ├── Auth/                # Auth forms
│   │   ├── guards/              # Route guards
│   │   ├── Home/                # Home feed components
│   │   ├── Profile/             # Profile components
│   │   ├── Settings/            # Settings components
│   │   └── Skeleton/            # Loading skeletons
│   ├── HOC/                     # Higher-Order Components
│   ├── lib/                     # Utilities
│   │   └── axiosInterceptor.ts  # Global axios config
│   ├── store/                   # Redux store
│   │   ├── store.ts
│   │   ├── authSlice.ts
│   │   ├── activitySlice.ts
│   │   └── postSlice.ts
│   ├── vercel.json              # Vercel proxy config
│   └── package.json
│
├── backend/
│   ├── controllers/             # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── postController.js
│   │   ├── activityController.js
│   │   └── errorController.js
│   ├── models/                  # Mongoose models
│   │   ├── userModel.js
│   │   ├── postModel.js
│   │   └── commentModel.js
│   ├── routers/                 # Express routers
│   │   ├── userRouter.js
│   │   └── postRouter.js
│   ├── middleware/              # Custom middleware
│   │   ├── isAuthenticated.js
│   │   ├── isVerified.js
│   │   └── multer.js
│   ├── utils/                   # Utility functions
│   │   ├── appError.js
│   │   ├── catchAsync.js
│   │   ├── cloudinary.js
│   │   ├── datauri.js
│   │   ├── email.js
│   │   └── generateOtp.js
│   ├── emailTemplate/           # Email templates
│   │   └── otpTemplate.hbs
│   ├── config/
│   │   └── env.js
│   ├── app.js                   # Express app
│   ├── server.js                # Server entry point
│   ├── vercel.json              # Vercel config
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account
- Cloudinary account
- Email service (Gmail recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app
```

2. **Install dependencies**

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Environment Variables**

Create `.env` file in the `backend` directory:

```env
NODE_ENV=production
PORT=5000

# Database
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
DB=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

Create `.env.local` file in the `frontend` directory:

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Production (set in Vercel Dashboard)
# NEXT_PUBLIC_API_URL=/api/v1
```

4. **Run the application**

```bash
# Run backend (from backend directory)
npm run dev

# Run frontend (from frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=/api/v1
   ```
4. Deploy

### Backend (Vercel)

1. Push your code to GitHub
2. Import backend folder as separate project
3. Set all environment variables from `.env`
4. Ensure `NODE_ENV=production`
5. Deploy

### Important: Cross-Origin Cookie Configuration

The project uses a Vercel proxy to handle cross-origin requests:

**Frontend `vercel.json`:**
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url.vercel.app/api/:path*"
    }
  ]
}
```

This makes cookies work seamlessly between frontend and backend on different Vercel subdomains.

---

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/users/signup              # Register new user
POST   /api/v1/users/login               # Login user
POST   /api/v1/users/logout              # Logout user
POST   /api/v1/users/verify              # Verify email with OTP
POST   /api/v1/users/resend-otp          # Resend verification OTP
POST   /api/v1/users/forget-password     # Request password reset
POST   /api/v1/users/reset-password      # Reset password with OTP
POST   /api/v1/users/change-password     # Change password (authenticated)
```

### User
```
GET    /api/v1/users/me                  # Get current user
GET    /api/v1/users/profile/:id         # Get user profile
POST   /api/v1/users/edit-profile        # Update profile
GET    /api/v1/users/suggested-user      # Get suggested users
POST   /api/v1/users/follow-unfollow/:id # Follow/unfollow user
GET    /api/v1/users/activity            # Get user activity
POST   /api/v1/users/deactivate-account  # Deactivate account
DELETE /api/v1/users/delete-account      # Permanently delete account
POST   /api/v1/users/reactivate-account  # Reactivate account
```

### Posts
```
GET    /api/v1/posts                     # Get all posts
POST   /api/v1/posts/create              # Create post
GET    /api/v1/posts/:id                 # Get single post
GET    /api/v1/posts/user/:id            # Get user posts
DELETE /api/v1/posts/:id                 # Delete post
POST   /api/v1/posts/like/:id            # Like/unlike post
POST   /api/v1/posts/save/:postId        # Save/unsave post
POST   /api/v1/posts/share/:id           # Share post
POST   /api/v1/posts/comment/:id         # Add comment
POST   /api/v1/posts/vote                # Vote on poll
POST   /api/v1/posts/rsvp/:postId        # RSVP to event
POST   /api/v1/posts/comment/like/:commentId      # Like comment
POST   /api/v1/posts/comment/reply/:commentId     # Reply to comment
DELETE /api/v1/posts/comment/:commentId           # Delete comment
```

---

## 🔒 Security Features

- **JWT Authentication** with HTTP-only cookies
- **Password hashing** with bcryptjs
- **Rate limiting** to prevent brute force attacks
- **Helmet** for secure HTTP headers
- **CORS** configuration
- **MongoDB sanitization** to prevent NoSQL injection
- **HPP** to prevent HTTP parameter pollution
- **Input validation** with Mongoose schemas
- **XSS protection**
- **CSRF protection** via SameSite cookies

---

## 🎯 Key Features Implementation

### Session Management
- Redux Persist for state persistence
- SessionValidator component validates user on app load
- Global 401 interceptor handles expired sessions
- Automatic redirect to login on authentication failure

### File Upload
- Multer for handling multipart/form-data
- Sharp for image optimization
- Cloudinary for cloud storage
- Support for images and videos
- Automatic cleanup on deletion

### Email System
- Nodemailer with Gmail SMTP
- Handlebars templates for beautiful emails
- OTP generation and validation
- Time-limited tokens

### Activity Tracking
- Tracks user interactions (likes, comments, follows)
- Activity statistics dashboard
- Filter by activity type
- Real-time updates

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for seamless deployment
- MongoDB for the database
- Cloudinary for media management
- All open-source contributors

---

## 📞 Support

For support, email your.email@example.com or open an issue in the repository.

---

## 🗺️ Roadmap

- [ ] Real-time chat messaging
- [ ] Video calls
- [ ] Stories feature
- [ ] Notifications system
- [ ] Advanced search and filters
- [ ] Hashtags and trending topics
- [ ] User mentions (@username)
- [ ] Post analytics
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)

---

**⭐ If you like this project, please give it a star on GitHub! ⭐**
