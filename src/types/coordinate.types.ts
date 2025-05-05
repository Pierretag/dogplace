/**
 * Coordinate entity interface
 */
export interface Coordinate {
  id: string;
  latitude: number;
  longitude: number;
  created_at: Date;
}

/**
 * Input for creating a new coordinate
 */
export interface CreateCoordinateInput {
  latitude: number;
  longitude: number;
}
