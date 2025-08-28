// Jikan API service for fetching anime data
export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  synopsis?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  episodes?: number;
  status?: string;
  aired?: {
    from?: string;
    to?: string;
  };
  season?: string;
  year?: number;
  genres?: Array<{ mal_id: number; name: string }>;
  studios?: Array<{ mal_id: number; name: string }>;
  source?: string;
  rating?: string;
  duration?: string;
  images?: {
    jpg?: {
      image_url?: string;
      large_image_url?: string;
    };
  };
  trailer?: {
    url?: string;
  };
}

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

class JikanApiService {
  private baseUrl = 'https://api.jikan.moe/v4';
  private rateLimitDelay = 1000; // 1 second between requests

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      await this.delay(this.rateLimitDelay);
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`Jikan API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Jikan API request failed:', error);
      throw error;
    }
  }

  async getTopAnime(page: number = 1, limit: number = 25): Promise<JikanResponse<JikanAnime[]>> {
    return this.makeRequest<JikanResponse<JikanAnime[]>>(`/top/anime?page=${page}&limit=${limit}`);
  }

  async getAnimeByGenre(genreId: number, page: number = 1): Promise<JikanResponse<JikanAnime[]>> {
    return this.makeRequest<JikanResponse<JikanAnime[]>>(`/anime?genres=${genreId}&page=${page}&order_by=score&sort=desc`);
  }

  async searchAnime(query: string, page: number = 1): Promise<JikanResponse<JikanAnime[]>> {
    const encodedQuery = encodeURIComponent(query);
    return this.makeRequest<JikanResponse<JikanAnime[]>>(`/anime?q=${encodedQuery}&page=${page}&order_by=score&sort=desc`);
  }

  async getAnimeById(id: number): Promise<JikanResponse<JikanAnime>> {
    return this.makeRequest<JikanResponse<JikanAnime>>(`/anime/${id}/full`);
  }

  async getSeasonalAnime(year: number, season: string): Promise<JikanResponse<JikanAnime[]>> {
    return this.makeRequest<JikanResponse<JikanAnime[]>>(`/seasons/${year}/${season}`);
  }

  async getAnimeRecommendations(id: number): Promise<JikanResponse<any[]>> {
    return this.makeRequest<JikanResponse<any[]>>(`/anime/${id}/recommendations`);
  }

  async getGenres(): Promise<JikanResponse<Array<{ mal_id: number; name: string }>>> {
    return this.makeRequest<JikanResponse<Array<{ mal_id: number; name: string }>>>('/genres/anime');
  }

  // Transform Jikan data to our database format
  transformToDbFormat(jikanAnime: JikanAnime) {
    return {
      mal_id: jikanAnime.mal_id,
      title: jikanAnime.title,
      title_english: jikanAnime.title_english || null,
      title_japanese: jikanAnime.title_japanese || null,
      synopsis: jikanAnime.synopsis || null,
      score: jikanAnime.score || null,
      scored_by: jikanAnime.scored_by || null,
      rank: jikanAnime.rank || null,
      popularity: jikanAnime.popularity || null,
      members: jikanAnime.members || null,
      favorites: jikanAnime.favorites || null,
      episodes: jikanAnime.episodes || null,
      status: jikanAnime.status || null,
      aired_from: jikanAnime.aired?.from ? new Date(jikanAnime.aired.from).toISOString().split('T')[0] : null,
      aired_to: jikanAnime.aired?.to ? new Date(jikanAnime.aired.to).toISOString().split('T')[0] : null,
      season: jikanAnime.season || null,
      year: jikanAnime.year || null,
      genres: jikanAnime.genres?.map(g => g.name) || [],
      studios: jikanAnime.studios?.map(s => s.name) || [],
      source: jikanAnime.source || null,
      rating: jikanAnime.rating || null,
      duration: jikanAnime.duration || null,
      image_url: jikanAnime.images?.jpg?.large_image_url || jikanAnime.images?.jpg?.image_url || null,
      trailer_url: jikanAnime.trailer?.url || null
    };
  }
}

export const jikanApi = new JikanApiService();