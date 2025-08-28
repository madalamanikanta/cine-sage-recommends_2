import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock Supabase responses
const handlers = [
  // Mock auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        user_metadata: { username: 'testuser' }
      }
    })
  }),

  // Mock logout
  http.post('*/auth/v1/logout', () => {
    return HttpResponse.json({}, { status: 204 })
  }),

  // Mock user session
  http.get('*/auth/v1/user', () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'test@example.com',
      user_metadata: { username: 'testuser' }
    })
  }),

  // Mock profiles table
  http.get('*/rest/v1/profiles', () => {
    return HttpResponse.json([
      {
        id: 'mock-user-id',
        username: 'testuser',
        favorite_genres: ['Action', 'Adventure'],
        preferred_studios: ['Studio Ghibli', 'Madhouse'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ])
  }),

  http.post('*/rest/v1/profiles', () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      username: 'testuser',
      favorite_genres: ['Action', 'Adventure'],
      preferred_studios: ['Studio Ghibli', 'Madhouse'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString()
    }, { status: 201 })
  }),

  // Mock anime table
  http.get('*/rest/v1/anime', () => {
    return HttpResponse.json([
      {
        mal_id: 1,
        title: 'Test Anime',
        title_english: 'Test Anime',
        synopsis: 'A test anime for testing purposes',
        score: 8.5,
        genres: ['Action', 'Adventure'],
        status: 'Finished Airing',
        episodes: 24,
        year: 2024
      }
    ])
  }),

  // Mock external API - AniList GraphQL
  http.post('https://graphql.anilist.co', () => {
    return HttpResponse.json({
      data: {
        Page: {
          media: [
            {
              id: 1,
              title: { romaji: 'Test Anime', english: 'Test Anime' },
              description: 'A test anime',
              coverImage: { large: 'https://example.com/image.jpg' },
              averageScore: 85,
              genres: ['Action', 'Adventure'],
              status: 'FINISHED',
              episodes: 24,
              startDate: { year: 2024 }
            }
          ]
        }
      }
    })
  })
]

export const server = setupServer(...handlers)
