import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function FeaturingSection() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ["/api/featured"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">FEATURING</h2>
          <Button variant="link" className="text-accent-red font-medium">
            View All
          </Button>
        </div>
        <div className="flex space-x-4 overflow-x-auto scroll-container pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-48 h-48 rounded-2xl bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Fallback featured content using the real image URLs from the reference
  const fallbackFeatured = [
    { id: 1, thumbnailUrl: "https://dbrosraaga.netlify.app/img/1.png", title: "Featured Album 1" },
    { id: 2, thumbnailUrl: "https://dbrosraaga.netlify.app/img/2.png", title: "Featured Album 2" },
    { id: 3, thumbnailUrl: "https://dbrosraaga.netlify.app/img/3.png", title: "Featured Album 3" },
    { id: 4, thumbnailUrl: "https://dbrosraaga.netlify.app/img/4.png", title: "Featured Album 4" },
    { id: 5, thumbnailUrl: "https://dbrosraaga.netlify.app/img/5.png", title: "Featured Album 5" },
  ];

  const displayContent = featured?.length ? featured : fallbackFeatured;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">FEATURING</h2>
        <Button variant="link" className="text-accent-red font-medium hover:underline">
          View All
        </Button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto scroll-container pb-4">
        {displayContent.map((item: any) => (
          <div key={item.id} className="flex-shrink-0 music-card cursor-pointer relative group">
            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-lg relative">
              <img 
                src={item.thumbnailUrl} 
                alt={item.title || `Featured ${item.id}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center`;
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" className="bg-accent-red text-white rounded-full w-12 h-12 p-0">
                  <Play className="w-5 h-5 ml-0.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
