import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Plus, X, Save, Loader2 } from "lucide-react";

export default function Preferences() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const availableGenres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
    "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Thriller",
    "Shounen", "Shoujo", "Seinen", "Josei", "Mecha", "Supernatural"
  ];

  // Load user preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('favorite_genres, preferred_studios')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error loading preferences:', error);
          toast({
            title: "Error loading preferences",
            description: "Could not load your saved preferences.",
            variant: "destructive",
          });
        } else if (profile) {
          setSelectedGenres(profile.favorite_genres || []);
          // Use preferred_studios as keywords for now
          setKeywords(profile.preferred_studios || []);
        }
      } catch (err) {
        console.error('Unexpected error loading preferences:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user, toast]);

  // 🔥 Activity Logger
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

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
    recordActivity(`Toggled genre: ${genre}`);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords(prev => [...prev, newKeyword.trim()]);
      recordActivity(`Added keyword: ${newKeyword.trim()}`);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword));
    recordActivity(`Removed keyword: ${keyword}`);
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your preferences.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          favorite_genres: selectedGenres,
          preferred_studios: keywords, // Using as keywords for now
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      recordActivity("Saved preferences");
      toast({
        title: "Preferences saved!",
        description: "Your anime preferences have been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Save failed",
        description: error.message || "There was an error saving your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addKeyword();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isAuthenticated={!!user} onLogout={handleLogout} />
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading preferences...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={!!user} onLogout={handleLogout} />
      
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Settings className="h-8 w-8 text-primary animate-glow" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Preferences
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Customize your anime discovery experience by selecting your favorite genres and keywords.
          </p>
        </div>

        {/* Genres Section */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Favorite Genres</CardTitle>
            <CardDescription>
              Select the anime genres you enjoy most. This helps us find anime that match your taste.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableGenres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  onClick={() => toggleGenre(genre)}
                  className={`h-auto p-3 transition-all duration-300 ${
                    selectedGenres.includes(genre)
                      ? "bg-gradient-primary text-primary-foreground border-0 shadow-lg shadow-primary/25"
                      : "hover:border-primary/50"
                  }`}
                >
                  {genre}
                </Button>
              ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Selected: {selectedGenres.length} genres
            </div>
          </CardContent>
        </Card>

        {/* Keywords Section */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Keywords & Themes</CardTitle>
            <CardDescription>
              Add specific themes, elements, or keywords you're interested in seeing in anime.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="keyword" className="sr-only">Add keyword</Label>
                <Input
                  id="keyword"
                  placeholder="Enter a keyword (e.g., 'magic', 'school', 'friendship')"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-muted/50 border-border/50 focus:border-primary"
                />
              </div>
              <Button
                onClick={addKeyword}
                disabled={!newKeyword.trim()}
                className="px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Current Keywords:</Label>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <span>{keyword}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeKeyword(keyword)}
                      className="h-auto p-0 ml-2 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {keywords.length === 0 && (
                  <p className="text-muted-foreground text-sm italic">
                    No keywords added yet. Add some to improve your recommendations!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Preference Summary</CardTitle>
            <CardDescription>
              Review your current preferences before saving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-primary">Selected Genres ({selectedGenres.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedGenres.map((genre, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-secondary">Keywords ({keywords.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GradientButton 
            onClick={handleSave} 
            className="px-8 py-3"
            disabled={saving || !user}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </>
            )}
          </GradientButton>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3"
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
