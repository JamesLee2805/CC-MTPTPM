
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Track } from '../types';
import TrackList from './TrackList';

interface SearchViewProps {
  allTracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  likedTrackIds: Set<string>;
}

const SearchView: React.FC<SearchViewProps> = (props) => {
  const [query, setQuery] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(props.allTracks);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredTracks(props.allTracks);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = props.allTracks.filter(track => 
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.album.toLowerCase().includes(lowerQuery)
    );
    setFilteredTracks(results);
  }, [query, props.allTracks]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative max-w-2xl">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-white/40" size={24} />
        </div>
        <input 
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Bạn muốn nghe gì?"
          className="w-full bg-[#18181b] border border-white/10 rounded-full py-4 pl-14 pr-6 text-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xl"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold font-poppins mb-4">
          {query ? 'Kết quả tìm kiếm' : 'Duyệt tất cả'}
        </h2>
        <TrackList 
          tracks={filteredTracks}
          currentTrack={props.currentTrack}
          isPlaying={props.isPlaying}
          onTrackSelect={props.onTrackSelect}
          onToggleLike={props.onToggleLike}
          likedTrackIds={props.likedTrackIds}
        />
      </div>
    </div>
  );
};

export default SearchView;
