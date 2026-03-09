
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
    youtubeUrl: 'https://www.youtube.com/watch?v=gJHSDZfTrOk',
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
    description: 'Sự kết hợp độc đáo giữa âm hưởng cổ phong và nhạc hiện đại.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Llw9Q6akRo4',
    lyrics: [
      { time: 0, text: "Nơi đây sương khói mờ nhân ảnh" },
      { time: 5, text: "Lạc trôi giữa đời" },
      { time: 10, text: "Ta lạc trôi giữa đời..." },
      { time: 20, text: "Bao nhiêu ký ức xưa ùa về" }
    ]
  },
  // DJ / VINAHOUSE VIETNAM
  {
    id: 'dj-1',
    title: 'Thiên Đàng (Nonstop 2024)',
    artist: 'DJ Thái Hoàng',
    album: 'Vinahouse Legend',
    duration: '15:20',
    coverUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'DJ / Vinahouse',
    description: 'Bản nonstop cực căng từ ông hoàng Vinahouse Thái Hoàng.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Nn_z7X6X_9w'
  },
  {
    id: 'dj-2',
    title: 'Cắt Đôi Nỗi Sầu (Remix)',
    artist: 'DJ Future',
    album: 'Future Bass VN',
    duration: '04:15',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'DJ / Vinahouse',
    description: 'Bản remix theo phong cách Future Bass đầy năng lượng.',
    youtubeUrl: 'https://www.youtube.com/watch?v=fXW9vO_S-X4'
  },
  {
    id: 'dj-3',
    title: 'Mashup Hot Tiktok 2024',
    artist: 'DJ Win',
    album: 'Tiktok Remix',
    duration: '03:45',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'DJ / Vinahouse',
    description: 'Mashup những bản nhạc hot nhất xu hướng từ DJ Win.',
    youtubeUrl: 'https://www.youtube.com/watch?v=0_0_0_0_0_0' // Placeholder for mashup
  },
  {
    id: 'dj-4',
    title: 'Gió (Vinahouse Remix)',
    artist: 'DJ Tùng Chùa',
    album: 'Night Club',
    duration: '05:10',
    coverUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    genre: 'DJ / Vinahouse',
    youtubeUrl: 'https://www.youtube.com/watch?v=0_0_0_0_0_1'
  },
  // US-UK
  {
    id: 'us-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    genre: 'US-UK',
    youtubeUrl: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
    lyrics: [
      { time: 0, text: "I've been on my own for long enough" },
      { time: 5, text: "Maybe you can show me how to love, maybe" },
      { time: 10, text: "I'm running out of time" },
      { time: 15, text: "'Cause I can see the sun light up the sky" },
      { time: 20, text: "So I hit the road in overdrive, baby" }
    ]
  },
  {
    id: 'us-2',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    album: 'Endless Summer Vacation',
    duration: '3:21',
    coverUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    genre: 'US-UK',
    youtubeUrl: 'https://www.youtube.com/watch?v=G7KNmW9a75Y'
  },
  // LO-FI
  {
    id: 'lofi-1',
    title: 'Coffee Breath',
    artist: 'Lofi Girl',
    album: 'Study Session',
    duration: '2:45',
    coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    genre: 'Lo-fi',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A'
  },
  // K-POP
  {
    id: 'kpop-1',
    title: 'Ditto',
    artist: 'NewJeans',
    album: 'OMG',
    duration: '3:05',
    coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'K-Pop',
    description: 'Bản hit mang phong cách Baltimore Club đầy hoài niệm.',
    youtubeUrl: 'https://www.youtube.com/watch?v=pSUydWEqKwE'
  },
  {
    id: 'kpop-2',
    title: 'Seven',
    artist: 'Jungkook',
    album: 'Golden',
    duration: '3:04',
    coverUrl: 'https://images.unsplash.com/photo-1514525253344-99a42999628a?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'K-Pop',
    youtubeUrl: 'https://www.youtube.com/watch?v=QU9c0053UAU'
  },
  // INDIE VIET
  {
    id: 'indie-1',
    title: 'Lạ Lùng',
    artist: 'Vũ.',
    album: 'Single',
    duration: '4:15',
    coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Indie',
    youtubeUrl: 'https://www.youtube.com/watch?v=F5tS4Gerick',
    lyrics: [
      { time: 0, text: "Kìa màn đêm mờ sương" },
      { time: 5, text: "Đợi chờ em ở đâu" },
      { time: 10, text: "Lạ lùng em tới đây" },
      { time: 15, text: "Khiến trái tim ta bồi hồi" }
    ]
  },
  {
    id: 'indie-2',
    title: 'Thanh Xuân',
    artist: 'Da LAB',
    album: 'Single',
    duration: '3:45',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    genre: 'Indie',
    youtubeUrl: 'https://www.youtube.com/watch?v=GgQFO8dL5YI'
  },
  // ELECTRONIC
  {
    id: 'elec-1',
    title: 'Wake Me Up',
    artist: 'Avicii',
    album: 'True',
    duration: '4:07',
    coverUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&h=800&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Electronic',
    youtubeUrl: 'https://www.youtube.com/watch?v=IcrbM1l_BoI'
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
  },
  {
    id: 'rec-kpop',
    name: 'K-Pop Fever',
    description: 'Sức nóng từ các nhóm nhạc hàng đầu Hàn Quốc.',
    tracks: MOCK_TRACKS.filter(t => t.genre === 'K-Pop'),
    coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&h=800&fit=crop&q=80'
  }
];

export const TOPICS = [
  { id: 't1', name: 'Cà Phê Sáng', coverUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop' },
  { id: 't2', name: 'Lofi Chill', coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop' },
  { id: 't3', name: 'Nhạc Trẻ Hot', coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop' },
  { id: 't4', name: 'Tình Yêu', coverUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=400&fit=crop' },
  { id: 't5', name: 'Gym & Workout', coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop' },
];

export const GENRES = ['Tất cả', 'Nhạc Trẻ', 'DJ / Vinahouse', 'Trữ Tình', 'Rap Việt', 'K-Pop', 'US-UK', 'Indie'];
