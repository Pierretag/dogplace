-- Create ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    rating DECIMAL(3,1) NOT NULL,
    nb_reviews INTEGER NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50) DEFAULT 'google_maps',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_ratings_place_id ON ratings(place_id);
CREATE INDEX idx_ratings_date ON ratings(date);

-- Migrate existing ratings data
INSERT INTO ratings (place_id, rating, nb_reviews, date, source, created_at)
SELECT 
    id as place_id,
    map_rating as rating,
    map_nbreviews as nb_reviews,
    updated_at as date,
    'google_maps' as source,
    created_at
FROM places 
WHERE map_rating IS NOT NULL AND map_nbreviews IS NOT NULL;

-- Remove rating columns from places table
ALTER TABLE places
    DROP COLUMN map_rating,
    DROP COLUMN map_nbreviews;
