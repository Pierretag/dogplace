import Router from '@koa/router';
import placeRoutes from './place.routes';

// Create main router
const router = new Router();

// Health check endpoint
router.get('/health', (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
});

// Register routes
router.use(placeRoutes.routes());
router.use(placeRoutes.allowedMethods());

export default router;
