const GOOGLE_TOKEN_KEY = '__Google_Access_Token__';

export function getGoogleAccessToken(): string | null {
  return localStorage.getItem(GOOGLE_TOKEN_KEY);
}

export function clearGoogleToken() {
  localStorage.removeItem(GOOGLE_TOKEN_KEY);
}
