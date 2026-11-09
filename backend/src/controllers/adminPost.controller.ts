import { Request, Response, NextFunction } from "express";
import {
  createPostSchema,
  updatePostSchema,
  updateStatusSchema,
  postQuerySchema
} from "../validators/post.validator.js";
import {
  getAdminPosts,
  getPostById,
  createPost,
  updatePost,
  updatePostStatus,
  deletePost
} from "../services/post.service.js";

export async function listPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = postQuerySchema.parse(req.query);
    const result = await getAdminPosts(query);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
}

export async function getPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await getPostById(req.params.id);
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
}

export async function createNewPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = createPostSchema.parse(req.body);
    const authorId = req.user?.id;
    const post = await createPost(data, authorId);
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
}

export async function updateExistingPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = updatePostSchema.parse(req.body);
    const post = await updatePost(req.params.id, data);
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
}

export async function changePostStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let status: "published" | "draft" | "scheduled" | undefined;
    if (req.body && req.body.status) {
      status = updateStatusSchema.parse(req.body).status;
    }
    const post = await updatePostStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
}

export async function removePost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await deletePost(req.params.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
}
