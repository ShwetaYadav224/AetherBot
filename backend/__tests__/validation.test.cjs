const { authValidationSchemas, chatValidationSchemas, validate } = require('../middleware/validation.js');

describe('Validation Middleware', () => {
  describe('Auth Validation Schemas', () => {
    test('should validate valid signup data', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const { error } = authValidationSchemas.signup.validate(validData);
      expect(error).toBeUndefined();
    });

    test('should reject invalid email in signup', () => {
      const invalidData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const { error } = authValidationSchemas.signup.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('valid email address');
    });

    test('should reject short password in signup', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'short'
      };

      const { error } = authValidationSchemas.signup.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('at least 6 characters');
    });

    test('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const { error } = authValidationSchemas.login.validate(validData);
      expect(error).toBeUndefined();
    });

    test('should reject missing email in login', () => {
      const invalidData = {
        password: 'password123'
      };

      const { error } = authValidationSchemas.login.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('Email is required');
    });
  });

  describe('Chat Validation Schemas', () => {
    test('should validate valid chat data', () => {
      const validData = {
        threadId: 'thread-123',
        message: 'Hello, how are you?'
      };

      const { error } = chatValidationSchemas.chat.validate(validData);
      expect(error).toBeUndefined();
    });

    test('should reject empty message in chat', () => {
      const invalidData = {
        threadId: 'thread-123',
        message: ''
      };

      const { error } = chatValidationSchemas.chat.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('cannot be empty');
    });

    test('should reject long threadId', () => {
      const invalidData = {
        threadId: 'a'.repeat(101),
        message: 'Hello'
      };

      const { error } = chatValidationSchemas.chat.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('exceed 100 characters');
    });
  });
});