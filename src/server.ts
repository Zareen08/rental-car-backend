import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}`);
      console.log(`DB test: http://localhost:${PORT}/db-test`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
