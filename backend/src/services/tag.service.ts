import { pool } from "../db/pool.js";
import { TagInput } from "../validators/tag.validator.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";
import { slugify } from "./category.service.js";

export async function getAllTags() {
  const result = await pool.query(
    "SELECT id, name, slug, created_at FROM tags ORDER BY name ASC"
  );
  return result.rows;
}

export async function getTagById(id: string) {
  const result = await pool.query(
    "SELECT id, name, slug, created_at FROM tags WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) throw new NotFoundError("Tag not found");
  return result.rows[0];
}

export async function createTag(data: TagInput) {
  const slug = data.slug || slugify(data.name);
  const existing = await pool.query("SELECT id FROM tags WHERE slug = $1", [slug]);
  if (existing.rows.length > 0) {
    throw new ConflictError("Tag with this slug already exists");
  }

  const result = await pool.query(
    "INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id, name, slug, created_at",
    [data.name.trim(), slug]
  );
  return result.rows[0];
}

export async function updateTag(id: string, data: Partial<TagInput>) {
  const current = await getTagById(id);
  const name = data.name !== undefined ? data.name.trim() : current.name;
  const slug = data.slug !== undefined ? data.slug : (data.name ? slugify(name) : current.slug);

  const conflict = await pool.query(
    "SELECT id FROM tags WHERE slug = $1 AND id != $2",
    [slug, id]
  );
  if (conflict.rows.length > 0) {
    throw new ConflictError("Tag with this slug already exists");
  }

  const result = await pool.query(
    "UPDATE tags SET name = $1, slug = $2 WHERE id = $3 RETURNING id, name, slug, created_at",
    [name, slug, id]
  );
  return result.rows[0];
}

export async function deleteTag(id: string) {
  await getTagById(id);
  await pool.query("DELETE FROM tags WHERE id = $1", [id]);
  return { id };
}
