import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../useAuth'
import { supabase } from '@/integrations/supabase/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signInWithOtp: vi.fn(),
      signInWithOAuth: vi.fn(),
      resend: vi.fn(),
      verifyOtp: vi.fn(),
      refreshSession: vi.fn(),
    },
    from: vi.fn(() => ({
      upsert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  }
}))

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBe(null)
    expect(result.current.session).toBe(null)
  })

  it('should handle successful sign up', async () => {
    const mockSignUp = vi.mocked(supabase.auth.signUp)
    mockSignUp.mockResolvedValue({ error: null, data: { user: null, session: null } })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    const signUpResult = await result.current.signUp('test@example.com', 'password123', 'testuser')

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: {
        emailRedirectTo: 'http://localhost:3000/',
        data: { username: 'testuser' }
      }
    })
    expect(signUpResult.error).toBe(null)
  })

  it('should handle sign up error', async () => {
    const mockError = { message: 'Email already registered' }
    const mockSignUp = vi.mocked(supabase.auth.signUp)
    mockSignUp.mockResolvedValue({ error: mockError, data: { user: null, session: null } } as any)

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    const signUpResult = await result.current.signUp('test@example.com', 'password123')

    expect(signUpResult.error).toBe(mockError)
  })

  it('should handle successful sign in', async () => {
    const mockSignIn = vi.mocked(supabase.auth.signInWithPassword)
    mockSignIn.mockResolvedValue({ error: null, data: { user: null, session: null } })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    const signInResult = await result.current.signIn('test@example.com', 'password123')

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(signInResult.error).toBe(null)
  })

  it('should handle sign out', async () => {
    const mockSignOut = vi.mocked(supabase.auth.signOut)
    mockSignOut.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await result.current.signOut()

    expect(mockSignOut).toHaveBeenCalled()
  })

  it('should handle OTP sign in', async () => {
    const mockSignInWithOtp = vi.mocked(supabase.auth.signInWithOtp)
    mockSignInWithOtp.mockResolvedValue({ error: null, data: { user: null, session: null } } as any)

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    const otpResult = await result.current.signInWithOTP('test@example.com')

    expect(mockSignInWithOtp).toHaveBeenCalledWith({ email: 'test@example.com' })
    expect(otpResult.error).toBe(null)
  })

  it('should handle OAuth sign in', async () => {
    const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth)
    mockSignInWithOAuth.mockResolvedValue({ error: null, data: { provider: 'google', url: 'https://oauth-url.com' } } as any)

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    const oauthResult = await result.current.signInWithOAuth('google')

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({ provider: 'google' })
    expect(oauthResult.error).toBe(null)
  })

  it('should update profile successfully', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' }
    const mockFrom = vi.mocked(supabase.from)
    const mockUpsert = vi.fn().mockResolvedValue({ error: null })
    mockFrom.mockReturnValue({ upsert: mockUpsert } as any)

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    // Simulate user being logged in
    result.current.user = mockUser as any

    const updateResult = await result.current.updateProfile({
      username: 'newusername',
      favorite_genres: ['Action', 'Comedy']
    })

    expect(mockUpsert).toHaveBeenCalledWith({
      id: 'user-123',
      username: 'newusername',
      favorite_genres: ['Action', 'Comedy']
    })
    expect(updateResult.error).toBe(null)
  })

  it('should handle update profile when not logged in', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    const updateResult = await result.current.updateProfile({
      username: 'newusername'
    })

    expect(updateResult.error).toBeDefined()
    expect(updateResult.error?.message).toBe('No user logged in')
  })
})
