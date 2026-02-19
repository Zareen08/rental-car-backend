import { Request, Response, NextFunction } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleServices.createVehicleInDB(req.body);
    res.status(201).json({ success: true, message: "Vehicle created", data: vehicle });
  } catch (error: any) {
    next(error);
  }
};

const getAllVehicles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicles = await vehicleServices.getAllVehiclesFromDB();
    res.status(200).json({ success: true, data: vehicles });
  } catch (error: any) {
    next(error);
  }
};

const getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleServices.getVehicleByIdFromDB(Number(req.params.vehicleId));
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (error: any) {
    next(error);
  }
};

const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleServices.updateVehicleInDB(
      Number(req.params.vehicleId),
      req.body
    );
    res.status(200).json({ success: true, message: "Vehicle updated", data: vehicle });
  } catch (error: any) {
    next(error);
  }
};

const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleServices.deleteVehicleFromDB(Number(req.params.vehicleId));
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found or has active bookings" });
    }
    res.status(200).json({ success: true, message: "Vehicle deleted" });
  } catch (error: any) {
    next(error);
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
