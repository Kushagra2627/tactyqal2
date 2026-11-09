import { Request, Response, NextFunction } from "express";
import { contactSchema } from "../validators/contact.validator.js";
import { saveContactMessage } from "../services/contact.service.js";

export async function submitContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = contactSchema.parse(req.body);
    const message = await saveContactMessage(data);
    res.status(201).json({
      success: true,
      data: {
        id: message.id,
        message: "Thank you for contacting us! We will get back to you shortly."
      }
    });
  } catch (err) {
    next(err);
  }
}
