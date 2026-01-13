
import React from 'react';
import { Track } from '../types';
import { Clock, Heart } from 'lucide-react';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  likedTrackIds: Set<string>;
  showHeader?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({ 
  tracks, 
  currentTrack, 
  isPlaying, 
  onTrackSelect,
  onToggleLike,
  likedTrackIds,
  showHeader = true
}) => {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/5">
      <table className="w-full text-left">
        {showHeader && (
          <thead>
            <tr className="text-[10px] font-bold text-white/30 uppercase border-b border-white/5">
              <th className="py-4 px-6 w-12 text-center">#</th>
              <th className="py-4 px-4">Bài hát</th>
              <th className="py-4 px-4 hidden md:table-cell">Album</th>
              <th className="py-4 px-4 hidden sm:table-cell text-center"><Clock size={14} className="mx-auto" /></th>
              <th className="py-4 px-4 w-12"></th>
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-white/5">
          {tracks.map((track, i) => {
            const isCurrent = currentTrack.id === track.id;
            const isLiked = likedTrackIds.has(track.id);
            
            return (
              <tr 
                key={track.id} 
                className={`group cursor-pointer transition-colors ${isCurrent ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}
                onClick={() => onTrackSelect(track)}
              >
                <td className="py-4 px-6 text-center text-sm font-medium text-white/40 group-hover:text-white">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-center justify-center gap-0.5 h-3">
                      <div className="w-1 bg-blue-500 h-full animate-bounce" style={{animationDelay: '0s'}}></div>
                      <div className="w-1 bg-blue-500 h-2/3 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 bg-blue-500 h-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  ) : i + 1}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={track.coverUrl} className="w-10 h-10 rounded shadow" alt="cover" />
                    <div>
                      <p className={`text-sm font-semibold ${isCurrent ? 'text-blue-400' : 'text-white'}`}>{track.title}</p>
                      <p className="text-xs text-white/40">{track.artist}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 hidden md:table-cell text-sm text-white/40">{track.album}</td>
                <td className="py-4 px-4 hidden sm:table-cell text-sm text-white/40 text-center tabular-nums">{track.duration}</td>
                <td className="py-4 px-4 text-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(track.id);
                    }}
                    className={`transition-colors ${isLiked ? 'text-pink-500' : 'text-white/20 hover:text-white'}`}
                  >
                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {tracks.length === 0 && (
        <div className="p-8 text-center text-white/30 text-sm">
          Không tìm thấy bài hát nào
        </div>
      )}
    </div>
  );
};

export default TrackList;
