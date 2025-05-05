
import { UserInfo } from "@/types/chat";

interface OpenAIConfig {
  apiKey: string;
  baseURL: string;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export class OpenAIService {
  private openai: any;
  private isConfigured: boolean = false;

  constructor() {
    this.isConfigured = false;
  }

  configure(config: OpenAIConfig) {
    try {
      // Dynamic import to avoid server-side rendering issues
      import("openai").then((OpenAI) => {
        this.openai = new OpenAI.default({
          apiKey: config.apiKey,
          baseURL: config.baseURL
        });
        this.isConfigured = true;
      }).catch(err => {
        console.error("Failed to import OpenAI:", err);
      });
    } catch (error) {
      console.error("Error configuring OpenAI:", error);
    }
  }

  async generateWelcomeMessage(name: string): Promise<string> {
    if (!this.isConfigured || !this.openai) {
      return `Welcome to the ID card generator, ${name}!`;
    }

    try {
      const messages: Message[] = [
        {
          role: "system",
          content: "You are a friendly chatbot assisting with ID card generation. Keep responses very short and friendly."
        },
        {
          role: "user",
          content: `Generate a very brief (max 100 characters) welcome message for ${name} who is creating their ID card. Don't include any hints about other questions.`
        }
      ];

      const response = await this.openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: messages,
      });

      return response.choices[0].message.content || `Welcome to the ID card generator, ${name}!`;
    } catch (error) {
      console.error("Error generating welcome message:", error);
      return `Welcome to the ID card generator, ${name}!`;
    }
  }

  async generateCompletionMessage(userInfo: UserInfo): Promise<string> {
    if (!this.isConfigured || !this.openai) {
      return `All set, ${userInfo.name}! Your ID card is ready to download.`;
    }

    try {
      const messages: Message[] = [
        {
          role: "system",
          content: "You are a friendly chatbot assisting with ID card generation. Keep responses very short and friendly."
        },
        {
          role: "user",
          content: `Generate a very brief (max 100 characters) completion message for ${userInfo.name} who has finished creating their ID card. Include that they can download it now.`
        }
      ];

      const response = await this.openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: messages,
      });

      return response.choices[0].message.content || `All set, ${userInfo.name}! Your ID card is ready to download.`;
    } catch (error) {
      console.error("Error generating completion message:", error);
      return `All set, ${userInfo.name}! Your ID card is ready to download.`;
    }
  }
}

export const openAIService = new OpenAIService();
