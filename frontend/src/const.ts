// Redirect to backend OAuth login - backend will redirect to Google
// Pass returnTo to redirect back after auth (e.g. /admin)
// In production (Netlify), API is on Railway - use VITE_API_URL to derive backend origin
export const getLoginUrl = (returnTo?: string) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const origin = apiUrl ? new URL(apiUrl).origin : window.location.origin;
  const base = `${origin}/api/oauth/login`;
  if (returnTo) {
    return `${base}?returnTo=${encodeURIComponent(returnTo)}`;
  }
  return base;
};
