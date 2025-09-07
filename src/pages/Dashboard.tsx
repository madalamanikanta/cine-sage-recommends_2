import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Settings, TrendingUp, Users, Heart, Clock } from "lucide-react";
import { RecentBox } from "@/components/RecentBox";
import { useAuth } from "@/hooks/useAuth";
import { TrendingFeed } from "@/components/TrendingFeed";
import { SupabaseConnectionTest } from "@/components/SupabaseConnectionTest";

export default function Dashboard() {
  const [userName] = useState("Anime Fan"); // TODO: Get from auth context
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const recordActivity = (action: string) => {
    const activity = {
      action,
      timestamp: new Date().toISOString(),
    };
    const history = JSON.parse(localStorage.getItem("recentActivity") || "[]");
    history.unshift(activity);
    localStorage.setItem("recentActivity", JSON.stringify(history));
  };
  const handleLogout = async () => {
    await signOut();
    recordActivity("Logged out");
    navigate("/");
  };

  const quickActions = [
    {
      title: "Get Recommendations",
      description: "Discover new anime based on your preferences",
      icon: Sparkles,
      action: () => navigate("/recommendations"),
      color: "text-anime-primary"
    },
    {
      title: "Update Preferences",
      description: "Manage your favorite genres and keywords",
      icon: Settings,
      action: () => navigate("/preferences"),
      color: "text-anime-secondary"
    },
    {
      title: "Trending Anime",
      description: "See what's popular right now",
      icon: TrendingUp,
      action: () => navigate("/Trending?filter=trending"),
      color: "text-anime-accent"
    }
  ];

  const stats = [
    { label: "Recommendations Generated", value: "127", icon: Sparkles },
    { label: "Anime Discovered", value: "43", icon: Heart },
    { label: "Hours Saved", value: "24", icon: Clock },
    { label: "Genres Explored", value: "8", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} onLogout={handleLogout} />
      
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome back, {userName}!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to discover your next favorite anime? Your personalized recommendations are waiting.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Database Connection Status */}
        <div className="mb-6">
          <SupabaseConnectionTest />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <action.icon className={`h-8 w-8 ${action.color} group-hover:animate-glow`} />
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={action.action}
                    className="w-full"
                    variant="outline"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent and Trending Anime */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RecentBox />
          <TrendingFeed />
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4 py-8">
          <h3 className="text-2xl font-semibold text-foreground">Ready for your next anime adventure?</h3>
          <p className="text-muted-foreground">Let CineSage guide you to your perfect match.</p>
          <GradientButton
            onClick={() => navigate("/recommendations")}
            className="px-8 py-3 text-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Get Recommendations
          </GradientButton>
        </div>
      </div>
    </div>
  );
}