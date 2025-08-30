import { useEffect, useState } from 'react';
import { getRecentAnime } from '@/lib/api/jikan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { AnimeCard } from './anime/AnimeCard';
import { Loader2 } from 'lucide-react';
import { AnimeBase } from '@/types/anime';
import { Button } from './ui/button';

export function RecentBox() {
  const [recentAnime, setRecentAnime] = useState<AnimeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecentAnime = async (pageNum: number) => {
    try {
      setError(null);
      const response = await getRecentAnime(pageNum);
      if (pageNum === 1) {
        setRecentAnime(response.data);
      } else {
        setRecentAnime(prev => [...prev, ...response.data]);
      }
      setHasMore(response.pagination.has_next_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent anime');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentAnime(1);
  }, []);

  if (loading && page === 1) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle>Recent Anime</CardTitle>
          <CardDescription>Loading recent releases...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Anime</CardTitle>
        <CardDescription>Latest releases this season</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full pr-4">
          {error ? (
            <div className="text-center p-4 text-destructive">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => fetchRecentAnime(page)}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentAnime.map((anime) => (
                  <AnimeCard
                    key={anime.mal_id}
                    mal_id={anime.mal_id}
                    title={anime.title}
                    image_url={anime.images.jpg.image_url}
                    score={anime.score}
                    episodes={anime.episodes || undefined}
                    year={anime.year || undefined}
                    genres={anime.genres.map(g => g.name)}
                    status={anime.status}
                    synopsis={anime.synopsis}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPage(p => p + 1);
                      fetchRecentAnime(page + 1);
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
