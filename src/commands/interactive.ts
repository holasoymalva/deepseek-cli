import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { DeepSeekAPI } from '../api';
import { Config } from '../config';

export async function interactiveCommand(config: Config): Promise<void> {
  const api = new DeepSeekAPI(config);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('deepseek> ')
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
