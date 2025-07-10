import { Pool, PoolClient } from 'pg';
import { Rating, CreateRatingInput, LatestRating } from '../types/rating.types';
import { logger } from '../utils/logger';

/**
 * Create a new rating
 * @param pool Database pool
 * @param input Rating input
 * @returns Created rating
 */
export const createRating = async (
  pool: Pool | PoolClient,
  input: CreateRatingInput
): Promise<Rating> => {
  const {
    place_id,
    rating,
    nb_reviews,
    date = new Date(),
    source = 'google_maps',
  } = input;
  
  try {
    const result = await pool.query(
      `INSERT INTO ratings (
        place_id, rating, nb_reviews, date, source
      ) VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [place_id, rating, nb_reviews, date, source]
    );
    
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating rating', { error, input });
    throw error;
  }
};

/**
 * Get the latest rating for a place
 * @param pool Database pool
 * @param placeId Place ID
 * @returns Latest rating or null if not found
 */
export const getLatestRating = async (
  pool: Pool | PoolClient,
  placeId: string
): Promise<LatestRating | null> => {
  try {
    const result = await pool.query(
      `SELECT rating, nb_reviews, date
       FROM ratings
       WHERE place_id = $1
       ORDER BY date DESC
       LIMIT 1`,
      [placeId]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error getting latest rating', { error, placeId });
    throw error;
  }
};

/**
 * Get all ratings for a place
 * @param pool Database pool
 * @param placeId Place ID
 * @returns Array of ratings
 */
export const getRatingsForPlace = async (
  pool: Pool | PoolClient,
  placeId: string
): Promise<Rating[]> => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM ratings
       WHERE place_id = $1
       ORDER BY date DESC`,
      [placeId]
    );
    
    return result.rows;
  } catch (error) {
    logger.error('Error getting ratings for place', { error, placeId });
    throw error;
  }
};

/**
 * Get the latest rating for multiple places
 * @param pool Database pool
 * @param placeIds Array of place IDs
 * @returns Map of place IDs to their latest ratings
 */
export const getLatestRatingsForPlaces = async (
  pool: Pool | PoolClient,
  placeIds: string[]
): Promise<Map<string, LatestRating>> => {
  try {
    const result = await pool.query(
      `WITH LatestRatings AS (
        SELECT DISTINCT ON (place_id)
          place_id,
          rating,
          nb_reviews,
          date
        FROM ratings
        WHERE place_id = ANY($1)
        ORDER BY place_id, date DESC
      )
      SELECT * FROM LatestRatings`,
      [placeIds]
    );
    
    const ratingsMap = new Map<string, LatestRating>();
    result.rows.forEach(row => {
      ratingsMap.set(row.place_id, {
        rating: row.rating,
        nb_reviews: row.nb_reviews,
        date: row.date
      });
    });
    
    return ratingsMap;
  } catch (error) {
    logger.error('Error getting latest ratings for places', { error, placeIds });
    throw error;
  }
};
