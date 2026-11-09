import { pool } from "../db/pool.js";
import { CategoryInput } from "../validators/category.validator.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getAllCategories() {
  const result = await pool.query(
    "SELECT id, name, slug, created_at FROM categories ORDER BY name ASC"
  );
  return result.rows;
}

export async function getCategoryById(id: string) {
  const result = await pool.query(
    "SELECT id, name, slug, created_at FROM categories WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) throw new NotFoundError("Category not found");
  return result.rows[0];
}

export async function createCategory(data: CategoryInput) {
  const slug = data.slug || slugify(data.name);
  const existing = await pool.query("SELECT id FROM categories WHERE slug = $1", [slug]);
  if (existing.rows.length > 0) {
    throw new ConflictError("Category with this slug already exists");
  }

  const result = await pool.query(
    "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id, name, slug, created_at",
    [data.name.trim(), slug]
  );
  return result.rows[0];
}

export async function updateCategory(id: string, data: Partial<CategoryInput>) {
  const current = await getCategoryById(id);
  const name = data.name !== undefined ? data.name.trim() : current.name;
  const slug = data.slug !== undefined ? data.slug : (data.name ? slugify(name) : current.slug);

  const conflict = await pool.query(
    "SELECT id FROM categories WHERE slug = $1 AND id != $2",
    [slug, id]
  );
  if (conflict.rows.length > 0) {
    throw new ConflictError("Category with this slug already exists");
  }

  const result = await pool.query(
    "UPDATE categories SET name = $1, slug = $2 WHERE id = $3 RETURNING id, name, slug, created_at",
    [name, slug, id]
  );
  return result.rows[0];
}

export async function deleteCategory(id: string) {
  await getCategoryById(id);
  await pool.query("DELETE FROM categories WHERE id = $1", [id]);
  return { id };
}
