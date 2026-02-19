export const Roles = {
  admin: "admin",
  customer: "customer",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string; 
  phone?: string;
  role: Role;
  age?: number;
  created_at?: Date;
  updated_at?: Date;
}

export type VehicleType = "car" | "bike" | "van" | "SUV";
export type VehicleStatus = "available" | "booked";

export interface Vehicle {
  id?: number;
  vehicle_name: string;
  type: VehicleType;
  registration_number: string;
  daily_rent_price: number;
  availability_status?: VehicleStatus;
}

export type BookingStatus = "active" | "cancelled" | "returned";

export interface Booking {
  id?: number;
  customer_id: number;
  vehicle_id: number;
  rent_start_date: Date | string;
  rent_end_date: Date | string;
  total_price: number;
  status?: BookingStatus;
}


