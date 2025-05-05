import { Pool } from 'pg';
import { config } from './environment';

/**
 * Create a PostgreSQL connection pool
 */
export const createPool = (): Pool => {
  const pool = new Pool({
    connectionString: config.database.url,
    max: config.database.poolSize,
    idleTimeoutMillis: config.database.idleTimeout,
    // Additional options can be added here
  });

  // Log connection events in development mode
  if (process.env.ENVIRONMENT === 'development') {
    pool.on('connect', () => {
      console.log('Connected to PostgreSQL database');
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
      process.exit(-1);
    });
  }

  return pool;
};

/**
 * Database pool instance
 */
export const pool = createPool();

/**
 * Execute a query with parameters
 * @param text SQL query text
 * @param params Query parameters
 * @returns Query result
 */
export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  if (process.env.ENVIRONMENT === 'development') {
    console.log('Executed query', { text, duration, rows: res.rowCount });
  }
  
  return res;
};

/**
 * Get a client from the pool
 * @returns PostgreSQL client
 */
export const getClient = async () => {
  const client = await pool.connect();
  const originalRelease = client.release;
  
  // Override release method to log query duration
  client.release = () => {
    client.release = originalRelease;
    return client.release();
  };
  
  return client;
};
