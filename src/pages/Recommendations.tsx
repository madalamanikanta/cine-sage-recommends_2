import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnimeItem {
  mal_id: number;
  url: string;
  images?: { jpg?: { image_url?: string } };
  title: string;
  score?: number | null;
  popularity?: number | null;
  rank?: number | null;
  genres?: { mal_id: number; name: string }[];
  aired?: { from?: string | null };
}

const GENRE_NAME_TO_ID: Record<string, number> = {
  Action: 1,
  Adventure: 2,
  Comedy: 4,
  Drama: 8,
  Fantasy: 10,
  Horror: 14,
  Mystery: 7,
  Romance: 22,
  "Sci-Fi": 24,
  "Slice of Life": 36,
  Sports: 30,
  Thriller: 41,
  Shounen: 27,
  Shoujo: 25,
  Seinen: 42,
  Josei: 43,
  Mecha: 18,
  Supernatural: 37,
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/gi, "");
function mapGenreToId(genre: string): number | null {
  const n = normalize(genre);
  for (const [k, v] of Object.entries(GENRE_NAME_TO_ID)) {
    if (normalize(k) === n) return v;
  }
  return null;
}

export default function Recommendations() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [genres, setGenres] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [popular, setPopular] = useState<AnimeItem[]>([]);
  const [trending, setTrending] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("You must be logged in to see recommendations.");
      return;
    }

    const loadPrefs = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("favorite_genres, preferred_studios")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setGenres(data?.favorite_genres || []);
        setKeywords(data?.preferred_studios || []);

        if (data?.favorite_genres?.length) {
          fetchRecommendations(data.favorite_genres);
        } else {
          setLoading(false);
        }
      } catch (err: any) {
        console.error(err);
        setError("Failed to load preferences.");
        setLoading(false);
      }
    };

    loadPrefs();
  }, [user]);

  async function fetchRecommendations(favGenres: string[]) {
    setLoading(true);
    try {
      const ids = favGenres.map(mapGenreToId).filter((x): x is number => !!x);
      if (!ids.length) {
        setError("No valid genres found in preferences.");
        setLoading(false);
        return;
      }

      // ✅ Fetch Popular (popularity order)
      const popularRequests = ids.map((id) =>
        fetch(`https://api.jikan.moe/v4/anime?genres=${id}&order_by=popularity&sort=asc&limit=12`).then((r) => r.json())
      );

      // ✅ Fetch Trending (members/recency order)
      const trendingRequests = ids.map((id) =>
        fetch(`https://api.jikan.moe/v4/anime?genres=${id}&order_by=members&sort=desc&limit=12`).then((r) => r.json())
      );

      const [popularRes, trendingRes] = await Promise.all([
        Promise.all(popularRequests),
        Promise.all(trendingRequests),
      ]);

      const mapPopular: Record<number, AnimeItem> = {};
      popularRes.forEach((res) => {
        (res.data || []).forEach((a: any) => {
          mapPopular[a.mal_id] = {
            mal_id: a.mal_id,
            url: a.url,
            images: a.images,
            title: a.title,
            score: a.score ?? null,
            popularity: a.popularity ?? null,
            rank: a.rank ?? null,
            genres: a.genres ?? [],
            aired: a.aired ?? { from: null },
          };
        });
      });

      const mapTrending: Record<number, AnimeItem> = {};
      trendingRes.forEach((res) => {
        (res.data || []).forEach((a: any) => {
          mapTrending[a.mal_id] = {
            mal_id: a.mal_id,
            url: a.url,
            images: a.images,
            title: a.title,
            score: a.score ?? null,
            popularity: a.popularity ?? null,
            rank: a.rank ?? null,
            genres: a.genres ?? [],
            aired: a.aired ?? { from: null },
          };
        });
      });

      setPopular(Object.values(mapPopular).slice(0, 24));
      setTrending(Object.values(mapTrending).slice(0, 24));
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  }

  const renderGrid = (list: AnimeItem[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {list.map((a) => (
        <a
          key={a.mal_id}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="aspect-[2/3] w-full bg-gray-100">
            <img
              src={a.images?.jpg?.image_url ?? ""}
              alt={a.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-2">
            {/* ✅ Anime title with theme color */}
            <h3 className="text-sm font-semibold text-primary line-clamp-2">{a.title}</h3>
            <div className="text-xs text-muted-foreground mt-1">
              <div>Score: {a.score ?? "—"} · Rank: {a.rank ?? "—"}</div>
              <div className="truncate">Genres: {a.genres?.map((g) => g.name).join(", ")}</div>
            </div>
          </CardContent>
        </a>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} onLogout={() => {}} />

      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Recommendations
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover anime tailored to your favorite genres and themes.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading recommendations...
          </div>
        )}

        {error && <div className="text-center text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-muted-foreground text-center">
              Based on genres: <strong>{genres.join(", ") || "None"}</strong> & keywords:{" "}
              <strong>{keywords.join(", ") || "None"}</strong>
            </div>

            {/* ✅ Popular Section */}
            {popular.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">🔥 Popular in your genres</h2>
                {renderGrid(popular)}
              </section>
            )}

            {/* ✅ Trending Section */}
            {trending.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">📈 Trending now</h2>
                {renderGrid(trending)}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
