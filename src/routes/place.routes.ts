import Router from '@koa/router';
import * as placeController from '../controllers/place.controller';
import { validate, validateCreatePlace, validateUpdatePlace, validateSearchParams } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

// Create router
const router = new Router({ prefix: '/api/places' });

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all places
router.get('/', validate(validateSearchParams, 'query'), placeController.getPlaces);

// Search places
router.get('/search', validate(validateSearchParams, 'query'), placeController.searchPlaces);

// Get a place by ID
router.get('/:id', placeController.getPlaceById);

// Create a new place
router.post('/', validate(validateCreatePlace), placeController.createPlace);

// Update a place
router.put('/:id', validate(validateUpdatePlace), placeController.updatePlace);

// Delete a place
router.delete('/:id', placeController.deletePlace);

export default router;
