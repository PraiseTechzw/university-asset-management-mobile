// OAuth configuration for Google authentication
export const oauthConfig = {
  google: {
    redirectUri: 'cut-asset-manager://auth/callback',
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET || '',
  },
};

// Validate OAuth response URL
export const validateOAuthResponse = (url: string) => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    const error = params.get('error');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    
    if (error) {
      return { error, accessToken: null, refreshToken: null };
    }
    
    return { error: null, accessToken, refreshToken };
  } catch (error) {
    return { error: 'Invalid OAuth response URL', accessToken: null, refreshToken: null };
  }
};
