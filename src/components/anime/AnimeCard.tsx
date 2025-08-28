import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Play, Plus, Check, Heart, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimeCardProps {
  mal_id: number;
  title: string;
  image_url?: string;
  score?: number;
  episodes?: number;
  year?: number;
  genres?: string[];
  status?: string;
  synopsis?: string;
  userStatus?: 'plan_to_watch' | 'watching' | 'completed' | 'dropped' | 'on_hold' | null;
  userScore?: number;
  isFavorite?: boolean;
  onStatusChange?: (status: string) => void;
  onScoreChange?: (score: number) => void;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  plan_to_watch: { label: 'Plan to Watch', icon: Plus, color: 'bg-blue-500' },
  watching: { label: 'Watching', icon: Play, color: 'bg-green-500' },
  completed: { label: 'Completed', icon: Check, color: 'bg-purple-500' },
  dropped: { label: 'Dropped', icon: Clock, color: 'bg-red-500' },
  on_hold: { label: 'On Hold', icon: Clock, color: 'bg-yellow-500' },
};

export function AnimeCard({
  mal_id,
  title,
  image_url,
  score,
  episodes,
  year,
  genres = [],
  status,
  synopsis,
  userStatus,
  userScore,
  isFavorite,
  onStatusChange,
  onScoreChange,
  onFavoriteToggle,
  onClick,
  className
}: AnimeCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  const truncatedSynopsis = synopsis && synopsis.length > 150 
    ? synopsis.substring(0, 150) + '...' 
    : synopsis;

  const StatusIcon = userStatus ? statusConfig[userStatus]?.icon : Plus;

  return (
    <Card className={cn(
      "group relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50",
      "transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20",
      "animate-fade-in cursor-pointer",
      className
    )} onClick={onClick}>
      <div className="relative aspect-[3/4] overflow-hidden">
        {!imageError && image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Play className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Score badge */}
        {score && (
          <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0 backdrop-blur-sm">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {score.toFixed(1)}
          </Badge>
        )}

        {/* User status indicator */}
        {userStatus && (
          <div className={cn(
            "absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center",
            statusConfig[userStatus]?.color,
            "text-white shadow-lg"
          )}>
            <StatusIcon className="w-4 h-4" />
          </div>
        )}

        {/* Favorite indicator */}
        {isFavorite && (
          <Heart className="absolute bottom-2 right-2 w-6 h-6 text-red-500 fill-current" />
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {year && <span>{year}</span>}
            {episodes && <span>• {episodes} eps</span>}
            {status && <span>• {status}</span>}
          </div>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs px-2 py-0.5">
                {genre}
              </Badge>
            ))}
            {genres.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{genres.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Synopsis */}
        {synopsis && (
          <div className="text-xs text-muted-foreground">
            <p className={cn("leading-relaxed", !showFullSynopsis && "line-clamp-3")}>
              {showFullSynopsis ? synopsis : truncatedSynopsis}
            </p>
            {synopsis.length > 150 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullSynopsis(!showFullSynopsis);
                }}
                className="text-primary hover:underline mt-1"
              >
                {showFullSynopsis ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* User score */}
        {userScore && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Your score:</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{userScore}/10</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          {onStatusChange && (
            <Button
              size="sm"
              variant={userStatus ? "secondary" : "default"}
              className="flex-1 h-8 text-xs"
              onClick={() => onStatusChange(userStatus || 'plan_to_watch')}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {userStatus ? statusConfig[userStatus]?.label : 'Add to List'}
            </Button>
          )}
          
          {onFavoriteToggle && (
            <Button
              size="sm"
              variant={isFavorite ? "destructive" : "outline"}
              className="h-8 px-3"
              onClick={onFavoriteToggle}
            >
              <Heart className={cn("w-3 h-3", isFavorite && "fill-current")} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}