import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { AuthUser, getCurrentUser, signIn, signOut, signUp, resetPassword, signInWithGoogle } from '../../lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<{ user: AuthUser | null; error: string | null }>;
  signInWithGoogle: () => Promise<{ user: AuthUser | null; error: string | null }>;
  signUp: (userData: { email: string; password: string; full_name: string; department?: string; phone?: string }) => Promise<{ user: AuthUser | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        refreshUser();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await refreshUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (credentials: { email: string; password: string }) => {
    const result = await signIn(credentials);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const handleSignUp = async (userData: { email: string; password: string; full_name: string; department?: string; phone?: string }) => {
    const result = await signUp(userData);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.error) {
      setUser(null);
    }
    return result;
  };

  const handleSignInWithGoogle = async () => {
    const result = await signInWithGoogle();
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn: handleSignIn,
    signInWithGoogle: handleSignInWithGoogle,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
