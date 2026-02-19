import { pool } from "../../config/db";
import { Booking, Vehicle } from "../../types/types";

const createBookingInDB = async (booking: Booking) => {
  const vehicleResult = await pool.query(
    `SELECT * FROM vehicles WHERE id=$1`,
    [booking.vehicle_id]
  );
  const vehicle: Vehicle = vehicleResult.rows[0];
  if (!vehicle) throw new Error("Vehicle not found");
  if (vehicle.availability_status !== "available") throw new Error("Vehicle is not available");

  const start = new Date(booking.rent_start_date);
  const end = new Date(booking.rent_end_date);
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) throw new Error("Rent end date must be after start date");

  const total_price = vehicle.daily_rent_price * diffDays;

  const result = await pool.query(
    `
    INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES($1,$2,$3,$4,$5,$6) RETURNING *
    `,
    [booking.customer_id, booking.vehicle_id, booking.rent_start_date, booking.rent_end_date, total_price, "active"]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [booking.vehicle_id]
  );

  return result.rows[0];
};

const getBookingsFromDB = async (userId?: number, role?: string) => {
  if (role === "admin") {
    const result = await pool.query(`SELECT * FROM bookings`);
    return result.rows;
  } else {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE customer_id=$1`,
      [userId]
    );
    return result.rows;
  }
};

const cancelBookingInDB = async (bookingId: number) => {
  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
  const booking = bookingResult.rows[0];
  if (!booking) throw new Error("Booking not found");

  const today = new Date();
  const startDate = new Date(booking.rent_start_date);
  if (today >= startDate) throw new Error("Cannot cancel booking after start date");

  const result = await pool.query(
    `UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`,
    [bookingId]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
    [booking.vehicle_id]
  );

  return result.rows[0];
};

const markBookingReturnedInDB = async (bookingId: number) => {
  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
  const booking = bookingResult.rows[0];
  if (!booking) throw new Error("Booking not found");

  const result = await pool.query(
    `UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`,
    [bookingId]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
    [booking.vehicle_id]
  );

  return result.rows[0];
};

export const bookingServices = {
  createBookingInDB,
  getBookingsFromDB,
  cancelBookingInDB,
  markBookingReturnedInDB,
};
