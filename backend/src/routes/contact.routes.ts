import { Router } from "express";
import { submitContact } from "../controllers/contact.controller.js";
import { contactLimiter } from "../middleware/rateLimit.js";
import { noCache } from "../middleware/cache.js";

const router = Router();

router.post("/", contactLimiter, noCache, submitContact);

export default router;
