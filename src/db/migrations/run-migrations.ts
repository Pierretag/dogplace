import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { config } from '../../config/environment';
import { logger } from '../../utils/logger';

/**
 * Run database migrations
 */
async function runMigrations(): Promise<void> {
  // Create a new pool for migrations
  const pool = new Pool({
    connectionString: config.database.url,
  });

  try {
    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get applied migrations
    const { rows: appliedMigrations } = await pool.query(
      'SELECT name FROM migrations ORDER BY id'
    );
    const appliedMigrationNames = appliedMigrations.map((m) => m.name);

    // Get migration files
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    // Apply migrations
    for (const file of migrationFiles) {
      if (appliedMigrationNames.includes(file)) {
        logger.info(`Migration ${file} already applied, skipping`);
        continue;
      }

      logger.info(`Applying migration ${file}`);

      // Start a transaction
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Read and execute migration
        const migration = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(migration);

        // Record migration
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );

        await client.query('COMMIT');
        logger.info(`Migration ${file} applied successfully`);
      } catch (error) {
        await client.query('ROLLBACK');
        logger.error(`Error applying migration ${file}`, { error });
        throw error;
      } finally {
        client.release();
      }
    }

    logger.info('All migrations applied successfully');
  } catch (error) {
    logger.error('Error running migrations', { error });
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migrations completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration failed', { error });
      process.exit(1);
    });
}

export default runMigrations;
