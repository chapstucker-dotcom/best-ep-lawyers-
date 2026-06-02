import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, firmData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
    signInWithGoogle: () => Promise<any>;
signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured, just set loading to false
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firmData: any) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured. Please contact the administrator.' } };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: firmData }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured. Please contact the administrator.' } };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured. Please contact the administrator.' } };
    }
    // Supabase handles the OAuth redirect and will restore the session on return.
    // IMPORTANT: Add your deploy URL(s) to Supabase Auth > URL Configuration (Redirect URLs).
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured. Please contact the administrator.' } };
    }
    return await supabase.auth.resetPasswordForEmail(email);
  };

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Supabase is not configured. Please contact the administrator.' } };
    }
    return await supabase.auth.updateUser({ password: newPassword });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isConfigured: isSupabaseConfigured,
      signUp, 
      signIn, 
      signInWithGoogle,
      signOut, 
      resetPassword, 
      updatePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};


