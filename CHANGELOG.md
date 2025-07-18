# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2025-07-18

### Changed

- Refactored restaurant import functionality to extract common logic into a reusable function
- Enhanced file import endpoint to fully process restaurant data from uploaded JSON files
- Improved error handling for file uploads and JSON parsing
- Removed import-restaurants.ts script in favor of the file import API endpoint

## [1.1.0] - 2025-07-17

### Added

- Added `map_hours` field to Places table to store restaurant hours as JSON
- Added `map_pricerange` field to Places table to store price range information
- Updated CRUD operations to handle the new fields
- Updated import script to extract and store hours and price range data
- Updated API documentation to reflect the new fields

## [1.0.0] - 2025-05-04

### Added

- Initial project setup with TypeScript and Koa.js
- PostgreSQL database connection and configuration
- Database migration system
- RESTful API for places entity
- CRUD operations for places
- Search functionality for places
- Pagination support
- Error handling middleware
- Request validation
- Authentication placeholder
- Logging system
- Health check endpoint
- Documentation (README.md)
