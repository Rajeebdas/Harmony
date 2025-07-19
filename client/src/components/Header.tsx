import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Search, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="bg-card-bg shadow-sm sticky top-0 z-40 border-b border-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Music className="text-accent-red text-2xl" />
              <h1 className="text-xl font-bold text-text-primary">Harmony</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-text-primary font-medium hover:text-accent-red transition-colors">
                Home
              </a>
              <a href="#" className="text-text-secondary hover:text-accent-red transition-colors">
                Discover
              </a>
              <a href="#" className="text-text-secondary hover:text-accent-red transition-colors">
                Library
              </a>
              <a href="#" className="text-text-secondary hover:text-accent-red transition-colors">
                Podcasts
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden sm:block relative">
              <Input
                type="text"
                placeholder="Search music, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 bg-bg-primary border-divider focus:ring-2 focus:ring-accent-blue focus:border-transparent rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
            </form>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="md:hidden text-text-secondary">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="md:hidden text-text-secondary">
                <Menu className="w-4 h-4" />
              </Button>
              
              {user && (
                <div className="flex items-center space-x-2">
                  {user.profileImageUrl && (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="hidden sm:block text-sm font-medium text-text-primary">
                    {user.firstName || user.email}
                  </span>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
