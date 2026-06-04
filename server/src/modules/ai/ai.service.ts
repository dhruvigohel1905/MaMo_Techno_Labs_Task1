import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export class AIService {
  private async generate(prompt: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      if (error.message?.includes('API_KEY')) {
        throw new AppError('AI service not configured. Please set GEMINI_API_KEY.', 503);
      }
      throw new AppError('AI generation failed. Please try again.', 500);
    }
  }

  async generateDescription(title: string, category: string): Promise<string> {
    const prompt = `Write a professional and engaging event description for the following event:
    
Title: ${title}
Category: ${category}

Requirements:
- Write 3-4 paragraphs
- Include what attendees will learn/experience
- Mention the value proposition
- Use professional but inviting tone
- Do not include any markdown formatting, just plain text`;

    return this.generate(prompt);
  }

  async generateSchedule(eventType: string, duration: string): Promise<string> {
    const prompt = `Create a detailed event schedule/agenda for the following:

Event Type: ${eventType}
Duration: ${duration}

Requirements:
- Create a realistic timeline with specific time slots
- Include breaks and networking sessions
- Add brief descriptions for each session
- Format as a structured agenda
- Do not include any markdown formatting, just plain text with clear time slots`;

    return this.generate(prompt);
  }

  async generateCertificateContent(eventName: string, organizationName: string): Promise<string> {
    const prompt = `Generate professional certificate wording for the following:

Event Name: ${eventName}
Organization: ${organizationName}

Requirements:
- Write formal certificate text
- Include phrases like "This is to certify that" or "In recognition of"
- Keep it concise but professional
- Suitable for a formal certificate of participation/achievement
- Do not include any markdown formatting, just plain text`;

    return this.generate(prompt);
  }
}
