import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Config {
  apiKey: string;
  model: string;
  apiUrl: string;
  maxTokens: number;
  temperature: number;
  stream: boolean;
  showReasoning: boolean;
}

// Available DeepSeek models
export const AVAILABLE_MODELS = {
  CHAT: 'deepseek-chat',
  REASONER: 'deepseek-reasoner'
};

/**
 * Attempts to load API key from various sources:
 * 1. Environment variable
 * 2. .env file in current directory
 * 3. .deepseekrc file in home directory
 */
function getApiKey(): string {
  // Check environment variable
  if (process.env.DEEPSEEK_API_KEY) {
    return process.env.DEEPSEEK_API_KEY;
  }
  
  // Check for .deepseekrc in home directory
  try {
    const homeDirPath = path.join(os.homedir(), '.deepseekrc');
    if (fs.existsSync(homeDirPath)) {
      const config = JSON.parse(fs.readFileSync(homeDirPath, 'utf8'));
      if (config.apiKey) {
        return config.apiKey;
      }
    }
  } catch (error) {
    // Silently fail if .deepseekrc is invalid
  }
  
  return '';
}

/**
 * Validates if the provided model name is valid
 */
function validateModel(model: string): string {
  const validModels = Object.values(AVAILABLE_MODELS);
  if (validModels.includes(model)) {
    return model;
  }
  // Default to chat model if invalid
  return AVAILABLE_MODELS.CHAT;
}

export function getConfig(): Config {
  // Try to load config from .deepseekrc
  let rcConfig: Partial<Config> = {};
  try {
    const homeDirPath = path.join(os.homedir(), '.deepseekrc');
    if (fs.existsSync(homeDirPath)) {
      rcConfig = JSON.parse(fs.readFileSync(homeDirPath, 'utf8'));
    }
  } catch (error) {
    // Silently fail if .deepseekrc is invalid
  }

  // Parse maxTokens and temperature with fallbacks
  const maxTokens = process.env.DEEPSEEK_MAX_TOKENS ? 
    parseInt(process.env.DEEPSEEK_MAX_TOKENS, 10) : 
    (rcConfig.maxTokens || 4096);
    
  const temperature = process.env.DEEPSEEK_TEMPERATURE ? 
    parseFloat(process.env.DEEPSEEK_TEMPERATURE) : 
    (rcConfig.temperature || 0.1);

  // Get and validate model
  const modelFromEnv = process.env.DEEPSEEK_MODEL || rcConfig.model || AVAILABLE_MODELS.CHAT;
  const validatedModel = validateModel(modelFromEnv);

  // Stream option
  const stream = process.env.DEEPSEEK_STREAM === 'true' || rcConfig.stream || false;

  // Show reasoning option (for deepseek-reasoner)
  const showReasoning = process.env.DEEPSEEK_SHOW_REASONING === 'true' || rcConfig.showReasoning || false;

  return {
    apiKey: getApiKey(),
    model: validatedModel,
    apiUrl: process.env.DEEPSEEK_API_URL || rcConfig.apiUrl || 'https://api.deepseek.com/chat/completions',
    maxTokens: maxTokens,
    temperature: temperature,
    stream: stream,
    showReasoning: showReasoning
  };
}