-- Create comprehensive anime database schema

-- User profiles table with anime preferences
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  favorite_genres TEXT[] DEFAULT '{}',
  preferred_studios TEXT[] DEFAULT '{}',
  watching_since DATE DEFAULT CURRENT_DATE,
  anime_watched INTEGER DEFAULT 0,
  total_episodes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Anime data table (cached from Jikan API)
CREATE TABLE public.anime (
  mal_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  title_english TEXT,
  title_japanese TEXT,
  synopsis TEXT,
  score DECIMAL(3,2),
  scored_by INTEGER,
  rank INTEGER,
  popularity INTEGER,
  members INTEGER,
  favorites INTEGER,
  episodes INTEGER,
  status TEXT,
  aired_from DATE,
  aired_to DATE,
  season TEXT,
  year INTEGER,
  genres TEXT[] DEFAULT '{}',
  studios TEXT[] DEFAULT '{}',
  source TEXT,
  rating TEXT,
  duration TEXT,
  image_url TEXT,
  trailer_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User anime interactions (ratings, watch status)
CREATE TABLE public.user_anime (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mal_id INTEGER NOT NULL REFERENCES public.anime(mal_id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('plan_to_watch', 'watching', 'completed', 'dropped', 'on_hold')),
  user_score INTEGER CHECK (user_score >= 1 AND user_score <= 10),
  episodes_watched INTEGER DEFAULT 0,
  start_date DATE,
  finish_date DATE,
  rewatched_times INTEGER DEFAULT 0,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mal_id)
);

-- User recommendations table
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mal_id INTEGER NOT NULL REFERENCES public.anime(mal_id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('similar_genre', 'opposite_genre', 'collaborative', 'trending', 'personalized')),
  score DECIMAL(3,2) NOT NULL,
  reasoning TEXT,
  is_viewed BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mal_id, recommendation_type)
);

-- Anime reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mal_id INTEGER NOT NULL REFERENCES public.anime(mal_id) ON DELETE CASCADE,
  review_text TEXT NOT NULL,
  is_spoiler BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mal_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for anime (public read access)
CREATE POLICY "Anyone can view anime data" ON public.anime FOR SELECT USING (true);
CREATE POLICY "Service role can manage anime data" ON public.anime FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for user_anime
CREATE POLICY "Users can view their own anime list" ON public.user_anime FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own anime list" ON public.user_anime FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for recommendations
CREATE POLICY "Users can view their own recommendations" ON public.recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own recommendations" ON public.recommendations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage recommendations" ON public.recommendations FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can manage their own reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_anime_updated_at BEFORE UPDATE ON public.anime FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_anime_updated_at BEFORE UPDATE ON public.user_anime FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_anime_genres ON public.anime USING GIN(genres);
CREATE INDEX idx_anime_studios ON public.anime USING GIN(studios);
CREATE INDEX idx_anime_score ON public.anime(score DESC);
CREATE INDEX idx_anime_year ON public.anime(year DESC);
CREATE INDEX idx_user_anime_status ON public.user_anime(status);
CREATE INDEX idx_user_anime_score ON public.user_anime(user_score DESC);
CREATE INDEX idx_recommendations_type ON public.recommendations(recommendation_type);
CREATE INDEX idx_recommendations_score ON public.recommendations(score DESC);