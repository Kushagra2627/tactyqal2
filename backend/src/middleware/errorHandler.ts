import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.fields ? { fields: err.fields } : {})
      }
    });
    return;
  }

  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "body";
      fields[key] = issue.message;
    }
    res.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload",
        fields
      }
    });
    return;
  }

  // Handle Database Connection Errors with actionable message
  if (err?.code === "ECONNREFUSED" || err?.message?.includes("ECONNREFUSED")) {
    console.error("Database connection refused. Is PostgreSQL running on port 5432?");
    res.status(503).json({
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Database connection refused. Please ensure PostgreSQL is running on port 5432."
      }
    });
    return;
  }

  console.error("Unhandled Error:", err);
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred"
    }
  });
}
