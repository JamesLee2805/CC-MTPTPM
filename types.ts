
export interface LyricLine {
  time: number;
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
  genre: string;
  description?: string;
  isLocal?: boolean;
  lyrics?: LyricLine[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  coverUrl: string;
  createdBy?: string;
}

export enum ViewState {
  HOME = 'home',
  PLAYLIST = 'playlist',
  SEARCH = 'search',
  LIBRARY = 'library',
  AI_EXPLORER = 'ai_explorer',
  LYRICS = 'lyrics',
  UPLOAD = 'upload',
  PLAYLIST_DETAIL = 'playlist_detail'
}

export interface AIRecommendation {
  title: string;
  artist: string;
  reason: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
