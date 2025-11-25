import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf, User } from "lucide-react";
import { useState } from "react";

export const PublicNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md group-hover:shadow-glow transition-all duration-300">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EcoSmart
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/bin-map"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/bin-map") ? "text-primary" : "text-foreground"
              }`}
            >
              Bin Map
            </Link>
            <Link
              to="/education"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/education") ? "text-primary" : "text-foreground"
              }`}
            >
              Education
            </Link>
            <Link to="/citizen-login">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Citizen Login
              </Button>
            </Link>
            <Link to="/admin-login">
              <Button variant="hero" size="sm">
                Admin Portal
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/") ? "bg-primary/10 text-primary" : "hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/bin-map"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/bin-map") ? "bg-primary/10 text-primary" : "hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Bin Map
              </Link>
              <Link
                to="/education"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/education") ? "bg-primary/10 text-primary" : "hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Education
              </Link>
              <Link to="/citizen-login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <User className="w-4 h-4" />
                  Citizen Login
                </Button>
              </Link>
              <Link to="/admin-login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="hero" size="sm" className="w-full">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
