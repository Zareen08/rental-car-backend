import { Request, Response, NextFunction } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer_id = (req as any).user.id;
    const booking = await bookingServices.createBookingInDB({ ...req.body, customer_id });
    res.status(201).json({ success: true, message: "Booking created", data: booking });
  } catch (error: any) {
    next(error);
  }
};

const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const bookings = await bookingServices.getBookingsFromDB(user.id, user.role);
    res.status(200).json({ success: true, data: bookings });
  } catch (error: any) {
    next(error);
  }
};

const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const booking = await bookingServices.cancelBookingInDB(bookingId);
    res.status(200).json({ success: true, message: "Booking cancelled", data: booking });
  } catch (error: any) {
    next(error);
  }
};

const markBookingReturned = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const booking = await bookingServices.markBookingReturnedInDB(bookingId);
    res.status(200).json({ success: true, message: "Booking marked as returned", data: booking });
  } catch (error: any) {
    next(error);
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  cancelBooking,
  markBookingReturned,
};
