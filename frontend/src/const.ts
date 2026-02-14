// Redirect to backend OAuth login - backend will redirect to Google
// Pass returnTo to redirect back after auth (e.g. /admin)
export const getLoginUrl = (returnTo?: string) => {
  const base = `${window.location.origin}/api/oauth/login`;
  if (returnTo) {
    return `${base}?returnTo=${encodeURIComponent(returnTo)}`;
  }
  return base;
};
