import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import {
  CreatePlaceInput,
} from "../types/place.types";
import { createPlace, searchPlaces, updatePlace } from "../logic/place.logic";
import { logger } from "../utils/logger";
import { pool } from "../config/database";

interface RestaurantData {
  place_id: string;
  about: any[];
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  reviews: number;
  rating: number;
  link: string;
  address: string;
}

function extractPetPolicy(restaurant: RestaurantData): string {
  const petpolicy = restaurant.about.find((item: { id: string }) => {
    return item.id === "pets";
  });
  if (petpolicy) {
    return "dogallowed";
  } else return "false";
}

async function importRestaurants(pool: Pool, filePath: string) {
  try {
    // Read and parse the JSON file
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const restaurants: RestaurantData[] = JSON.parse(fileContent);
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const restaurant of restaurants) {
      try {
        // Check if restaurant exists
        const existingPlaces = await searchPlaces(pool, {
          map_place_id: restaurant.place_id,
        }, { page: 1, limit: 1 });
        const exists = existingPlaces.data.length > 0;
        // get pet policy

        if (exists) {
          // Update existing restaurant
          const existingPlace = existingPlaces.data[0];
          await updatePlace(pool, existingPlace.id, {
            map_nbreviews: restaurant.reviews,
            map_rating: restaurant.rating,
            pet_classification: extractPetPolicy(restaurant),
          });
          updated++;
          logger.info("Updated restaurant", { name: restaurant.name });
        } else {
          // Create new restaurant
          const input: CreatePlaceInput = {
            name: restaurant.name,
            address: restaurant.address,
            category: "restaurant",
            sub_category: "restaurant",
            pet_classification: extractPetPolicy(restaurant),
            latitude: restaurant.coordinates.latitude,
            longitude: restaurant.coordinates.longitude,
            map_nbreviews: restaurant.reviews,
            map_rating: restaurant.rating,
            map_url: restaurant.link,
            map_place_id: restaurant.place_id,
          };

          await createPlace(pool, input);
          created++;
          logger.info("Created restaurant", { name: restaurant.name });
        }
      } catch (error) {
        logger.error("Error processing restaurant", { error, restaurant });
        failed++;
      }
    }

    // Log summary
    logger.info("Import completed", {
      total: restaurants.length,
      created,
      updated,
      failed,
    });
  } catch (error) {
    logger.error("Error importing restaurants", { error });
    throw error;
  }
}

// Main execution
//if (require.main === module) {
try {
  const filePath = "./file/all-task-5.json";

  importRestaurants(pool, filePath)
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error("Script failed", { error });
      process.exit(1);
    });
} catch (e) {
  console.error(e);
}
//}
