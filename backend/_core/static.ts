import express, { type Express } from "express";
import fs from "fs";
import path from "path";

/**
 * Serve pre-built frontend static files. Used in production.
 * Kept separate from vite.ts so we don't pull in @tailwindcss/vite at runtime.
 */
export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "../..", "frontend", "dist");

  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
