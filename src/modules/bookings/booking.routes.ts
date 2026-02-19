import { Router } from "express";
import { bookingController } from "./booking.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Roles } from "../auth/auth.constant";

const router = Router();

router.post("/", authenticate, authorize(Roles.customer), bookingController.createBooking);

router.get("/", authenticate, bookingController.getBookings);

router.put("/cancel/:bookingId", authenticate, authorize(Roles.customer), bookingController.cancelBooking);

router.put("/return/:bookingId", authenticate, authorize(Roles.admin), bookingController.markBookingReturned);

export const bookingRoute = router;
