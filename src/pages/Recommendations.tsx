import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const genres = JSON.parse(localStorage.getItem("genres") || "[]");
    const keywords = JSON.parse(localStorage.getItem("keywords") || "[]");

    // mock data - replace with API later
    const fakeData = [
      { title: "Naruto", desc: "Action-packed ninja adventures", genre: "Shounen" },
      { title: "Your Name", desc: "Romantic supernatural drama", genre: "Romance" },
      { title: "Attack on Titan", desc: "Dark fantasy & survival", genre: "Action" },
    ];

    setRecommendations(fakeData);

    // log activity
    const activity = {
      action: "Viewed recommendations",
      timestamp: new Date().toISOString(),
    };
    const history = JSON.parse(localStorage.getItem("recentActivity") || "[]");
    history.unshift(activity);
    localStorage.setItem("recentActivity", JSON.stringify(history));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} onLogout={() => {}} />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Recommendations
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((anime, idx) => (
            <Card key={idx} className="bg-gradient-card border-border/50 hover:shadow-xl transition">
              <CardHeader>
                <CardTitle className="text-xl">{anime.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{anime.desc}</p>
                <p className="mt-2 text-xs text-primary">Genre: {anime.genre}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
