
import React, { useState, useEffect } from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Maximize2, Heart, Mic2, ChevronUp } from 'lucide-react';

interface PlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenLyrics?: () => void;
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
  onOpenLyrics,
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
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-4 md:px-8 py-3 z-[100] transition-all duration-500 hover:bg-[#0a0a0c]/90 group/player">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Track Info - Clickable area to expand */}
        <div 
          onClick={onOpenLyrics}
          className="flex items-center gap-4 w-1/3 min-w-0 cursor-pointer group/info"
        >
          <div className="relative flex-shrink-0">
            <img src={currentTrack.coverUrl} className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shadow-2xl transition-transform group-hover/info:scale-105" alt="Cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/info:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
               <ChevronUp size={20} className="text-white animate-bounce" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm md:text-base truncate text-white group-hover/info:text-blue-400 transition-colors">{currentTrack.title}</h4>
            <p className="text-xs text-white/50 truncate group-hover/info:text-white/80 transition-colors">{currentTrack.artist}</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleLike(currentTrack.id); }}
            className={`hidden sm:block transition-all hover:scale-110 ${isLiked ? 'text-pink-500' : 'text-white/20 hover:text-white'}`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1.5 w-1/3">
          <div className="flex items-center gap-4 md:gap-7">
            <button className="hidden md:block text-white/30 hover:text-white transition-colors"><Shuffle size={16} /></button>
            <button onClick={onPrev} className="text-white hover:text-blue-400 transition-all hover:scale-110"><SkipBack size={22} /></button>
            <button 
              onClick={onPlayPause}
              className="w-10 h-10 md:w-11 md:h-11 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" className="ml-1" />}
            </button>
            <button onClick={onNext} className="text-white hover:text-blue-400 transition-all hover:scale-110"><SkipForward size={22} /></button>
            <button className="hidden md:block text-white/30 hover:text-white transition-colors"><Repeat size={16} /></button>
          </div>
          
          <div className="flex items-center gap-3 w-full max-w-md group/slider">
            <span className="text-[9px] font-medium text-white/30 tabular-nums w-8 text-right">{formatTime(progress)}</span>
            <div className="relative flex-1 py-2">
              <input 
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
              />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-blue-500 rounded-full pointer-events-none -translate-y-1/2 group-hover/slider:bg-blue-400" 
                style={{ width: `${(progress / (duration || 1)) * 100}%` }}
              ></div>
            </div>
            <span className="text-[9px] font-medium text-white/30 tabular-nums w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Extras */}
        <div className="flex items-center justify-end gap-2 md:gap-4 w-1/3">
          <button 
            onClick={onOpenLyrics}
            className={`p-2 rounded-full transition-all hover:bg-white/10 ${onOpenLyrics ? 'text-blue-400' : 'text-white/40'}`}
            title="Lời bài hát & Chế độ toàn màn hình"
          >
            <Mic2 size={20} />
          </button>
          <div className="hidden lg:flex items-center gap-2 group/vol">
            <Volume2 size={18} className="text-white/40 group-hover/vol:text-white transition-colors" />
            <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer">
              <div className="w-2/3 h-full bg-white/40 group-hover/vol:bg-blue-500 transition-all rounded-full"></div>
            </div>
          </div>
          <button onClick={onOpenLyrics} className="hidden sm:block text-white/40 hover:text-white transition-all hover:scale-110">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
