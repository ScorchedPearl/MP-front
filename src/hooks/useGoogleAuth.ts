import { useGoogleLogin } from '@react-oauth/google';

const GOOGLE_TOKEN_KEY = '__Google_Access_Token__';

export function useGoogleAccessTokenLogin(): () => Promise<string> {
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar',
    flow: 'implicit',
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token;
      if (token) {
        localStorage.setItem(GOOGLE_TOKEN_KEY, token);
      }
    },
    onError: (error) => {
      console.error('Google login failed', error);
    },
  });

  return async () => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Google login timeout')), 10000);
      const checkToken = () => {
        const token = localStorage.getItem(GOOGLE_TOKEN_KEY);
        if (token) {
          clearTimeout(timeout);
          resolve(token);
        } else {
          setTimeout(checkToken, 300);
        }
      };
      login();
      checkToken();
    });
  };
}
