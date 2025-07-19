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
import { songs } from "@/songs";

interface MusicPlayerProps {
  externalPlayIndex?: number | null;
  onSongEnd?: () => void;
}

export default function MusicPlayer({ externalPlayIndex, onSongEnd }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = songs[currentIndex];

  // Sync with external play index
  useEffect(() => {
    if (typeof externalPlayIndex === 'number' && externalPlayIndex >= 0 && externalPlayIndex < songs.length) {
      setCurrentIndex(externalPlayIndex);
      setIsPlaying(true);
    }
  }, [externalPlayIndex]);

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

  useEffect(() => {
    setCurrentTime(0);
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentIndex]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        console.log('Audio playback failed');
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

  const playNext = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  // Handle song end
  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current?.play();
    } else if (onSongEnd) {
      onSongEnd();
    } else {
      playNext();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-divider z-50">
      <audio ref={audioRef} src={currentSong.audioUrl} onEnded={handleEnded} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Currently playing song info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {/* Album art placeholder */}
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-xs text-text-secondary">No Art</span>
              </div>
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
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary" onClick={playPrev}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button 
              onClick={togglePlayPause}
              className="bg-accent-red hover:bg-red-600 text-white rounded-full w-10 h-10 p-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary" onClick={playNext}>
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
                max={audioRef.current?.duration || 100}
                step={1}
                onValueChange={handleProgressChange}
                className="w-24"
              />
              <span className="w-10">{formatTime(audioRef.current?.duration || 0)}</span>
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
