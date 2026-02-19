import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-this';

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload, expiresIn: string = '7d'): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
  } catch (err) {
    console.error('JWT sign error:', err);
    throw new Error('Failed to generate JWT token');
  }
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (err) {
    console.error('JWT verify error:', err);
    throw new Error('Invalid or expired token');
  }
};
