-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create coordinates table
CREATE TABLE IF NOT EXISTS coordinates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create places table
CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coordinate_id UUID REFERENCES coordinates(id) UNIQUE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    category VARCHAR(200) NOT NULL,
    sub_category VARCHAR(200) NOT NULL,
    pet_classification VARCHAR(200) NOT NULL,
    map_nbreviews integer, 
    map_rating integer,
    map_pricelevel integer,
    map_url TEXT UNIQUE,
    map_place_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    CONSTRAINT unique_places UNIQUE (name, address)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_sub_category ON places(sub_category);
CREATE INDEX IF NOT EXISTS idx_places_pet_classification ON places(pet_classification);
CREATE INDEX IF NOT EXISTS idx_places_status ON places(status);
CREATE INDEX IF NOT EXISTS idx_places_created_at ON places(created_at);
CREATE INDEX IF NOT EXISTS idx_coordinates_lat_long ON coordinates(latitude, longitude);
