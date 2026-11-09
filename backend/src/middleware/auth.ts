import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";

export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "editor";
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[config.cookieName];
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthUser;
    req.user = decoded;
  } catch (err) {
    // Invalid token, do not authenticate
  }
  next();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[config.cookieName];
  if (!token) {
    return next(new UnauthorizedError("Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid or expired session"));
  }
}

export function requireRole(role: "admin" | "editor") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }
    if (req.user.role !== role && req.user.role !== "admin") {
      return next(new ForbiddenError("Access forbidden: insufficient permissions"));
    }
    next();
  };
}
