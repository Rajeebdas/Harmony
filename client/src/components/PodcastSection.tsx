import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function PodcastSection() {
  const { data: podcasts, isLoading } = useQuery({
    queryKey: ["/api/podcasts"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">PODCAST</h2>
          <Button variant="link" className="text-accent-red font-medium">
            View All
          </Button>
        </div>
        <div className="flex space-x-4 overflow-x-auto scroll-container pb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-40">
              <div className="w-full h-40 rounded-xl bg-muted animate-pulse" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fallback podcasts using the real data from the reference
  const fallbackPodcasts = [
    {
      id: 1,
      title: "Isha",
      host: "Sadhguru",
      thumbnailUrl: "https://dbrosraaga.netlify.app/podcast/1.png"
    },
    {
      id: 2,
      title: "Warikoo Show",
      host: "Ankur Warikoo",
      thumbnailUrl: "https://dbrosraaga.netlify.app/podcast/2.png"
    },
    {
      id: 3,
      title: "TDS",
      host: "Ranveer Alhabadia",
      thumbnailUrl: "https://dbrosraaga.netlify.app/podcast/3.png"
    },
    {
      id: 4,
      title: "Harry Potter",
      host: "Disney",
      thumbnailUrl: "https://dbrosraaga.netlify.app/podcast/4.png"
    },
    {
      id: 5,
      title: "The ThunderMans",
      host: "Kids Show",
      thumbnailUrl: "https://dbrosraaga.netlify.app/podcast/5.png"
    },
    {
      id: 6,
      title: "Economy",
      host: "Seth Godin",
      thumbnailUrl: "https://dbrosraaga.netlify.app/podcast/6.png"
    }
  ];

  const displayPodcasts = podcasts?.length ? podcasts : fallbackPodcasts;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">PODCAST</h2>
        <Button variant="link" className="text-accent-red font-medium hover:underline">
          View All
        </Button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto scroll-container pb-4">
        {displayPodcasts.map((podcast: any) => (
          <div key={podcast.id} className="flex-shrink-0 music-card cursor-pointer">
            <div className="w-40">
              <img 
                src={podcast.thumbnailUrl} 
                alt={podcast.title}
                className="w-full h-40 rounded-xl object-cover shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200&fit=crop&crop=center`;
                }}
              />
              <div className="mt-3">
                <h3 className="font-semibold text-text-primary truncate">{podcast.title}</h3>
                <p className="text-text-secondary text-sm truncate">{podcast.host}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
