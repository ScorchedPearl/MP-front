// src/hooks/useGoogleAuth.ts
import { useGoogleLogin } from "@react-oauth/google";

export function useGoogleAccessTokenLogin() {
  return useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar",
    flow: "implicit",
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token;
      if (token) {
        localStorage.setItem("__Google_Access_Token__", token);
      }
    },
    onError: (errorResponse) => {
      console.error("❌ Google login failed", errorResponse);
    },
  });
}

export function getGoogleToken(): string | null {
  return localStorage.getItem("__Google_Access_Token__");
}
