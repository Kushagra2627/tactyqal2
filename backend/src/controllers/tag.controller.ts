import { Request, Response, NextFunction } from "express";
import { tagSchema } from "../validators/tag.validator.js";
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
} from "../services/tag.service.js";

export async function listTags(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tags = await getAllTags();
    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (err) {
    next(err);
  }
}

export async function getTag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tag = await getTagById(req.params.id);
    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (err) {
    next(err);
  }
}

export async function createNewTag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = tagSchema.parse(req.body);
    const tag = await createTag(data);
    res.status(201).json({
      success: true,
      data: tag
    });
  } catch (err) {
    next(err);
  }
}

export async function updateExistingTag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = tagSchema.partial().parse(req.body);
    const tag = await updateTag(req.params.id, data);
    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (err) {
    next(err);
  }
}

export async function removeTag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await deleteTag(req.params.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
}
