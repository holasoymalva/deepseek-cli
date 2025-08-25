import axios from 'axios';
import { Config } from './config';

export class DeepSeekAPI {
  constructor(private config: Config) {}

  async complete(prompt: string): Promise<string> {
    if (this.config.useLocal) {
      return this.completeWithOllama(prompt);
    } else {
      return this.completeWithCloud(prompt);
    }
  }

  private async completeWithOllama(prompt: string): Promise<string> {
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
          stream: false,
          options: {
            temperature: 0.1,
            num_predict: 4096
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 120000  // 2 minutes for local processing
        }
      );

      return response.data.message.content;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error(
          `Cannot connect to Ollama at ${this.config.ollamaHost}.\n` +
          'Make sure Ollama is running: ollama serve\n' +
          `And the model is installed: ollama pull ${this.config.model}`
        );
      }
      if (error.response?.status === 404) {
        throw new Error(
          `Model '${this.config.model}' not found in Ollama.\n` +
          `Install it with: ollama pull ${this.config.model}`
        );
      }
      throw new Error(`Ollama API error: ${error.message}`);
    }
  }

  private async completeWithCloud(prompt: string): Promise<string> {
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
          },
          timeout: 30000
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your DEEPSEEK_API_KEY.');
      }
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (error.response?.status === 400) {
        console.error('API Error Details:', error.response?.data);
        throw new Error(`Bad request: ${error.response?.data?.error?.message || 'Invalid request format'}`);
      }
      throw new Error(`API error: ${error.message}`);
    }
  }

  async checkOllamaConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.config.ollamaHost}/api/tags`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async listOllamaModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.config.ollamaHost}/api/tags`, {
        timeout: 5000
      });
      return response.data.models?.map((model: any) => model.name) || [];
    } catch {
      return [];
    }
  }
}
