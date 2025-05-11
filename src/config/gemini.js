// Import GoogleGenAI for client-side use
import { GoogleGenAI } from '@google/genai';

async function main(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing API key in environment variables.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  const config = {
    responseMimeType: 'text/plain',
  };

  const model = 'gemini-2.5-pro-exp-03-25';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let result="";

    for await (const chunk of response) {
      result+=chunk.text;
    }
    return result;
  } catch (error) {
    console.error('Error during API call:', error);
  }
}

export default main;
