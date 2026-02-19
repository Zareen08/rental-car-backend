import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB, initDB } from './config/db';

import { authRoute } from './modules/auth/auth.routes';
import { userRoute } from './modules/users/user.routes';
import { vehicleRoute } from './modules/vehicles/vehicle.routes';
import { bookingRoute } from './modules/bookings/booking.routes';

const PORT = process.env.PORT || 5002;
const PRODUCTION_URL = 'https://vehicle-rental-backend-blush.vercel.app';

const startServer = async () => {
  try {
    await connectDB();
    
    await initDB();

    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/users', userRoute);
    app.use('/api/v1/vehicles', vehicleRoute);
    app.use('/api/v1/bookings', bookingRoute);
    console.log('Routes registered');

    app.use((_req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });

    app.listen(PORT, () => {
      console.log(`\n Server running on ${PRODUCTION_URL}`);
      console.log(`Health check: ${PRODUCTION_URL}/`);
      console.log(` DB test: ${PRODUCTION_URL}/db-test`);
      console.log(`\n API Endpoints:`);
      console.log(`   Auth:     ${PRODUCTION_URL}/api/v1/auth`);
      console.log(`   Users:    ${PRODUCTION_URL}/api/v1/users`);
      console.log(`   Vehicles: ${PRODUCTION_URL}/api/v1/vehicles`);
      console.log(`   Bookings: ${PRODUCTION_URL}/api/v1/bookings`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();