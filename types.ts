
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
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  coverUrl: string;
}

export enum ViewState {
  HOME = 'home',
  PLAYLIST = 'playlist',
  SEARCH = 'search',
  LIBRARY = 'library',
  AI_EXPLORER = 'ai_explorer',
  LYRICS = 'lyrics'
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
