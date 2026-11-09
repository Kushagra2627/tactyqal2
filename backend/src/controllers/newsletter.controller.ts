import { Request, Response, NextFunction } from "express";
import { newsletterSchema } from "../validators/newsletter.validator.js";
import { subscribeNewsletter } from "../services/newsletter.service.js";

export async function subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = newsletterSchema.parse(req.body);
    const result = await subscribeNewsletter(data);
    res.status(200).json({
      success: true,
      data: {
        message: "Successfully subscribed to our newsletter",
        email: result.email
      }
    });
  } catch (err) {
    next(err);
  }
}
