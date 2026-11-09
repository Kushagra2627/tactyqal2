import { Request, Response, NextFunction } from "express";
import { getDashboardStats } from "../services/stats.service.js";

export async function getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
}
