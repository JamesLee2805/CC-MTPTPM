
import React, { useState, useEffect, useRef } from 'react';
import { Track, RepeatMode } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, Repeat, Shuffle, Maximize2, Heart, Mic2, ChevronUp, Youtube, ListMusic, Clock } from 'lucide-react';

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
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: RepeatMode;
  onToggleRepeat: () => void;
  onOpenQueue: () => void;
  sleepTimer: number | null;
  onSetSleepTimer: (minutes: number | null) => void;
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
  isLiked,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  onOpenQueue,
  sleepTimer,
  onSetSleepTimer
}) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const prevVolumeRef = useRef(0.7);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);

    // Set initial volume
    audio.volume = isMuted ? 0 : volume;

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [audioRef]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolumeRef.current);
      setIsMuted(false);
    } else {
      prevVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
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
            <button 
              onClick={onToggleShuffle}
              className={`hidden md:block transition-colors ${isShuffle ? 'text-blue-500' : 'text-white/30 hover:text-white'}`}
              title="Phát ngẫu nhiên"
            >
              <Shuffle size={16} />
            </button>
            <button onClick={onPrev} className="text-white hover:text-blue-400 transition-all hover:scale-110"><SkipBack size={22} /></button>
            <button 
              onClick={onPlayPause}
              className="w-10 h-10 md:w-11 md:h-11 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" className="ml-1" />}
            </button>
            <button onClick={onNext} className="text-white hover:text-blue-400 transition-all hover:scale-110"><SkipForward size={22} /></button>
            <button 
              onClick={onToggleRepeat}
              className={`hidden md:block transition-colors relative ${repeatMode !== RepeatMode.OFF ? 'text-blue-500' : 'text-white/30 hover:text-white'}`}
              title="Lặp lại"
            >
              <Repeat size={16} />
              {repeatMode === RepeatMode.ONE && <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center">1</span>}
            </button>
          </div>
          
          <div className="flex items-center gap-3 w-full max-w-md group/slider">
            <span className="text-[10px] font-bold text-white/20 tabular-nums w-8 text-right">{formatTime(progress)}</span>
            <div className="relative flex-1 py-3 cursor-pointer group/bar">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full relative transition-all duration-150" 
                    style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-xl opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </div>
              <input 
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
            <span className="text-[10px] font-bold text-white/20 tabular-nums w-8">{formatTime(duration)}</span>
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
            <button 
              onClick={toggleMute}
              className="text-white/20 hover:text-white transition-colors"
            >
              {getVolumeIcon()}
            </button>
            <div className="relative w-24 h-1 flex items-center group/vol-slider cursor-pointer">
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/40 group-hover/vol-slider:bg-blue-500 rounded-full relative transition-all" 
                  style={{ width: `${volume * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-xl opacity-0 group-hover/vol-slider:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>
          {currentTrack.youtubeUrl && (
            <a 
              href={currentTrack.youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:block text-white/40 hover:text-[#FF0000] transition-all hover:scale-110"
              title="Xem trên YouTube"
            >
              <Youtube size={20} />
            </a>
          )}
          <div className="relative">
            <button 
              onClick={() => setShowSleepMenu(!showSleepMenu)}
              className={`hidden sm:block transition-all hover:scale-110 ${sleepTimer ? 'text-blue-500' : 'text-white/40 hover:text-white'}`}
              title="Hẹn giờ tắt nhạc"
            >
              <Clock size={20} />
            </button>
            {showSleepMenu && (
              <div className="absolute right-0 bottom-full mb-4 w-48 glass border border-white/10 rounded-xl shadow-2xl z-[110] overflow-hidden py-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5">Hẹn giờ tắt</div>
                {[15, 30, 45, 60, 90].map(mins => (
                  <button 
                    key={mins}
                    onClick={() => { onSetSleepTimer(mins); setShowSleepMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors ${sleepTimer === mins ? 'text-blue-400 bg-white/5' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                  >
                    {mins} phút
                  </button>
                ))}
                <button 
                  onClick={() => { onSetSleepTimer(null); setShowSleepMenu(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/10 transition-colors border-t border-white/5"
                >
                  Tắt hẹn giờ
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={onOpenQueue}
            className="hidden sm:block text-white/40 hover:text-white transition-all hover:scale-110"
            title="Danh sách chờ"
          >
            <ListMusic size={20} />
          </button>
          <button onClick={onOpenLyrics} className="hidden sm:block text-white/40 hover:text-white transition-all hover:scale-110">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
