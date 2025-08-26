// Global error handling middleware
export const errorHandler = (error, req, res, next) => {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors,
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'Please provide a valid token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'Please login again',
    });
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

// Async error wrapper for routes
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class for application errors
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 error handler
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

// Custom validation error class
export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
    this.statusCode = 400;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}