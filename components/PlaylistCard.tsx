
import React from 'react';
import { Playlist } from '../types';
import { Play } from 'lucide-react';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: (playlist: Playlist) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onClick }) => {
  return (
    <div 
      onClick={() => onClick(playlist)}
      className="group bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all cursor-pointer border border-white/5 hover:border-blue-500/30 shadow-lg"
    >
      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden shadow-2xl">
        <img 
          src={playlist.coverUrl} 
          alt={playlist.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform">
            <Play fill="white" className="text-white ml-1" size={24} />
          </div>
        </div>
      </div>
      <h3 className="font-bold text-white truncate">{playlist.name}</h3>
      <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
        {playlist.description}
      </p>
    </div>
  );
};

export default PlaylistCard;
