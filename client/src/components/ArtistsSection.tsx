import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function ArtistsSection() {
  const { data: artists, isLoading } = useQuery({
    queryKey: ["/api/artists"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">ARTISTS</h2>
          <Button variant="link" className="text-accent-red font-medium">
            View All
          </Button>
        </div>
        <div className="flex space-x-6 overflow-x-auto scroll-container pb-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0 text-center">
              <div className="w-24 h-24 rounded-full bg-muted animate-pulse mx-auto" />
              <div className="mt-3 h-4 bg-muted rounded w-20 mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fallback artists using the real data from the reference
  const fallbackArtists = [
    {
      id: 1,
      name: "Arijit Singh",
      profileImageUrl: "https://dbrosraaga.netlify.app/artist/1.png"
    },
    {
      id: 2,
      name: "Lata Mangeshkar",
      profileImageUrl: "https://dbrosraaga.netlify.app/artist/2.png"
    },
    {
      id: 3,
      name: "Darshan Raval",
      profileImageUrl: "https://dbrosraaga.netlify.app/artist/3.png"
    },
    {
      id: 4,
      name: "Kishore Kumar",
      profileImageUrl: "https://dbrosraaga.netlify.app/artist/4.png"
    },
    {
      id: 5,
      name: "Sachet Parampara",
      profileImageUrl: "https://dbrosraaga.netlify.app/artist/5.png"
    },
    {
      id: 6,
      name: "Hansraj Raghuwansi",
      profileImageUrl: "https://dbrosraaga.netlify.app/artist/6.png"
    },
    {
      id: 7,
      name: "Neha Kakkar",
      profileImageUrl: "https://dbrosraaga.netlify.app/artist/7.png"
    },
    {
      id: 8,
      name: "Jubin Nautiyal",
      profileImageUrl: "https://dbrosraaga.netlify.app/artist/8.png"
    },
    {
      id: 9,
      name: "Shreya Ghoshal",
      profileImageUrl: "https://dbrosraaga.netlify.app/artist/12.png"
    }
  ];

  const displayArtists = artists?.length ? artists : fallbackArtists;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">ARTISTS</h2>
        <Button variant="link" className="text-accent-red font-medium hover:underline">
          View All
        </Button>
      </div>
      
      <div className="flex space-x-6 overflow-x-auto scroll-container pb-4">
        {displayArtists.map((artist: any) => (
          <div key={artist.id} className="flex-shrink-0 artist-card cursor-pointer text-center group">
            <div className="relative">
              <img 
                src={artist.profileImageUrl} 
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover shadow-lg mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center`;
                }}
              />
              <div className="play-overlay absolute inset-0 bg-black bg-opacity-40 opacity-0 rounded-full flex items-center justify-center">
                <Play className="text-white w-5 h-5" />
              </div>
            </div>
            <h3 className="font-medium text-text-primary mt-3 text-sm">{artist.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
