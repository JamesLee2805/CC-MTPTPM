
import React, { useState } from 'react';
import { getMoodPlaylist, explainSong, generateLyrics } from '../services/geminiService';
import { Sparkles, Brain, Music, Wand2, Loader2, Play, Star } from 'lucide-react';
import { Track, AIRecommendation } from '../types';

interface GeminiDJProps {
  currentTrack: Track;
}

const GeminiDJ: React.FC<GeminiDJProps> = ({ currentTrack }) => {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIRecommendation[]>([]);
  const [explanation, setExplanation] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [activeTab, setActiveTab] = useState<'mood' | 'explain' | 'lyrics'>('mood');

  const handleMoodCuration = async () => {
    if (!mood) return;
    setLoading(true);
    const recs = await getMoodPlaylist(mood);
    setResults(recs);
    setLoading(false);
  };

  const handleExplain = async () => {
    setLoading(true);
    const text = await explainSong(currentTrack.title, currentTrack.artist);
    setExplanation(text);
    setLoading(false);
  };

  const handleLyrics = async () => {
    setLoading(true);
    const text = await generateLyrics(mood || "u sầu", "Pop Ballad");
    setLyrics(text);
    setLoading(false);
  };

  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Sparkles className="text-blue-400" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold font-poppins">Gemini AI Studio</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Ưu tiên Nhạc Việt</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
        <button 
          onClick={() => setActiveTab('mood')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'mood' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/60 hover:bg-white/5'}`}
        >
          <Music size={16} /> DJ Cảm Xúc
        </button>
        <button 
          onClick={() => setActiveTab('explain')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'explain' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/60 hover:bg-white/5'}`}
        >
          <Brain size={16} /> Giải Thích
        </button>
        <button 
          onClick={() => setActiveTab('lyrics')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'lyrics' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/60 hover:bg-white/5'}`}
        >
          <Wand2 size={16} /> Lời Nhạc
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {activeTab === 'mood' && (
          <div className="space-y-4">
            <div className="relative">
              <input 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Bạn đang cảm thấy thế nào?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button 
                onClick={handleMoodCuration}
                disabled={loading || !mood}
                className="absolute right-2 top-1.5 p-1.5 bg-blue-500 rounded-lg hover:bg-blue-400 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              </button>
            </div>

            {results.length > 0 && (
              <div className="space-y-3">
                {results.map((rec, i) => (
                  <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="flex items-center gap-1.5">
                           <h4 className="font-semibold text-sm">{rec.title}</h4>
                           <Star size={10} className="text-yellow-500 fill-current" />
                        </div>
                        <p className="text-xs text-white/50">{rec.artist}</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity">
                        <Play size={16} />
                      </button>
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed italic">"{rec.reason}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'explain' && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-semibold text-blue-400 mb-1">{currentTrack.title}</h3>
              <p className="text-xs text-white/40 mb-3">bởi {currentTrack.artist}</p>
              <button 
                onClick={handleExplain}
                disabled={loading}
                className="w-full py-2 bg-blue-600 rounded-lg text-sm font-medium hover:bg-blue-500 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Brain size={16} />} 
                Phân tích bài hát này
              </button>
            </div>
            {explanation && (
              <div className="text-sm text-white/70 leading-relaxed bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 whitespace-pre-wrap">
                {explanation}
              </div>
            )}
          </div>
        )}

        {activeTab === 'lyrics' && (
          <div className="space-y-4">
             <div className="relative">
              <input 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Chủ đề bài hát..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button 
                onClick={handleLyrics}
                disabled={loading || !mood}
                className="absolute right-2 top-1.5 p-1.5 bg-blue-500 rounded-lg hover:bg-blue-400 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={18} />}
              </button>
            </div>
            {lyrics && (
              <div className="text-xs text-white/60 font-mono leading-loose bg-purple-500/5 p-4 rounded-xl border border-purple-500/10 whitespace-pre-wrap">
                {lyrics}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiDJ;
