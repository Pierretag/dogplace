import { Pool } from 'pg';
import * as placeLogic from '../../src/logic/place.logic';
import { CreatePlaceInput } from '../../src/types/place.types';

// Mock the database pool
jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn().mockReturnThis(),
    query: jest.fn(),
    release: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Place Logic', () => {
  let pool: Pool;
  
  beforeEach(() => {
    pool = new Pool();
    jest.clearAllMocks();
  });
  
  describe('createPlace', () => {
    it('should create a place with coordinates', async () => {
      // Mock the database responses
      const mockCoordinate = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        latitude: 37.7749,
        longitude: -122.4194,
        created_at: new Date(),
      };
      
      const mockPlace = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        coordinate_id: mockCoordinate.id,
        name: 'Test Place',
        address: '123 Test St',
        category: 'Test Category',
        sub_category: 'Test Subcategory',
        pet_classification: 'Dog-friendly',
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',
      };
      
      // Set up the mock implementation for pool.connect().query()
      (pool.connect as jest.Mock).mockImplementation(() => ({
        query: jest.fn()
          .mockResolvedValueOnce({ rows: [mockCoordinate] }) // First query for creating coordinate
          .mockResolvedValueOnce({ rows: [mockPlace] }), // Second query for creating place
        release: jest.fn(),
      }));
      
      // Create the input data
      const input: CreatePlaceInput = {
        name: 'Test Place',
        address: '123 Test St',
        category: 'Test Category',
        sub_category: 'Test Subcategory',
        pet_classification: 'Dog-friendly',
        latitude: 37.7749,
        longitude: -122.4194,
      };
      
      // Call the function
      const result = await placeLogic.createPlace(pool, input);
      
      // Check the result
      expect(result).toEqual({
        ...mockPlace,
        latitude: mockCoordinate.latitude,
        longitude: mockCoordinate.longitude,
      });
      
      // Check that the transaction was started and committed
      expect(pool.connect).toHaveBeenCalled();
    });
  });
  
  describe('getPlaceById', () => {
    it('should return a place by ID', async () => {
      // Mock the database response
      const mockPlace = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        coordinate_id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Place',
        address: '123 Test St',
        category: 'Test Category',
        sub_category: 'Test Subcategory',
        pet_classification: 'Dog-friendly',
        latitude: 37.7749,
        longitude: -122.4194,
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',
      };
      
      // Set up the mock implementation for pool.query()
      (pool.query as jest.Mock).mockResolvedValue({ rows: [mockPlace] });
      
      // Call the function
      const result = await placeLogic.getPlaceById(pool, mockPlace.id);
      
      // Check the result
      expect(result).toEqual(mockPlace);
      
      // Check that the query was called with the correct parameters
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [mockPlace.id]
      );
    });
    
    it('should return null if place not found', async () => {
      // Set up the mock implementation for pool.query()
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
      
      // Call the function
      const result = await placeLogic.getPlaceById(pool, 'non-existent-id');
      
      // Check the result
      expect(result).toBeNull();
    });
  });
});
