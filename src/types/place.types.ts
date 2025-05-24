/**
 * Place entity interface
 */
export interface Place {
  id: string;
  coordinate_id: string;
  name: string;
  address: string;
  category: string;
  sub_category: string;
  pet_classification: string;
  map_nbreviews?: number;
  map_rating?: number;
  map_pricelevel?: number;
  map_url?: string;
  map_place_id?: string;
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'inactive';
}

/**
 * Input for creating a new place
 */
export interface CreatePlaceInput {
  name: string;
  address: string;
  category: string;
  sub_category: string;
  pet_classification: string;
  latitude: number;
  longitude: number;
  map_nbreviews?: number;
  map_rating?: number;
  map_pricelevel?: number;
  map_url?: string;
  map_place_id?: string;
}

/**
 * Input for updating an existing place
 */
export interface RestaurantData {
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

export interface UpdatePlaceInput {
  name?: string;
  address?: string;
  category?: string;
  sub_category?: string;
  pet_classification?: string;
  latitude?: number;
  longitude?: number;
  map_nbreviews?: number;
  map_rating?: number;
  map_pricelevel?: number;
  map_url?: string;
  map_place_id?: string;
  status?: 'active' | 'inactive';
}
