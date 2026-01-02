import mongoose from 'mongoose';

const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

let isConnected = false;
let connectionAttempts = 0;
let mongoServer = null;
const MAX_RETRIES = 3;

// Try to use MongoDB Memory Server for local development
const startMemoryServer = async () => {
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    console.log('Starting MongoDB Memory Server for local development...');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log('MongoDB Memory Server started');
    return uri;
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error);
    throw error;
  }
};

export const connectDB = async () => {
  let MONGODB_URI = process.env.MONGODB_URI;

  if (isConnected) {
    console.log('Database already connected');
    return;
  }

  // If no URI or it looks like a placeholder, use memory server
  const useMemoryServer = !MONGODB_URI ||
    MONGODB_URI.includes('your-') ||
    MONGODB_URI.includes('placeholder') ||
    process.env.USE_MEMORY_DB === 'true';

  if (useMemoryServer) {
    console.log('No valid MONGODB_URI found, using in-memory database');
    MONGODB_URI = await startMemoryServer();
  }

  try {
    console.log('Connecting to MongoDB...');

    await mongoose.connect(MONGODB_URI, mongooseOptions);

    isConnected = true;
    connectionAttempts = 0;

    console.log('MongoDB connected successfully');

    // Event listeners for connection issues
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      isConnected = true;
    });

  } catch (error) {
    connectionAttempts++;

    // If main connection fails and we haven't tried memory server yet, try it
    if (!mongoServer && connectionAttempts === 1) {
      console.log('Primary connection failed, falling back to in-memory database...');
      try {
        MONGODB_URI = await startMemoryServer();
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        isConnected = true;
        console.log('MongoDB Memory Server connected successfully');
        return;
      } catch (memError) {
        console.error('Memory server fallback also failed:', memError);
      }
    }

    if (connectionAttempts >= MAX_RETRIES) {
      console.error('Failed to connect to MongoDB after maximum retries:', error);
      throw error;
    }

    console.warn(`MongoDB connection attempt ${connectionAttempts} failed, retrying in 5 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    return connectDB();
  }
};

export const getConnectionStatus = () => ({
  isConnected,
  connectionAttempts,
  maxRetries: MAX_RETRIES,
  usingMemoryServer: !!mongoServer,
});