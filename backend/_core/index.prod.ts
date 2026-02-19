/**
 * Production entry point. No Vite/dev dependencies - uses static file serving only.
 * Use this for deployment to avoid bundling @tailwindcss/vite.
 */
import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import { createSessionStore } from "./sessionStore";
import { createServer } from "http";
import net from "net";
import passport from "passport";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { ENV } from "./env";
import { registerOAuthRoutes } from "./oauth";
import { registerUploadRoutes } from "./uploadRoutes";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic } from "./static";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  app.set("trust proxy", 1);

  // CORS: normalize origins (strip trailing slash) to avoid mismatch
  const normalizeOrigin = (url: string) => url.replace(/\/$/, "");
  const allowedOrigins = ENV.frontendUrl
    ? ENV.frontendUrl.split(",").map((o) => normalizeOrigin(o.trim())).filter(Boolean)
    : [];
  app.use(
    cors({
      origin:
        allowedOrigins.length > 0
          ? (origin, cb) => {
              const norm = origin ? normalizeOrigin(origin) : "";
              const allowed = !norm || allowedOrigins.some((a) => a === norm || a === origin);
              if (allowed) cb(null, origin || allowedOrigins[0]);
              else cb(null, false);
            }
          : true,
      credentials: true,
    })
  );

  const server = createServer(app);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  const sessionStore = createSessionStore();
  app.use(
    session({
      secret: ENV.sessionSecret,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: ENV.isProduction,
        sameSite: "lax", // Always lax because Netlify proxies /api making it same-origin
        maxAge: 365 * 24 * 60 * 60 * 1000,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  registerOAuthRoutes(app);
  registerUploadRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  serveStatic(app);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
