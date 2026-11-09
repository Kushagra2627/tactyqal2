import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../validators/auth.validator.js";
import { loginUser, getUserById } from "../services/auth.service.js";
import { config } from "../config/env.js";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { token, user } = await loginUser(email, password);

    // 7 days cookie expiration
    const maxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      maxAge,
      path: "/"
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.clearCookie(config.cookieName, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      path: "/"
    });

    res.status(200).json({
      success: true,
      data: {
        message: "Logged out successfully"
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Not authenticated"
        }
      });
      return;
    }

    const user = await getUserById(req.user.id);
    if (!user) {
      res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "User session invalid"
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
}
