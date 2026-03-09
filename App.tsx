
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_TRACKS, RECOMMENDED_PLAYLISTS, GENRES, TOPICS } from './constants';
import { Track, ViewState, User, Playlist, RepeatMode } from './types';
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
import { Home, Search, Library, PlusCircle, Heart, Disc, Play, Pause, MoreHorizontal, User as UserIcon, LogOut, Loader2, ChevronLeft, ChevronRight, Upload, Music, CloudUpload, X, ListMusic, Mic2, Star, TrendingUp, Flame, Zap, Headphones, Compass, Sparkles, Clock } from 'lucide-react';

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
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.OFF);
  const [queue, setQueue] = useState<Track[]>(MOCK_TRACKS);
  const [queueIndex, setQueueIndex] = useState(0);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [importUrl, setImportUrl] = useState('');
  const [importTitle, setImportTitle] = useState('');
  const [importArtist, setImportArtist] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
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

  const lastTrackIdRef = useRef<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
      
      if (lastTrackIdRef.current !== currentTrack.id) {
        audio.load();
        lastTrackIdRef.current = currentTrack.id;
      }

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
  }, [isPlaying, currentTrack.id]);

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
    
    // Update recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 10);
    });
  };

  const nextTrack = React.useCallback(() => {
    if (queue.length === 0) return;
    
    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      const idx = queue.findIndex(t => t.id === currentTrack.id);
      nextIdx = (idx + 1) % queue.length;
      
      // If we reached the end and repeat is off, stop playing
      if (idx === queue.length - 1 && repeatMode === RepeatMode.OFF) {
        setIsPlaying(false);
        return;
      }
    }
    
    handleTrackSelect(queue[nextIdx]);
  }, [queue, currentTrack.id, isShuffle, repeatMode]);

  const prevTrack = React.useCallback(() => {
    if (queue.length === 0) return;
    
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + queue.length) % queue.length;
    handleTrackSelect(queue[prevIdx]);
  }, [queue, currentTrack.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      if (repeatMode === RepeatMode.ONE) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [repeatMode, nextTrack]);

  useEffect(() => {
    if (sleepTimer === null) return;
    
    const timer = setTimeout(() => {
      setIsPlaying(false);
      setSleepTimer(null);
      alert('Hẹn giờ tắt nhạc đã kích hoạt. Nhạc đã dừng.');
    }, sleepTimer * 60 * 1000);
    
    return () => clearTimeout(timer);
  }, [sleepTimer]);

  const handleSetSleepTimer = (minutes: number | null) => {
    setSleepTimer(minutes);
  };

  const handleToggleShuffle = () => setIsShuffle(prev => !prev);
  const handleToggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === RepeatMode.OFF) return RepeatMode.ALL;
      if (prev === RepeatMode.ALL) return RepeatMode.ONE;
      return RepeatMode.OFF;
    });
  };
  const handleOpenQueue = () => navigateTo(ViewState.QUEUE);

  const handleAddToPlaylist = (track: Track, playlistId: string) => {
    const updatedPlaylists = userPlaylists.map(pl => {
      if (pl.id === playlistId) {
        // Avoid duplicates
        if (pl.tracks.some(t => t.id === track.id)) return pl;
        return { ...pl, tracks: [...pl.tracks, track] };
      }
      return pl;
    });
    setUserPlaylists(updatedPlaylists);
    storage.saveUserPlaylists(updatedPlaylists);
  };

  const handleAddToQueue = (track: Track) => {
    setQueue(prev => {
      if (prev.some(t => t.id === track.id)) return prev;
      return [...prev, track];
    });
  };

  const toggleLike = (trackId: string) => {
    setLikedTrackIds(prev => {
      const next = new Set(prev);
      next.has(trackId) ? next.delete(trackId) : next.add(trackId);
      storage.saveLikedTracks(Array.from(next) as string[]);
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

  const handleUrlImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) return;
    
    setIsImporting(true);
    
    // Create a new track object from the URL
    const newTrack: Track = {
      id: `url-${Date.now()}`,
      title: importTitle || 'Bản nhạc từ internet',
      artist: importArtist || 'Nghệ sĩ ẩn danh',
      album: 'Nguồn trực tuyến',
      duration: '??:??',
      coverUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400&h=400&fit=crop',
      audioUrl: importUrl,
      genre: 'Internet',
      description: `Được nhập từ: ${importUrl}`
    };

    setUserTracks([newTrack, ...userTracks]);
    setImportUrl('');
    setImportTitle('');
    setImportArtist('');
    setIsImporting(false);
    navigateTo(ViewState.LIBRARY);
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
      
      {recentlyPlayed.length > 0 && (
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black font-poppins flex items-center gap-2"><Clock className="text-blue-400" size={20} /> Nghe Gần Đây</h2>
            </div>
            <button onClick={() => setRecentlyPlayed([])} className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest">Xóa lịch sử</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
            {recentlyPlayed.map(track => (
              <div key={track.id} onClick={() => handleTrackSelect(track)} className="flex-shrink-0 w-32 group cursor-pointer">
                <div className="relative aspect-square mb-2 rounded-xl overflow-hidden shadow-lg border border-white/5 transition-all">
                  <img src={track.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={track.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-xl">
                      <Play fill="white" size={16} className="ml-0.5" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-[11px] text-white truncate group-hover:text-blue-400 transition-colors">{track.title}</h3>
                <p className="text-[9px] text-white/40 truncate">{track.artist}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
        {GENRES.map(genre => (
          <button key={genre} onClick={() => setSelectedGenre(genre)} className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${selectedGenre === genre ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}>
            {genre === 'DJ / Vinahouse' ? <span className="flex items-center gap-2"><Zap size={14} className="text-yellow-400" /> {genre}</span> : genre}
          </button>
        ))}
      </div>

      {selectedGenre === 'Tất cả' && (
        <section id="topics" className="animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black font-poppins flex items-center gap-2"><Sparkles className="text-yellow-500" size={24} /> Chủ Đề Hot</h2>
              <p className="text-sm text-white/40">Giai điệu phù hợp với mọi khoảnh khắc</p>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2">
            {TOPICS.map(topic => (
              <div key={topic.id} className="flex-shrink-0 w-40 group cursor-pointer">
                <div className="relative aspect-square mb-3 rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-all">
                  <img src={topic.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={topic.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-xl">
                      <Play fill="white" size={16} className="ml-0.5" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-sm text-white text-center group-hover:text-blue-400 transition-colors">{topic.name}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="charts" className="animate-fade-in">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black font-poppins flex items-center gap-2"><TrendingUp className="text-blue-500" size={24} /> {selectedGenre === 'Tất cả' ? 'BXH Nhạc Việt' : `Đề xuất ${selectedGenre}`}</h2>
            <p className="text-sm text-white/40">Những bài hát đang làm mưa làm gió</p>
          </div>
          <button className="text-xs font-bold text-blue-400 hover:underline uppercase tracking-widest">Xem tất cả</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredTracks().slice(0, 6).map((track, idx) => (
            <div key={track.id} onClick={() => handleTrackSelect(track)} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-pointer relative">
              <div className="relative w-20 h-20 flex-shrink-0">
                <img src={track.coverUrl} className="w-full h-full object-cover rounded-xl shadow-lg" alt={track.title} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl"><Play size={20} fill="white" /></div>
                <div className={`absolute -top-2 -left-2 w-7 h-7 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0a0a0c] shadow-lg ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-300 text-black' : idx === 2 ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
                  {idx + 1}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-white truncate group-hover:text-blue-400 transition-colors">{track.title}</h3>
                <p className="text-xs text-white/40 truncate">{track.artist}</p>
                <div className="flex items-center gap-2 mt-2">
                   <span className={`text-[9px] font-bold uppercase tracking-widest ${track.genre.includes('DJ') ? 'text-yellow-500' : 'text-blue-500'}`}>{track.genre}</span>
                   {idx < 3 && <Flame size={12} className="text-orange-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="new-releases" className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black font-poppins flex items-center gap-2"><Music className="text-emerald-500" size={24} /> Mới Phát Hành</h2>
            <p className="text-sm text-white/40">Những bản nhạc vừa cập bến SoundTrack</p>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2">
          {MOCK_TRACKS.slice(-6).reverse().map(track => (
            <div key={track.id} onClick={() => handleTrackSelect(track)} className="flex-shrink-0 w-48 group cursor-pointer">
              <div className="relative aspect-square mb-3 rounded-2xl overflow-hidden shadow-lg border border-white/5 group-hover:border-emerald-500/50 transition-all">
                <img src={track.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={track.title} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform">
                    <Play fill="black" className="text-black ml-1" size={24} />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{track.title}</h3>
              <p className="text-xs text-white/40 truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {selectedGenre === 'Tất cả' && (
        <>
          <section id="top-100" className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black font-poppins flex items-center gap-2"><Star className="text-yellow-500" size={24} /> Top 100</h2>
                <p className="text-sm text-white/40">Những ca khúc hay nhất được tuyển chọn</p>
              </div>
              <button className="text-xs font-bold text-blue-400 hover:underline uppercase tracking-widest">Xem tất cả</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {RECOMMENDED_PLAYLISTS.slice(0, 5).map(playlist => (
                <div key={playlist.id} onClick={() => handleOpenPlaylist(playlist)} className="group cursor-pointer">
                  <div className="relative aspect-square mb-3 rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-all">
                    <img src={playlist.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={playlist.name} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-xl">
                        <Play fill="white" size={20} className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-white truncate group-hover:text-blue-400 transition-colors">{playlist.name}</h3>
                  <p className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-tighter">Top 100 • 2024</p>
                </div>
              ))}
            </div>
          </section>
          <section id="suggested" className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black font-poppins flex items-center gap-2"><ListMusic className="text-purple-500" size={24} /> Playlist Gợi Ý</h2>
                <p className="text-sm text-white/40">Khám phá âm nhạc theo phong cách riêng</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {RECOMMENDED_PLAYLISTS.slice(5).map(playlist => (
                <PlaylistCard key={playlist.id} playlist={playlist} onClick={() => handleOpenPlaylist(playlist)} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );

  const renderMainContent = () => {
    switch (view) {
      case ViewState.SEARCH:
        return <SearchView 
          allTracks={[...MOCK_TRACKS, ...userTracks]} 
          currentTrack={currentTrack} 
          isPlaying={isPlaying} 
          onTrackSelect={handleTrackSelect} 
          onToggleLike={toggleLike} 
          onDownload={handleDownload} 
          likedTrackIds={likedTrackIds}
          userPlaylists={userPlaylists}
          onAddToPlaylist={handleAddToPlaylist}
          onAddToQueue={handleAddToQueue}
          onCreatePlaylist={handleCreatePlaylist}
        />;
      case ViewState.LIBRARY:
        return <LibraryView 
          user={user} 
          onOpenAuth={() => { setAuthView('login'); setShowAuthModal(true); }} 
          likedTracks={[...MOCK_TRACKS, ...userTracks].filter(t => likedTrackIds.has(t.id))} 
          currentTrack={currentTrack} 
          isPlaying={isPlaying} 
          onTrackSelect={handleTrackSelect} 
          onToggleLike={toggleLike} 
          onDownload={handleDownload} 
          likedTrackIds={likedTrackIds}
          userPlaylists={userPlaylists}
          onAddToPlaylist={handleAddToPlaylist}
          onAddToQueue={handleAddToQueue}
          onCreatePlaylist={handleCreatePlaylist}
        />;
      case ViewState.PLAYLIST_DETAIL:
        const currentPlaylist = selectedPlaylist ? (userPlaylists.find(pl => pl.id === selectedPlaylist.id) || RECOMMENDED_PLAYLISTS.find(pl => pl.id === selectedPlaylist.id) || selectedPlaylist) : null;
        return currentPlaylist ? <PlaylistView 
          playlist={currentPlaylist} 
          currentTrack={currentTrack} 
          isPlaying={isPlaying} 
          onTrackSelect={handleTrackSelect} 
          onToggleLike={toggleLike} 
          onDownload={handleDownload} 
          likedTrackIds={likedTrackIds} 
          onBack={() => navigateTo(previousView)} 
          userPlaylists={userPlaylists}
          onAddToPlaylist={handleAddToPlaylist}
          onAddToQueue={handleAddToQueue}
          onCreatePlaylist={handleCreatePlaylist}
        /> : null;
      case ViewState.QUEUE:
        return (
          <div className="animate-fade-in space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-black font-poppins">Danh sách chờ</h1>
              <button onClick={() => setQueue([])} className="text-sm text-white/40 hover:text-white transition-colors">Xóa hết</button>
            </div>
            <TrackList 
              tracks={queue}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onTrackSelect={handleTrackSelect}
              onToggleLike={toggleLike}
              onDownload={handleDownload}
              likedTrackIds={likedTrackIds}
              userPlaylists={userPlaylists}
              onAddToPlaylist={handleAddToPlaylist}
              onAddToQueue={handleAddToQueue}
              onCreatePlaylist={handleCreatePlaylist}
            />
          </div>
        );
      case ViewState.UPLOAD:
        return (
          <div className="animate-fade-in space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Local File Upload */}
              <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 bg-white/5 hover:bg-white/10 transition-all group">
                <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform"><CloudUpload size={40} /></div>
                <div>
                  <h2 className="text-2xl font-bold">Tải lên từ máy tính</h2>
                  <p className="text-white/40 max-w-sm mt-2">Chọn tệp âm thanh (MP3) trực tiếp từ thiết bị của bạn.</p>
                </div>
                <label className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full font-bold cursor-pointer transition-transform hover:scale-105">
                  Chọn tệp MP3
                  <input type="file" accept="audio/mp3" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              {/* URL Import */}
              <div className="p-12 border border-white/10 rounded-3xl flex flex-col space-y-6 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600/20 rounded-full flex items-center justify-center text-emerald-500"><Headphones size={24} /></div>
                  <div>
                    <h2 className="text-xl font-bold">Nhập từ nguồn mạng</h2>
                    <p className="text-white/40 text-sm">Dán link trực tiếp của tệp âm thanh.</p>
                  </div>
                </div>
                
                <form onSubmit={handleUrlImport} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Link âm thanh (URL)</label>
                    <input 
                      type="url" 
                      required
                      placeholder="https://example.com/song.mp3"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Tên bài hát</label>
                      <input 
                        type="text" 
                        placeholder="Tên bài hát"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        value={importTitle}
                        onChange={(e) => setImportTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Nghệ sĩ</label>
                      <input 
                        type="text" 
                        placeholder="Nghệ sĩ"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        value={importArtist}
                        onChange={(e) => setImportArtist(e.target.value)}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isImporting || !importUrl}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {isImporting ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
                    THÊM VÀO THƯ VIỆN
                  </button>
                </form>
              </div>
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
            <NavItem icon={<Home size={20} />} label="Trang chủ" active={view === ViewState.HOME} onClick={() => { navigateTo(ViewState.HOME); document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            <NavItem icon={<Compass size={20} />} label="Khám phá" active={false} onClick={() => { navigateTo(ViewState.HOME); document.getElementById('suggested')?.scrollIntoView({ behavior: 'smooth' }); }} />
            <NavItem icon={<TrendingUp size={20} />} label="BXH" active={false} onClick={() => { navigateTo(ViewState.HOME); document.getElementById('charts')?.scrollIntoView({ behavior: 'smooth' }); }} />
            <NavItem icon={<Sparkles size={20} />} label="Chủ đề" active={false} onClick={() => { navigateTo(ViewState.HOME); document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' }); }} />
            <NavItem icon={<Search size={20} />} label="Tìm kiếm" active={view === ViewState.SEARCH} onClick={() => navigateTo(ViewState.SEARCH)} />
            <NavItem icon={<Library size={20} />} label="Thư viện" active={view === ViewState.LIBRARY} onClick={() => navigateTo(ViewState.LIBRARY)} />
            <div className="relative">
              <NavItem icon={<Upload size={20} />} label="Tải lên" active={view === ViewState.UPLOAD} onClick={() => navigateTo(ViewState.UPLOAD)} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-blue-500 text-[8px] font-black text-white rounded uppercase animate-pulse">New</span>
            </div>
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
            <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm bài hát, nghệ sĩ, playlist..." 
                  onClick={() => navigateTo(ViewState.SEARCH)}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                />
              </div>
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
        <aside className="w-96 glass border-l border-white/5 p-6 hidden lg:block overflow-hidden">
          <GeminiDJ 
            currentTrack={currentTrack} 
            allTracks={[...MOCK_TRACKS, ...userTracks]}
            onTrackSelect={handleTrackSelect}
          />
        </aside>
      </div>
      <audio ref={audioRef} src={currentTrack.audioUrl} preload="auto" crossOrigin="anonymous" />
      <Player 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause} 
        onNext={nextTrack} 
        onPrev={prevTrack} 
        onOpenLyrics={handleToggleNowPlaying} 
        audioRef={audioRef} 
        onToggleLike={toggleLike} 
        isLiked={likedTrackIds.has(currentTrack.id)}
        isShuffle={isShuffle}
        onToggleShuffle={handleToggleShuffle}
        repeatMode={repeatMode}
        onToggleRepeat={handleToggleRepeat}
        onOpenQueue={handleOpenQueue}
        sleepTimer={sleepTimer}
        onSetSleepTimer={handleSetSleepTimer}
      />
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
