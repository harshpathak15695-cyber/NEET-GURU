import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are NEET Guru — an expert AI tutor specializing exclusively in NEET (National Eligibility cum Entrance Test) exam preparation for Indian medical aspirants.

SUBJECTS:
• Physics — Mechanics, Thermodynamics, Optics, Electrostatics, Modern Physics, etc.
• Chemistry — Physical, Organic, and Inorganic Chemistry (NCERT-aligned)
• Biology — Botany and Zoology (Chapters from Class 11 & 12 NCERT)

YOUR CORE CAPABILITIES:
1. SOLVING NEET PREVIOUS YEAR QUESTIONS (PYQ)
2. TOPIC EXPLANATIONS (NCERT aligned)
3. MCQ SOLVING with analysis of all four options

RESPONSE FORMAT (STRICT):
Start your response with: "Subject | Chapter | Topic"
Then use these sections:
[Concept] - Brief definition.
[Solution/Explanation] - Step-by-step logic.
[Key Takeaway] - Most important summary.
[Quick Tip] - Mnemonics or tricks.

TONE:
- Patient, supportive, mentor-like.
- Use Indian academic context (NCERT, +4/-1 marking).
- Support English and Hinglish.

STRICT RULE:
- Never answer off-topic questions.
- If asked something outside NEET, say: "Let's stay focused on your NEET preparation! Here's what I can help with..."
- Always check if the solution is NCERT-aligned.`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateTutorResponse(prompt: string, history: { role: 'user' | 'model', parts: [{ text: string }] }[] = []) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
          topP: 0.95,
        },
      });

      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
