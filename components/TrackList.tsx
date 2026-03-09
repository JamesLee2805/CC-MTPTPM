
import React from 'react';
import { Track } from '../types';
import { Clock, Heart, Download, Youtube, Play, MoreVertical, Plus, ListMusic } from 'lucide-react';
import { Playlist } from '../types';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onDownload: (track: Track) => void;
  likedTrackIds: Set<string>;
  showHeader?: boolean;
  userPlaylists?: Playlist[];
  onAddToPlaylist?: (track: Track, playlistId: string) => void;
  onAddToQueue?: (track: Track) => void;
  onCreatePlaylist?: () => void;
}

const TrackList: React.FC<TrackListProps> = ({ 
  tracks, 
  currentTrack, 
  isPlaying, 
  onTrackSelect,
  onToggleLike,
  onDownload,
  likedTrackIds,
  showHeader = true,
  userPlaylists = [],
  onAddToPlaylist,
  onAddToQueue,
  onCreatePlaylist
}) => {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);
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
              <th className="py-4 px-4 w-24"></th>
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
                <td className="py-4 px-6 text-center text-sm font-medium text-white/20 group-hover:text-white transition-colors">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span className="group-hover:opacity-0 transition-opacity">
                      {isCurrent && isPlaying ? (
                        <div className="flex items-center justify-center gap-0.5 h-3">
                          <div className="w-1 bg-blue-500 h-full animate-bounce" style={{animationDelay: '0s'}}></div>
                          <div className="w-1 bg-blue-500 h-2/3 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 bg-blue-500 h-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      ) : i + 1}
                    </span>
                    <Play size={14} fill="white" className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={track.coverUrl} className="w-10 h-10 rounded shadow object-cover" alt="cover" />
                    <div>
                      <p className={`text-sm font-semibold ${isCurrent ? 'text-blue-400' : 'text-white'}`}>{track.title}</p>
                      <p className="text-xs text-white/40">{track.artist}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 hidden md:table-cell text-sm text-white/40">{track.album}</td>
                <td className="py-4 px-4 hidden sm:table-cell text-sm text-white/40 text-center tabular-nums">{track.duration}</td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {track.youtubeUrl && (
                      <a 
                        href={track.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white/20 hover:text-[#FF0000] transition-colors p-1"
                        title="Xem trên YouTube"
                      >
                        <Youtube size={16} />
                      </a>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(track);
                      }}
                      className="text-white/20 hover:text-white transition-colors p-1"
                      title="Tải xuống"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(track.id);
                      }}
                      className={`transition-colors ${isLiked ? 'text-pink-500' : 'text-white/20 hover:text-white'} p-1`}
                    >
                      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === track.id ? null : track.id);
                        }}
                        className="text-white/20 hover:text-white transition-colors p-1"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {activeMenu === track.id && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 glass border border-white/10 rounded-xl shadow-2xl z-[110] overflow-hidden py-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToQueue?.(track);
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2 border-b border-white/5"
                          >
                            <ListMusic size={14} /> Thêm vào danh sách chờ
                          </button>
                          <div className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5">Thêm vào Playlist</div>
                          <div className="max-h-40 overflow-y-auto custom-scrollbar">
                            {userPlaylists.map(playlist => (
                              <button 
                                key={playlist.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToPlaylist?.(track, playlist.id);
                                  setActiveMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors truncate"
                              >
                                {playlist.name}
                              </button>
                            ))}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onCreatePlaylist?.();
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-blue-400 hover:bg-white/10 transition-colors flex items-center gap-2 border-t border-white/5"
                          >
                            <Plus size={14} /> Tạo Playlist mới
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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
