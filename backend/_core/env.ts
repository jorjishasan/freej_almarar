export const ENV = {
  sessionSecret: process.env.JWT_SECRET ?? process.env.SESSION_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  frontendUrl: process.env.FRONTEND_URL ?? "",
  backendUrl:
    process.env.BACKEND_URL ??
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : ""),
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  awsRegion: process.env.AWS_REGION ?? "us-east-1",
  awsBucket: process.env.AWS_BUCKET_NAME ?? "",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
};
