import axios from 'axios';
import { Config } from './config';

export class DeepSeekAPI {
  constructor(private config: Config) {}

  async complete(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.config.apiUrl,
        {
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are DeepSeek Coder, an AI programming assistant. Help with coding tasks, provide clear code examples, and follow best practices.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 4096
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`API error: ${error.message}`);
    }
  }
}
