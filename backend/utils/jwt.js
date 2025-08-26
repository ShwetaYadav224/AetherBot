import jwt from 'jsonwebtoken';

// Function to get JWT config - checks environment variables when called
const getJwtConfig = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return { JWT_SECRET, JWT_EXPIRES_IN };
};

export const generateToken = (payload) => {
  const { JWT_SECRET, JWT_EXPIRES_IN } = getJwtConfig();
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  try {
    const { JWT_SECRET } = getJwtConfig();
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Invalid token');
  }
};