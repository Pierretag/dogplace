import { Pool } from 'pg';
import { 
  Place, 
  CreatePlaceInput, 
  UpdatePlaceInput,
  RestaurantData,
  PlaceOutput
} from '../types/place.types';
import * as ratingDb from '../db/rating.db';
import { 
  PaginationParams, 
  PaginatedResult 
} from '../types/common.types';
import * as placeDb from '../db/place.db';
import * as coordinateDb from '../db/coordinate.db';
import { logger } from '../utils/logger';

/**
 * Create a new place
 * @param pool Database pool
 * @param input Place creation input
 * @returns Created place
 */
export const createPlace = async (
  pool: Pool,
  input: CreatePlaceInput
): Promise<Place> => {
  // Start a transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create coordinate
    const coordinate = await coordinateDb.createCoordinate(client, {
      latitude: input.latitude,
      longitude: input.longitude,
    });
    
    // Create place
    const place = await placeDb.createPlace(client, {
      coordinate_id: coordinate.id,
      name: input.name,
      address: input.address,
      category: input.category,
      sub_category: input.sub_category,
      pet_classification: input.pet_classification,
      map_pricelevel: input.map_pricelevel,
      map_hours: input.map_hours,
      map_pricerange: input.map_pricerange,
      map_url: input.map_url,
      map_place_id: input.map_place_id,
      updated_at: new Date(),
      status: 'active',
    });
    
    await client.query('COMMIT');
    
    // Add latitude and longitude to the response
    return {
      ...place,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    } as any;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error creating place', { error, input });
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get a place by ID
 * @param pool Database pool
 * @param id Place ID
 * @returns Place or null if not found
 */
export const getPlaceById = async (
  pool: Pool,
  id: string
): Promise<PlaceOutput | null> => {
  const place = await placeDb.getPlaceById(pool, id);
  if (!place) return null;

  const latestRating = await ratingDb.getLatestRating(pool, id);
  return {
    ...place,
    latest_rating: latestRating || undefined,
    map_hours: JSON.stringify(place.map_hours) || {},
  };
};

/**
 * Get all places with pagination
 * @param pool Database pool
 * @param pagination Pagination parameters
 * @returns Paginated places
 */
export const getPlaces = async (
  pool: Pool,
  pagination: PaginationParams
): Promise<PaginatedResult<PlaceOutput>> => {
  const places = await placeDb.getPlaces(pool, pagination);
  
  // Get latest ratings for all places
  const placeIds = places.data.map(place => place.id);
  const ratingsMap = await ratingDb.getLatestRatingsForPlaces(pool, placeIds);
  
  // Add ratings to places
  const placesWithRatings :PlaceOutput[] = places.data.map(place => ({
    ...place,
    map_hours: place.map_hours ? JSON.parse(place.map_hours as string).hours : {},
    latest_rating: ratingsMap.get(place.id)
  }));
  
  return {
    ...places,
    data: placesWithRatings
  };
};

/**
 * Update a place
 * @param pool Database pool
 * @param id Place ID
 * @param input Place update input
 * @returns Updated place or null if not found
 */
export const updatePlace = async (
  pool: Pool,
  id: string,
  input: UpdatePlaceInput
): Promise<Place | null> => {
  // Start a transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get the place to check if it exists
    const place = await placeDb.getPlaceById(client, id);
    
    if (!place) {
      await client.query('ROLLBACK');
      return null;
    }
    
    // Update coordinate if latitude or longitude is provided
    if (input.latitude !== undefined || input.longitude !== undefined) {
      await coordinateDb.updateCoordinate(client, place.coordinate_id, {
        latitude: input.latitude !== undefined ? input.latitude : (place as any).latitude,
        longitude: input.longitude !== undefined ? input.longitude : (place as any).longitude,
      });
      
      // Remove latitude and longitude from the input to avoid duplicating them in the place update
      const { latitude, longitude, ...placeInput } = input;
      
      // Update place
      const updatedPlace = await placeDb.updatePlace(client, id, placeInput);
      
      await client.query('COMMIT');
      
      // Get the updated place with coordinate information
      return placeDb.getPlaceById(pool, id);
    } else {
      // Update place without updating coordinate
      const updatedPlace = await placeDb.updatePlace(client, id, input);
      
      await client.query('COMMIT');
      
      return updatedPlace;
    }
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error updating place', { error, id, input });
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Delete a place
 * @param pool Database pool
 * @param id Place ID
 * @returns Whether the place was deleted
 */
export const deletePlace = async (
  pool: Pool,
  id: string
): Promise<boolean> => {
  // Start a transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get the place to check if it exists and get the coordinate_id
    const place = await placeDb.getPlaceById(client, id);
    
    if (!place) {
      await client.query('ROLLBACK');
      return false;
    }
    
    // Delete the place
    const placeDeleted = await placeDb.deletePlace(client, id);
    
    if (!placeDeleted) {
      await client.query('ROLLBACK');
      return false;
    }
    
    // Delete the coordinate
    await coordinateDb.deleteCoordinate(client, place.coordinate_id);
    
    await client.query('COMMIT');
    
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error deleting place', { error, id });
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Search places
 * @param pool Database pool
 * @param filters Search filters
 * @param pagination Pagination parameters
 * @returns Paginated places
 */
/**
 * Extract pet policy from restaurant data
 * @param restaurant Restaurant data
 * @returns Pet policy classification
 */
export const extractPetPolicy = (restaurant: RestaurantData): string => {
  const petpolicy = restaurant.about.find((item: { id: string }) => {
    return item.id === "pets";
  });
  return petpolicy ? "dogallowed" : "false";
};

/**
 * Extract hours data from restaurant data
 * @param restaurant Restaurant data
 * @returns Hours data as JSON string or undefined if not available
 */
export const extractHours = (restaurant: RestaurantData): string | undefined => {
  if (!restaurant.hours || restaurant.hours.length === 0) {
    return undefined;
  }
  
  return JSON.stringify({ hours: restaurant.hours });
};

/**
 * Extract price range from restaurant data
 * @param restaurant Restaurant data
 * @returns Price range or undefined if not available
 */
export const extractPriceRange = (restaurant: RestaurantData): string | undefined => {
  return restaurant.price_range || undefined;
};

export const searchPlaces = async (
  pool: Pool,
  filters: Record<string, any>,
  pagination: PaginationParams
): Promise<PaginatedResult<PlaceOutput>> => {
  const places = await placeDb.searchPlaces(pool, filters, pagination);
  
  // Get latest ratings for all places
  const placeIds = places.data.map(place => place.id);
  const ratingsMap = await ratingDb.getLatestRatingsForPlaces(pool, placeIds);
  
  // Add ratings to places
  const placesWithRatings :PlaceOutput[] = places.data.map(place => ({
    ...place,
    latest_rating: ratingsMap.get(place.id),
    map_hours: place.map_hours ? JSON.parse(place.map_hours as string): {},
  }));
  
  return {
    ...places,
    data: placesWithRatings
  };
};
