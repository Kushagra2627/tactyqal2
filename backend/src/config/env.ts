import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres@localhost:5432/tactyqal_db",
  jwtSecret: process.env.JWT_SECRET || "super-secure-tactyqal-secret-key-change-in-production-min32chars",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "tactyqal_token",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  adminEmail: process.env.ADMIN_EMAIL || "admin@tactyqal.com",
  adminPassword: process.env.ADMIN_PASSWORD || "AdminPassword123!",
  adminName: process.env.ADMIN_NAME || "Tactyqal Admin",
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
  baseUrl: process.env.BASE_URL || "http://localhost:5000"
};
