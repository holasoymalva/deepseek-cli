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
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000  // 60 seconds
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

  async completeStream(prompt: string, onChunk: (chunk: string) => void): Promise<string> {
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
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          stream: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
          },
          responseType: 'stream',
          timeout: 120000  // 120 seconds for streaming
        }
      );

      let fullContent = '';
      
      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          try {
            const lines = chunk.toString().split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                const jsonData = JSON.parse(line.substring(6));
                const content = jsonData.choices[0]?.delta?.content || '';
                if (content) {
                  fullContent += content;
                  onChunk(content);
                }
              }
            }
          } catch (error) {
            // Ignore parsing errors for incomplete chunks
          }
        });

        response.data.on('end', () => {
          resolve(fullContent);
        });

        response.data.on('error', (error: Error) => {
          reject(error);
        });
      });
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

  async completeWithReasoning(prompt: string): Promise<{ content: string, reasoningContent?: string }> {
    try {
      const response = await axios.post(
        this.config.apiUrl,
        {
          model: 'deepseek-reasoner',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000  // 60 seconds
        }
      );

      return {
        content: response.data.choices[0].message.content,
        reasoningContent: response.data.choices[0].message.reasoning_content
      };
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
}
