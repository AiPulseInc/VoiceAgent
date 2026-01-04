import { GoogleGenAI } from "@google/genai";

export const generateHeroImage = async (apiKey: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-2.5-flash-image for generation as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'Cinematic wide shot of a modern, high-tech automotive workshop interior during winter peak season. Mechanics working on cars on lifts, tires stacked neatly. Warm indoor lighting contrasting with cold blue snowy evening outside large glass garage doors. Ultra detailed, 8k resolution, photorealistic.',
          },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: '16:9'
        }
      },
    });

    // Iterate through parts to find the image
    if (response.candidates && response.candidates.length > 0) {
        const parts = response.candidates[0].content?.parts || [];
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                return `data:${mimeType};base64,${part.inlineData.data}`;
            }
        }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation failed:", error);
    // Fallback image if generation fails or API key is invalid/missing permissions
    return "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";
  }
};