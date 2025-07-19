import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function TopChartsSection() {
  const { data: topCharts, isLoading } = useQuery({
    queryKey: ["/api/playlists/top-charts"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">TOP CHARTS</h2>
          <Button variant="link" className="text-accent-red font-medium">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card-bg rounded-xl p-4 shadow-sm">
              <div className="w-full h-32 rounded-lg bg-muted animate-pulse mb-3" />
              <div className="h-4 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fallback top charts using the real data from the reference
  const fallbackTopCharts = [
    {
      id: 1,
      title: "Bollywood Songs",
      description: "Top 50",
      thumbnailUrl: "https://dbrosraaga.netlify.app/top/1.png",
      category: "bollywood"
    },
    {
      id: 2,
      title: "International Hits",
      description: "Top 50",
      thumbnailUrl: "https://dbrosraaga.netlify.app/top/2.png",
      category: "international"
    },
    {
      id: 3,
      title: "Punjabi Songs",
      description: "Top 50",
      thumbnailUrl: "https://dbrosraaga.netlify.app/top/3.png",
      category: "punjabi"
    },
    {
      id: 4,
      title: "Bhakti Songs",
      description: "Top 50",
      thumbnailUrl: "https://dbrosraaga.netlify.app/top/4.png",
      category: "devotional"
    },
    {
      id: 5,
      title: "Hip-Hop Songs",
      description: "Top 50",
      thumbnailUrl: "https://dbrosraaga.netlify.app/top/5.png",
      category: "hiphop"
    },
    {
      id: 6,
      title: "Dancing Beats",
      description: "Top 50",
      thumbnailUrl: "https://dbrosraaga.netlify.app/top/6.png",
      category: "dance"
    },
    {
      id: 7,
      title: "Patriotic Songs",
      description: "Top 50",
      thumbnailUrl: "https://dbrosraaga.netlify.app/top/7.png",
      category: "patriotic"
    },
    {
      id: 8,
      title: "Slow Lo-fi",
      description: "Top 50",
      thumbnailUrl: "https://dbrosraaga.netlify.app/top/8.png",
      category: "lofi"
    }
  ];

  const displayCharts = topCharts?.length ? topCharts : fallbackTopCharts;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">TOP CHARTS</h2>
        <Button variant="link" className="text-accent-red font-medium hover:underline">
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayCharts.map((chart: any, index: number) => (
          <div key={chart.id} className="bg-card-bg rounded-xl p-4 shadow-sm music-card cursor-pointer">
            <div className="relative mb-3">
              <img 
                src={chart.thumbnailUrl} 
                alt={chart.title}
                className="w-full h-32 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop&crop=center`;
                }}
              />
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white ${
                index % 2 === 0 ? 'bg-accent-red' : 'bg-accent-blue'
              }`}>
                {chart.description}
              </div>
            </div>
            <h3 className="font-semibold text-text-primary">{chart.title}</h3>
            <p className="text-text-secondary text-sm">{chart.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
