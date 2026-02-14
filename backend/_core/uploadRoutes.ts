import type { Request, Response, NextFunction } from "express";
import { createUploadMiddleware, isUploadConfigured } from "./upload";

export function registerUploadRoutes(app: import("express").Express) {
  if (!isUploadConfigured()) {
    console.warn("[Upload] S3 not configured, /api/upload disabled");
    return;
  }

  const upload = createUploadMiddleware();

  app.post(
    "/api/upload/:folder",
    (req, res, next) => {
      const user = (req as Request & { user?: { role: string } }).user;
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin required" });
      }
      next();
    },
    (req: Request, res: Response, next: NextFunction) => {
      upload(req, res, (err: unknown) => {
        if (err) {
          console.error("[Upload] Error:", err);
          const msg = err instanceof Error ? err.message : "Upload failed";
          const status = (err as { status?: number })?.status === 413 ? 413 : 400;
          return res.status(status).json({ error: msg });
        }
        next();
      });
    },
    (req: Request, res: Response) => {
      const file = req.file as { location?: string } | undefined;
      if (!file?.location) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      res.json({ url: file.location });
    }
  );
}
