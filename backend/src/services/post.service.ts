import { pool } from "../db/pool.js";
import { CreatePostInput, UpdatePostInput, PostQueryInput } from "../validators/post.validator.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";
import { sanitizeContent } from "../utils/sanitize.js";
import { slugify } from "./category.service.js";

export interface FormattedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  category_id?: string | null;
  date: string;
  read: number;
  cover: string;
  status: "published" | "draft" | "scheduled";
  body: string;
  published_at?: string | null;
  author_id?: string | null;
  author_name?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image_url?: string | null;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

function calculateReadMinutes(text: string): number {
  const words = text.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatPostRow(row: any): FormattedPost {
  const dateStr = row.published_at
    ? new Date(row.published_at).toISOString().split("T")[0]
    : row.created_at
    ? new Date(row.created_at).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category_name || "General",
    category_id: row.category_id,
    date: dateStr,
    read: row.read_minutes || 3,
    cover: row.cover_url,
    status: row.status,
    body: row.body,
    published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
    author_id: row.author_id,
    author_name: row.author_name,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    og_image_url: row.og_image_url,
    tags: row.tags ? row.tags.filter(Boolean) : [],
    created_at: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : undefined
  };
}

export async function getPublicPosts(query: PostQueryInput) {
  const { search, category, page = 1, pageSize = 10 } = query;
  const offset = (page - 1) * pageSize;

  const conditions: string[] = ["p.status = 'published'", "p.published_at <= NOW()"];
  const params: any[] = [];

  if (category && category !== "All") {
    params.push(category.toLowerCase());
    conditions.push("(LOWER(c.name) = $" + params.length + " OR LOWER(c.slug) = $" + params.length + ")");
  }

  if (search && search.trim()) {
    params.push(`%${search.trim().toLowerCase()}%`);
    const idx = params.length;
    conditions.push(`(LOWER(p.title) LIKE $${idx} OR LOWER(p.excerpt) LIKE $${idx})`);
  }

  const whereClause = "WHERE " + conditions.join(" AND ");

  // Count total
  const countRes = await pool.query(
    `SELECT COUNT(p.id)::int as total
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}`,
    params
  );
  const total = countRes.rows[0]?.total || 0;

  // Fetch items
  const selectParams = [...params, pageSize, offset];
  const queryStr = `
    SELECT
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      u.name as author_name,
      ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL) as tags
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    ${whereClause}
    GROUP BY p.id, c.name, c.slug, u.name
    ORDER BY p.published_at DESC
    LIMIT $${selectParams.length - 1} OFFSET $${selectParams.length}
  `;

  const itemsRes = await pool.query(queryStr, selectParams);
  const items = itemsRes.rows.map(formatPostRow);

  return {
    items,
    total,
    page,
    pageSize
  };
}

export async function getPublicPostBySlug(slug: string): Promise<FormattedPost> {
  const queryStr = `
    SELECT
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      u.name as author_name,
      ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL) as tags
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.slug = $1 AND p.status = 'published' AND p.published_at <= NOW()
    GROUP BY p.id, c.name, c.slug, u.name
  `;

  const res = await pool.query(queryStr, [slug]);
  if (res.rows.length === 0) {
    throw new NotFoundError("Article not found");
  }
  return formatPostRow(res.rows[0]);
}

