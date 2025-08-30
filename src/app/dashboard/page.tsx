import { RecentBox } from '@/components/RecentBox';
import { TrendingFeed } from '@/components/TrendingFeed';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Anime Dashboard</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RecentBox />
        <TrendingFeed />
      </div>
    </div>
  );
}
