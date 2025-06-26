import chalk from 'chalk';
import ora from 'ora';
import { DeepSeekAPI } from '../api';
import { Config } from '../config';

export async function chatCommand(prompt: string, config: Config): Promise<void> {
  const spinner = ora('Thinking...').start();
  
  try {
    const api = new DeepSeekAPI(config);
    const response = await api.complete(prompt);
    
    spinner.stop();
    console.log('\n' + formatResponse(response) + '\n');
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

function formatResponse(response: string): string {
  // Simple code block formatting
  return response.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const header = lang ? chalk.gray(`\`\`\`${lang}`) : chalk.gray('```');
    return header + '\n' + chalk.white(code.trim()) + '\n' + chalk.gray('```');
  });
}