export async function getAdminPosts(query: PostQueryInput) {
  const { search, category, status, page = 1, pageSize = 50, sortBy = "published_at", sortOrder = "desc" } = query;
  const offset = (page - 1) * pageSize;

  const conditions: string[] = [];
  const params: any[] = [];

  if (status && status !== "all") {
    params.push(status);
    conditions.push(`p.status = $${params.length}`);
  }

  if (category && category !== "All") {
    params.push(category.toLowerCase());
    conditions.push(`(LOWER(c.name) = $${params.length} OR LOWER(c.slug) = $${params.length})`);
  }

  if (search && search.trim()) {
    params.push(`%${search.trim().toLowerCase()}%`);
    const idx = params.length;
    conditions.push(`(LOWER(p.title) LIKE $${idx} OR LOWER(p.excerpt) LIKE $${idx})`);
  }

  const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  const countRes = await pool.query(
    `SELECT COUNT(p.id)::int as total
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}`,
    params
  );
  const total = countRes.rows[0]?.total || 0;

  const allowedSortCols: Record<string, string> = {
    published_at: "p.published_at",
    created_at: "p.created_at",
    title: "p.title",
    read_minutes: "p.read_minutes"
  };
  const sortCol = allowedSortCols[sortBy] || "p.published_at";
  const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const selectParams = [...params, pageSize, offset];
  const queryStr = `
    SELECT
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      u.name as author_name,
      ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL) as tags
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    ${whereClause}
    GROUP BY p.id, c.name, c.slug, u.name
    ORDER BY ${sortCol} ${order} NULLS LAST
    LIMIT $${selectParams.length - 1} OFFSET $${selectParams.length}
  `;

  const itemsRes = await pool.query(queryStr, selectParams);
  const items = itemsRes.rows.map(formatPostRow);

  return {
    items,
    total,
    page,
    pageSize
  };
}

export async function getPostById(id: string): Promise<FormattedPost> {
  const queryStr = `
    SELECT
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      u.name as author_name,
      ARRAY_AGG(t.id) FILTER (WHERE t.id IS NOT NULL) as tag_ids,
      ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL) as tags
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.id = $1
    GROUP BY p.id, c.name, c.slug, u.name
  `;

  const res = await pool.query(queryStr, [id]);
  if (res.rows.length === 0) {
    throw new NotFoundError("Post not found");
  }
  return formatPostRow(res.rows[0]);
}

