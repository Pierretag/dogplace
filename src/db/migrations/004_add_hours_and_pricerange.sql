-- Add map_hours and map_pricerange fields to places table
ALTER TABLE places
ADD COLUMN map_hours TEXT,
ADD COLUMN map_pricerange VARCHAR(200);
