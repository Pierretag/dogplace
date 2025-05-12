# Database Setup Guide

This guide provides instructions for setting up the PostgreSQL database for the DogPlace API.

## Prerequisites

- PostgreSQL (v12 or higher)
- Node.js (v14 or higher)

## Database Creation

1. Connect to PostgreSQL:

```bash
psql -U postgres
```

2. Create a new database:

```sql
CREATE DATABASE dogplace;
```

3. Create a new user (optional):

```sql
CREATE USER dogplace_user WITH ENCRYPTED PASSWORD 'your_password';
```

4. Grant privileges to the user:

```sql
GRANT ALL PRIVILEGES ON DATABASE dogplace TO dogplace_user;
```

5. Connect to the new database:

```sql
\c dogplace
```

6. Redo all the configuration just in case 
```sql
GRANT ALL PRIVILEGES ON DATABASE dogplace TO dogplace_user;
```
```sql
CREATE USER dogplace_user WITH ENCRYPTED PASSWORD 'your_password';
```

## Environment Configuration

Update the `.env` file with your database connection string:

```
DATABASE_URL=postgres://dogplace_user:your_password@localhost:5432/dogplace
```

## Running Migrations

The project includes a migration system that will set up the database schema automatically.

1. Run the migrations:

```bash
npm run migrate
```

This will:
- Create the necessary tables
- Set up indexes for performance
- Create constraints for data integrity

## Database Schema

The database schema consists of the following tables:

### coordinates

Stores location data for places.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| latitude | DECIMAL(10, 8) | Latitude coordinate |
| longitude | DECIMAL(11, 8) | Longitude coordinate |
| created_at | TIMESTAMP | Creation timestamp |

### places

Stores information about dog-friendly places.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| coordinate_id | UUID | Foreign key to coordinates table |
| name | VARCHAR(255) | Place name |
| address | TEXT | Place address |
| category | VARCHAR(200) | Main category |
| sub_category | VARCHAR(200) | Sub-category |
| pet_classification | VARCHAR(200) | Pet classification |
| map_nbreviews | INTEGER | Number of reviews from map provider |
| map_rating | INTEGER | Rating from map provider |
| map_pricelevel | INTEGER | Price level from map provider |
| map_url | TEXT | URL to map provider page |
| map_place_id | TEXT | ID from map provider |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| status | VARCHAR(50) | Status (active, inactive) |

## Indexes

The following indexes are created for performance optimization:

- `idx_places_category`: Index on places.category
- `idx_places_sub_category`: Index on places.sub_category
- `idx_places_pet_classification`: Index on places.pet_classification
- `idx_places_status`: Index on places.status
- `idx_places_created_at`: Index on places.created_at
- `idx_coordinates_lat_long`: Index on coordinates.latitude and coordinates.longitude

## Constraints

The following constraints are enforced for data integrity:

- `places.coordinate_id` is a foreign key to `coordinates.id`
- `places.name` and `places.address` must be unique together
- `places.map_url` must be unique

## Backup and Restore

### Creating a Backup

```bash
pg_dump -U postgres -d dogplace > dogplace_backup.sql
```

### Restoring from a Backup

```bash
psql -U postgres -d dogplace < dogplace_backup.sql
