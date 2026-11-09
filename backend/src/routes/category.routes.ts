import { Router } from "express";
import { listCategories } from "../controllers/category.controller.js";
import { publicCache } from "../middleware/cache.js";

const router = Router();

router.get("/", publicCache(300), listCategories);

export default router;
