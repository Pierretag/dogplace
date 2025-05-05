import { Pool, PoolClient } from 'pg';
import { Place, CreatePlaceInput, UpdatePlaceInput } from '../types/place.types';
import { PaginationParams, PaginatedResult } from '../types/common.types';
import { calculatePagination, createPaginatedResult } from '../utils/pagination';
import { logger } from '../utils/logger';

/**
 * Create a new place
 * @param pool Database pool
 * @param input Place input
 * @returns Created place
 */
export const createPlace = async (
  pool: Pool | PoolClient,
  input: Omit<Place, 'id' | 'created_at'>
): Promise<Place> => {
  const {
    coordinate_id,
    name,
    address,
    category,
    sub_category,
    pet_classification,
    map_nbreviews,
    map_rating,
    map_pricelevel,
    map_url,
    map_place_id,
    updated_at,
    status = 'active',
  } = input;
  
  try {
    const result = await pool.query(
      `INSERT INTO places (
        coordinate_id, name, address, category, sub_category, pet_classification,
        map_nbreviews, map_rating, map_pricelevel, map_url, map_place_id, updated_at, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING *`,
      [
        coordinate_id,
        name,
        address,
        category,
        sub_category,
        pet_classification,
        map_nbreviews,
        map_rating,
        map_pricelevel,
        map_url,
        map_place_id,
        updated_at,
        status,
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating place', { error, input });
    throw error;
  }
};

/**
 * Get a place by ID
 * @param pool Database pool
 * @param id Place ID
 * @returns Place or null if not found
 */
export const getPlaceById = async (
  pool: Pool | PoolClient,
  id: string
): Promise<Place | null> => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.latitude, c.longitude 
       FROM places p
       JOIN coordinates c ON p.coordinate_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error getting place by ID', { error, id });
    throw error;
  }
};

/**
 * Get all places with pagination
 * @param pool Database pool
 * @param pagination Pagination parameters
 * @returns Paginated places
 */
export const getPlaces = async (
  pool: Pool | PoolClient,
  pagination: PaginationParams
): Promise<PaginatedResult<Place>> => {
  const { page, limit } = pagination;
  
  try {
    // Get the total count
    const countResult = await pool.query('SELECT COUNT(*) FROM places');
    const total = parseInt(countResult.rows[0].count, 10);
    
    // Calculate pagination values
    const { offset, totalPages } = calculatePagination(page, limit, total);
    
    // Get the places
    const result = await pool.query(
      `SELECT p.*, c.latitude, c.longitude 
       FROM places p
       JOIN coordinates c ON p.coordinate_id = c.id
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    return createPaginatedResult(result.rows, total, page, limit);
  } catch (error) {
    logger.error('Error getting places', { error, pagination });
    throw error;
  }
};

/**
 * Update a place
 * @param pool Database pool
 * @param id Place ID
 * @param input Place update input
 * @returns Updated place or null if not found
 */
export const updatePlace = async (
  pool: Pool | PoolClient,
  id: string,
  input: UpdatePlaceInput
): Promise<Place | null> => {
  // Create the SET clause for the SQL query
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;
  
  // Add each field to the updates array if it exists in the input
  if (input.name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(input.name);
  }
  
  if (input.address !== undefined) {
    updates.push(`address = $${paramIndex++}`);
    values.push(input.address);
  }
  
  if (input.category !== undefined) {
    updates.push(`category = $${paramIndex++}`);
    values.push(input.category);
  }
  
  if (input.sub_category !== undefined) {
    updates.push(`sub_category = $${paramIndex++}`);
    values.push(input.sub_category);
  }
  
  if (input.pet_classification !== undefined) {
    updates.push(`pet_classification = $${paramIndex++}`);
    values.push(input.pet_classification);
  }
  
  if (input.map_nbreviews !== undefined) {
    updates.push(`map_nbreviews = $${paramIndex++}`);
    values.push(input.map_nbreviews);
  }
  
  if (input.map_rating !== undefined) {
    updates.push(`map_rating = $${paramIndex++}`);
    values.push(input.map_rating);
  }
  
  if (input.map_pricelevel !== undefined) {
    updates.push(`map_pricelevel = $${paramIndex++}`);
    values.push(input.map_pricelevel);
  }
  
  if (input.map_url !== undefined) {
    updates.push(`map_url = $${paramIndex++}`);
    values.push(input.map_url);
  }
  
  if (input.map_place_id !== undefined) {
    updates.push(`map_place_id = $${paramIndex++}`);
    values.push(input.map_place_id);
  }
  
  if (input.status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    values.push(input.status);
  }
  
  // Always update the updated_at field
  updates.push(`updated_at = $${paramIndex++}`);
  values.push(new Date());
  
  // Add the ID to the values array
  values.push(id);
  
  // If there are no updates, return null
  if (updates.length === 0) {
    return null;
  }
  
  try {
    const result = await pool.query(
      `UPDATE places 
       SET ${updates.join(', ')} 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      values
    );
    
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error updating place', { error, id, input });
    throw error;
  }
};

/**
 * Delete a place
 * @param pool Database pool
 * @param id Place ID
 * @returns Whether the place was deleted
 */
export const deletePlace = async (
  pool: Pool | PoolClient,
  id: string
): Promise<boolean> => {
  try {
    const result = await pool.query(
      'DELETE FROM places WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    logger.error('Error deleting place', { error, id });
    throw error;
  }
};

/**
 * Search places
 * @param pool Database pool
 * @param filters Search filters
 * @param pagination Pagination parameters
 * @returns Paginated places
 */
export const searchPlaces = async (
  pool: Pool | PoolClient,
  filters: Record<string, any>,
  pagination: PaginationParams
): Promise<PaginatedResult<Place>> => {
  const { page, limit } = pagination;
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;
  
  // Add each filter to the conditions array if it exists
  if (filters.category) {
    conditions.push(`p.category = $${paramIndex++}`);
    values.push(filters.category);
  }
  
  if (filters.sub_category) {
    conditions.push(`p.sub_category = $${paramIndex++}`);
    values.push(filters.sub_category);
  }
  
  if (filters.pet_classification) {
    conditions.push(`p.pet_classification = $${paramIndex++}`);
    values.push(filters.pet_classification);
  }
  
  if (filters.status) {
    conditions.push(`p.status = $${paramIndex++}`);
    values.push(filters.status);
  }
  
  if (filters.name) {
    conditions.push(`p.name ILIKE $${paramIndex++}`);
    values.push(`%${filters.name}%`);
  }
  
  if (filters.address) {
    conditions.push(`p.address ILIKE $${paramIndex++}`);
    values.push(`%${filters.address}%`);
  }
  
  // Create the WHERE clause
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  try {
    // Get the total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM places p ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count, 10);
    
    // Calculate pagination values
    const { offset, totalPages } = calculatePagination(page, limit, total);
    
    // Add pagination parameters to the values array
    values.push(limit);
    values.push(offset);
    
    // Get the places
    const result = await pool.query(
      `SELECT p.*, c.latitude, c.longitude 
       FROM places p
       JOIN coordinates c ON p.coordinate_id = c.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      values
    );
    
    return createPaginatedResult(result.rows, total, page, limit);
  } catch (error) {
    logger.error('Error searching places', { error, filters, pagination });
    throw error;
  }
};
