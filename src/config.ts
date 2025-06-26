export interface Config {
  apiKey: string;
  model: string;
  apiUrl: string;
}

export function getConfig(): Config {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    apiUrl: 'https://api.deepseek.com/chat/completions'
  };
}