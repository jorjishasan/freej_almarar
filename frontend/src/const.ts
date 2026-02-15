// Base URL for API requests. In production (Netlify), API is on Railway.
const getApiOrigin = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return apiUrl ? new URL(apiUrl).origin : window.location.origin;
};

// Upload endpoint - must point to backend (Railway) when frontend is on Netlify
export const getUploadUrl = (folder: string) => `${getApiOrigin()}/api/upload/${folder}`;

// Redirect to backend OAuth login - backend will redirect to Google
// Pass returnTo to redirect back after auth (e.g. /admin)
export const getLoginUrl = (returnTo?: string) => {
  const base = `${getApiOrigin()}/api/oauth/login`;
  if (returnTo) {
    return `${base}?returnTo=${encodeURIComponent(returnTo)}`;
  }
  return base;
};
