import axios from 'axios';
import { Config } from './config';
import { spawn } from 'child_process';
import * as path from 'path';

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

interface Conversation {
  role: string;
  content: string;
}

export class DeepSeekAPI {
  constructor(private config: Config) {}

  async complete(prompt: string): Promise<{ content: string, usage?: TokenUsage }> {
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

      const content = response.data.choices[0].message.content;
      let usage: TokenUsage | undefined;
      
      if (response.data.usage) {
        usage = {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
          estimatedCost: await this.estimateCost(response.data.usage.prompt_tokens, response.data.usage.completion_tokens)
        };
      } else {
        // If the API doesn't return usage info, estimate it
        const tokenCount = await this.countTokens(prompt);
        const outputTokenCount = await this.countTokens(content);
        usage = {
          promptTokens: tokenCount,
          completionTokens: outputTokenCount,
          totalTokens: tokenCount + outputTokenCount,
          estimatedCost: await this.estimateCost(tokenCount, outputTokenCount)
        };
      }

      return { content, usage };
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

  async completeWithHistory(messages: Conversation[]): Promise<{ content: string, usage?: TokenUsage }> {
    try {
      const response = await axios.post(
        this.config.apiUrl,
        {
          model: this.config.model,
          messages: messages,
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

      const content = response.data.choices[0].message.content;
      let usage: TokenUsage | undefined;
      
      if (response.data.usage) {
        usage = {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
          estimatedCost: await this.estimateCost(response.data.usage.prompt_tokens, response.data.usage.completion_tokens)
        };
      } else {
        // If the API doesn't return usage info, estimate it
        const promptText = messages.map(m => m.content).join(' ');
        const tokenCount = await this.countTokens(promptText);
        const outputTokenCount = await this.countTokens(content);
        usage = {
          promptTokens: tokenCount,
          completionTokens: outputTokenCount,
          totalTokens: tokenCount + outputTokenCount,
          estimatedCost: await this.estimateCost(tokenCount, outputTokenCount)
        };
      }

      return { content, usage };
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

  async completeStream(prompt: string, onChunk: (chunk: string) => void): Promise<{ content: string, usage?: TokenUsage }> {
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

        response.data.on('end', async () => {
          // Estimate token usage
          const promptTokens = await this.countTokens(prompt);
          const completionTokens = await this.countTokens(fullContent);
          const usage: TokenUsage = {
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
            estimatedCost: await this.estimateCost(promptTokens, completionTokens)
          };
          
          resolve({ content: fullContent, usage });
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

  async completeStreamWithHistory(messages: Conversation[], onChunk: (chunk: string) => void): Promise<{ content: string, usage?: TokenUsage }> {
    try {
      const response = await axios.post(
        this.config.apiUrl,
        {
          model: this.config.model,
          messages: messages,
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

        response.data.on('end', async () => {
          // Estimate token usage
          const promptText = messages.map(m => m.content).join(' ');
          const promptTokens = await this.countTokens(promptText);
          const completionTokens = await this.countTokens(fullContent);
          const usage: TokenUsage = {
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
            estimatedCost: await this.estimateCost(promptTokens, completionTokens)
          };
          
          resolve({ content: fullContent, usage });
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

  async completeWithReasoning(prompt: string): Promise<{ content: string, reasoningContent?: string, usage?: TokenUsage }> {
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

      const content = response.data.choices[0].message.content;
      const reasoningContent = response.data.choices[0].message.reasoning_content;
      let usage: TokenUsage | undefined;
      
      if (response.data.usage) {
        usage = {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
          estimatedCost: await this.estimateCost(response.data.usage.prompt_tokens, response.data.usage.completion_tokens, 'deepseek-reasoner')
        };
      } else {
        // If the API doesn't return usage info, estimate it
        const tokenCount = await this.countTokens(prompt);
        const outputTokenCount = await this.countTokens(content + (reasoningContent || ''));
        usage = {
          promptTokens: tokenCount,
          completionTokens: outputTokenCount,
          totalTokens: tokenCount + outputTokenCount,
          estimatedCost: await this.estimateCost(tokenCount, outputTokenCount, 'deepseek-reasoner')
        };
      }

      return { content, reasoningContent, usage };
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

  private async countTokens(text: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '..', 'deepseek_v3_tokenizer', 'token_counter.py');
      const pythonProcess = spawn('python3', [scriptPath, text, '--json']);
      
      let output = '';
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Token counter error: ${data}`);
      });
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          // If there's an error, return an estimate based on words
          const wordCount = text.split(/\s+/).length;
          resolve(Math.ceil(wordCount * 1.3)); // Rough estimate: ~1.3 tokens per word
        } else {
          try {
            const result = JSON.parse(output);
            resolve(result.token_count);
          } catch (error) {
            // If parsing fails, return a word-based estimate
            const wordCount = text.split(/\s+/).length;
            resolve(Math.ceil(wordCount * 1.3));
          }
        }
      });
    });
  }

  private async estimateCost(promptTokens: number, completionTokens: number, model: string = this.config.model): Promise<number> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '..', 'deepseek_v3_tokenizer', 'token_counter.py');
      const pythonProcess = spawn('python3', [
        scriptPath, 
        "dummy", // The text doesn't matter as we're just using the cost estimation
        '--json',
        '--model', model
      ]);
      
      let output = '';
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          // Default cost estimate if script fails
          resolve(0.0001 * (promptTokens + completionTokens));
        } else {
          try {
            const result = JSON.parse(output);
            const inputCostPerToken = result.costs.input_cache_miss / result.token_count;
            const outputCostPerToken = result.costs.output_same_length / result.token_count;
            
            const totalCost = (inputCostPerToken * promptTokens) + (outputCostPerToken * completionTokens);
            resolve(totalCost);
          } catch (error) {
            // Default cost estimate if parsing fails
            resolve(0.0001 * (promptTokens + completionTokens));
          }
        }
      });
    });
  }
}
