import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import FeaturingSection from "@/components/FeaturingSection";
import TrendingSection from "@/components/TrendingSection";
import PodcastSection from "@/components/PodcastSection";
import ArtistsSection from "@/components/ArtistsSection";
import TopChartsSection from "@/components/TopChartsSection";
import MobileAppSection from "@/components/MobileAppSection";
import AboutDeveloperSection from "@/components/AboutDeveloperSection";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your music...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <FeaturingSection />
        <TrendingSection />
        <PodcastSection />
        <ArtistsSection />
        <TopChartsSection />
        <MobileAppSection />
        <AboutDeveloperSection />
      </div>

      <MusicPlayer />
    </div>
  );
}
