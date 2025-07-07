import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { DeepSeekAPI, TokenUsage } from '../api';
import { Config } from '../config';

export async function interactiveCommand(config: Config): Promise<void> {
  const api = new DeepSeekAPI(config);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('deepseek-cli > ')
  });

  // Track session token usage
  let sessionTokens = {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    estimatedCost: 0
  };

  rl.on('line', async (input) => {
    const trimmed = input.trim();
    
    if (trimmed.toLowerCase() === 'exit') {
      // Display session summary
      displaySessionSummary(sessionTokens);
      console.log(chalk.yellow('\nGoodbye! 👋'));
      rl.close();
      process.exit(0);
    }

    if (trimmed.toLowerCase() === 'stats') {
      // Display current session stats
      displaySessionSummary(sessionTokens);
      rl.prompt();
      return;
    }

    if (trimmed) {
      const spinner = ora('Thinking...').start();
      
      try {
        const response = await api.complete(trimmed);
        spinner.stop();
        console.log('\n' + formatResponse(response.content) + '\n');
        
        // Display token usage if available
        if (response.usage) {
          displayTokenUsage(response.usage);
          
          // Update session totals
          sessionTokens.promptTokens += response.usage.promptTokens;
          sessionTokens.completionTokens += response.usage.completionTokens;
          sessionTokens.totalTokens += response.usage.totalTokens;
          sessionTokens.estimatedCost += response.usage.estimatedCost;
        }
      } catch (error) {
        spinner.stop();
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      }
    }
    
    rl.prompt();
  });

  rl.on('close', () => {
    // Display session summary
    displaySessionSummary(sessionTokens);
    console.log(chalk.yellow('\nGoodbye! 👋'));
    process.exit(0);
  });

  // Display welcome message with token usage info
  console.log(chalk.dim('Type "stats" to view session token usage and cost estimates'));
  console.log(chalk.dim('Type "exit" to quit\n'));
  
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

function displayTokenUsage(usage: TokenUsage): void {
  console.log(chalk.dim('─'.repeat(40)));
  console.log(chalk.dim('Token Usage:'));
  console.log(chalk.dim(`  Input: ${usage.promptTokens} tokens`));
  console.log(chalk.dim(`  Output: ${usage.completionTokens} tokens`));
  console.log(chalk.dim(`  Total: ${usage.totalTokens} tokens`));
  console.log(chalk.dim(`  Estimated Cost: $${usage.estimatedCost.toFixed(6)}`));
  console.log(chalk.dim('─'.repeat(40)));
}

function displaySessionSummary(sessionTokens: { promptTokens: number, completionTokens: number, totalTokens: number, estimatedCost: number }): void {
  console.log(chalk.cyan('\n─'.repeat(50)));
  console.log(chalk.cyan('Session Summary:'));
  console.log(chalk.cyan(`  Total Input Tokens: ${sessionTokens.promptTokens}`));
  console.log(chalk.cyan(`  Total Output Tokens: ${sessionTokens.completionTokens}`));
  console.log(chalk.cyan(`  Total Tokens: ${sessionTokens.totalTokens}`));
  console.log(chalk.cyan(`  Total Estimated Cost: $${sessionTokens.estimatedCost.toFixed(6)}`));
  console.log(chalk.cyan('─'.repeat(50)));
}
