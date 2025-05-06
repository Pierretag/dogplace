CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coordinate_id UUID REFERENCES coordinates(id) UNIQUE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    category VARCHAR(200) NOT NULL,
    sub_category VARCHAR(200) NOT NULL,
    pet_classification VARCHAR(200) NOT NULL,
    map_nbreviews integer, 
    map_rating DECIMAL(3,1),
    map_pricelevel integer,
    map_url TEXT UNIQUE,
    map_place_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    status VARCHAR(50) DEFAULT 'active',
    CONSTRAINT unique_places UNIQUE (name, address)
);

CREATE TABLE coordinates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
