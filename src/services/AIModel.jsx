import { GoogleGenAI } from '@google/genai';

export async function getGeminiResponse(prompt) {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API,
  });

  const config = {
    responseMimeType: 'application/json',
  };

  const model = 'gemini-2.0-flash';

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = '';

  for await (const chunk of response) {
    fullResponse += chunk.text;
  }

  return fullResponse;
}
