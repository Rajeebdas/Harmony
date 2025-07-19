import { songs } from "@/songs";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import React from "react";

interface AllSongsSectionProps {
  onPlaySong?: (index: number) => void;
}

const AllSongsSection: React.FC<AllSongsSectionProps> = ({ onPlaySong }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">All Songs</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song, idx) => (
          <div key={song.audioUrl} className="bg-card-bg rounded-xl p-4 shadow-sm music-card flex items-center space-x-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary truncate">{song.title}</h3>
              <p className="text-text-secondary text-sm truncate">{song.artist}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onPlaySong?.(idx)}>
              <Play className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllSongsSection; 