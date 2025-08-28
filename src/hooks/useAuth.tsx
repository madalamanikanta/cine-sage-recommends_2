import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType, AuthResult, OAuthProvider, UserProfile } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setInitialized(true);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      setInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: username ? { username } : undefined
      }
    });

    if (error) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Check your email to confirm your account!",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
    }

    return { error };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to sign out",
          variant: "destructive",
        });
      } else {
        // Clear local state immediately
        setUser(null);
        setSession(null);
        toast({
          title: "Signed out",
          description: "See you next time!",
        });
      }
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign out",
        variant: "destructive",
      });
    }
  };

  // Add missing methods to match AuthContextType interface
  const signInWithOTP = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    
    if (error) {
      toast({
        title: "OTP Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
      });
    }
    
    return { error };
  };

  const signInWithOAuth = async (provider: OAuthProvider): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    
    if (error) {
      toast({
        title: "OAuth Error",
        description: error.message,
        variant: "destructive",
      });
    }
    
    return { error };
  };

  const resendOTP = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    
    if (error) {
      toast({
        title: "Resend Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "OTP Resent",
        description: "Check your email for the new verification code.",
      });
    }
    
    return { error };
  };

  const verifyOTP = async (email: string, token: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    
    if (error) {
      toast({
        title: "Verification Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome!",
        description: "Your email has been verified successfully.",
      });
    }
    
    return { error };
  };

  const refreshSession = async () => {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Session refresh error:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<AuthResult> => {
    if (!user) {
      const error = new Error('No user logged in') as AuthError;
      return { error };
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates });
    
    if (error) {
      toast({
        title: "Profile Update Error",
        description: error.message,
        variant: "destructive",
      });
      return { error: error as unknown as AuthError };
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    }
    
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      initialized,
      signUp,
      signIn,
      signInWithOTP,
      signInWithOAuth,
      signOut,
      resendOTP,
      verifyOTP,
      refreshSession,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}