import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config(); 

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

// Connect and test database
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL connected successfully");
    client.release();
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); 
  }
};

// Initialize tables
export const initDB = async () => {
  try {
    // Users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(50) CHECK (role IN ('admin','customer')) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Vehicles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(200) NOT NULL,
        type VARCHAR(50) CHECK (type IN ('car','bike','van','SUV')) NOT NULL,
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price NUMERIC NOT NULL,
        availability_status VARCHAR(50)
        CHECK (availability_status IN ('available','booked'))
        DEFAULT 'available'
      )
    `);

    // Bookings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC NOT NULL,
        status VARCHAR(50)
        CHECK (status IN ('active','cancelled','returned'))
        DEFAULT 'active',
        CONSTRAINT rent_dates_check CHECK (rent_end_date > rent_start_date)
      )
    `);

    console.log("All Tables Created Successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

// Query helper for services
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
