import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.createUser);
router.post("/login", authController.loginUser);

// TEMPORARY
router.get("/signup", (req, res) => {
  res.json({ 
    message: "This endpoint requires POST method. Use Postman to test with POST request.",
    hint: "Send a POST request with JSON body containing name, email, password, phone, role"
  });
});

router.get("/login", (req, res) => {
  res.json({ 
    message: "This endpoint requires POST method. Use Postman to test with POST request.",
    hint: "Send a POST request with JSON body containing email and password"
  });
});

// Test route to verify router is mounted
router.get("/test", (req, res) => {
  res.json({ message: "Auth router is working!" });
});

export const authRoute = router;