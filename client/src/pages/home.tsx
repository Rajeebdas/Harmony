import Header from "@/components/Header";
import FeaturingSection from "@/components/FeaturingSection";
import TrendingSection from "@/components/TrendingSection";
import PodcastSection from "@/components/PodcastSection";
import ArtistsSection from "@/components/ArtistsSection";
import TopChartsSection from "@/components/TopChartsSection";
import AboutDeveloperSection from "@/components/AboutDeveloperSection";
import MusicPlayer from "@/components/MusicPlayer";
import AllSongsSection from "@/components/AllSongsSection";
import React, { useState } from "react";

export default function Home() {
  const [playIndex, setPlayIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <FeaturingSection />
        <TrendingSection />
        <PodcastSection />
        <ArtistsSection />
        <TopChartsSection />
        <AllSongsSection onPlaySong={setPlayIndex} />
        <AboutDeveloperSection />
      </div>
      <MusicPlayer externalPlayIndex={playIndex} onSongEnd={() => setPlayIndex(null)} />
    </div>
  );
}
