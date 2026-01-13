
import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMoodPlaylist = async (mood: string): Promise<AIRecommendation[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gợi ý một danh sách phát gồm 5 bài hát dựa trên tâm trạng: "${mood}". Với mỗi bài hát, hãy cung cấp tên bài hát, nghệ sĩ và lý do ngắn gọn tại sao nó phù hợp (lý do viết bằng tiếng Việt).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["title", "artist", "reason"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
};

export const explainSong = async (title: string, artist: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Giải thích ý nghĩa và lịch sử của bài hát "${title}" của "${artist}" bằng tiếng Việt. Bao gồm những câu chuyện bên lề thú vị và ảnh hưởng của nó đối với văn hóa. Giữ độ dài khoảng 200 từ.`,
  });
  return response.text || "Không có thông tin giải thích.";
};

export const generateLyrics = async (mood: string, genre: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Viết lời bài hát cho một bài hát thuộc thể loại ${genre} mang cảm giác ${mood} bằng tiếng Việt. Bao gồm Phân khúc (Verse), Điệp khúc (Chorus) và Đoạn chuyển (Bridge).`,
  });
  return response.text || "Lỗi khi tạo lời bài hát.";
};
