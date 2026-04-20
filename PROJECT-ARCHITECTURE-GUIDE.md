# 🏗️ Project Architecture Guide - Social Media Application

> Complete architecture overview for interview preparation

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Design Patterns Used](#design-patterns-used)
5. [Technology Stack](#technology-stack)
6. [Interview Questions & Answers](#interview-questions--answers)

---

## Architecture Overview

### **Overall Architecture: 3-Tier Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT TIER (Frontend)                    │
│  Next.js 15 + React 19 + TypeScript + Redux + TailwindCSS  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         │ (Axios)
┌────────────────────────▼────────────────────────────────────┐
│                  APPLICATION TIER (Backend)                  │
│        Node.js + Express.js + MVC Pattern + JWT Auth        │
└────────────────────────┬────────────────────────────────────┘
                         │ Mongoose ODM
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     DATA TIER (Database)                     │
│                    MongoDB (NoSQL Database)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### **Architecture Pattern: MVC (Model-View-Controller)**

The backend follows the **MVC architectural pattern** with additional layers for better separation of concerns.

### **Folder Structure:**

```
backend/
├── config/              # Configuration files
│   └── env.js          # Environment variables setup
├── controllers/         # Business logic (Controller layer)
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   ├── activityController.js
│   └── errorController.js
├── models/             # Data models (Model layer)
│   ├── userModel.js
│   ├── postModel.js
│   └── commentModel.js
├── routers/            # Route definitions (Router layer)
│   ├── userRouter.js
│   └── postRouter.js
├── middleware/         # Middleware functions
│   ├── isAuthenticated.js
│   ├── isVerified.js
│   └── multer.js
├── utils/              # Utility functions
│   ├── appError.js
│   ├── catchAsync.js
│   ├── email.js
│   ├── cloudinary.js
│   └── generateOtp.js
├── tests/              # Test files
│   ├── unit/
│   └── integration/
├── app.js              # Express app configuration
└── server.js           # Server entry point
```

---

### **MVC Pattern Breakdown:**

#### **1. Model Layer (Data)**
- **Location:** `backend/models/`
- **Purpose:** Define data structure and database schema
- **Technology:** Mongoose ODM (Object Data Modeling)

**Example:**
```javascript
// userModel.js
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // ... more fields
});

export default mongoose.model('User', userSchema);
```

**What it does:**
- Defines database schema
- Handles data validation
- Provides database query methods
- Manages relationships between collections

---

#### **2. Controller Layer (Business Logic)**
- **Location:** `backend/controllers/`
- **Purpose:** Handle business logic and data processing
- **Pattern:** Each controller handles one resource (User, Post, etc.)

**Example:**
```javascript
// authController.js
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // 1. Validate input
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  
  // 2. Check if user exists
  const user = await User.findOne({ email }).select('+password');
  
  // 3. Verify password
  const isPasswordCorrect = await user.comparePassword(password);
  
  // 4. Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
  // 5. Send response
  res.status(200).json({ status: 'success', data: { user } });
});
```

**What it does:**
- Processes incoming requests
- Validates data
- Interacts with models
- Sends responses
- Handles errors

---

#### **3. Router Layer (Routes)**
- **Location:** `backend/routers/`
- **Purpose:** Define API endpoints and map them to controllers
- **Pattern:** RESTful API design

**Example:**
```javascript
// userRouter.js
const userRouter = Router();

// Auth routes
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/logout', logout);

// Protected routes
userRouter.get('/profile/:id', isAuthenticated, isVerified, getProfile);
userRouter.post('/edit-profile', isAuthenticated, isVerified, upload, editProfile);

export default userRouter;
```

**What it does:**
- Maps HTTP methods to controller functions
- Applies middleware (authentication, validation)
- Organizes API endpoints

---

#### **4. Middleware Layer**
- **Location:** `backend/middleware/`
- **Purpose:** Process requests before reaching controllers

**Types:**
1. **Authentication Middleware** (`isAuthenticated.js`)
   - Verifies JWT token
   - Attaches user to request object

2. **Authorization Middleware** (`isVerified.js`)
   - Checks if user is verified
   - Restricts access to certain routes

3. **File Upload Middleware** (`multer.js`)
   - Handles file uploads
   - Validates file types

**Example:**
```javascript
// isAuthenticated.js
const isAuthenticated = catchAsync(async (req, res, next) => {
  // 1. Get token from cookies
  const token = req.cookies.jwt;
  
  // 2. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // 3. Get user from database
  const user = await User.findById(decoded.id);
  
  // 4. Attach user to request
  req.user = user;
  next();
});
```

---

#### **5. Utility Layer**
- **Location:** `backend/utils/`
- **Purpose:** Reusable helper functions

**Key Utilities:**
1. **AppError** - Custom error class
2. **catchAsync** - Async error wrapper
3. **email** - Email sending functionality
4. **cloudinary** - Image upload to cloud
5. **generateOtp** - OTP generation

---

### **Request Flow in Backend:**

```
1. Client Request
   ↓
2. Express Middleware (CORS, Body Parser, etc.)
   ↓
3. Router (Match route)
   ↓
4. Middleware (Authentication, Validation)
   ↓
5. Controller (Business Logic)
   ↓
6. Model (Database Query)
   ↓
7. Controller (Process Data)
   ↓
8. Response to Client
```

**Example Flow for Login:**
```
POST /api/v1/users/login
   ↓
app.js (Express middleware)
   ↓
userRouter.js (Route: POST /login)
   ↓
authController.js (login function)
   ↓
userModel.js (Find user in database)
   ↓
authController.js (Verify password, generate token)
   ↓
Response: { status: 'success', data: { user } }
```

---

## Frontend Architecture

### **Architecture Pattern: Component-Based Architecture with Redux**

The frontend follows **Next.js App Router** architecture with **Redux for state management**.

### **Folder Structure:**

```
frontend/
├── app/                    # Next.js App Router (Pages)
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify/
│   ├── profile/           # Profile pages
│   ├── post/              # Post pages
│   ├── settings/          # Settings pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Auth/             # Auth components
│   ├── Home/             # Home components
│   ├── Profile/          # Profile components
│   ├── ui/               # UI components (shadcn)
│   └── Helper/           # Helper components
├── store/                # Redux state management
│   ├── authSlice.ts
│   ├── postSlice.ts
│   ├── activitySlice.ts
│   └── store.ts
├── lib/                  # Utility libraries
│   ├── axiosInterceptor.ts
│   ├── utils.ts
│   └── warmupBackend.ts
├── hooks/                # Custom React hooks
├── HOC/                  # Higher Order Components
│   └── ClientProvider.tsx
├── middleware.ts         # Next.js middleware
└── tests/                # Test files
```

---

### **Frontend Architecture Layers:**

#### **1. Presentation Layer (UI Components)**
- **Location:** `frontend/components/`
- **Purpose:** Display UI and handle user interactions
- **Pattern:** Atomic Design (Atoms, Molecules, Organisms)

**Component Hierarchy:**
```
Atoms (Basic UI elements)
  ├── Button
  ├── Input
  └── Avatar
     ↓
Molecules (Simple combinations)
  ├── LoadingButton
  ├── PasswordInput
  └── SearchBar
     ↓
Organisms (Complex components)
  ├── Login Form
  ├── Post Card
  └── Navbar
     ↓
Pages (Full pages)
  ├── Home Page
  ├── Profile Page
  └── Login Page
```

---

#### **2. State Management Layer (Redux)**
- **Location:** `frontend/store/`
- **Purpose:** Manage global application state
- **Pattern:** Redux Toolkit with Slices

**Redux Architecture:**
```
┌─────────────────────────────────────────┐
│           Redux Store                    │
├─────────────────────────────────────────┤
│  authSlice    │ User authentication     │
│  postSlice    │ Posts data              │
│  activitySlice│ User activities         │
└─────────────────────────────────────────┘
         ↓                    ↑
    Dispatch Action      Subscribe
         ↓                    ↑
┌─────────────────────────────────────────┐
│         React Components                 │
└─────────────────────────────────────────┘
```

**Example:**
```typescript
// authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});
```

**What it does:**
- Centralized state management
- Predictable state updates
- Easy debugging with Redux DevTools
- Persistent state with redux-persist

---

#### **3. Routing Layer (Next.js App Router)**
- **Location:** `frontend/app/`
- **Purpose:** Handle navigation and page rendering
- **Pattern:** File-based routing

**Routing Structure:**
```
app/
├── page.tsx                    → /
├── auth/
│   ├── login/page.tsx         → /auth/login
│   ├── signup/page.tsx        → /auth/signup
│   └── verify/page.tsx        → /auth/verify
├── profile/
│   └── [id]/page.tsx          → /profile/:id (dynamic)
├── post/
│   └── [id]/page.tsx          → /post/:id (dynamic)
└── settings/
    ├── page.tsx               → /settings
    └── account/page.tsx       → /settings/account
```

---

#### **4. Data Fetching Layer (API Integration)**
- **Location:** `frontend/lib/axiosInterceptor.ts`
- **Purpose:** Handle API calls to backend
- **Pattern:** Axios with interceptors

**API Call Flow:**
```
Component
   ↓
API Call (axios.post('/api/users/login', data))
   ↓
Axios Interceptor (Add auth token, handle errors)
   ↓
Backend API
   ↓
Response
   ↓
Axios Interceptor (Handle 401, timeouts)
   ↓
Component (Update UI)
```

**Example:**
```typescript
// axiosInterceptor.ts
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

---

### **Frontend Request Flow:**

```
1. User Action (Click button)
   ↓
2. Component Event Handler
   ↓
3. API Call (Axios)
   ↓
4. Backend API
   ↓
5. Response
   ↓
6. Redux Action (Update state)
   ↓
7. Component Re-render (Show updated UI)
```

**Example: Login Flow**
```
1. User clicks "Sign In" button
   ↓
2. Login component calls handleSubmit()
   ↓
3. axios.post('/api/v1/users/login', { email, password })
   ↓
4. Backend processes login
   ↓
5. Response: { data: { user }, message: 'Login successful' }
   ↓
6. dispatch(setAuthUser(user))
   ↓
7. Redux updates auth state
   ↓
8. Component redirects to home page
   ↓
9. Home page renders with user data
```

---

## Design Patterns Used

### **1. MVC Pattern (Backend)**
- **Model:** Data structure and database logic
- **View:** JSON responses (API)
- **Controller:** Business logic

**Why:**
- ✅ Separation of concerns
- ✅ Easy to maintain
- ✅ Scalable
- ✅ Testable

---

### **2. Repository Pattern (Backend Models)**
- Models act as repositories for data access
- Abstracts database operations

**Example:**
```javascript
// Instead of writing queries everywhere
const user = await User.findById(id);

// Model provides clean interface
const user = await User.findById(id).select('-password');
```

---

### **3. Middleware Pattern (Backend)**
- Chain of responsibility pattern
- Each middleware handles one concern

**Example:**
```javascript
app.use(helmet());           // Security
app.use(cors());             // CORS
app.use(express.json());     // Body parsing
app.use(isAuthenticated);    // Authentication
```

---

### **4. Singleton Pattern (Database Connection)**
- Single database connection instance
- Reused across requests

**Example:**
```javascript
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb; // Reuse existing connection
  }
  cachedDb = await mongoose.connect(process.env.DB);
  return cachedDb;
}
```

---

### **5. Factory Pattern (Error Handling)**
- AppError class creates different error types

**Example:**
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  }
}

// Usage
throw new AppError('User not found', 404);
throw new AppError('Server error', 500);
```

---

### **6. Higher-Order Function Pattern (catchAsync)**
- Wraps async functions to handle errors

**Example:**
```javascript
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Usage
export const login = catchAsync(async (req, res, next) => {
  // No need for try-catch
  const user = await User.findOne({ email });
});
```

---

### **7. Redux Pattern (Frontend State Management)**
- Flux architecture
- Unidirectional data flow

**Flow:**
```
Action → Reducer → Store → Component
   ↑                           ↓
   └───────────────────────────┘
```

---

### **8. Component Composition Pattern (Frontend)**
- Build complex UIs from simple components

**Example:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Post Title</CardTitle>
  </CardHeader>
  <CardContent>
    Post content here
  </CardContent>
</Card>
```

---

### **9. Custom Hooks Pattern (Frontend)**
- Reusable stateful logic

**Example:**
```typescript
// Custom hook
const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return { user, isAuthenticated };
};

