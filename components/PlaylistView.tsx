
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
}

const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlist,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onToggleLike,
  onDownload,
  likedTrackIds,
  onBack
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
      <div className="flex flex-col md:flex-row items-end gap-8">
        <div className="w-56 h-56 md:w-64 md:h-64 flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden glass border border-white/10">
          <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Playlist</span>
          <h1 className="text-4xl md:text-6xl font-black font-poppins">{playlist.name}</h1>
          <p className="text-white/60 text-sm md:text-base">{playlist.description}</p>
          <div className="flex items-center gap-2 text-sm text-white/40">
            <span className="font-bold text-white">SoundTrack</span>
            <span>•</span>
            <span>{playlist.tracks.length} bài hát</span>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => playlist.tracks.length > 0 && onTrackSelect(playlist.tracks[0])}
              className="bg-blue-600 hover:bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all"
            >
              <Play fill="white" size={24} className="ml-1" />
            </button>
            <button className="text-white/40 hover:text-white transition-colors">
              <Heart size={28} />
            </button>
            <button className="text-white/40 hover:text-white transition-colors">
              <MoreHorizontal size={28} />
            </button>
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
