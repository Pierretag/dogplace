import { Context } from 'koa';
import { Pool } from 'pg';
import * as placeLogic from '../logic/place.logic';
import { CreatePlaceInput, UpdatePlaceInput } from '../types/place.types';
import { parsePaginationParams } from '../utils/pagination';
import { logger } from '../utils/logger';
import { notFound, badRequest } from '../middleware/error.middleware';

/**
 * Get database pool from context
 * @param ctx Koa context
 * @returns Database pool
 */
const getPool = (ctx: Context): Pool => ctx.state.dbPool;

/**
 * Get all places
 * @param ctx Koa context
 */
export const getPlaces = async (ctx: Context): Promise<void> => {
  try {
    // Parse pagination parameters
    const pagination = parsePaginationParams(ctx.query);
    
    // Get places
    const result = await placeLogic.getPlaces(getPool(ctx), pagination);
    
    ctx.body = result;
  } catch (error) {
    logger.error('Error getting places', { error });
    throw error;
  }
};

/**
 * Get a place by ID
 * @param ctx Koa context
 */
export const getPlaceById = async (ctx: Context): Promise<void> => {
  try {
    const id = ctx.params.id;
    
    // Get place
    const place = await placeLogic.getPlaceById(getPool(ctx), id);
    
    if (!place) {
      throw notFound(`Place with ID ${id} not found`);
    }
    
    ctx.body = place;
  } catch (error) {
    logger.error('Error getting place by ID', { error, id: ctx.params.id });
    throw error;
  }
};

/**
 * Create a new place
 * @param ctx Koa context
 */
export const createPlace = async (ctx: Context): Promise<void> => {
  try {
    const input = ctx.request.body as CreatePlaceInput;
    
    // Create place
    const place = await placeLogic.createPlace(getPool(ctx), input);
    
    ctx.status = 201;
    ctx.body = place;
  } catch (error) {
    logger.error('Error creating place', { error, input: ctx.request.body });
    throw error;
  }
};

/**
 * Update a place
 * @param ctx Koa context
 */
export const updatePlace = async (ctx: Context): Promise<void> => {
  try {
    const id = ctx.params.id;
    const input = ctx.request.body as UpdatePlaceInput;
    
    // Update place
    const place = await placeLogic.updatePlace(getPool(ctx), id, input);
    
    if (!place) {
      throw notFound(`Place with ID ${id} not found`);
    }
    
    ctx.body = place;
  } catch (error) {
    logger.error('Error updating place', { error, id: ctx.params.id, input: ctx.request.body });
    throw error;
  }
};

/**
 * Delete a place
 * @param ctx Koa context
 */
export const deletePlace = async (ctx: Context): Promise<void> => {
  try {
    const id = ctx.params.id;
    
    // Delete place
    const deleted = await placeLogic.deletePlace(getPool(ctx), id);
    
    if (!deleted) {
      throw notFound(`Place with ID ${id} not found`);
    }
    
    ctx.status = 204;
  } catch (error) {
    logger.error('Error deleting place', { error, id: ctx.params.id });
    throw error;
  }
};

/**
 * Search places
 * @param ctx Koa context
 */
export const searchPlaces = async (ctx: Context): Promise<void> => {
  try {
    // Parse pagination parameters
    const pagination = parsePaginationParams(ctx.query);
    
    // Extract search filters from query parameters
    const { page, limit, ...filters } = ctx.query;
    
    // Search places
    const result = await placeLogic.searchPlaces(getPool(ctx), filters, pagination);
    
    ctx.body = result;
  } catch (error) {
    logger.error('Error searching places', { error, query: ctx.query });
    throw error;
  }
};
