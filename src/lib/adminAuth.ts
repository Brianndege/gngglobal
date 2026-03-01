const TOKEN_KEY = "gng_admin_token";

export function saveAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAdminAuthHeaders() {
  const token = getAdminToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
