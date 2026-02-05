
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_TRACKS, RECOMMENDED_PLAYLISTS, GENRES } from './constants';
import { Track, ViewState, User, Playlist } from './types';
import Player from './components/Player';
import GeminiDJ from './components/GeminiDJ';
import Visualizer from './components/Visualizer';
import AuthModal from './components/AuthModal';
import SearchView from './components/SearchView';
import LibraryView from './components/LibraryView';
import TrackList from './components/TrackList';
import PlaylistCard from './components/PlaylistCard';
import PlaylistView from './components/PlaylistView';
import LyricsView from './components/LyricsView';
import { storage } from './services/storage';
import { Home, Search, Library, PlusCircle, Heart, Disc, Play, Pause, MoreHorizontal, User as UserIcon, LogOut, Loader2, ChevronLeft, ChevronRight, Upload, Music, CloudUpload, X, ListMusic, Mic2, Star, TrendingUp, Flame, Zap, Headphones } from 'lucide-react';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track>(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [previousView, setPreviousView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');
  const [bannerIndex, setBannerIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Helper to change view and track history
  const navigateTo = (newView: ViewState) => {
    if (view !== newView) {
      setPreviousView(view);
      setView(newView);
    }
  };

  const initAudioGraph = () => {
    if (audioContextRef.current || !audioRef.current) return;
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    const ctx = new AudioContextClass();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    analyser.fftSize = 128;
    audioContextRef.current = ctx;
    analyserRef.current = analyser;
  };

  const featuredTracks = [MOCK_TRACKS[0], MOCK_TRACKS[2], MOCK_TRACKS[6], MOCK_TRACKS[9]];
  
  useEffect(() => {
    if (view !== ViewState.HOME) return;
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % featuredTracks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [view, featuredTracks.length]);

  useEffect(() => {
    const initApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const storedUser = storage.getUser();
      const storedLiked = storage.getLikedTracks();
      const storedPlaylists = storage.getUserPlaylists();
      if (storedUser) setUser(storedUser);
      if (storedLiked.length > 0) setLikedTrackIds(new Set(storedLiked));
      if (storedPlaylists.length > 0) setUserPlaylists(storedPlaylists);
      setIsAppLoading(false);
    };
    initApp();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Playback prevented: ", error.name);
          if (error.name === 'NotAllowedError') setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => {
    initAudioGraph();
    setIsPlaying(prev => !prev);
  };

  const handleTrackSelect = (track: Track) => {
    initAudioGraph();
    if (currentTrack.id === track.id) {
      handlePlayPause();
      return;
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    const all = [...MOCK_TRACKS, ...userTracks];
    const idx = all.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % all.length;
    handleTrackSelect(all[nextIdx]);
  };

  const prevTrack = () => {
    const all = [...MOCK_TRACKS, ...userTracks];
    const idx = all.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + all.length) % all.length;
    handleTrackSelect(all[prevIdx]);
  };

  const toggleLike = (trackId: string) => {
    setLikedTrackIds(prev => {
      const next = new Set(prev);
      next.has(trackId) ? next.delete(trackId) : next.add(trackId);
      storage.saveLikedTracks(Array.from(next));
      return next;
    });
  };

  const handleDownload = (track: Track) => {
    const link = document.createElement('a');
    link.href = track.audioUrl;
    link.download = `${track.artist} - ${track.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreatePlaylist = () => {
    if (!user) { setAuthView('login'); setShowAuthModal(true); return; }
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      name: `Danh sách mới #${userPlaylists.length + 1}`,
      description: 'Mô tả playlist của bạn',
      tracks: [],
      coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop',
      createdBy: user.id
    };
    const updated = [newPlaylist, ...userPlaylists];
    setUserPlaylists(updated);
    storage.saveUserPlaylists(updated);
    handleOpenPlaylist(newPlaylist);
  };

  const handleOpenPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    navigateTo(ViewState.PLAYLIST_DETAIL);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newTrack: Track = {
        id: `local-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: user?.name || 'Local User',
        album: 'Bản tải lên',
        duration: '??:??',
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
        audioUrl: URL.createObjectURL(file),
        genre: 'Tải lên',
        isLocal: true
      };
      setUserTracks([newTrack, ...userTracks]);
      navigateTo(ViewState.LIBRARY);
    }
  };

  const handleToggleNowPlaying = () => {
    if (view === ViewState.LYRICS) {
      setView(previousView);
    } else {
      setPreviousView(view);
      setView(ViewState.LYRICS);
    }
  };

  const getFilteredTracks = () => {
    if (selectedGenre === 'Tất cả') return MOCK_TRACKS;
    return MOCK_TRACKS.filter(t => t.genre === selectedGenre);
  };

  const renderHomeContent = () => (
    <div className="space-y-12 pb-10">
      <section className="relative h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden group shadow-2xl">
        {featuredTracks.map((track, idx) => (
          <div key={track.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === bannerIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
            <div className="absolute inset-0">
              <img src={track.coverUrl} className="w-full h-full object-cover" alt={track.title} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            <div className="relative h-full flex flex-col justify-center px-8 md:px-16 space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                   <Star size={12} className="text-yellow-400 fill-current" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Editor's Pick</span>
                </div>
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{track.genre}</span>
              </div>
              <div className="space-y-2 max-w-2xl">
                <h1 className="text-4xl md:text-8xl font-black font-poppins leading-tight tracking-tighter text-white drop-shadow-2xl">{track.title}</h1>
                <p className="text-xl md:text-3xl font-medium text-white/80">{track.artist}</p>
                <p className="text-sm text-white/40 max-w-md hidden md:block line-clamp-2">{track.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => handleTrackSelect(track)} className="bg-blue-600 text-white px-8 py-4 rounded-full font-black text-sm md:text-base flex items-center gap-2 hover:scale-105 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                  {(currentTrack.id === track.id && isPlaying) ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" className="ml-1" />}
                  PHÁT NGAY
                </button>
                <button onClick={() => { handleTrackSelect(track); handleToggleNowPlaying(); }} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-black text-sm md:text-base flex items-center gap-2 hover:bg-white/20 transition-all">
                  <Mic2 size={20} /> XEM LỜI
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {featuredTracks.map((_, idx) => (
            <button key={idx} onClick={() => setBannerIndex(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${idx === bannerIndex ? 'w-10 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'w-2 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
        {GENRES.map(genre => (
          <button key={genre} onClick={() => setSelectedGenre(genre)} className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedGenre === genre ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}>
            {genre === 'DJ / Vinahouse' ? <span className="flex items-center gap-2"><Zap size={14} className="text-yellow-400" /> {genre}</span> : genre}
          </button>
        ))}
      </div>

      {(selectedGenre === 'Tất cả' || selectedGenre === 'DJ / Vinahouse') && (
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black font-poppins flex items-center gap-3"><Headphones className="text-yellow-500" size={32} /> DJ Spotlight</h2>
              <p className="text-sm text-white/40 italic mt-1">Nơi hội tụ những bản phối căng nhất từ Thái Hoàng, Future, Win...</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_TRACKS.filter(t => t.genre === 'DJ / Vinahouse').map(track => (
              <div key={track.id} onClick={() => handleTrackSelect(track)} className="group relative bg-[#18181b] rounded-2xl overflow-hidden cursor-pointer border border-white/5 transition-all hover:scale-[1.02] hover:border-yellow-500/50 shadow-xl">
                <div className="aspect-[4/5] relative">
                  <img src={track.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={track.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2 py-0.5 bg-yellow-500 text-[9px] font-black text-black rounded uppercase tracking-tighter">Vinahouse 2024</span>
                    </div>
                    <h3 className="text-lg font-bold text-white truncate">{track.title}</h3>
                    <p className="text-sm text-white/60">{track.artist}</p>
                  </div>
                  <div className="absolute top-5 right-5 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Play size={24} fill="black" className="ml-1 text-black" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="animate-fade-in">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black font-poppins flex items-center gap-2"><TrendingUp className="text-blue-500" size={24} /> {selectedGenre === 'Tất cả' ? 'BXH Xu hướng' : `Đề xuất ${selectedGenre}`}</h2>
            <p className="text-sm text-white/40">Giai điệu đang được yêu thích nhất</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredTracks().slice(0, 6).map((track, idx) => (
            <div key={track.id} onClick={() => handleTrackSelect(track)} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-pointer relative">
              <div className="relative w-24 h-24 flex-shrink-0">
                <img src={track.coverUrl} className="w-full h-full object-cover rounded-xl shadow-lg" alt={track.title} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl"><Play size={24} fill="white" /></div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0a0a0c] shadow-lg">#{idx + 1}</div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white truncate group-hover:text-blue-400 transition-colors">{track.title}</h3>
                <p className="text-xs text-white/40 truncate">{track.artist}</p>
                <div className="flex items-center gap-2 mt-2">
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${track.genre.includes('DJ') ? 'text-yellow-500' : 'text-blue-500'}`}>{track.genre}</span>
                   {idx < 3 && <Flame size={14} className="text-orange-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderMainContent = () => {
    switch (view) {
      case ViewState.SEARCH:
        return <SearchView allTracks={[...MOCK_TRACKS, ...userTracks]} currentTrack={currentTrack} isPlaying={isPlaying} onTrackSelect={handleTrackSelect} onToggleLike={toggleLike} onDownload={handleDownload} likedTrackIds={likedTrackIds} />;
      case ViewState.LIBRARY:
        return <LibraryView user={user} onOpenAuth={() => { setAuthView('login'); setShowAuthModal(true); }} likedTracks={[...MOCK_TRACKS, ...userTracks].filter(t => likedTrackIds.has(t.id))} currentTrack={currentTrack} isPlaying={isPlaying} onTrackSelect={handleTrackSelect} onToggleLike={toggleLike} onDownload={handleDownload} likedTrackIds={likedTrackIds} />;
      case ViewState.PLAYLIST_DETAIL:
        return selectedPlaylist ? <PlaylistView playlist={selectedPlaylist} currentTrack={currentTrack} isPlaying={isPlaying} onTrackSelect={handleTrackSelect} onToggleLike={toggleLike} onDownload={handleDownload} likedTrackIds={likedTrackIds} onBack={() => navigateTo(previousView)} /> : null;
      case ViewState.UPLOAD:
        return (
          <div className="animate-fade-in space-y-8">
            <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 bg-white/5">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500"><CloudUpload size={40} /></div>
              <div><h2 className="text-2xl font-bold">Tải lên âm nhạc của bạn</h2><p className="text-white/40 max-w-sm mt-2">Chia sẻ những giai điệu yêu thích từ máy tính của bạn.</p></div>
              <label className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full font-bold cursor-pointer transition-transform hover:scale-105">Chọn tệp MP3<input type="file" accept="audio/mp3" className="hidden" onChange={handleFileUpload} /></label>
            </div>
          </div>
        );
      case ViewState.HOME:
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0c] text-white overflow-hidden selection:bg-blue-500/30">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={(u) => {setUser(u); storage.saveUser(u)}} initialView={authView} />
      {view === ViewState.LYRICS && <LyricsView track={currentTrack} currentTime={currentTime} onSeek={handleSeek} onClose={handleToggleNowPlaying} audioRef={audioRef} isPlaying={isPlaying} analyser={analyserRef.current} />}
      <div className={`flex-1 flex overflow-hidden ${view === ViewState.LYRICS ? 'hidden' : ''}`}>
        <aside className="w-64 glass border-r border-white/5 p-6 flex flex-col gap-8 hidden md:flex overflow-hidden">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"><Disc className="animate-spin-slow text-white" size={20} /></div>
            <h1 className="text-xl font-bold font-poppins">SoundTrack</h1>
          </div>
          <nav className="space-y-1">
            <NavItem icon={<Home size={20} />} label="Trang chủ" active={view === ViewState.HOME} onClick={() => navigateTo(ViewState.HOME)} />
            <NavItem icon={<Search size={20} />} label="Tìm kiếm" active={view === ViewState.SEARCH} onClick={() => navigateTo(ViewState.SEARCH)} />
            <NavItem icon={<Library size={20} />} label="Thư viện" active={view === ViewState.LIBRARY} onClick={() => navigateTo(ViewState.LIBRARY)} />
            <NavItem icon={<Upload size={20} />} label="Tải lên" active={view === ViewState.UPLOAD} onClick={() => navigateTo(ViewState.UPLOAD)} />
          </nav>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">Playlist</h3>
            <div className="space-y-1">
              <NavItem icon={<PlusCircle size={20} />} label="Tạo mới" active={false} onClick={handleCreatePlaylist} />
              <NavItem icon={<Heart size={20} className="text-pink-500" />} label="Yêu thích" active={false} onClick={() => navigateTo(ViewState.LIBRARY)} />
              {userPlaylists.map(pl => (
                <button key={pl.id} onClick={() => handleOpenPlaylist(pl)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all text-left truncate ${selectedPlaylist?.id === pl.id && view === ViewState.PLAYLIST_DETAIL ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                  <ListMusic size={18} /> <span className="truncate">{pl.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-white/5 to-transparent relative">
          <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0a0a0c]/90 backdrop-blur-md">
            <div className="flex gap-2">
              <button onClick={() => setView(previousView)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors shadow-sm"><ChevronLeft size={20} /></button>
              <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 cursor-not-allowed"><ChevronRight size={20} /></button>
            </div>
            <div className="flex items-center gap-4">
              {!user ? (
                <><button onClick={() => { setAuthView('register'); setShowAuthModal(true); }} className="text-white/60 hover:text-white font-semibold text-xs tracking-widest uppercase">Đăng ký</button>
                <button onClick={() => { setAuthView('login'); setShowAuthModal(true); }} className="bg-white text-black px-8 py-2.5 rounded-full font-bold text-sm">Đăng nhập</button></>
              ) : (
                <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 group cursor-pointer">
                   <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-500"><img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /></div>
                  <span className="text-sm font-semibold max-w-[120px] truncate">{user.name}</span>
                </div>
              )}
            </div>
          </header>
          <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-full transition-all duration-500">{renderMainContent()}</div>
        </main>
        <aside className="w-96 glass border-l border-white/5 p-6 hidden lg:block overflow-hidden"><GeminiDJ currentTrack={currentTrack} /></aside>
      </div>
      <audio ref={audioRef} src={currentTrack.audioUrl} onEnded={nextTrack} preload="auto" />
      <Player currentTrack={currentTrack} isPlaying={isPlaying} onPlayPause={handlePlayPause} onNext={nextTrack} onPrev={prevTrack} onOpenLyrics={handleToggleNowPlaying} audioRef={audioRef} onToggleLike={toggleLike} isLiked={likedTrackIds.has(currentTrack.id)} />
    </div>
  );
};

interface NavItemProps { icon: React.ReactNode; label: string; active: boolean; onClick?: () => void; }
const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
    {icon}<span>{label}</span>{active && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
  </button>
);

export default App;
