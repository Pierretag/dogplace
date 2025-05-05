# DogPlace API Documentation

This document provides detailed information about the DogPlace API endpoints.

## Base URL

```
http://localhost:8000/api
```

## Authentication

Authentication is currently a placeholder. All endpoints are accessible without authentication.

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of a request:

- `200 OK`: The request was successful
- `201 Created`: The resource was successfully created
- `204 No Content`: The request was successful but no content is returned
- `400 Bad Request`: The request was invalid
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: The authenticated user does not have permission
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

Error responses have the following format:

```json
{
  "error": "Error message",
  "details": ["Detailed error information"],
  "status": 400
}
```

## Pagination

Endpoints that return multiple items support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10, max: 100)

Paginated responses have the following format:

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

## Endpoints

### Places

#### Get All Places

```
GET /places
```

Query Parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10, max: 100)

Response:

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Dog-friendly Cafe",
      "address": "123 Main St, City",
      "category": "Food & Drink",
      "sub_category": "Cafe",
      "pet_classification": "Dog-friendly",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "map_nbreviews": 42,
      "map_rating": 4,
      "map_pricelevel": 2,
      "map_url": "https://maps.example.com/place/123",
      "map_place_id": "abc123",
      "created_at": "2025-05-04T12:00:00Z",
      "updated_at": "2025-05-04T12:00:00Z",
      "status": "active"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

#### Get Place by ID

```
GET /places/:id
```

Response:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Dog-friendly Cafe",
  "address": "123 Main St, City",
  "category": "Food & Drink",
  "sub_category": "Cafe",
  "pet_classification": "Dog-friendly",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "map_nbreviews": 42,
  "map_rating": 4,
  "map_pricelevel": 2,
  "map_url": "https://maps.example.com/place/123",
  "map_place_id": "abc123",
  "created_at": "2025-05-04T12:00:00Z",
  "updated_at": "2025-05-04T12:00:00Z",
  "status": "active"
}
```

#### Create Place

```
POST /places
```

Request Body:

```json
{
  "name": "Dog-friendly Cafe",
  "address": "123 Main St, City",
  "category": "Food & Drink",
  "sub_category": "Cafe",
  "pet_classification": "Dog-friendly",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "map_nbreviews": 42,
  "map_rating": 4,
  "map_pricelevel": 2,
  "map_url": "https://maps.example.com/place/123",
  "map_place_id": "abc123"
}
```

Response:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Dog-friendly Cafe",
  "address": "123 Main St, City",
  "category": "Food & Drink",
  "sub_category": "Cafe",
  "pet_classification": "Dog-friendly",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "map_nbreviews": 42,
  "map_rating": 4,
  "map_pricelevel": 2,
  "map_url": "https://maps.example.com/place/123",
  "map_place_id": "abc123",
  "created_at": "2025-05-04T12:00:00Z",
  "updated_at": "2025-05-04T12:00:00Z",
  "status": "active"
}
```

#### Update Place

```
PUT /places/:id
```

Request Body:

```json
{
  "name": "Updated Dog-friendly Cafe",
  "address": "123 Main St, City",
  "category": "Food & Drink",
  "sub_category": "Cafe",
  "pet_classification": "Dog-friendly",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "map_nbreviews": 42,
  "map_rating": 4,
  "map_pricelevel": 2,
  "map_url": "https://maps.example.com/place/123",
  "map_place_id": "abc123",
  "status": "active"
}
```

Response:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Updated Dog-friendly Cafe",
  "address": "123 Main St, City",
  "category": "Food & Drink",
  "sub_category": "Cafe",
  "pet_classification": "Dog-friendly",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "map_nbreviews": 42,
  "map_rating": 4,
  "map_pricelevel": 2,
  "map_url": "https://maps.example.com/place/123",
  "map_place_id": "abc123",
  "created_at": "2025-05-04T12:00:00Z",
  "updated_at": "2025-05-04T12:00:00Z",
  "status": "active"
}
```

#### Delete Place

```
DELETE /places/:id
```

Response:

```
204 No Content
```

#### Search Places

```
GET /places/search
```

Query Parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10, max: 100)
- `category`: Filter by category
- `sub_category`: Filter by sub-category
- `pet_classification`: Filter by pet classification
- `status`: Filter by status
- `name`: Filter by name (partial match)
- `address`: Filter by address (partial match)

Response:

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Dog-friendly Cafe",
      "address": "123 Main St, City",
      "category": "Food & Drink",
      "sub_category": "Cafe",
      "pet_classification": "Dog-friendly",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "map_nbreviews": 42,
      "map_rating": 4,
      "map_pricelevel": 2,
      "map_url": "https://maps.example.com/place/123",
      "map_place_id": "abc123",
      "created_at": "2025-05-04T12:00:00Z",
      "updated_at": "2025-05-04T12:00:00Z",
      "status": "active"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### Health Check

#### Get API Health

```
GET /health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2025-05-04T12:00:00Z"
}
