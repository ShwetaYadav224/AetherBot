import Joi from 'joi';
import { validationResult, body } from 'express-validator';
import { ValidationError } from './errorHandler.js';

// Joi validation schemas
export const authValidationSchemas = {
  signup: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username must only contain letters and numbers',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 100 characters',
        'any.required': 'Password is required'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })
};

export const chatValidationSchemas = {
  chat: Joi.object({
    threadId: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.max': 'Thread ID cannot exceed 100 characters',
        'any.required': 'Thread ID is required'
      }),
    message: Joi.string()
      .min(1)
      .max(5000)
      .required()
      .messages({
        'string.min': 'Message cannot be empty',
        'string.max': 'Message cannot exceed 5000 characters',
        'any.required': 'Message is required'
      })
  }),

  threadId: Joi.object({
    threadId: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.max': 'Thread ID cannot exceed 100 characters',
        'any.required': 'Thread ID is required'
      })
  })
};

// Express-validator sanitization rules
export const sanitizationRules = {
  signup: [
    body('username')
      .trim()
      .escape()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3-30 characters')
      .isAlphanumeric()
      .withMessage('Username must contain only letters and numbers'),
    body('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],

  login: [
    body('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],

  chat: [
    body('threadId')
      .trim()
      .escape()
      .isLength({ max: 100 })
      .withMessage('Thread ID cannot exceed 100 characters'),
    body('message')
      .trim()
      .escape()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Message must be between 1-5000 characters')
  ]
};

// Joi validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      throw new ValidationError('Validation failed', errors);
    }
    
    next();
  };
};

// Express-validator middleware
export const validateWithExpressValidator = (rules) => {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }));
        
        throw new ValidationError('Validation failed', formattedErrors);
      }
      next();
    }
  ];
};

// Combined validation middleware (Joi + express-validator)
export const combinedValidation = (joiSchema, expressValidatorRules) => {
  return [
    validateWithExpressValidator(expressValidatorRules),
    validate(joiSchema)
  ];
};