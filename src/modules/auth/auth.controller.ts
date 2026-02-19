import { Request, Response } from "express";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    const user = await authServices.createUserInDB({ 
      name, 
      email, 
      password, 
      phone,
      role 
    });
    
    return res.status(201).json({ 
      success: true, 
      message: "User created", 
      data: user 
    });
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authServices.loginUserIntoDB(email, password);
    
    return res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      data: result 
    });
  } catch (error: any) {
    return res.status(401).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const authController = {
  createUser,
  loginUser,
};