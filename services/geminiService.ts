
import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation } from '../types';

// Use process.env.API_KEY directly as per SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMoodPlaylist = async (mood: string): Promise<AIRecommendation[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gợi ý một danh sách phát gồm 5 bài hát dựa trên tâm trạng: "${mood}". 
    ƯU TIÊN CỰC CAO cho các bài hát của nghệ sĩ VIỆT NAM hoặc các bản hit V-Pop đang nổi bật.
    Với mỗi bài hát, hãy cung cấp tên bài hát, nghệ sĩ, lý do ngắn gọn tại sao nó phù hợp (lý do viết bằng tiếng Việt) và một link YouTube chính thức (nếu có).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            reason: { type: Type.STRING },
            youtubeUrl: { type: Type.STRING }
          },
          required: ["title", "artist", "reason"]
        }
      }
    }
  });

  try {
    // response.text is a property, not a method
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
};

export const explainSong = async (title: string, artist: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Giải thích ý nghĩa và lịch sử của bài hát "${title}" của "${artist}" bằng tiếng Việt. Nếu đây là bài hát Việt Nam, hãy nhấn mạnh vào giá trị văn hóa và bối cảnh sáng tác tại Việt Nam. Bao gồm những câu chuyện bên lề thú vị và ảnh hưởng của nó. Giữ độ dài khoảng 200 từ.`,
  });
  return response.text || "Không có thông tin giải thích.";
};

export const generateLyrics = async (mood: string, genre: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Viết lời bài hát bằng TIẾNG VIỆT cho một bài hát thuộc thể loại ${genre} mang cảm giác ${mood}. Bao gồm Phân khúc (Verse), Điệp khúc (Chorus) và Đoạn chuyển (Bridge). Lời nhạc nên mang đậm chất thơ ca Việt Nam.`,
  });
  return response.text || "Lỗi khi tạo lời bài hát.";
};
