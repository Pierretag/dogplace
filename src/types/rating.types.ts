/**
 * Rating entity interface
 */
export interface Rating {
  id: string;
  place_id: string;
  rating: number;
  nb_reviews: number;
  date: Date;
  source: string;
  created_at: Date;
}

/**
 * Latest rating information for a place
 */
export interface LatestRating {
  rating: number;
  nb_reviews: number;
  date: Date;
}

/**
 * Input for creating a new rating
 */
export interface CreateRatingInput {
  place_id: string;
  rating: number;
  nb_reviews: number;
  date?: Date;
  source?: string;
}
