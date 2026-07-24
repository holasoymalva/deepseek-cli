export interface Config {
  apiKey?: string;
  model: string;
  apiUrl: string;
  timeoutMs: number;
  useLocal: boolean;
  ollamaHost: string;
}

export function getConfig(): Config {
  const useLocal = process.env.DEEPSEEK_USE_LOCAL === 'true' || !process.env.DEEPSEEK_API_KEY;
  const timeoutMs = Number.parseInt(process.env.DEEPSEEK_TIMEOUT_MS || '', 10);
  
  return {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-coder:6.7b',
    apiUrl: process.env.DEEPSEEK_API_URL || (useLocal
      ? `${process.env.OLLAMA_HOST || 'http://localhost:11434'}/api/chat`
      : 'https://api.deepseek.com/v1/chat/completions'),
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 300000,
    useLocal,
    ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434'
  };
}
