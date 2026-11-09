import { z } from "zod";

export const tagSchema = z.object({
  name: z.string().min(2, "Tag name must be at least 2 characters").max(100),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens").optional()
});

export type TagInput = z.infer<typeof tagSchema>;
