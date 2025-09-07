export interface AnimeGenre {
  mal_id: number;
  name: string;
  type: string;
}

export interface AnimeTheme {
  mal_id: number;
  name: string;
  type: string;
}

export interface AnimeImage {
  jpg: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
  webp: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
}

export interface AnimeBase {
  mal_id: number;
  url: string;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  year: number | null;
  images: AnimeImage;
  genres: AnimeGenre[];
  themes: AnimeTheme[];
  
}

export interface JikanResponse<T> {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  data: T[];
}

export type WatchStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'rewatch';

export interface UserAnime {
  id: string;
  user_id: string;
  anime_id: number;
  status: WatchStatus;
  progress: number;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface AnimeWithUserData extends AnimeBase {
  user_data?: UserAnime;
}
