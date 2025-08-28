import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, Users, Shield, Zap, Heart, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Recommendations",
      description: "Get personalized anime suggestions based on your unique preferences and viewing history."
    },
    {
      icon: TrendingUp,
      title: "Trending Discoveries",
      description: "Stay up-to-date with the latest and most popular anime series trending right now."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Benefit from a vast database of anime data and community-curated recommendations."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is secure and private. We only use your preferences to improve your experience."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant recommendations with our optimized recommendation engine."
    },
    {
      icon: Heart,
      title: "Made for Fans",
      description: "Built by anime lovers, for anime lovers. Discover your next obsession."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 backdrop-blur-sm bg-background/50 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AnimeVerse
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/auth")}
            className="hover:bg-primary/10"
          >
            Sign In
          </Button>
          <GradientButton onClick={() => navigate("/auth")}>
            Get Started
          </GradientButton>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              Discover Your Next
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Anime Adventure
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Powered by AI recommendations, community insights, and your personal taste.
              Find anime that matches your mood perfectly.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <GradientButton 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6"
            >
              Start Exploring
              <Sparkles className="ml-2 w-5 h-5" />
            </GradientButton>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Watch Demo
            </Button>
          </div>
          
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose AnimeVerse?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the perfect anime experience with our advanced features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Anime?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of anime fans discovering their next favorite series
          </p>
          <GradientButton 
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            Join AnimeVerse Today
          </GradientButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 AnimeVerse. Discover your next anime adventure.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
