
import React, { useEffect, useRef, useState } from 'react';
import { Track } from '../types';
import { Music, Sparkles, MessageSquareQuote, ChevronLeft, Share2, MoreHorizontal, ListMusic } from 'lucide-react';
import Visualizer from './Visualizer';

interface LyricsViewProps {
  track: Track;
  currentTime: number;
  onSeek: (time: number) => void;
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  analyser: AnalyserNode | null;
}

const LyricsView: React.FC<LyricsViewProps> = ({ track, currentTime, onSeek, onClose, audioRef, isPlaying, analyser }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!track.lyrics) return;

    let index = -1;
    for (let i = track.lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= track.lyrics[i].time) {
        index = i;
        break;
      }
    }

    if (index !== activeIndex) {
      setActiveIndex(index);
      
      const activeElement = containerRef.current?.children[index] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentTime, track.lyrics, activeIndex]);

  return (
    <div className="fixed inset-0 z-[120] bg-black overflow-hidden animate-fade-in flex flex-col h-screen">
      {/* Immersive Animated Background */}
      <div 
        className="absolute inset-0 opacity-40 blur-[150px] pointer-events-none scale-150 transition-all duration-[3000ms]"
        style={{ 
          backgroundImage: `url(${track.coverUrl})`, 
          backgroundSize: 'cover',
          transform: `scale(${isPlaying ? 1.5 : 1.2}) rotate(${isPlaying ? '5deg' : '0deg'})` 
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>

      {/* Header Bar */}
      <header className="relative z-[130] flex items-center justify-between px-6 md:px-12 py-8">
        <button 
          onClick={onClose}
          className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white shadow-2xl hover:bg-white/20 hover:scale-105 active:scale-95 transition-all group"
        >
          <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-sm uppercase tracking-widest pr-1">Quay lại</span>
        </button>
        
        <div className="text-center hidden sm:block">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Đang phát</p>
          <h2 className="text-sm font-bold text-white/80 max-w-[200px] truncate">{track.title}</h2>
        </div>

        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all shadow-lg"><Share2 size={20} /></button>
          <button className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all shadow-lg"><MoreHorizontal size={20} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row h-full overflow-hidden px-6 md:px-20 pb-32">
        
        {/* Left Side: Art & Info */}
        <div className="hidden md:flex w-1/2 flex-col justify-center items-start space-y-8 pr-12">
          <div className="relative group perspective-1000">
            <img 
              src={track.coverUrl} 
              alt={track.title} 
              className="w-80 h-80 lg:w-[450px] lg:h-[450px] rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
            />
            <div className="absolute -bottom-10 left-0 right-0">
               <Visualizer isPlaying={isPlaying} analyser={analyser} />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-5xl lg:text-7xl font-black font-poppins tracking-tighter text-white drop-shadow-2xl">
              {track.title}
            </h1>
            <p className="text-2xl lg:text-3xl text-white/60 font-medium">{track.artist}</p>
          </div>

          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-sm font-bold hover:bg-white/20 transition-all">
                <ListMusic size={18} /> Danh sách chờ
             </button>
             <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-full text-sm font-bold hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all">
                <Sparkles size={18} /> Phối khí bởi AI
             </button>
          </div>
        </div>

        {/* Right Side: Lyrics List */}
        <div className="flex-1 w-full md:w-1/2 flex flex-col justify-center">
          {track.lyrics && track.lyrics.length > 0 ? (
            <div 
              ref={containerRef}
              className="lyrics-scroll-container overflow-y-auto h-full space-y-8 py-[40vh] custom-scrollbar-hidden px-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {track.lyrics.map((line, i) => {
                const isActive = i === activeIndex;
                const isPassed = i < activeIndex;
                return (
                  <div key={i} onClick={() => onSeek(line.time)} className={`cursor-pointer transition-all duration-700 transform origin-left ${isActive ? 'text-white text-4xl md:text-6xl font-black scale-100 opacity-100 translate-x-2' : isPassed ? 'text-white/20 text-2xl md:text-4xl font-bold opacity-30 hover:opacity-50 blur-[1px]' : 'text-white/40 text-2xl md:text-4xl font-bold opacity-50 hover:opacity-100'}`}>
                    {line.text}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center animate-pulse"><Music size={48} className="text-white/20" /></div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black font-poppins text-white">Lời bài hát chưa sẵn sàng</h2>
                <p className="text-white/40 max-w-sm mx-auto">Chúng tôi đang nỗ lực cập nhật lời nhạc chính xác nhất cho giai điệu này.</p>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black hover:scale-105 transition-all shadow-2xl"><Sparkles size={20} /> TÌM LỜI BẰNG AI</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LyricsView;
