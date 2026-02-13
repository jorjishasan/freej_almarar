// Redirect to backend OAuth login - backend will redirect to Google
export const getLoginUrl = () => {
  return `${window.location.origin}/api/oauth/login`;
};
