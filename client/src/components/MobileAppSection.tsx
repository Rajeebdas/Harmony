import { Button } from "@/components/ui/button";

export default function MobileAppSection() {
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-accent-blue to-accent-red rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 mb-6 lg:mb-0">
            <h2 className="text-3xl font-bold mb-4">Mobile First Approach</h2>
            <p className="text-lg opacity-90 mb-6">
              Experience the ultimate music streaming on your mobile device. Download our app for the best listening experience with offline downloads, personalized playlists, and high-quality audio.
            </p>
            <h3 className="text-xl font-semibold mb-4">Download The Mobile App Now!</h3>
            <div className="flex space-x-4">
              <Button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors">
                <img 
                  src="https://dbrosraaga.netlify.app/img/gPlay.png" 
                  alt="Google Play" 
                  className="w-6 h-6"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <span>Download</span>
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img 
              src="https://dbrosraaga.netlify.app/img/mobf.png" 
              alt="Mobile App" 
              className="w-64 h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=400&fit=crop&crop=center`;
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
