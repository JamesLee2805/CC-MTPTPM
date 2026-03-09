
import React from 'react';
import { Playlist, Track } from '../types';
import TrackList from './TrackList';
import { Play, Heart, MoreHorizontal, Music, ChevronLeft } from 'lucide-react';

interface PlaylistViewProps {
  playlist: Playlist;
  currentTrack: Track;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onDownload: (track: Track) => void;
  likedTrackIds: Set<string>;
  onBack?: () => void;
  userPlaylists?: Playlist[];
  onAddToPlaylist?: (track: Track, playlistId: string) => void;
  onAddToQueue?: (track: Track) => void;
  onCreatePlaylist?: () => void;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlist,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onToggleLike,
  onDownload,
  likedTrackIds,
  onBack,
  userPlaylists,
  onAddToPlaylist,
  onAddToQueue,
  onCreatePlaylist
}) => {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Back button for mobile/compact view */}
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 md:hidden"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">Quay lại</span>
        </button>
      )}

      {/* Header */}
      <div className="relative -mx-6 md:-mx-10 -mt-6 md:-mt-10 p-6 md:p-10 mb-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={playlist.coverUrl} alt="" className="w-full h-full object-cover blur-3xl opacity-20 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0c]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-end gap-8">
          <div className="w-56 h-56 md:w-64 md:h-64 flex-shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden border border-white/10">
            <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded border border-blue-500/20">Playlist</span>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Cập nhật: 2024</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black font-poppins leading-tight tracking-tighter">{playlist.name}</h1>
            <p className="text-white/60 text-sm md:text-lg max-w-2xl leading-relaxed">{playlist.description}</p>
            <div className="flex items-center gap-3 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">S</div>
                <span className="font-bold text-white/80">SoundTrack Editor</span>
              </div>
              <span>•</span>
              <span>{playlist.tracks.length} bài hát</span>
              <span>•</span>
              <span>2.5M lượt nghe</span>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <button 
                onClick={() => playlist.tracks.length > 0 && onTrackSelect(playlist.tracks[0])}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all font-bold"
              >
                <Play fill="white" size={20} className="ml-0.5" /> PHÁT TẤT CẢ
              </button>
              <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <Heart size={24} />
              </button>
              <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <MoreHorizontal size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div>
        {playlist.tracks.length > 0 ? (
          <TrackList 
            tracks={playlist.tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackSelect={onTrackSelect}
            onToggleLike={onToggleLike}
            onDownload={onDownload}
            likedTrackIds={likedTrackIds}
            userPlaylists={userPlaylists}
            onAddToPlaylist={onAddToPlaylist}
            onAddToQueue={onAddToQueue}
            onCreatePlaylist={onCreatePlaylist}
          />
        ) : (
          <div className="glass rounded-2xl p-20 text-center border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="text-white/20" size={32} />
            </div>
            <p className="text-white/40">Playlist này chưa có bài hát nào.</p>
            <button className="mt-4 text-blue-400 hover:underline text-sm font-bold uppercase">Tìm bài hát ngay</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
