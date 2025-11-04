
import { GoogleGenAI } from "@google/genai";

// Initialize AI client
export const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// Function to send a prompt
export const run = async (prompt) => {
  try {
    console.log("Sending prompt to Gemini:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt, // just a string
      temperature: 0.7,
      maxOutputTokens: 400,
    });

    console.log("Received from Gemini:", response.text);
    return response.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong. Please try again.";
  }
};
