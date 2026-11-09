import { Router } from "express";
import { subscribe } from "../controllers/newsletter.controller.js";
import { newsletterLimiter } from "../middleware/rateLimit.js";
import { noCache } from "../middleware/cache.js";

const router = Router();

router.post("/", newsletterLimiter, noCache, subscribe);

export default router;
