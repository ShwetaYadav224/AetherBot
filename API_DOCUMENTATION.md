# AetherBot API Documentation

## Base URL
```
https://your-backend-domain.com/api
```

## Authentication
All endpoints except auth endpoints require JWT authentication via Bearer token.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Authentication Endpoints

### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token"
}
```

**Validation Rules:**
- Username: 3-30 alphanumeric characters
- Email: Valid email format
- Password: Minimum 6 characters

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token"
}
```

### GET /api/auth/profile
Get current user profile (requires authentication).

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/logout
Logout user (client-side token removal).

**Response:**
```json
{
  "message": "Logout successful"
}
```

## Chat Endpoints

### GET /api/thread
Get all threads for authenticated user.

**Response:**
```json
[
  {
    "_id": "thread_id",
    "threadId": "thread-123",
    "title": "Conversation about AI",
    "userId": "user_id",
    "messages": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/thread/:threadId
Get messages for a specific thread.

**Response:**
```json
[
  {
    "role": "user",
    "content": "Hello, how are you?",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  {
    "role": "assistant",
    "content": "I'm doing well, thank you!",
    "timestamp": "2024-01-01T00:00:01.000Z"
  }
]
```

### POST /api/chat
Send a message and get AI response.

**Request Body:**
```json
{
  "threadId": "thread-123",
  "message": "Hello, how are you?"
}
```

**Validation Rules:**
- threadId: Maximum 100 characters
- message: 1-5000 characters

**Response:**
```json
{
  "reply": "I'm doing well, thank you for asking!"
}
```

### DELETE /api/thread/:threadId
Delete a specific thread.

**Response:**
```json
{
  "success": "Thread deleted successfully"
}
```

## System Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345.67,
  "environment": "production"
}
```

### GET /api/cache/stats
Get cache statistics (for monitoring).

**Response:**
```json
{
  "cacheSize": 42,
  "maxCacheSize": 1000,
  "cacheTTL": 3600000,
  "cacheHitRate": "N/A"
}
```

### DELETE /api/cache
Clear response cache (debugging only).

**Response:**
```json
{
  "message": "Cache cleared successfully"
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message",
  "details": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

### Common HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Validation error or invalid input
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

- Production: 100 requests per 15 minutes per IP
- Development: 1000 requests per 15 minutes per IP
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

## Security Headers

The API includes security headers via Helmet:
- Content Security Policy
- XSS Protection
- No Sniff
- Frame Options
- HSTS (in production)

## CORS Configuration

- Allowed origins: Configured via `FRONTEND_URL` environment variable
- Default: `http://localhost:5173`
- Credentials: Enabled

## Data Validation

### Input Validation
- Joi schema validation for request bodies
- Express-validator for sanitization
- Parameter validation for URL parameters

### Validation Error Example
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password", 
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

## Pagination and Filtering

Currently not implemented. All endpoints return complete data sets. Consider implementing pagination for large datasets in future versions.

## WebSocket Support

Not currently implemented. Consider adding real-time features using Socket.io for future versions.

## Versioning

API versioning not currently implemented. Consider adding version prefix (e.g., `/api/v1/`) for future breaking changes.

## Monitoring Endpoints

- Health check: `/health`
- Cache statistics: `/api/cache/stats`
- Application logs: Check server logs directory
- Performance metrics: Use APM tools

This documentation covers the current API implementation. Always refer to the latest source code for the most up-to-date information.