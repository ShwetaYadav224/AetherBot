# AetherBot Authentication System Integration

## Overview

This document provides comprehensive documentation for the JWT authentication system integrated into the AetherBot MERN stack application. The system includes signup, login, and protected route functionality with TailwindCSS styling.

## Backend Authentication Setup

### Dependencies Added
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation and verification

### Files Created/Modified

#### 1. User Model (`backend/models/User.js`)
- MongoDB schema for user authentication
- Password hashing with bcrypt
- Password comparison method
- Email and username validation

#### 2. JWT Utilities (`backend/utils/jwt.js`)
- Token generation with configurable expiration
- Token verification middleware
- Secret key management via environment variables

#### 3. Authentication Middleware (`backend/middleware/auth.js`)
- `authenticateToken` - Verifies JWT tokens and attaches user to request
- `optionalAuth` - Optional authentication for public routes

#### 4. Authentication Routes (`backend/routes/auth.js`)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - Logout (client-side token removal)

#### 5. Thread Model Update (`backend/models/Thread.js`)
- Added `userId` field to associate threads with authenticated users

#### 6. Chat Routes Update (`backend/routes/chat.js`)
- Added authentication middleware to all chat routes
- Thread operations now require user authentication
- Threads are filtered by authenticated user

#### 7. Server Configuration (`backend/server.js`)
- Added authentication routes at `/api/auth`
- Updated environment variables for JWT configuration

### Environment Variables
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

## Frontend Authentication Setup

### Dependencies Added
- `react-router-dom` - Client-side routing
- `@tailwindcss/vite` - TailwindCSS v4 integration

### Files Created/Modified

#### 1. Authentication Context (`frontend/src/AuthContext.jsx`)
- Global state management for authentication
- Token storage in localStorage
- Login, signup, and logout functions
- Automatic token verification on app load

#### 2. Signup Component (`frontend/src/components/Signup.jsx`)
- User registration form with validation
- TailwindCSS styling with gradient backgrounds
- Error handling and loading states

#### 3. Login Component (`frontend/src/components/Login.jsx`)
- User authentication form
- Remember me functionality
- Password recovery option
- TailwindCSS styling

#### 4. Protected Route Component (`frontend/src/components/ProtectedRoute.jsx`)
- Route protection wrapper
- Automatic redirect to login for unauthenticated users
- Loading states during authentication check

#### 5. App Component Update (`frontend/src/App.jsx`)
- Integrated authentication provider
- Route configuration with protected routes
- Automatic redirect based on authentication status

#### 6. ChatApp Component (`frontend/src/ChatApp.jsx`)
- Wrapper for existing chat functionality
- Maintains compatibility with existing context

#### 7. Vite Configuration (`frontend/vite.config.js`)
- Added TailwindCSS v4 Vite plugin
- Removed PostCSS configuration (not needed for v4)

#### 8. CSS Update (`frontend/src/index.css`)
- Updated to use TailwindCSS v4 import syntax
- Custom utility classes for consistent styling

## Authentication Flow

### 1. User Registration
1. User visits `/signup` page
2. Fills out registration form (username, email, password)
3. Form validation ensures data integrity
4. Backend creates user with hashed password
5. JWT token generated and returned
6. User redirected to chat interface

### 2. User Login
1. User visits `/login` page
2. Enters email and password
3. Backend validates credentials
4. JWT token generated and returned
5. Token stored in localStorage
6. User redirected to chat interface

### 3. Protected Routes
1. All chat routes require authentication
2. Unauthenticated users redirected to login
3. Token automatically verified on page load
4. Expired tokens trigger automatic logout

### 4. Thread Management
1. All chat threads are associated with user IDs
2. Users can only access their own threads
3. Thread operations require valid authentication

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/profile` - Get current user info
- `POST /api/auth/logout` - Logout user

### Protected Chat Endpoints
- `GET /api/thread` - Get user's threads
- `GET /api/thread/:threadId` - Get specific thread
- `DELETE /api/thread/:threadId` - Delete thread
- `POST /api/chat` - Send message and get AI response

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- Protected routes with authentication middleware
- Input validation on both frontend and backend
- CORS configuration for secure cross-origin requests

## Integration Notes

1. The authentication system is designed to be modular and can be easily integrated into existing projects
2. All existing chat functionality remains intact but now requires authentication
3. Users can only access their own chat threads and history
4. The system uses localStorage for token persistence
5. TailwindCSS v4 is used for consistent styling

## Setup Instructions

1. Install backend dependencies: `cd backend && npm install`
2. Install frontend dependencies: `cd frontend && npm install`
3. Add JWT secret to backend `.env` file
4. Start backend server: `npm start`
5. Start frontend development server: `npm run dev`

## Testing

The authentication system includes comprehensive error handling and can be tested by:
1. Creating a new user account
2. Logging in with valid credentials
3. Testing protected routes without authentication
4. Verifying thread ownership restrictions
5. Testing token expiration and renewal

This authentication system provides a secure, scalable foundation for the AetherBot application with modern best practices for user authentication and session management.