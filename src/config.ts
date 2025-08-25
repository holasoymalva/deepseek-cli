export interface Config {
  apiKey?: string;
  model: string;
  apiUrl: string;
  useLocal: boolean;
  ollamaHost: string;
}

export function getConfig(): Config {
  const useLocal = process.env.DEEPSEEK_USE_LOCAL === 'true' || !process.env.DEEPSEEK_API_KEY;
  
  return {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-coder:6.7b',
    apiUrl: useLocal 
      ? `${process.env.OLLAMA_HOST || 'http://localhost:11434'}/api/chat`
      : 'https://api.deepseek.com/chat/completions',
    useLocal,
    ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434'
  };
}