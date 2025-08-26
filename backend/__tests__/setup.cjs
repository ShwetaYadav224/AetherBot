// Test setup file - CommonJS version

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.MONGODB_URI = 'mongodb://localhost:27017/aetherbot-test';
process.env.PORT = '3002';

// Global test setup
beforeAll(async () => {
  // Setup code if needed
});

afterAll(async () => {
  // Cleanup code if needed
});

// Global test teardown
afterEach(async () => {
  // Clean up after each test
  jest.clearAllMocks();
});