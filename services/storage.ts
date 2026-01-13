
import { User } from '../types';

const KEYS = {
  USER: 'nova_user_session',
  LIKED_TRACKS: 'nova_liked_tracks',
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
  }
};
