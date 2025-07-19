import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Play, Users, Headphones } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-card-bg shadow-sm border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Music className="text-accent-red text-2xl" />
              <h1 className="text-xl font-bold text-text-primary">Harmony</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-accent-blue hover:bg-blue-600 text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-text-primary mb-6">
            Your Music,
            <span className="text-accent-red"> Your Way</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Discover millions of songs, podcasts, and artists. Stream your favorites and find new music that moves you.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-accent-red hover:bg-red-600 text-white text-lg px-8 py-4"
          >
            Start Listening
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Card className="bg-card-bg shadow-sm border-divider">
            <CardContent className="p-6 text-center">
              <Play className="w-12 h-12 text-accent-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Unlimited Streaming
              </h3>
              <p className="text-text-secondary">
                Stream millions of songs without limits. Your music, anytime, anywhere.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg shadow-sm border-divider">
            <CardContent className="p-6 text-center">
              <Headphones className="w-12 h-12 text-accent-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                High Quality Audio
              </h3>
              <p className="text-text-secondary">
                Enjoy crystal clear sound quality with our premium audio streaming.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg shadow-sm border-divider">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-accent-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Discover Together
              </h3>
              <p className="text-text-secondary">
                Share playlists, discover new artists, and connect through music.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Ready to start your musical journey?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Join millions of music lovers worldwide
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-accent-blue hover:bg-blue-600 text-white text-lg px-8 py-4"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
}
