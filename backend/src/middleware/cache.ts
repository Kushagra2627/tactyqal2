import { Request, Response, NextFunction } from "express";

export function publicCache(seconds = 60) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader(
      "Cache-Control",
      `public, max-age=${seconds}, s-maxage=${seconds * 2}, stale-while-revalidate=${seconds * 4}`
    );
    next();
  };
}

export function noCache(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}
