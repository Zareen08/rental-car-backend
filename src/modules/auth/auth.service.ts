import { pool } from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateToken, JwtPayload } from "../../utils/jwt";

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;  
}

export const createUserInDB = async (payload: CreateUserPayload) => {
  const hashedPassword = await hashPassword(payload.password);

  const role = payload.role || "customer";

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
    [payload.name, payload.email.toLowerCase(), hashedPassword, payload.phone, role] 
  );

  return result.rows[0];
};

export const loginUserIntoDB = async (email: string, password: string) => {
  const userQuery = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email.toLowerCase()]
  );

  if (!userQuery.rows.length) throw new Error("User not found");

  const user = userQuery.rows[0];
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const payload: JwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(payload);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

export const authServices = {
  createUserInDB,
  loginUserIntoDB,
};