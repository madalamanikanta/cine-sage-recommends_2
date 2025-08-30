import { AnimeBase, JikanResponse } from "@/types/anime";

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests to respect rate limits

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRateLimit<T>(endpoint: string): Promise<T> {
  const url = `${JIKAN_BASE_URL}${endpoint}`;
  await delay(RATE_LIMIT_DELAY);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Jikan API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function getRecentAnime(page = 1): Promise<JikanResponse<AnimeBase>> {
  return fetchWithRateLimit<JikanResponse<AnimeBase>>(`/seasons/now?page=${page}&limit=12`);
}

export async function getTrendingAnime(page = 1): Promise<JikanResponse<AnimeBase>> {
  return fetchWithRateLimit<JikanResponse<AnimeBase>>(`/top/anime?filter=airing&page=${page}&limit=12`);
}

export async function searchAnime(query: string, page = 1): Promise<JikanResponse<AnimeBase>> {
  return fetchWithRateLimit<JikanResponse<AnimeBase>>(`/anime?q=${encodeURIComponent(query)}&page=${page}&limit=12`);
}

export async function getAnimeById(id: number): Promise<{ data: AnimeBase }> {
  return fetchWithRateLimit<{ data: AnimeBase }>(`/anime/${id}`);
}

export async function getAnimeRecommendations(id: number): Promise<JikanResponse<{ entry: AnimeBase }>> {
  return fetchWithRateLimit<JikanResponse<{ entry: AnimeBase }>>(`/anime/${id}/recommendations`);
}

export async function getAnimeByGenre(genreId: number, page = 1): Promise<JikanResponse<AnimeBase>> {
  return fetchWithRateLimit<JikanResponse<AnimeBase>>(`/anime?genres=${genreId}&page=${page}&limit=12`);
}

// Cache for genres to avoid repeated API calls
let genresCache: { [key: string]: { mal_id: number; name: string }[] } | null = null;

export async function getAnimeGenres(): Promise<{ mal_id: number; name: string }[]> {
  if (genresCache) {
    return genresCache;
  }

  const response = await fetchWithRateLimit<JikanResponse<{ mal_id: number; name: string }>>('/genres/anime');
  genresCache = response.data;
  return response.data;
}
