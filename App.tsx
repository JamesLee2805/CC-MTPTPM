
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_TRACKS } from './constants';
import { Track, ViewState, User } from './types';
import Player from './components/Player';
import GeminiDJ from './components/GeminiDJ';
import Visualizer from './components/Visualizer';
import AuthModal from './components/AuthModal';
import SearchView from './components/SearchView';
import LibraryView from './components/LibraryView';
import TrackList from './components/TrackList';
import { storage } from './services/storage';
import { Home, Search, Library, PlusCircle, Heart, Disc, Play, Pause, MoreHorizontal, User as UserIcon, LogOut, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  // State initialization with persistence check
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track>(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize App Data
  useEffect(() => {
    const initApp = async () => {
      // Simulate connecting to server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const storedUser = storage.getUser();
      const storedLiked = storage.getLikedTracks();
      
      if (storedUser) setUser(storedUser);
      if (storedLiked.length > 0) setLikedTrackIds(new Set(storedLiked));
      
      setIsAppLoading(false);
    };

    initApp();
  }, []);

  // Audio Handlers
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const nextTrack = () => {
    const idx = MOCK_TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % MOCK_TRACKS.length;
    handleTrackSelect(MOCK_TRACKS[nextIdx]);
  };

  const prevTrack = () => {
    const idx = MOCK_TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + MOCK_TRACKS.length) % MOCK_TRACKS.length;
    handleTrackSelect(MOCK_TRACKS[prevIdx]);
  };

  // Feature Handlers
  const toggleLike = (trackId: string) => {
    setLikedTrackIds(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      // Persist to storage
      storage.saveLikedTracks(Array.from(next));
      return next;
    });
  };

  const handleOpenAuth = (viewType: 'login' | 'register') => {
    setAuthView(viewType);
    setShowAuthModal(true);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    storage.saveUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    storage.clearUser();
    setView(ViewState.HOME);
  };

  const getLikedTracks = () => MOCK_TRACKS.filter(t => likedTrackIds.has(t.id));

  // Render Loading Screen
  if (isAppLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0a0a0c] text-white">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 animate-bounce">
          <Disc className="text-white animate-spin-slow" size={40} />
        </div>
        <h1 className="text-2xl font-bold font-poppins tracking-tight mb-2">NovaStream</h1>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <Loader2 className="animate-spin" size={16} />
          <span>Đang kết nối đến máy chủ...</span>
        </div>
      </div>
    );
  }

  // View Renderer
  const renderMainContent = () => {
    switch (view) {
      case ViewState.SEARCH:
        return (
          <SearchView 
            allTracks={MOCK_TRACKS}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackSelect={handleTrackSelect}
            onToggleLike={toggleLike}
            likedTrackIds={likedTrackIds}
          />
        );
      
      case ViewState.LIBRARY:
        return (
          <LibraryView 
            user={user}
            onOpenAuth={() => handleOpenAuth('login')}
            likedTracks={getLikedTracks()}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackSelect={handleTrackSelect}
            onToggleLike={toggleLike}
            likedTrackIds={likedTrackIds}
          />
        );

      case ViewState.HOME:
      default:
        return (
          <>
            {/* Hero Section */}
            <div className="relative group mb-10">
              <div className="flex flex-col md:flex-row items-end gap-8 p-8 glass rounded-3xl overflow-hidden relative">
                <img 
                  src={currentTrack.coverUrl} 
                  className="w-48 h-48 md:w-64 md:h-64 rounded-2xl shadow-2xl object-cover hover:scale-[1.02] transition-transform duration-500" 
                  alt="Current Album" 
                />
                <div className="flex-1 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Đang phát</span>
                  <h1 className="text-4xl md:text-6xl font-black font-poppins">{currentTrack.title}</h1>
                  <div className="flex items-center gap-2 text-white/60">
                    <span className="font-semibold text-white">{currentTrack.artist}</span>
                    <span>•</span>
                    <span className="text-sm">{currentTrack.album}</span>
                    <span>•</span>
                    <span className="text-sm">{currentTrack.genre}</span>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <button 
                      onClick={handlePlayPause}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-xl shadow-blue-600/20 flex items-center gap-2 hover:scale-105 transition-all"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />} {isPlaying ? 'TẠM DỪNG' : 'PHÁT'}
                    </button>
                    <button 
                      onClick={() => toggleLike(currentTrack.id)}
                      className={`w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors ${likedTrackIds.has(currentTrack.id) ? 'text-pink-500' : 'text-white'}`}
                    >
                      <Heart size={20} fill={likedTrackIds.has(currentTrack.id) ? "currentColor" : "none"} />
                    </button>
                    <button className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Embedded Visualizer */}
                <div className="absolute top-4 right-8 w-48 opacity-40">
                  <Visualizer isPlaying={isPlaying} audioRef={audioRef} />
                </div>
              </div>
            </div>

            {/* Trending Tracks */}
            <section className="space-y-6">
              <div className="flex justify-between items-end px-2">
                <h2 className="text-2xl font-bold font-poppins tracking-tight">Mới khám phá</h2>
                <button className="text-sm font-semibold text-white/40 hover:text-white transition-colors">Xem tất cả</button>
              </div>
              <TrackList 
                tracks={MOCK_TRACKS}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onTrackSelect={handleTrackSelect}
                onToggleLike={toggleLike}
                likedTrackIds={likedTrackIds}
              />
            </section>
          </>
        );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0c] text-white overflow-hidden selection:bg-blue-500/30">
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        initialView={authView}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 glass border-r border-white/5 p-6 flex flex-col gap-8 hidden md:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Disc className="text-white animate-spin-slow" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight font-poppins">NovaStream</h1>
          </div>

          <nav className="space-y-1">
            <NavItem 
              icon={<Home size={20} />} 
              label="Trang chủ" 
              active={view === ViewState.HOME} 
              onClick={() => setView(ViewState.HOME)} 
            />
            <NavItem 
              icon={<Search size={20} />} 
              label="Tìm kiếm" 
              active={view === ViewState.SEARCH} 
              onClick={() => setView(ViewState.SEARCH)} 
            />
            <NavItem 
              icon={<Library size={20} />} 
              label="Thư viện" 
              active={view === ViewState.LIBRARY} 
              onClick={() => setView(ViewState.LIBRARY)} 
            />
          </nav>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">Playlist của bạn</h3>
            <div className="space-y-1">
              <NavItem icon={<PlusCircle size={20} />} label="Tạo Playlist" active={false} onClick={() => !user && handleOpenAuth('login')} />
              <NavItem 
                icon={<Heart size={20} className="text-pink-500" />} 
                label="Bài hát đã thích" 
                active={view === ViewState.LIBRARY} 
                onClick={() => setView(ViewState.LIBRARY)} 
              />
            </div>
          </div>
          
          <div className="mt-auto">
            {!user ? (
               <div className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10">
                <p className="text-xs font-semibold mb-1">Nova Pro</p>
                <p className="text-[10px] text-white/50 mb-3">AI Tuyển chọn & Âm thanh Lossless</p>
                <button 
                  onClick={() => handleOpenAuth('login')}
                  className="w-full py-2 bg-white text-black text-[10px] font-bold rounded-lg hover:scale-[1.02] transition-transform"
                >
                  ĐĂNG NHẬP
                </button>
              </div>
            ) : (
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <button onClick={handleLogout} className="text-[10px] text-white/50 hover:text-white flex items-center gap-1">
                    <LogOut size={10} /> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-white/5 to-transparent relative">
          {/* Header Bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0a0a0c]/90 backdrop-blur-md transition-all">
            {/* Nav buttons */}
            <div className="hidden md:flex gap-2">
              <button className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/60 cursor-not-allowed hover:text-white transition-colors"><ChevronLeft size={20} /></button>
              <button className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/60 cursor-not-allowed hover:text-white transition-colors"><ChevronRight size={20} /></button>
            </div>
            
            <div className="md:hidden">
              <h1 className="text-lg font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">NovaStream</h1>
            </div>

            {/* Auth Buttons / User Profile */}
            <div className="flex items-center gap-4">
              {!user ? (
                <>
                  <button 
                    onClick={() => handleOpenAuth('register')}
                    className="text-white/60 hover:text-white font-semibold text-sm transition-colors hidden sm:block uppercase tracking-wider text-[11px]"
                  >
                    Đăng ký
                  </button>
                  <button 
                    onClick={() => handleOpenAuth('login')}
                    className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                  >
                    Đăng nhập
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 bg-black/50 p-1 pr-4 rounded-full border border-white/5 cursor-pointer hover:bg-black/70 transition-colors group">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-500 border-2 border-transparent group-hover:border-blue-400 transition-colors">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold max-w-[100px] truncate">{user.name}</span>
                </div>
              )}
            </div>
          </header>

          <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 pb-32 min-h-full">
            {renderMainContent()}
          </div>
        </main>

        {/* Gemini AI Side Panel */}
        <aside className="w-96 glass border-l border-white/5 p-6 hidden lg:block">
          <GeminiDJ currentTrack={currentTrack} />
        </aside>
      </div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onEnded={nextTrack}
        crossOrigin="anonymous"
      />

      {/* Global Player Controls */}
      <Player 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause}
        onNext={nextTrack}
        onPrev={prevTrack}
        audioRef={audioRef}
        onToggleLike={toggleLike}
        isLiked={likedTrackIds.has(currentTrack.id)}
      />
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      active ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span>{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
  </button>
);

export default App;
