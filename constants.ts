
import { Track, Playlist } from './types';

export const MOCK_TRACKS: Track[] = [
  // V-POP
  {
    id: 'vn-1',
    title: 'See Tình',
    artist: 'Hoàng Thùy Linh',
    album: 'LINK',
    duration: '3:05',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'V-Pop',
    description: 'Bản hit toàn cầu mang âm hưởng dân gian đương đại Việt Nam.',
    lyrics: [
      { time: 0, text: "Uầy uầy uầy uầy..." },
      { time: 5, text: "Giây phút em gặp anh là em biết em tình si" },
      { time: 17, text: "Tình tang tang tính, tính tang tang tình" }
    ]
  },
  {
    id: 'vn-2',
    title: 'Lạc Trôi',
    artist: 'Sơn Tùng M-TP',
    album: 'm-tp M-TP',
    duration: '3:52',
    coverUrl: 'https://images.unsplash.com/photo-1528642463367-8d7bd6703f64?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'V-Pop',
    description: 'Sự kết hợp độc đáo giữa âm hưởng cổ phong và nhạc hiện đại.'
  },
  // DJ / VINAHOUSE VIETNAM
  {
    id: 'dj-1',
    title: 'Thiên Đàng (Nonstop 2024)',
    artist: 'DJ Thái Hoàng',
    album: 'Vinahouse Legend',
    duration: '15:20',
    coverUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    genre: 'DJ / Vinahouse',
    description: 'Bản nonstop cực căng từ ông hoàng Vinahouse Thái Hoàng.'
  },
  {
    id: 'dj-2',
    title: 'Cắt Đôi Nỗi Sầu (Remix)',
    artist: 'DJ Future',
    album: 'Future Bass VN',
    duration: '04:15',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    genre: 'DJ / Vinahouse',
    description: 'Bản remix theo phong cách Future Bass đầy năng lượng.'
  },
  {
    id: 'dj-3',
    title: 'Mashup Hot Tiktok 2024',
    artist: 'DJ Win',
    album: 'Tiktok Remix',
    duration: '03:45',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    genre: 'DJ / Vinahouse',
    description: 'Mashup những bản nhạc hot nhất xu hướng từ DJ Win.'
  },
  {
    id: 'dj-4',
    title: 'Gió (Vinahouse Remix)',
    artist: 'DJ Tùng Chùa',
    album: 'Night Club',
    duration: '05:10',
    coverUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    genre: 'DJ / Vinahouse'
  },
  // US-UK
  {
    id: 'us-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'US-UK'
  },
  {
    id: 'us-2',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    album: 'Endless Summer Vacation',
    duration: '3:21',
    coverUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'US-UK'
  },
  // LO-FI
  {
    id: 'lofi-1',
    title: 'Coffee Breath',
    artist: 'Lofi Girl',
    album: 'Study Session',
    duration: '2:45',
    coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Lo-fi'
  },
  // INDIE VIET
  {
    id: 'indie-1',
    title: 'Lạ Lùng',
    artist: 'Vũ.',
    album: 'Single',
    duration: '4:15',
    coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    genre: 'Indie'
  }
];

export const RECOMMENDED_PLAYLISTS: Playlist[] = [
  {
    id: 'rec-dj',
    name: 'Bay Cùng Thái Hoàng',
    description: 'Tuyển tập những bản Nonstop và Remix đỉnh cao nhất.',
    tracks: MOCK_TRACKS.filter(t => t.artist === 'DJ Thái Hoàng'),
    coverUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&h=800&fit=crop&q=80'
  },
  {
    id: 'rec-1',
    name: 'V-Pop Gây Nghiện',
    description: 'Những bản hit V-Pop thịnh hành nhất hiện nay.',
    tracks: MOCK_TRACKS.filter(t => t.genre === 'V-Pop'),
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop&q=80'
  }
];

export const GENRES = ['Tất cả', 'DJ / Vinahouse', 'V-Pop', 'US-UK', 'Lo-fi', 'Indie', 'Electronic'];
