import { supabase } from './supabase';
import { Profile } from './supabase';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { oauthConfig, validateOAuthResponse } from './oauth';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'technician' | 'staff';
  department: string | null;
  phone: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  department?: string;
  phone?: string;
}

// Get current authenticated user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Sign in with email and password
export const signIn = async (credentials: LoginCredentials): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'No user data received' };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return { user: null, error: 'User profile not found' };
    }

    return { user: profile, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
};

// Sign up new user
export const signUp = async (userData: RegisterData): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'No user data received' };
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: userData.email,
        full_name: userData.full_name,
        role: 'staff', // Default role
        department: userData.department || null,
        phone: userData.phone || null,
      })
      .select()
      .single();

    if (profileError || !profile) {
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(data.user.id);
      return { user: null, error: 'Failed to create user profile' };
    }

    return { user: profile, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
};

// Sign out
export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: error.message };
    }

    // Clear any stored user data
    await SecureStore.deleteItemAsync('user_profile');
    
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: 'An unexpected error occurred' };
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'cut-asset-manager://reset-password',
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error: 'An unexpected error occurred' };
  }
};

// Update password
export const updatePassword = async (newPassword: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Update password error:', error);
    return { error: 'An unexpected error occurred' };
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

// Get user role
export const getUserRole = async (): Promise<'admin' | 'technician' | 'staff' | null> => {
  try {
    const user = await getCurrentUser();
    return user?.role || null;
  } catch (error) {
    console.error('Get user role error:', error);
    return null;
  }
};

// Check if user has admin access
export const isAdmin = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'admin';
};

// Check if user has technician access
export const isTechnician = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'technician' || role === 'admin';
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: oauthConfig.google.redirectUri,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.url) {
      return { user: null, error: 'Failed to get OAuth URL' };
    }

    // Open the OAuth URL in a web browser
    const result = await WebBrowser.openAuthSessionAsync(data.url, oauthConfig.google.redirectUri);

    if (result.type === 'success' && result.url) {
      // Validate the OAuth response
      const { error: oauthError, accessToken, refreshToken } = validateOAuthResponse(result.url);
      
      if (oauthError) {
        return { user: null, error: oauthError };
      }

      if (accessToken) {
        // Set the session manually
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) {
          return { user: null, error: sessionError.message };
        }

        if (sessionData.session?.user) {
                     // Get user profile
           const { data: profile, error: profileError } = await supabase
             .from('profiles')
             .select('*')
             .eq('id', sessionData.session.user.id)
             .single();

          if (profileError || !profile) {
                         // Create user profile if it doesn't exist
             const { data: newProfile, error: createError } = await supabase
               .from('profiles')
               .insert({
                 id: sessionData.session.user.id,
                 email: sessionData.session.user.email || '',
                 full_name: sessionData.session.user.user_metadata?.full_name || 'Google User',
                 role: 'staff', // Default role for Google users
                 department: null,
                 phone: null,
               })
               .select()
               .single();

            if (createError || !newProfile) {
              return { user: null, error: 'Failed to create user profile' };
            }

            return { user: newProfile, error: null };
          }

          return { user: profile, error: null };
        }
      }
    } else if (result.type === 'cancel') {
      return { user: null, error: 'Google authentication was cancelled' };
    }

    return { user: null, error: 'Google authentication failed' };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { user: null, error: 'An unexpected error occurred during Google authentication' };
  }
};
