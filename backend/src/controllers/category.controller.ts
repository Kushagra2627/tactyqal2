import { Request, Response, NextFunction } from "express";
import { categorySchema } from "../validators/category.validator.js";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/category.service.js";

export async function listCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await getAllCategories();
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await getCategoryById(req.params.id);
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
}

export async function createNewCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = categorySchema.parse(req.body);
    const category = await createCategory(data);
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
}

export async function updateExistingCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = categorySchema.partial().parse(req.body);
    const category = await updateCategory(req.params.id, data);
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
}

export async function removeCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await deleteCategory(req.params.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
}
