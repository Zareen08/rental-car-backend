import { pool } from "../../config/db";
import { Vehicle } from "../../types/types";

const createVehicleInDB = async (vehicle: Vehicle) => {
  const result = await pool.query(
    `
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
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
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

const getVehicleByIdFromDB = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result.rows[0];
};

const updateVehicleInDB = async (id: number, data: Partial<Vehicle>) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const setQuery = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");
  const result = await pool.query(
    `UPDATE vehicles SET ${setQuery} WHERE id=$${fields.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0];
};

const deleteVehicleFromDB = async (id: number) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [id]);
  return result.rows[0];
};

export const vehicleServices = {
  createVehicleInDB,
  getAllVehiclesFromDB,
  getVehicleByIdFromDB,
  updateVehicleInDB,
  deleteVehicleFromDB,
};
