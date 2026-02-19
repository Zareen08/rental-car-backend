import { pool } from "../../config/db";
import { hashPassword } from "../../utils/password";

interface UserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

const createUserIntoDB = async (payload: UserPayload) => {
  const hashedPassword = await hashPassword(payload.password!);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role, created_at
    `,
    [payload.name, payload.email.toLowerCase(), hashedPassword, payload.phone, payload.role || "customer"]
  );

  return result.rows[0];
};

const getAllUserIntoDB = async () => {
  const result = await pool.query(`
    SELECT id, name, email, phone, role, created_at
    FROM users
    ORDER BY id
  `);
  return result.rows;
};

const getSingleUserIntoDB = async (email: string) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role, created_at FROM users WHERE email=$1`,
    [email.toLowerCase()]
  );
  return result.rows[0];
};

const getUserByIdIntoDB = async (userId: string) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role, created_at FROM users WHERE id=$1`,
    [userId]
  );
  return result.rows[0];
};

const updateUserIntoDB = async (userId: string, payload: Partial<UserPayload>) => {
  const fields: string[] = [];
  const values: any[] = [];

  let idx = 1;
  for (const key in payload) {
    if (key === "password" && payload.password) {
      payload.password = await hashPassword(payload.password);
    }
    fields.push(`${key}=$${idx}`);
    values.push(payload[key as keyof UserPayload]);
    idx++;
  }

  if (!fields.length) return null;

  const result = await pool.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id=$${idx} RETURNING id, name, email, phone, role, created_at`,
    [...values, userId]
  );

  return result.rows[0];
};

const deleteUserIntoDB = async (userId: string) => {
  // Check if user has active bookings
  const bookingCheck = await pool.query(
    `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );
  
  if (bookingCheck.rows.length > 0) {
    throw new Error("User has active bookings");
  }

  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING id`, [userId]);
  return result;
};

export const userServices = {
  createUserIntoDB,
  getAllUserIntoDB,
  getSingleUserIntoDB,
  getUserByIdIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
};