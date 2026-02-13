import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5002,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'secret-key',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate required env vars
if (!config.databaseUrl) {
  console.error('❌ DATABASE_URL is not defined in .env file');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set, using default (not safe for production)');
}
