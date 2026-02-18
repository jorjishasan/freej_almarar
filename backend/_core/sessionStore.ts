import { createRequire } from "module";
import session from "express-session";

const require = createRequire(import.meta.url);

/**
 * Parse DATABASE_URL (mysql://user:pass@host:port/db) into MySQLStore options.
 */
function parseDbUrl(url: string): { host: string; port: number; user: string; password: string; database: string } | null {
  try {
    const u = new URL(url);
    const database = u.pathname?.replace(/^\//, "") || "";
    if (!database) return null;
    return {
      host: u.hostname || "localhost",
      port: u.port ? parseInt(u.port, 10) : 3306,
      user: decodeURIComponent(u.username || "root"),
      password: decodeURIComponent(u.password || ""),
      database,
    };
  } catch {
    return null;
  }
}

export type SessionStore = session.Store | undefined;

/**
 * Create a session store: MySQL when DATABASE_URL is set, otherwise undefined (MemoryStore).
 */
export function createSessionStore(): SessionStore {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith("mysql")) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[Session] DATABASE_URL not set or not MySQL - using MemoryStore (not recommended for production)");
    }
    return undefined;
  }

  const opts = parseDbUrl(url);
  if (!opts) {
    console.warn("[Session] Could not parse DATABASE_URL - using MemoryStore");
    return undefined;
  }

  try {
    const MySQLStore = require("express-mysql-session")(session);
    const store = new MySQLStore(
      {
        ...opts,
        clearExpired: true,
        checkExpirationInterval: 900000,
        createDatabaseTable: true,
      }
    );
    store.onReady?.().then(() => {
      console.log("[Session] MySQL session store ready");
    }).catch((err: unknown) => {
      console.warn("[Session] MySQL store init warning:", err);
    });
    return store as session.Store;
  } catch (err) {
    console.warn("[Session] Failed to create MySQL store, using MemoryStore:", err);
    return undefined;
  }
}
