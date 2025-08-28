import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { TrendingUp, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Anime {
  id: number;
  title: { romaji: string };
  coverImage: { large: string };
  averageScore: number;
  genres: string[];
}

const Trending = () => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const query = `
          query {
            Page(page: 1, perPage: 10) {
              media(type: ANIME, sort: TRENDING_DESC) {
                id
                title {
                  romaji
                }
                coverImage {
                  large
                }
                averageScore
                genres
              }
            }
          }
        `;

        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors) {
          throw new Error(data.errors[0]?.message || "GraphQL error");
        }

        setAnime(data.data?.Page?.media || []);
      } catch (err) {
        console.error("Failed to fetch trending anime:", err);
        toast({
          title: "Error",
          description: "Failed to load trending anime. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isAuthenticated={true} onLogout={handleLogout} />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <TrendingUp className="h-12 w-12 text-primary mx-auto animate-pulse" />
              <p className="text-lg text-muted-foreground">Loading trending anime...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} onLogout={handleLogout} />
      
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <TrendingUp className="h-8 w-8 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Trending Anime
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the hottest anime series that everyone's talking about right now.
          </p>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {anime.map((a) => (
            <motion.div
              key={a.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={a.coverImage.large}
                    alt={a.title.romaji}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  {a.averageScore && (
                    <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{a.averageScore}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {a.title.romaji}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {a.genres.slice(0, 3).join(", ")}
                    {a.genres.length > 3 && "..."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {anime.length === 0 && !loading && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              No trending anime found. Please try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
