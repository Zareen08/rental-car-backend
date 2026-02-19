import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

export const Roles = {
  admin: 'admin',
  customer: 'customer'
} as const;

const router = Router();

router.post("/", authenticate, authorize(Roles.admin), userController.createUser);

router.get("/", authenticate, authorize(Roles.admin), userController.getAllUsers);

router.get("/me", authenticate, userController.getSingleUser);

router.get("/:userId", authenticate, authorize(Roles.admin), userController.getUserById);

router.put("/:userId", authenticate, authorize(Roles.admin), userController.updateUser);

router.delete("/:userId", authenticate, authorize(Roles.admin), userController.deleteUser);

export const userRoute = router;