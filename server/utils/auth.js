export const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  // Decode payload (only for demo, should use jwt-decode in prod)
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload;
};
