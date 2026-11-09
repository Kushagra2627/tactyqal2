import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { noCache } from "../middleware/cache.js";

const router = Router();

router.post("/login", authLimiter, noCache, login);
router.post("/logout", noCache, logout);
router.get("/me", requireAuth, noCache, me);

export default router;
