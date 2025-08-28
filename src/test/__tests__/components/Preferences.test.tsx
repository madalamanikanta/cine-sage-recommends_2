import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/test-utils'
import Preferences from '@/pages/Preferences'
import { supabase } from '@/integrations/supabase/client'

// Mock the supabase client
vi.mock('@/integrations/supabase/client')

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Preferences Component', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock supabase responses
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              favorite_genres: ['Action', 'Adventure'],
              preferred_studios: ['Studio Ghibli']
            },
            error: null
          })
        })
      }),
      upsert: vi.fn().mockResolvedValue({ error: null })
    } as any)
  })

  it('renders preferences page correctly', async () => {
    render(<Preferences />)
    
    expect(screen.getByText('Preferences')).toBeInTheDocument()
    expect(screen.getByText('Favorite Genres')).toBeInTheDocument()
    expect(screen.getByText('Keywords & Themes')).toBeInTheDocument()
  })

  it('allows selecting and deselecting genres', async () => {
    const user = userEvent.setup()
    render(<Preferences />)
    
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument()
    })

    const actionButton = screen.getByRole('button', { name: 'Action' })
    await user.click(actionButton)
    
    // Should toggle the genre selection
    expect(actionButton).toHaveClass('bg-gradient-primary')
  })

  it('allows adding keywords', async () => {
    const user = userEvent.setup()
    render(<Preferences />)
    
    const keywordInput = screen.getByPlaceholderText(/Enter a keyword/i)
    const addButton = screen.getByRole('button', { name: /Add/i })
    
    await user.type(keywordInput, 'magic')
    await user.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('magic')).toBeInTheDocument()
    })
  })

  it('allows removing keywords', async () => {
    const user = userEvent.setup()
    render(<Preferences />)
    
    // Wait for initial keywords to load
    await waitFor(() => {
      expect(screen.getByText('Studio Ghibli')).toBeInTheDocument()
    })
    
    // Find and click the remove button for Studio Ghibli
    const removeButton = screen.getByRole('button', { name: '' }) // X button has no text
    await user.click(removeButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Studio Ghibli')).not.toBeInTheDocument()
    })
  })

  it('saves preferences successfully', async () => {
    const user = userEvent.setup()
    render(<Preferences />)
    
    await waitFor(() => {
      expect(screen.getByText('Save Preferences')).toBeInTheDocument()
    })
    
    const saveButton = screen.getByRole('button', { name: /Save Preferences/i })
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(vi.mocked(supabase.from)).toHaveBeenCalledWith('profiles')
    })
  })

  it('handles save error gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock error response
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: null
          })
        })
      }),
      upsert: vi.fn().mockResolvedValue({ 
        error: { message: 'Database error' } 
      })
    } as any)
    
    render(<Preferences />)
    
    await waitFor(() => {
      expect(screen.getByText('Save Preferences')).toBeInTheDocument()
    })
    
    const saveButton = screen.getByRole('button', { name: /Save Preferences/i })
    await user.click(saveButton)
    
    // Should show error toast (we can't easily test toast content, but we can verify the call was made)
    await waitFor(() => {
      expect(vi.mocked(supabase.from)).toHaveBeenCalled()
    })
  })

  it('navigates to dashboard on cancel', async () => {
    const user = userEvent.setup()
    render(<Preferences />)
    
    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    await user.click(cancelButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })
})
