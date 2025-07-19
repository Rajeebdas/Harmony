import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Play, Heart } from "lucide-react";

export default function TrendingSection() {
  const { data: trendingSongs, isLoading } = useQuery({
    queryKey: ["/api/songs/trending"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">TRENDING</h2>
          <Button variant="link" className="text-accent-red font-medium">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card-bg rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fallback trending songs using the real data from the reference
  const fallbackTrending = [
    {
      id: 1,
      title: "Dil Galti Kar",
      albumArt: "https://dbrosraaga.netlify.app/gallery/i1.jpeg",
      artist: { name: "Jubin | Mauni" }
    },
    {
      id: 2,
      title: "Shiv Panchakshara",
      albumArt: "https://dbrosraaga.netlify.app/gallery/i2.jpeg",
      artist: { name: "Sachet | Parampara" }
    },
    {
      id: 3,
      title: "Meri Zindagi",
      albumArt: "https://dbrosraaga.netlify.app/gallery/i3.jpeg",
      artist: { name: "Jubin Nautiyal" }
    },
    {
      id: 4,
      title: "Is Qadar",
      albumArt: "https://dbrosraaga.netlify.app/gallery/i4.jpeg",
      artist: { name: "Darshan Raval" }
    },
    {
      id: 5,
      title: "Shape Of You",
      albumArt: "https://dbrosraaga.netlify.app/gallery/i8.png",
      artist: { name: "Ed Sheeran" }
    },
    {
      id: 6,
      title: "Believer",
      albumArt: "https://dbrosraaga.netlify.app/gallery/i9.jpeg",
      artist: { name: "Imagine Dragons" }
    }
  ];

  const displaySongs = trendingSongs?.length ? trendingSongs : fallbackTrending;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">TRENDING</h2>
        <Button variant="link" className="text-accent-red font-medium hover:underline">
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displaySongs.map((song: any) => (
          <div key={song.id} className="bg-card-bg rounded-xl p-4 shadow-sm music-card cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={song.albumArt} 
                  alt={song.title}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center`;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Play className="text-white w-4 h-4" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary truncate">{song.title}</h3>
                <p className="text-text-secondary text-sm truncate">{song.artist?.name || "Unknown Artist"}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-text-secondary hover:text-accent-red">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
