import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Roles } from "../auth/auth.constant";

const router = Router();

router.post("/", authenticate, authorize(Roles.admin), vehicleController.createVehicle);

router.get("/", vehicleController.getAllVehicles);

router.get("/:vehicleId", vehicleController.getVehicleById);

router.put("/:vehicleId", authenticate, authorize(Roles.admin), vehicleController.updateVehicle);

router.delete("/:vehicleId", authenticate, authorize(Roles.admin), vehicleController.deleteVehicle);

export const vehicleRoute = router;
