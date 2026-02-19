import { Request, Response, NextFunction } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const user = await userServices.createUserIntoDB({ name, email, password, phone, role });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    next(error); 
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userServices.getAllUserIntoDB();
    return res.status(200).json({
      success: true,
      message: "All users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = (req as any).user.email;
    const user = await userServices.getSingleUserIntoDB(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const user = await userServices.getUserByIdIntoDB(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const requester = (req as any).user;

    if (requester.role !== "admin" && requester.id !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: "Forbidden: Access Denied" });
    }

    const updatedUser = await userServices.updateUserIntoDB(userId, req.body);
    if (!updatedUser) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await userServices.deleteUserIntoDB(userId);

    if (deletedUser.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or has active bookings",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  getUserById,  
  updateUser,
  deleteUser,
};