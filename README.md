# DogPlace API

A RESTful API for a dog-friendly place discovery platform.

## Technologies Used

- **Backend**: Node.js with Koa.js and TypeScript
- **Database**: PostgreSQL
- **Monitoring**: Grafana (to be implemented)

## Project Structure

The project follows a modular architecture:

```
src/
  ├── server.ts                 # Main entry point
  ├── routes/                   # API route definitions
  ├── controllers/              # Controller logic
  ├── logic/                    # Business logic
  ├── db/                       # Database functions and migrations
  │   └── migrations/           # Database migration scripts
  ├── types/                    # TypeScript type definitions
  ├── middleware/               # Custom middleware
  └── utils/                    # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgres://user:password@localhost:5432/dogplace
ENVIRONMENT=development
LOG_LEVEL=debug
PORT=8000
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run database migrations:

```bash
npm run migrate
```

4. Start the development server:

```bash
npm run dev
```

### Production

1. Build the project:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## API Endpoints

### Places

- `GET /api/places` - Get all places (with pagination)
- `GET /api/places/:id` - Get a specific place by ID
- `POST /api/places` - Create a new place
- `PUT /api/places/:id` - Update a place
- `DELETE /api/places/:id` - Delete a place
- `GET /api/places/search` - Search places by various criteria

### Health Check

- `GET /health` - Check API health status

## Features

- RESTful API design
- TypeScript for type safety
- PostgreSQL database with migrations
- Error handling middleware
- Request validation
- Pagination support
- Logging
- Authentication (placeholder)

## Development

### Running Migrations

```bash
npm run migrate
```

### Running Tests

```bash
npm test
```

## License

ISC
