import { Request, Response, NextFunction } from "express";
import { postQuerySchema } from "../validators/post.validator.js";
import { getPublicPosts, getPublicPostBySlug } from "../services/post.service.js";

export async function getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = postQuerySchema.parse(req.query);
    const result = await getPublicPosts(query);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
}

export async function getPostBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = req.params.slug;
    const post = await getPublicPostBySlug(slug);
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
}
