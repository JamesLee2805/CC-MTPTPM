
import React from 'react';
import { User, Track } from '../types';
import { Heart, Music, Lock } from 'lucide-react';
import TrackList from './TrackList';

interface LibraryViewProps {
  user: User | null;
  onOpenAuth: () => void;
  likedTracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  likedTrackIds: Set<string>;
}

const LibraryView: React.FC<LibraryViewProps> = ({
  user,
  onOpenAuth,
  likedTracks,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onToggleLike,
  likedTrackIds
}) => {
  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Lock size={48} className="text-white/20" />
        </div>
        <h2 className="text-3xl font-bold font-poppins">Thư viện của bạn</h2>
        <p className="text-white/50 max-w-md">
          Đăng nhập để xem các bài hát đã thích, tạo danh sách phát và lưu trữ bộ sưu tập âm nhạc của riêng bạn.
        </p>
        <button 
          onClick={onOpenAuth}
          className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
        >
          Đăng nhập miễn phí
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-end gap-6 p-6 bg-gradient-to-b from-blue-900/40 to-transparent rounded-3xl border border-white/5">
        <div className="w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-2xl flex items-center justify-center">
          <Heart size={64} className="text-white drop-shadow-lg" />
        </div>
        <div className="flex-1 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">Playlist</span>
          <h1 className="text-5xl font-black font-poppins">Bài hát đã thích</h1>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-white hover:underline cursor-pointer">{user.name}</span>
            <span>•</span>
            <span>{likedTracks.length} bài hát</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform">
                <Music size={24} />
            </button>
        </div>
        
        {likedTracks.length > 0 ? (
          <TrackList 
            tracks={likedTracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTrackSelect={onTrackSelect}
            onToggleLike={onToggleLike}
            likedTrackIds={likedTrackIds}
          />
        ) : (
          <div className="glass p-12 text-center rounded-2xl border border-white/5 border-dashed">
            <p className="text-white/40 mb-2">Bạn chưa thích bài hát nào</p>
            <p className="text-sm text-white/30">Nhấn vào biểu tượng trái tim khi nghe nhạc để thêm vào đây</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;
