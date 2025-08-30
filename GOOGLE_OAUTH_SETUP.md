# Google OAuth Setup for Supabase

This guide explains how to set up Google OAuth authentication with your Supabase project.

## Prerequisites

- Supabase project with authentication enabled
- Google Cloud Console project
- Expo app with `expo-auth-session` plugin

## Step 1: Configure Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application" as the application type
6. Add these authorized redirect URIs:
   - `https://asddokodyqoxhuuzkspn.supabase.co/auth/v1/callback`
   - `cut-asset-manager://auth/callback`
7. Copy the Client ID and Client Secret

## Step 2: Configure Supabase Authentication

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Providers"
3. Find "Google" and click "Edit"
4. Enable Google provider
5. Enter your Google Client ID and Client Secret
6. Save the configuration

## Step 3: Update Environment Variables

Add these to your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://asddokodyqoxhuuzkspn.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Test the Integration

1. Run your app: `pnpm start`
2. Go to the login screen
3. Tap "Continue with Google"
4. Complete the Google OAuth flow
5. You should be redirected back to the app and signed in

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**: Make sure the redirect URI in Google Cloud Console matches exactly
2. **"Provider not enabled" error**: Ensure Google provider is enabled in Supabase
3. **Deep link not working**: Check that the scheme is properly configured in app.json

### Debug Steps

1. Check browser console for OAuth errors
2. Verify Supabase authentication logs
3. Ensure all environment variables are set correctly

## Security Notes

- Never commit your Google Client Secret to version control
- Use environment variables for sensitive configuration
- Regularly rotate your OAuth credentials
- Monitor authentication logs for suspicious activity

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Expo Auth Session Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
