import { Pool, PoolClient } from 'pg';
import { Coordinate, CreateCoordinateInput } from '../types/coordinate.types';
import { logger } from '../utils/logger';

/**
 * Create a new coordinate
 * @param pool Database pool
 * @param input Coordinate input
 * @returns Created coordinate
 */
export const createCoordinate = async (
  pool: Pool | PoolClient,
  input: CreateCoordinateInput
): Promise<Coordinate> => {
  const { latitude, longitude } = input;
  
  try {
    const result = await pool.query(
      `INSERT INTO coordinates (latitude, longitude) 
       VALUES ($1, $2) 
       RETURNING *`,
      [latitude, longitude]
    );
    
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating coordinate', { error, input });
    throw error;
  }
};

/**
 * Get a coordinate by ID
 * @param pool Database pool
 * @param id Coordinate ID
 * @returns Coordinate or null if not found
 */
export const getCoordinateById = async (
  pool: Pool | PoolClient,
  id: string
): Promise<Coordinate | null> => {
  try {
    const result = await pool.query(
      'SELECT * FROM coordinates WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error getting coordinate by ID', { error, id });
    throw error;
  }
};

/**
 * Update a coordinate
 * @param pool Database pool
 * @param id Coordinate ID
 * @param input Coordinate input
 * @returns Updated coordinate
 */
export const updateCoordinate = async (
  pool: Pool | PoolClient,
  id: string,
  input: CreateCoordinateInput
): Promise<Coordinate | null> => {
  const { latitude, longitude } = input;
  
  try {
    const result = await pool.query(
      `UPDATE coordinates 
       SET latitude = $1, longitude = $2 
       WHERE id = $3 
       RETURNING *`,
      [latitude, longitude, id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error updating coordinate', { error, id, input });
    throw error;
  }
};

/**
 * Delete a coordinate
 * @param pool Database pool
 * @param id Coordinate ID
 * @returns Whether the coordinate was deleted
 */
export const deleteCoordinate = async (
  pool: Pool | PoolClient,
  id: string
): Promise<boolean> => {
  try {
    const result = await pool.query(
      'DELETE FROM coordinates WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    logger.error('Error deleting coordinate', { error, id });
    throw error;
  }
};
