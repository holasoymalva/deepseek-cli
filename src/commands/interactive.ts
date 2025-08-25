import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { DeepSeekAPI } from '../api';
import { Config } from '../config';

export async function interactiveCommand(config: Config): Promise<void> {
  const api = new DeepSeekAPI(config);
  
  // Check Ollama connection if using local mode
  if (config.useLocal) {
    const isConnected = await api.checkOllamaConnection();
    if (!isConnected) {
      console.log(chalk.red('⚠️  Cannot connect to Ollama at'), chalk.white(config.ollamaHost));
      console.log(chalk.yellow('Make sure Ollama is running:'), chalk.white('ollama serve'));
      console.log(chalk.yellow('Install the model:'), chalk.white(`ollama pull ${config.model}`));
      console.log('');
    } else {
      console.log(chalk.green('✅ Connected to Ollama'));
      const models = await api.listOllamaModels();
      if (!models.includes(config.model)) {
        console.log(chalk.yellow(`⚠️  Model '${config.model}' not found locally`));
        console.log(chalk.yellow('Install it with:'), chalk.white(`ollama pull ${config.model}`));
      }
      console.log('');
    }
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('deepseek-cli > ')
  });

  rl.on('line', async (input) => {
    const trimmed = input.trim();
    
    if (trimmed.toLowerCase() === 'exit') {
      console.log(chalk.yellow('\nGoodbye! 👋'));
      rl.close();
      process.exit(0);
    }

    if (trimmed) {
      const spinner = ora('Thinking...').start();
      
      try {
        const response = await api.complete(trimmed);
        spinner.stop();
        console.log('\n' + formatResponse(response) + '\n');
      } catch (error) {
        spinner.stop();
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      }
    }
    
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(chalk.yellow('\nGoodbye! 👋'));
    process.exit(0);
  });

  rl.prompt();
}

function formatResponse(response: string): string {
  // Format code blocks
  let formatted = response.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const header = lang ? chalk.gray(`\`\`\`${lang}`) : chalk.gray('```');
    return header + '\n' + chalk.white(code.trim()) + '\n' + chalk.gray('```');
  });
  
  // Format inline code
  formatted = formatted.replace(/`([^`]+)`/g, chalk.bgGray.white(' $1 '));
  
  // Format headers
  formatted = formatted.replace(/^#{1,3} (.+)$/gm, chalk.bold.cyan('$1'));
  
  // Format bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, chalk.bold('$1'));
  
  return formatted;
}
