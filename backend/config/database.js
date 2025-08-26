import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required');
}

const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 5;

export const connectDB = async () => {
  if (isConnected) {
    console.log('Database already connected');
    return;
  }

  try {
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    
    isConnected = true;
    connectionAttempts = 0;
    
    console.log('✅ MongoDB connected successfully');
    
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
});