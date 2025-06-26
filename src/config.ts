export interface Config {
  apiKey: string;
  model: string;
  apiUrl: string;
}

export function getConfig(): Config {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-coder-33b-instruct',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions'
  };
}
