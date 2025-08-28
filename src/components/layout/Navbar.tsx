import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, LogOut, User, Home, Settings } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export function Navbar({ isAuthenticated = false, onLogout }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleNavigation("/")}
        >
          <Sparkles className="h-8 w-8 text-primary animate-glow" />
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CineSage
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/dashboard")}
                className={location.pathname === "/dashboard" ? "text-primary" : ""}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/recommendations")}
                className={location.pathname === "/recommendations" ? "text-primary" : ""}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Recommendations
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/preferences")}
                className={location.pathname === "/preferences" ? "text-primary" : ""}
              >
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </Button>
              <GradientButton
                onClick={() => handleNavigation("/register")}
              >
                <User className="h-4 w-4 mr-2" />
                Get Started
              </GradientButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}