import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  slug: z
    .string()
    .min(2)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens")
    .optional(),
  excerpt: z.string().min(5, "Excerpt must be at least 5 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"),
  category_id: z.string().uuid("Invalid category ID").optional().nullable(),
  category: z.string().optional(),
  cover_url: z.string().min(1, "Cover URL is required"),
  cover: z.string().optional(),
  status: z.enum(["published", "draft", "scheduled"]).default("draft"),
  published_at: z.string().datetime().optional().nullable(),
  date: z.string().optional(),
  read_minutes: z.coerce.number().int().min(1).default(3),
  read: z.coerce.number().optional(),
  seo_title: z.string().max(255).optional().nullable(),
  seo_description: z.string().optional().nullable(),
  og_image_url: z.string().optional().nullable(),
  tag_ids: z.array(z.string().uuid()).optional()
});

export const updatePostSchema = createPostSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(["published", "draft", "scheduled"])
});

export const postQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["published_at", "created_at", "title", "read_minutes"]).default("published_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostQueryInput = z.infer<typeof postQuerySchema>;
