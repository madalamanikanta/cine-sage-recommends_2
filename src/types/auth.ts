// Authentication types and interfaces
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export interface AuthMethods {
  signUp: (email: string, password: string, username?: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithOTP: (email: string) => Promise<AuthResult>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resendOTP: (email: string) => Promise<AuthResult>;
  verifyOTP: (email: string, token: string) => Promise<AuthResult>;
}

export interface AuthResult {
  error: AuthError | null;
  data?: any;
}

export type OAuthProvider = 'google' | 'github' | 'discord';

export interface AuthFormData {
  email: string;
  password?: string;
  username?: string;
  confirmPassword?: string;
}

export type AuthMode = 'signin' | 'signup' | 'otp' | 'verify-otp';

export interface AuthContextType extends AuthState, AuthMethods {
  // Additional context methods
  refreshSession: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthResult>;
}

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  favorite_genres: string[];
  preferred_studios: string[];
  watching_since: string | null;
  anime_watched: number;
  total_episodes: number;
  created_at: string;
  updated_at: string;
}