// Usage in component
const { user, isAuthenticated } = useAuth();
```

---

### **10. HOC Pattern (Higher-Order Components)**
- Wrap components with additional functionality

**Example:**
```tsx
// ClientProvider.tsx
const ClientProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
```

---

## Technology Stack

### **Backend Stack:**

| Technology | Purpose | Why Used |
|------------|---------|----------|
| **Node.js** | Runtime environment | JavaScript on server, non-blocking I/O |
| **Express.js** | Web framework | Minimal, flexible, middleware support |
| **MongoDB** | Database | NoSQL, flexible schema, scalable |
| **Mongoose** | ODM | Schema validation, query builder |
| **JWT** | Authentication | Stateless, secure, scalable |
| **Bcrypt** | Password hashing | Secure password storage |
| **Cloudinary** | Image storage | Cloud-based, CDN, image optimization |
| **Nodemailer** | Email service | Send OTP, notifications |
| **Jest** | Testing | Unit & integration tests |
| **Supertest** | API testing | HTTP assertions |

---

### **Frontend Stack:**

| Technology | Purpose | Why Used |
|------------|---------|----------|
| **Next.js 15** | React framework | SSR, routing, optimization |
| **React 19** | UI library | Component-based, virtual DOM |
| **TypeScript** | Type safety | Catch errors early, better DX |
| **Redux Toolkit** | State management | Predictable state, DevTools |
| **TailwindCSS** | Styling | Utility-first, responsive, fast |
| **Shadcn UI** | Component library | Accessible, customizable |
| **Axios** | HTTP client | Interceptors, easy API calls |
| **Vitest** | Testing | Fast, modern, Vite-powered |
| **React Testing Library** | Component testing | User-centric testing |

---

## Interview Questions & Answers

### **Q1: What architecture pattern does your backend use?**

**Answer:**
"My backend uses the **MVC (Model-View-Controller) pattern**. 

- **Models** define the data structure using Mongoose schemas
- **Controllers** handle business logic and process requests
- **Routers** define API endpoints and map them to controllers

I also use additional layers like **middleware** for authentication and **utilities** for reusable functions. This separation of concerns makes the code maintainable, testable, and scalable."

---

### **Q2: Explain the request flow in your application**

**Answer:**
"When a user logs in:

1. **Frontend:** User submits login form
2. **API Call:** Axios sends POST request to `/api/v1/users/login`
3. **Backend Router:** Matches route and calls `authController.login`
4. **Controller:** Validates credentials, generates JWT token
5. **Model:** Queries MongoDB for user data
6. **Response:** Sends user data and token back
7. **Frontend:** Stores token in cookies, updates Redux state
8. **Redirect:** User is redirected to home page

The entire flow follows REST principles and uses JWT for stateless authentication."

---

### **Q3: How do you manage state in your frontend?**

**Answer:**
"I use **Redux Toolkit** for global state management with three main slices:

1. **authSlice** - User authentication state
2. **postSlice** - Posts data
3. **activitySlice** - User activities

I also use **redux-persist** to persist state in localStorage, so users stay logged in even after page refresh. For local component state, I use React's `useState` hook."

---

### **Q4: What design patterns have you used?**

**Answer:**
"I've used several design patterns:

**Backend:**
- **MVC Pattern** - Separation of concerns
- **Middleware Pattern** - Chain of responsibility for request processing
- **Singleton Pattern** - Database connection caching
- **Factory Pattern** - Custom error handling with AppError class
- **Higher-Order Function** - catchAsync wrapper for error handling

**Frontend:**
- **Redux Pattern** - Unidirectional data flow
- **Component Composition** - Building complex UIs from simple components
- **HOC Pattern** - ClientProvider wraps app with Redux
- **Custom Hooks** - Reusable stateful logic"

---

### **Q5: How do you handle authentication?**

**Answer:**
"I use **JWT (JSON Web Tokens)** for authentication:

1. User logs in with email/password
2. Backend verifies credentials
3. Backend generates JWT token with user ID
4. Token is sent in HTTP-only cookie (secure)
5. Frontend includes token in subsequent requests
6. Backend middleware verifies token on protected routes

I also have an **isAuthenticated** middleware that checks the token and an **isVerified** middleware that ensures the user has verified their email."

---

### **Q6: Why did you choose MongoDB over SQL?**

**Answer:**
"I chose MongoDB because:

1. **Flexible Schema** - Social media data (posts, comments) can have varying structures
2. **Scalability** - Horizontal scaling for large datasets
3. **JSON-like Documents** - Easy to work with in JavaScript/Node.js
4. **Fast Reads** - Optimized for read-heavy operations (social media feeds)
5. **Embedded Documents** - Can store related data together (comments in posts)

However, I understand SQL databases are better for complex relationships and transactions. For this project, MongoDB's flexibility was more suitable."

---

### **Q7: How do you handle errors in your application?**

**Answer:**
"I have a centralized error handling system:

**Backend:**
1. **AppError class** - Custom error class with status codes
2. **catchAsync wrapper** - Catches async errors automatically
3. **Global error handler** - Middleware that catches all errors
4. **Different error types** - Validation errors, authentication errors, etc.

**Frontend:**
1. **Axios interceptors** - Handle 401 errors globally
2. **Try-catch blocks** - For API calls
3. **Toast notifications** - Show user-friendly error messages
4. **Error boundaries** - Catch React component errors

This ensures consistent error handling across the application."

---

### **Q8: What is the difference between MVC and 3-tier architecture?**

**Answer:**
"**MVC** is a design pattern for organizing code within an application layer:
- Model: Data
- View: Presentation
- Controller: Logic

**3-Tier Architecture** is a deployment architecture with three physical layers:
- Presentation Tier: Frontend (Next.js)
- Application Tier: Backend (Express.js)
- Data Tier: Database (MongoDB)

My project uses **both**: 3-tier architecture for deployment and MVC pattern within the backend tier."

---

### **Q9: How do you ensure code quality?**

**Answer:**
"I ensure code quality through:

1. **Testing** - 77 tests (25 frontend + 52 backend)
2. **TypeScript** - Type safety in frontend
3. **ESLint** - Code linting
4. **Code Organization** - Clear folder structure
5. **Error Handling** - Centralized error management
6. **Documentation** - Comprehensive guides
7. **Git Workflow** - Feature branches and PRs
8. **Security** - Helmet, CORS, input sanitization

I also follow best practices like DRY (Don't Repeat Yourself) and SOLID principles."

---

### **Q10: How would you scale this application?**

**Answer:**
"To scale this application:

**Backend:**
1. **Horizontal Scaling** - Deploy multiple server instances
2. **Load Balancer** - Distribute traffic (Nginx, AWS ALB)
3. **Database Sharding** - Split MongoDB across servers
4. **Caching** - Redis for frequently accessed data
5. **CDN** - Cloudinary for images
6. **Microservices** - Split into smaller services (auth, posts, etc.)

**Frontend:**
1. **Code Splitting** - Load only needed code
2. **Image Optimization** - Next.js Image component
3. **Static Generation** - Pre-render pages
4. **CDN** - Vercel Edge Network

**Infrastructure:**
1. **Containerization** - Docker for consistent deployment
2. **Orchestration** - Kubernetes for managing containers
3. **Monitoring** - Application performance monitoring
4. **Auto-scaling** - Scale based on traffic"

---

## 🎯 Key Takeaways for Interviews

### **When Asked About Architecture:**

1. **Start with high-level** - "3-tier architecture with MVC pattern"
2. **Explain each layer** - Frontend, Backend, Database
3. **Mention design patterns** - MVC, Middleware, Redux
4. **Show understanding** - Why you chose this architecture
5. **Discuss trade-offs** - Pros and cons of your choices

### **When Asked About Technology Choices:**

1. **Justify each choice** - Why Next.js? Why MongoDB?
2. **Show alternatives** - "I chose X over Y because..."
3. **Discuss trade-offs** - What you gain and what you lose
4. **Show learning** - What you learned from using these technologies

### **When Asked About Scalability:**

1. **Current architecture** - How it's built now
2. **Bottlenecks** - What would break first
3. **Solutions** - How to fix those bottlenecks
4. **Future improvements** - What you would do differently

---

## 📚 Additional Resources

- [MVC Pattern Explained](https://www.freecodecamp.org/news/the-model-view-controller-pattern-mvc-architecture-and-frameworks-explained/)
- [3-Tier Architecture](https://www.ibm.com/topics/three-tier-architecture)
- [REST API Design](https://restfulapi.net/)
- [Redux Architecture](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)
- [Next.js Architecture](https://nextjs.org/docs/app/building-your-application/routing)

---

**Created for:** Interview Preparation  
**Last Updated:** April 2026  
**Project:** Social Media Application
