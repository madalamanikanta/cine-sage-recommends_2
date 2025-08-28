import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";

export default function RecentActivity() {
  const navigate = useNavigate();
  const activities = JSON.parse(localStorage.getItem("recentActivity") || "[]");

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} onLogout={() => navigate("/")} />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <History className="h-8 w-8 text-primary animate-glow" />
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Recent Activity
          </h1>
        </div>

        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No recent activity yet. Start exploring!
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((item: any, idx: number) => (
              <Card key={idx} className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">{item.action}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