export async function createPost(data: CreatePostInput, authorId?: string): Promise<FormattedPost> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const slug = data.slug || slugify(data.title);
    const existing = await client.query("SELECT id FROM posts WHERE slug = $1", [slug]);
    if (existing.rows.length > 0) {
      throw new ConflictError("A post with this slug already exists");
    }

    // Resolve category
    let categoryId = data.category_id || null;
    if (!categoryId && data.category) {
      const catSlug = slugify(data.category);
      const catRes = await client.query(
        "SELECT id FROM categories WHERE slug = $1 OR LOWER(name) = LOWER($2)",
        [catSlug, data.category.trim()]
      );
      if (catRes.rows.length > 0) {
        categoryId = catRes.rows[0].id;
      } else {
        const newCat = await client.query(
          "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id",
          [data.category.trim(), catSlug]
        );
        categoryId = newCat.rows[0].id;
      }
    }

    const sanitizedBody = sanitizeContent(data.body);
    const coverUrl = data.cover_url || data.cover || "https://www.tactyqal.com/application/assets/images/blog-ele.png";
    const readMinutes = data.read_minutes || data.read || calculateReadMinutes(sanitizedBody);

    let publishedAt: string | null = null;
    if (data.status === "published") {
      publishedAt = data.published_at || (data.date ? new Date(data.date).toISOString() : new Date().toISOString());
    } else if (data.status === "scheduled" && data.published_at) {
      publishedAt = data.published_at;
    }

    const insertRes = await client.query(
      `INSERT INTO posts (
        slug, title, excerpt, body, category_id, cover_url,
        status, published_at, read_minutes, author_id,
        seo_title, seo_description, og_image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        slug,
        data.title.trim(),
        data.excerpt.trim(),
        sanitizedBody,
        categoryId,
        coverUrl,
        data.status || "draft",
        publishedAt,
        readMinutes,
        authorId || null,
        data.seo_title || data.title,
        data.seo_description || data.excerpt,
        data.og_image_url || coverUrl
      ]
    );

    const post = insertRes.rows[0];

    // Link tags if provided
    if (data.tag_ids && data.tag_ids.length > 0) {
      for (const tagId of data.tag_ids) {
        await client.query(
          "INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [post.id, tagId]
        );
      }
    }

    await client.query("COMMIT");
    return getPostById(post.id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updatePost(id: string, data: UpdatePostInput): Promise<FormattedPost> {
  const current = await getPostById(id);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let slug = current.slug;
    if (data.slug && data.slug !== current.slug) {
      slug = data.slug;
      const conflict = await client.query("SELECT id FROM posts WHERE slug = $1 AND id != $2", [slug, id]);
      if (conflict.rows.length > 0) {
        throw new ConflictError("A post with this slug already exists");
      }
    } else if (data.title && !data.slug && data.title !== current.title) {
      // Keep existing slug unless explicitly changed
    }

    let categoryId = data.category_id !== undefined ? data.category_id : current.category_id;
    if (data.category && data.category_id === undefined) {
      const catSlug = slugify(data.category);
      const catRes = await client.query(
        "SELECT id FROM categories WHERE slug = $1 OR LOWER(name) = LOWER($2)",
        [catSlug, data.category.trim()]
      );
      if (catRes.rows.length > 0) {
        categoryId = catRes.rows[0].id;
      } else {
        const newCat = await client.query(
          "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id",
          [data.category.trim(), catSlug]
        );
        categoryId = newCat.rows[0].id;
      }
    }

    const title = data.title !== undefined ? data.title.trim() : current.title;
    const excerpt = data.excerpt !== undefined ? data.excerpt.trim() : current.excerpt;
    const body = data.body !== undefined ? sanitizeContent(data.body) : current.body;
    const coverUrl = (data.cover_url || data.cover) !== undefined ? (data.cover_url || data.cover)! : current.cover;
    const status = data.status !== undefined ? data.status : current.status;
    const readMinutes = (data.read_minutes || data.read) !== undefined ? (data.read_minutes || data.read)! : current.read;

    let publishedAt = current.published_at;
    if (data.status === "published" && !current.published_at) {
      publishedAt = new Date().toISOString();
    } else if (data.published_at !== undefined) {
      publishedAt = data.published_at;
    } else if (data.date !== undefined) {
      publishedAt = new Date(data.date).toISOString();
    }

    await client.query(
      `UPDATE posts SET
        slug = $1, title = $2, excerpt = $3, body = $4, category_id = $5,
        cover_url = $6, status = $7, published_at = $8, read_minutes = $9,
        seo_title = $10, seo_description = $11, og_image_url = $12, updated_at = NOW()
       WHERE id = $13`,
      [
        slug,
        title,
        excerpt,
        body,
        categoryId,
        coverUrl,
        status,
        publishedAt,
        readMinutes,
        data.seo_title !== undefined ? data.seo_title : current.seo_title,
        data.seo_description !== undefined ? data.seo_description : current.seo_description,
        data.og_image_url !== undefined ? data.og_image_url : current.og_image_url,
        id
      ]
    );

    if (data.tag_ids !== undefined) {
      await client.query("DELETE FROM post_tags WHERE post_id = $1", [id]);
      for (const tagId of data.tag_ids) {
        await client.query(
          "INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [id, tagId]
        );
      }
    }

    await client.query("COMMIT");
    return getPostById(id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updatePostStatus(id: string, status?: "published" | "draft" | "scheduled"): Promise<FormattedPost> {
  const current = await getPostById(id);
  const newStatus = status || (current.status === "published" ? "draft" : "published");

  let publishedAt = current.published_at;
  if (newStatus === "published" && !publishedAt) {
    publishedAt = new Date().toISOString();
  }

  await pool.query(
    "UPDATE posts SET status = $1, published_at = $2, updated_at = NOW() WHERE id = $3",
    [newStatus, publishedAt, id]
  );

  return getPostById(id);
}

export async function deletePost(id: string): Promise<{ id: string }> {
  await getPostById(id);
  await pool.query("DELETE FROM posts WHERE id = $1", [id]);
  return { id };
}
