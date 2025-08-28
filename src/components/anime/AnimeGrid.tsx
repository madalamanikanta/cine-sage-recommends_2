import { AnimeCard } from './AnimeCard';
import { Skeleton } from '@/components/ui/skeleton';

interface Anime {
  mal_id: number;
  title: string;
  image_url?: string;
  score?: number;
  episodes?: number;
  year?: number;
  genres?: string[];
  status?: string;
  synopsis?: string;
}

interface AnimeGridProps {
  anime: Anime[];
  loading?: boolean;
  onAnimeClick?: (mal_id: number) => void;
  userAnimeData?: Record<number, {
    status?: string;
    user_score?: number;
    is_favorite?: boolean;
  }>;
  onStatusChange?: (mal_id: number, status: string) => void;
  onFavoriteToggle?: (mal_id: number) => void;
  className?: string;
}

export function AnimeGrid({
  anime,
  loading = false,
  onAnimeClick,
  userAnimeData = {},
  onStatusChange,
  onFavoriteToggle,
  className
}: AnimeGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <div className="space-y-2 p-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex gap-1">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (anime.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-24 h-24 rounded-full bg-gradient-primary/10 flex items-center justify-center">
          <span className="text-2xl">🎌</span>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No anime found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or explore different genres
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {anime.map((item) => {
        const userData = userAnimeData[item.mal_id];
        return (
          <AnimeCard
            key={item.mal_id}
            mal_id={item.mal_id}
            title={item.title}
            image_url={item.image_url}
            score={item.score}
            episodes={item.episodes}
            year={item.year}
            genres={item.genres}
            status={item.status}
            synopsis={item.synopsis}
            userStatus={userData?.status as any}
            userScore={userData?.user_score}
            isFavorite={userData?.is_favorite}
            onStatusChange={onStatusChange ? (status) => onStatusChange(item.mal_id, status) : undefined}
            onFavoriteToggle={onFavoriteToggle ? () => onFavoriteToggle(item.mal_id) : undefined}
            onClick={onAnimeClick ? () => onAnimeClick(item.mal_id) : undefined}
          />
        );
      })}
    </div>
  );
}