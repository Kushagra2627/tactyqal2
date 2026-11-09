import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Add a subject"),
  message: z.string().min(10, "Message needs at least 10 characters"),
  company: z.string().optional().nullable()
});

export type ContactInput = z.infer<typeof contactSchema>;
