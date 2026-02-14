import type { Express, NextFunction, Request, Response } from "express";
import passport from "passport";
import type { Profile } from "passport-google-oauth20";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { User } from "../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

function getRedirectUri(req: Request): string {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.headers["x-forwarded-host"] || req.get("host") || "localhost:3000";
  return `${protocol}://${host}`;
}

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return [];
  return raw.split(",").map((e: string) => e.trim().toLowerCase()).filter(Boolean);
}

export function registerOAuthRoutes(app: Express) {
  const { googleClientId, googleClientSecret } = ENV;
  if (!googleClientId || !googleClientSecret) return;

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: "/api/oauth/callback",
        scope: ["profile", "email"],
        passReqToCallback: true,
      },
      (_req: Request, _at: string, _rt: string, profile: Profile, done: (err: null, p: Profile) => void) =>
        done(null, profile)
    )
  );

  passport.serializeUser((user: Express.User, done: (err: null, id?: string) => void) =>
    done(null, (user as User).openId)
  );
  passport.deserializeUser(async (openId: string, done: (err: Error | null, user?: User) => void) => {
    try {
      const user = await db.getUserByOpenId(openId);
      done(null, user ?? undefined);
    } catch (err) {
      done(err instanceof Error ? err : new Error(String(err)), undefined);
    }
  });

  app.get("/api/oauth/login", (req: Request, res: Response, next: NextFunction) => {
    const callbackURL = `${getRedirectUri(req)}/api/oauth/callback`;
    passport.authenticate("google", { scope: ["profile", "email"], callbackURL } as passport.AuthenticateOptions)(req, res, next);
  });

  app.get(
    "/api/oauth/callback",
    (req: Request, res: Response, next: NextFunction) => {
      const callbackURL = `${getRedirectUri(req)}/api/oauth/callback`;
      passport.authenticate(
        "google",
        { failureRedirect: "/", callbackURL } as passport.AuthenticateOptions,
        async (err: unknown, profile: Profile | undefined) => {
          if (err || !profile) return res.redirect(302, "/");
          const openId = profile.id;
          const email = profile.emails?.[0]?.value ?? null;
          const name = profile.displayName ?? profile.name?.givenName ?? null;
          const role = getAdminEmails().indexOf((email ?? "").toLowerCase()) >= 0 ? "admin" : "user";

          await db.upsertUser({
            openId,
            name,
            email,
            loginMethod: "google",
            role,
            lastSignedIn: new Date(),
          });

          const user = await db.getUserByOpenId(openId);
          if (!user) return res.redirect(302, "/");
          req.login(user, (err) =>
            err ? res.status(500).json({ error: "Login failed" }) : res.redirect(302, "/")
          );
        }
      )(req, res, next);
    }
  );
}
