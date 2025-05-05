import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import { config } from './config/environment';
import { pool } from './config/database';
import { errorMiddleware } from './middleware/error.middleware';
import router from './routes';
import { logger as appLogger } from './utils/logger';

// Create Koa application
const app = new Koa();

// Add database pool to context state
app.use(async (ctx, next) => {
  ctx.state.dbPool = pool;
  await next();
});

// Add middleware
app.use(errorMiddleware);
app.use(logger());
app.use(bodyParser());

// Add routes
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
const server = app.listen(config.port, () => {
  appLogger.info(`Server running on port ${config.port}`);
  appLogger.info(`Environment: ${config.environment}`);
});

// Handle server errors
server.on('error', (err) => {
  appLogger.error('Server error', { error: err });
});

// Handle process termination
process.on('SIGINT', () => {
  appLogger.info('Shutting down server');
  server.close(() => {
    appLogger.info('Server closed');
    pool.end(() => {
      appLogger.info('Database pool closed');
      process.exit(0);
    });
  });
});

export default server;
