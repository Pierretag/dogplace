import { Context } from "koa";
import { Pool } from "pg";
import * as placeLogic from "../logic/place.logic";
import {
  extractPetPolicy,
  extractHours,
  extractPriceRange,
} from "../logic/place.logic";
import {
  CreatePlaceInput,
  UpdatePlaceInput,
  RestaurantData,
} from "../types/place.types";
import * as ratingDb from "../db/rating.db";
import { parsePaginationParams } from "../utils/pagination";
import { logger } from "../utils/logger";
import { notFound, badRequest } from "../middleware/error.middleware";
import * as fs from "fs";
import formidable from "formidable";
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
    logger.error("Error getting places", { error });
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
    logger.error("Error getting place by ID", { error, id: ctx.params.id });
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
    logger.error("Error creating place", { error, input: ctx.request.body });
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
    logger.error("Error updating place", {
      error,
      id: ctx.params.id,
      input: ctx.request.body,
    });
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
    logger.error("Error deleting place", { error, id: ctx.params.id });
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
    const result = await placeLogic.searchPlaces(
      getPool(ctx),
      filters,
      pagination,
    );

    ctx.body = result;
  } catch (error) {
    logger.error("Error searching places", { error, query: ctx.query });
    throw error;
  }
};

/**
 * Bulk import restaurants
 * @param ctx Koa context
 */
export const bulkImportPlaces = async (ctx: Context): Promise<void> => {
  try {
    const { restaurants } = ctx.request.body as {
      restaurants: RestaurantData[];
    };
    const pool = getPool(ctx);

    // Process the restaurant import
    const result = await placeLogic.processRestaurantImport(pool, restaurants);

    // Return the result
    ctx.body = result;
  } catch (error) {
    logger.error("Error in bulk import", { error });
    throw error;
  }
};

/**
 * Import restaurants from a file
 * @param ctx Koa context
 */
export const fileImportPlaces = async (ctx: Context): Promise<void> => {
  try {
    const file: formidable.File | formidable.File[] | undefined =
      ctx.request.files?.file;

    if (!file) {
      throw badRequest("No file uploaded");
    }

    if (Array.isArray(file)) {
      throw badRequest("Multiple files not supported");
    }

    try {
      // Read the file contents
      const fileContent = fs.readFileSync(file.filepath, "utf-8");

      // Parse it as JSON
      const jsonData = JSON.parse(fileContent);

      // Validate that the JSON contains an array of restaurants
      if (!Array.isArray(jsonData)) {
        throw badRequest("File must contain an array of restaurants");
      }

      // Process the restaurant import
      const result = await placeLogic.processRestaurantImport(
        getPool(ctx),
        jsonData,
      );

      // Return the result
      ctx.body = result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw badRequest(`Invalid JSON file: ${errorMessage}`);
    }
  } catch (error) {
    logger.error("Error in file import", { error });
    throw error;
  }
};
