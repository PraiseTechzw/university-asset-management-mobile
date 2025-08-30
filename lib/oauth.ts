import { makeRedirectUri } from 'expo-auth-session';

// OAuth configuration for different providers
export const oauthConfig = {
  google: {
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: 'cut-asset-manager',
      path: '/(auth)/login',
    }),
  },
};

// Helper function to get redirect URI for a specific provider
export const getRedirectUri = (provider: 'google' | 'github' | 'facebook') => {
  return makeRedirectUri({
    scheme: 'cut-asset-manager',
    path: `/(auth)/${provider}-callback`,
  });
};

// Validate OAuth response
export const validateOAuthResponse = (url: string) => {
  try {
    const urlObj = new URL(url);
    const accessToken = urlObj.searchParams.get('access_token');
    const refreshToken = urlObj.searchParams.get('refresh_token');
    const error = urlObj.searchParams.get('error');
    
    if (error) {
      return { error, accessToken: null, refreshToken: null };
    }
    
    if (!accessToken) {
      return { error: 'No access token received', accessToken: null, refreshToken: null };
    }
    
    return { error: null, accessToken, refreshToken };
  } catch (err) {
    return { error: 'Invalid OAuth response URL', accessToken: null, refreshToken: null };
  }
};
