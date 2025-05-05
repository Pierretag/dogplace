import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Environment configuration
 */
export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '8000', 10),
  environment: process.env.ENVIRONMENT || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/dogplace',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
  },
};

/**
 * Check if the application is running in development mode
 */
export const isDevelopment = (): boolean => {
  return config.environment === 'development';
};

/**
 * Check if the application is running in production mode
 */
export const isProduction = (): boolean => {
  return config.environment === 'production';
};

/**
 * Check if the application is running in test mode
 */
export const isTest = (): boolean => {
  return config.environment === 'test';
};
