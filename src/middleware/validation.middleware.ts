import { Context, Next } from 'koa';
import { badRequest } from './error.middleware';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Validation function type
 */
export type ValidationFunction<T> = (data: T) => ValidationResult;

/**
 * Create a validation middleware
 * @param validator Validation function
 * @param source Source of the data to validate (body, query, params)
 * @returns Validation middleware
 */
export const validate = <T>(
  validator: ValidationFunction<T>,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return async (ctx: Context, next: Next): Promise<void> => {
    let data: any;

    // Get the data from the specified source
    switch (source) {
      case 'body':
        data = ctx.request.body;
        break;
      case 'query':
        data = ctx.query;
        break;
      case 'params':
        data = ctx.params;
        break;
      default:
        data = ctx.request.body;
    }

    // Validate the data
    const result = validator(data as T);

    // If validation fails, throw a bad request error
    if (!result.valid) {
      throw badRequest('Validation failed', result.errors);
    }

    // Continue to the next middleware
    await next();
  };
};

/**
 * Validate a place creation request
 * @param data Place creation data
 * @returns Validation result
 */
export const validateCreatePlace = (data: any): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  } else if (data.name.length > 255) {
    errors.push('Name must be less than 255 characters');
  }

  if (!data.address || data.address.trim() === '') {
    errors.push('Address is required');
  }

  if (!data.category || data.category.trim() === '') {
    errors.push('Category is required');
  } else if (data.category.length > 200) {
    errors.push('Category must be less than 200 characters');
  }

  if (!data.sub_category || data.sub_category.trim() === '') {
    errors.push('Sub-category is required');
  } else if (data.sub_category.length > 200) {
    errors.push('Sub-category must be less than 200 characters');
  }

  if (!data.pet_classification || data.pet_classification.trim() === '') {
    errors.push('Pet classification is required');
  } else if (data.pet_classification.length > 200) {
    errors.push('Pet classification must be less than 200 characters');
  }

  // Coordinate validation
  if (data.latitude === undefined || data.latitude === null) {
    errors.push('Latitude is required');
  } else if (isNaN(Number(data.latitude))) {
    errors.push('Latitude must be a number');
  }

  if (data.longitude === undefined || data.longitude === null) {
    errors.push('Longitude is required');
  } else if (isNaN(Number(data.longitude))) {
    errors.push('Longitude must be a number');
  }

  // Optional fields
  if (data.map_nbreviews !== undefined && data.map_nbreviews !== null) {
    if (isNaN(Number(data.map_nbreviews))) {
      errors.push('Map number of reviews must be a number');
    }
  }

  if (data.map_rating !== undefined && data.map_rating !== null) {
    if (isNaN(Number(data.map_rating))) {
      errors.push('Map rating must be a number');
    }
  }

  if (data.map_pricelevel !== undefined && data.map_pricelevel !== null) {
    if (isNaN(Number(data.map_pricelevel))) {
      errors.push('Map price level must be a number');
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
};

/**
 * Validate a place update request
 * @param data Place update data
 * @returns Validation result
 */
export const validateUpdatePlace = (data: any): ValidationResult => {
  const errors: string[] = [];

  // Optional fields with validation
  if (data.name !== undefined) {
    if (data.name.trim() === '') {
      errors.push('Name cannot be empty');
    } else if (data.name.length > 255) {
      errors.push('Name must be less than 255 characters');
    }
  }

  if (data.address !== undefined && data.address.trim() === '') {
    errors.push('Address cannot be empty');
  }

  if (data.category !== undefined) {
    if (data.category.trim() === '') {
      errors.push('Category cannot be empty');
    } else if (data.category.length > 200) {
      errors.push('Category must be less than 200 characters');
    }
  }

  if (data.sub_category !== undefined) {
    if (data.sub_category.trim() === '') {
      errors.push('Sub-category cannot be empty');
    } else if (data.sub_category.length > 200) {
      errors.push('Sub-category must be less than 200 characters');
    }
  }

  if (data.pet_classification !== undefined) {
    if (data.pet_classification.trim() === '') {
      errors.push('Pet classification cannot be empty');
    } else if (data.pet_classification.length > 200) {
      errors.push('Pet classification must be less than 200 characters');
    }
  }

  // Coordinate validation
  if (data.latitude !== undefined && isNaN(Number(data.latitude))) {
    errors.push('Latitude must be a number');
  }

  if (data.longitude !== undefined && isNaN(Number(data.longitude))) {
    errors.push('Longitude must be a number');
  }

  // Optional fields
  if (data.map_nbreviews !== undefined && isNaN(Number(data.map_nbreviews))) {
    errors.push('Map number of reviews must be a number');
  }

  if (data.map_rating !== undefined && isNaN(Number(data.map_rating))) {
    errors.push('Map rating must be a number');
  }

  if (data.map_pricelevel !== undefined && isNaN(Number(data.map_pricelevel))) {
    errors.push('Map price level must be a number');
  }

  if (data.status !== undefined && !['active', 'inactive'].includes(data.status)) {
    errors.push('Status must be either "active" or "inactive"');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
};

/**
 * Validate search parameters
 * @param data Search parameters
 * @returns Validation result
 */
/**
 * Validate bulk import request
 * @param data Bulk import data
 * @returns Validation result
 */
export const validateBulkImport = (data: any): ValidationResult => {
  const errors: string[] = [];

  // Check if restaurants array exists
  if (!data.restaurants || !Array.isArray(data.restaurants)) {
    errors.push('Restaurants array is required');
    return {
      valid: false,
      errors
    };
  }

  // Validate each restaurant
  data.restaurants.forEach((restaurant: any, index: number) => {
    if (!restaurant.place_id) {
      errors.push(`Restaurant at index ${index}: place_id is required`);
    }
    if (!restaurant.name) {
      errors.push(`Restaurant at index ${index}: name is required`);
    }
    if (!restaurant.coordinates || 
        typeof restaurant.coordinates.latitude !== 'number' || 
        typeof restaurant.coordinates.longitude !== 'number') {
      errors.push(`Restaurant at index ${index}: valid coordinates (latitude and longitude) are required`);
    }
    if (!restaurant.address) {
      errors.push(`Restaurant at index ${index}: address is required`);
    }
    if (typeof restaurant.reviews !== 'number') {
      errors.push(`Restaurant at index ${index}: reviews must be a number`);
    }
    if (typeof restaurant.rating !== 'number') {
      errors.push(`Restaurant at index ${index}: rating must be a number`);
    }
    if (!restaurant.link) {
      errors.push(`Restaurant at index ${index}: link is required`);
    }
    if (!Array.isArray(restaurant.about)) {
      errors.push(`Restaurant at index ${index}: about must be an array`);
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
};

export const validateSearchParams = (data: any): ValidationResult => {
  const errors: string[] = [];

  // Pagination validation
  if (data.page !== undefined) {
    const page = parseInt(data.page as string, 10);
    if (isNaN(page) || page < 1) {
      errors.push('Page must be a positive number');
    }
  }

  if (data.limit !== undefined) {
    const limit = parseInt(data.limit as string, 10);
    if (isNaN(limit) || limit < 1) {
      errors.push('Limit must be a positive number');
    }
  }

  // Filter validation
  if (data.category !== undefined && data.category.trim() === '') {
    errors.push('Category cannot be empty');
  }

  if (data.sub_category !== undefined && data.sub_category.trim() === '') {
    errors.push('Sub-category cannot be empty');
  }

  if (data.pet_classification !== undefined && data.pet_classification.trim() === '') {
    errors.push('Pet classification cannot be empty');
  }

  if (data.status !== undefined && !['active', 'inactive'].includes(data.status)) {
    errors.push('Status must be either "active" or "inactive"');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
};
