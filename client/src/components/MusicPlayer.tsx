import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  Maximize2,
  Heart
} from "lucide-react";

interface CurrentSong {
  id: number;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl?: string;
  duration: number;
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Default song (using data from the reference)
  const [currentSong] = useState<CurrentSong>({
    id: 1,
    title: "Dil Galti Kar",
    artist: "Jubin Nautiyal | Mauni Roy",
    albumArt: "https://dbrosraaga.netlify.app/gallery/i1.jpeg",
    duration: 192 // 3:12 in seconds
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.volume = volume / 100;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, [volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Since we don't have actual audio URLs, we'll simulate playback
      audio.play().catch(() => {
        // Fallback for when there's no actual audio file
        console.log('Audio playback simulated');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = value[0];
    setCurrentTime(newTime);
    audio.currentTime = newTime;
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume / 100;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Add to favorites API call
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-divider z-50">
      <audio ref={audioRef} src={currentSong.audioUrl} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Currently playing song info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <img 
                src={currentSong.albumArt} 
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop&crop=center`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-text-primary truncate">{currentSong.title}</h4>
              <p className="text-text-secondary text-sm truncate">{currentSong.artist}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`hidden sm:block ${isFavorite ? 'text-accent-red' : 'text-text-secondary'} hover:text-accent-red`}
              onClick={toggleFavorite}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Playback controls */}
          <div className="flex items-center space-x-4 flex-1 justify-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`hidden sm:block ${isShuffle ? 'text-accent-blue' : 'text-text-secondary'} hover:text-text-primary`}
              onClick={() => setIsShuffle(!isShuffle)}
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button 
              onClick={togglePlayPause}
              className="bg-accent-red hover:bg-red-600 text-white rounded-full w-10 h-10 p-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`hidden sm:block ${isRepeat ? 'text-accent-blue' : 'text-text-secondary'} hover:text-text-primary`}
              onClick={() => setIsRepeat(!isRepeat)}
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress and volume */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <div className="hidden lg:flex items-center space-x-2 text-sm text-text-secondary">
              <span className="w-10 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={currentSong.duration}
                step={1}
                onValueChange={handleProgressChange}
                className="w-24"
              />
              <span className="w-10">{formatTime(currentSong.duration)}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-text-secondary" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
