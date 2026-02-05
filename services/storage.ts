
import { User, Playlist } from '../types';

const KEYS = {
  USER: 'soundtrack_user_session',
  LIKED_TRACKS: 'soundtrack_liked_tracks',
  USER_PLAYLISTS: 'soundtrack_user_playlists',
};

export const storage = {
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveUser: (user: User) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  clearUser: () => {
    localStorage.removeItem(KEYS.USER);
  },

  getLikedTracks: (): string[] => {
    try {
      const data = localStorage.getItem(KEYS.LIKED_TRACKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLikedTracks: (ids: string[]) => {
    localStorage.setItem(KEYS.LIKED_TRACKS, JSON.stringify(ids));
  },

  getUserPlaylists: (): Playlist[] => {
    try {
      const data = localStorage.getItem(KEYS.USER_PLAYLISTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUserPlaylists: (playlists: Playlist[]) => {
    localStorage.setItem(KEYS.USER_PLAYLISTS, JSON.stringify(playlists));
  }
};
