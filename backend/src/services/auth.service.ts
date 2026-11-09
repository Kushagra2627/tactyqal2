import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { config } from "../config/env.js";
import { UnauthorizedError } from "../utils/errors.js";
import { AuthUser } from "../middleware/auth.js";

export async function loginUser(email: string, password: string):Promise<{ token: string; user: AuthUser }> {
  const result = await pool.query(
    "SELECT id, email, password_hash, name, role FROM users WHERE email = $1",
    [email.toLowerCase().trim()]
  );

  if (result.rows.length === 0) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const payload: AuthUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any
  });

  return { token, user: payload };
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const result = await pool.query(
    "SELECT id, email, name, role FROM users WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}
