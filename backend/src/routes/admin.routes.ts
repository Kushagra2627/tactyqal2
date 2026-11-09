import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { noCache } from "../middleware/cache.js";
import {
  listPosts,
  getPost,
  createNewPost,
  updateExistingPost,
  changePostStatus,
  removePost
} from "../controllers/adminPost.controller.js";
import {
  listCategories,
  getCategory,
  createNewCategory,
  updateExistingCategory,
  removeCategory
} from "../controllers/category.controller.js";
import {
  listTags,
  getTag,
  createNewTag,
  updateExistingTag,
  removeTag
} from "../controllers/tag.controller.js";
import { getStats } from "../controllers/stats.controller.js";
import { upload, list as listMedia, remove as removeMedia, uploadMiddleware } from "../controllers/media.controller.js";

const router = Router();

// Protect all admin routes
router.use(requireAuth);
router.use(requireRole("admin"));
router.use(noCache);

// Admin Posts
router.get("/posts", listPosts);
router.get("/posts/:id", getPost);
router.post("/posts", createNewPost);
router.put("/posts/:id", updateExistingPost);
router.patch("/posts/:id/status", changePostStatus);
router.delete("/posts/:id", removePost);

// Admin Categories
router.get("/categories", listCategories);
router.get("/categories/:id", getCategory);
router.post("/categories", createNewCategory);
router.put("/categories/:id", updateExistingCategory);
router.delete("/categories/:id", removeCategory);

// Admin Tags
router.get("/tags", listTags);
router.get("/tags/:id", getTag);
router.post("/tags", createNewTag);
router.put("/tags/:id", updateExistingTag);
router.delete("/tags/:id", removeTag);

// Admin Stats
router.get("/stats", getStats);

// Admin Media
router.post("/media", uploadMiddleware.single("file"), upload);
router.get("/media", listMedia);
router.delete("/media/:id", removeMedia);

export default router;
