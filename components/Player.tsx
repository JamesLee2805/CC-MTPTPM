
import React, { useState, useEffect } from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Maximize2, Heart } from 'lucide-react';

interface PlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  onToggleLike: (trackId: string) => void;
  isLiked: boolean;
}

const Player: React.FC<PlayerProps> = ({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrev, 
  audioRef,
  onToggleLike,
  isLiked
}) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [audioRef]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-4 md:px-8 py-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/3 min-w-0">
          <img src={currentTrack.coverUrl} className="w-14 h-14 rounded-md object-cover flex-shrink-0 shadow-lg" alt="Cover" />
          <div className="min-w-0">
            <h4 className="font-semibold text-sm md:text-base truncate text-white">{currentTrack.title}</h4>
            <p className="text-xs text-white/50 truncate">{currentTrack.artist}</p>
          </div>
          <button 
            onClick={() => onToggleLike(currentTrack.id)}
            className={`hidden md:block transition-colors ${isLiked ? 'text-pink-500' : 'text-white/20 hover:text-white'}`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="flex items-center gap-6">
            <button className="text-white/40 hover:text-white transition-colors"><Shuffle size={18} /></button>
            <button onClick={onPrev} className="text-white hover:text-blue-400 transition-colors"><SkipBack size={24} /></button>
            <button 
              onClick={onPlayPause}
              className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button onClick={onNext} className="text-white hover:text-blue-400 transition-colors"><SkipForward size={24} /></button>
            <button className="text-white/40 hover:text-white transition-colors"><Repeat size={18} /></button>
          </div>
          
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-[10px] text-white/40 tabular-nums">{formatTime(progress)}</span>
            <input 
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
            <span className="text-[10px] text-white/40 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Extras */}
        <div className="flex items-center justify-end gap-4 w-1/3">
          <div className="hidden md:flex items-center gap-2">
            <Volume2 size={20} className="text-white/60" />
            <div className="w-24 h-1 bg-white/10 rounded-full">
              <div className="w-2/3 h-full bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <button className="text-white/60 hover:text-white"><Maximize2 size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default Player;
