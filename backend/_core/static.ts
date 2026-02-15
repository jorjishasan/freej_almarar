import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { ENV } from "./env";

/**
 * Serve pre-built frontend static files. Used in production when frontend is bundled.
 * When FRONTEND_URL is set, frontend is hosted elsewhere (e.g. Netlify) - skip static serving.
 */
export function serveStatic(app: Express) {
  if (ENV.frontendUrl) {
    app.use("*", (_req, res) => res.redirect(302, ENV.frontendUrl + "/"));
    return;
  }

  const distPath = path.resolve(import.meta.dirname, "../..", "frontend", "dist");

  if (!fs.existsSync(distPath)) {
    console.warn(`[Static] Build directory not found: ${distPath}, skipping static serve`);
    app.use("*", (_req, res) => res.status(404).send("Not found"));
    return;
  }

  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
