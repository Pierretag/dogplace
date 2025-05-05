import { Context, Next } from 'koa';
import { logger } from '../utils/logger';
import { ErrorResponse } from '../types/common.types';

/**
 * Error handling middleware
 * @param ctx Koa context
 * @param next Next middleware
 */
export const errorMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (error: any) {
    // Log the error
    logger.error('Request error', {
      error: error.message,
      stack: error.stack,
      path: ctx.path,
      method: ctx.method,
    });

    // Set the status code
    ctx.status = error.status || error.statusCode || 500;

    // Create the error response
    const errorResponse: ErrorResponse = {
      error: error.message || 'Internal Server Error',
      status: ctx.status,
    };

    // Add details if available
    if (error.details) {
      errorResponse.details = Array.isArray(error.details)
        ? error.details
        : [error.details];
    }

    // Set the response body
    ctx.body = errorResponse;

    // Emit the error event
    ctx.app.emit('error', error, ctx);
  }
};

/**
 * Custom error class with status code
 */
export class ApiError extends Error {
  status: number;
  details?: string[];

  /**
   * Create a new API error
   * @param message Error message
   * @param status HTTP status code
   * @param details Error details
   */
  constructor(message: string, status: number = 500, details?: string[]) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create a not found error
 * @param message Error message
 * @returns API error
 */
export const notFound = (message: string = 'Resource not found'): ApiError => {
  return new ApiError(message, 404);
};

/**
 * Create a bad request error
 * @param message Error message
 * @param details Error details
 * @returns API error
 */
export const badRequest = (message: string = 'Bad request', details?: string[]): ApiError => {
  return new ApiError(message, 400, details);
};

/**
 * Create an unauthorized error
 * @param message Error message
 * @returns API error
 */
export const unauthorized = (message: string = 'Unauthorized'): ApiError => {
  return new ApiError(message, 401);
};

/**
 * Create a forbidden error
 * @param message Error message
 * @returns API error
 */
export const forbidden = (message: string = 'Forbidden'): ApiError => {
  return new ApiError(message, 403);
};

/**
 * Create an internal server error
 * @param message Error message
 * @returns API error
 */
export const internalServerError = (message: string = 'Internal server error'): ApiError => {
  return new ApiError(message, 500);
};
