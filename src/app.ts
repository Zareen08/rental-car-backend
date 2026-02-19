import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './config/db';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({ 
    success: true, 
    message: 'Vehicle Rental API Running',
    timestamp: new Date().toISOString()
  });
});

app.get('/db-test', async (_req, res) => {
  try {
    const result = await query('SELECT NOW() as current_time');
    res.json({
      success: true,
      message: 'Database connected successfully',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Database test failed:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export default app;