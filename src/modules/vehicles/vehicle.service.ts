import { pool } from "../../config/db";
import { Vehicle } from "../../types/types";

const createVehicleInDB = async (vehicle: Vehicle) => {
  const result = await pool.query(
    `
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `,
    [
      vehicle.vehicle_name,
      vehicle.type,
      vehicle.registration_number,
      vehicle.daily_rent_price,
      vehicle.availability_status || "available",
    ]
  );
  return result.rows[0];
};

const getAllVehiclesFromDB = async () => {
  const result = await pool.query(`SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles`);
  return result.rows;
};

const getVehicleByIdFromDB = async (id: number) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
    [id]
  );
  return result.rows[0];
};

const updateVehicleInDB = async (id: number, data: Partial<Vehicle>) => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  const allowedFields = ['vehicle_name', 'type', 'registration_number', 'daily_rent_price', 'availability_status'];
  
  for (const key of allowedFields) {
    if (data[key as keyof Vehicle] !== undefined) {
      fields.push(`${key}=$${idx}`);
      values.push(data[key as keyof Vehicle]);
      idx++;
    }
  }

  if (fields.length === 0) {
    return null;
  }

  const result = await pool.query(
    `UPDATE vehicles SET ${fields.join(", ")} WHERE id=$${idx} RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [...values, id]
  );
  return result.rows[0];
};

const deleteVehicleFromDB = async (id: number) => {
  const bookingCheck = await pool.query(
    `SELECT id FROM bookings WHERE vehicle_id = $1 AND status IN ('active', 'confirmed')`,
    [id]
  );
  
  if (bookingCheck.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id=$1 RETURNING id`,
    [id]
  );
  return result.rows[0];
};

export const vehicleServices = {
  createVehicleInDB,
  getAllVehiclesFromDB,
  getVehicleByIdFromDB,
  updateVehicleInDB,
  deleteVehicleFromDB,
};