import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isCheckingAuth: boolean;
  authError: string | null;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  claimAdminAccess: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkAdminStatus: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  /**
   * Check if user.id exists in admin_users.user_id
   * Uses maybeSingle() as required
   */
  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error querying admin_users table:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Exception during admin check:', err);
      return false;
    }
  }, []);

  // Initialize session and verify access
  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      setIsCheckingAuth(true);
      setAuthError(null);
      try {
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          console.warn('Error fetching session:', sessionErr);
        }

        if (sessionData && sessionData.session) {
          if (!isMounted) return;
          setSession(sessionData.session);
          
          const { data: userData } = await supabase.auth.getUser();
          const currentUser = userData?.user || sessionData.session.user;
          setUser(currentUser);

          if (currentUser?.id) {
            const adminValid = await checkAdminStatus(currentUser.id);
            if (isMounted) {
              setIsAdmin(adminValid);
            }
          } else {
            if (isMounted) setIsAdmin(false);
          }
        } else {
          if (isMounted) {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
          }
        }
      } catch (err: any) {
        console.error('Session initialization error:', err);
        if (isMounted) {
          setAuthError(err?.message || 'Authentication verification error');
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    }

    initializeSession();

    // Listen for auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);
      const currentUser = newSession?.user || null;
      setUser(currentUser);

      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setIsCheckingAuth(false);
      } else if (currentUser?.id) {
        // Token refresh or sign in
        const adminValid = await checkAdminStatus(currentUser.id);
        if (isMounted) {
          setIsAdmin(adminValid);
          setIsCheckingAuth(false);
        }
      } else {
        if (isMounted) {
          setIsAdmin(false);
          setIsCheckingAuth(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsCheckingAuth(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        setIsCheckingAuth(false);
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        const adminValid = await checkAdminStatus(data.user.id);
        setIsAdmin(adminValid);
        setIsCheckingAuth(false);

        if (!adminValid) {
          return {
            success: true,
            error: 'You are signed in, but you are not authorized as an admin.',
          };
        }
        return { success: true };
      }

      setIsCheckingAuth(false);
      return { success: false, error: 'Sign in failed. No user returned.' };
    } catch (err: any) {
      setIsCheckingAuth(false);
      const msg = err?.message || 'Sign in failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const signUp = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsCheckingAuth(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
      });

      if (error) {
        setIsCheckingAuth(false);
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        const adminValid = await checkAdminStatus(data.user.id);
        setIsAdmin(adminValid);
        setIsCheckingAuth(false);
        return { success: true };
      }

      setIsCheckingAuth(false);
      return { success: false, error: 'Signup response empty' };
    } catch (err: any) {
      setIsCheckingAuth(false);
      const msg = err?.message || 'Sign up failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  /**
   * Helper to register current authenticated user in admin_users if authorized or setup
   */
  const claimAdminAccess = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Please sign in first.' };
    }
    try {
      const { error } = await supabase.from('admin_users').insert({
        user_id: user.id,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      setIsAdmin(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to authorize admin user.' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsCheckingAuth(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isCheckingAuth,
        authError,
        signIn,
        signUp,
        claimAdminAccess,
        signOut,
        checkAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
