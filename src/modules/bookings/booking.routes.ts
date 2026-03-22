import { Router } from "express";
import { bookingController } from "./booking.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Roles } from "../auth/auth.constant";

const router = Router();

router.post("/", authenticate, bookingController.createBooking);

router.get("/", authenticate, bookingController.getBookings);

router.put("/:bookingId", authenticate, authorize(Roles.customer), bookingController.cancelBooking);

router.put("/:bookingId", authenticate, authorize(Roles.admin), bookingController.markBookingReturned);

export const bookingRoute = router;