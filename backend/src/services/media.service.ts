import fs from "fs";
import path from "path";
import { pool } from "../db/pool.js";
import { config } from "../config/env.js";
import { NotFoundError } from "../utils/errors.js";

export interface StorageProvider {
  save(file: Express.Multer.File): Promise<{ filename: string; url: string; size: number; mime: string }>;
  delete(filename: string): Promise<void>;
}

export class LocalDiskStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), config.uploadDir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async save(file: Express.Multer.File) {
    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const targetPath = path.join(this.uploadDir, filename);
    await fs.promises.writeFile(targetPath, file.buffer);
    const url = `/uploads/${filename}`;
    return {
      filename,
      url,
      size: file.size,
      mime: file.mimetype
    };
  }

  async delete(filename: string) {
    const filePath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}

const storage: StorageProvider = new LocalDiskStorageProvider();

export async function uploadMediaFile(file: Express.Multer.File) {
  const stored = await storage.save(file);

  const res = await pool.query(
    `INSERT INTO media (filename, url, mime, size_bytes)
     VALUES ($1, $2, $3, $4)
     RETURNING id, filename, url, mime, size_bytes, width, height, created_at`,
    [stored.filename, stored.url, stored.mime, stored.size]
  );

  return res.rows[0];
}

export async function listMedia(page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  const countRes = await pool.query("SELECT COUNT(id)::int as total FROM media");
  const total = countRes.rows[0]?.total || 0;

  const res = await pool.query(
    `SELECT id, filename, url, mime, size_bytes, width, height, created_at
     FROM media
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [pageSize, offset]
  );

  return {
    items: res.rows,
    total,
    page,
    pageSize
  };
}

export async function deleteMediaFile(id: string) {
  const res = await pool.query("SELECT id, filename FROM media WHERE id = $1", [id]);
  if (res.rows.length === 0) {
    throw new NotFoundError("Media file not found");
  }

  const media = res.rows[0];
  await storage.delete(media.filename);
  await pool.query("DELETE FROM media WHERE id = $1", [id]);
  return { id };
}
