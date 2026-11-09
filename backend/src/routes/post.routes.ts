import { Router } from "express";
import { getPosts, getPostBySlug } from "../controllers/post.controller.js";
import { publicCache } from "../middleware/cache.js";

const router = Router();

router.get("/", publicCache(60), getPosts);
router.get("/:slug", publicCache(60), getPostBySlug);

export default router;
