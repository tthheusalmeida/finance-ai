import { GoogleGenerativeAI } from "@google/generative-ai";

const AI_AGENT_API_KEY = process.env.AI_AGENT_API_KEY;

if (!AI_AGENT_API_KEY) {
  throw new Error("API Key da Gemini não encontrada no .env");
}

export class Gemini {
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>;

  constructor(modelName: string = "models/gemini-1.5-flash-latest") {
    const genAI = new GoogleGenerativeAI(AI_AGENT_API_KEY as string);
    this.model = genAI.getGenerativeModel({ model: modelName });
  }

  async sendMessage(
    prompt: string,
    temperature: number = 0.2,
  ): Promise<string> {
    const result = await this.model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    });

    const response = await result.response;
    return response.text();
  }
}
