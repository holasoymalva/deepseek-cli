import chalk from 'chalk';
import ora from 'ora';
import { DeepSeekAPI, TokenUsage } from '../api';
import { Config } from '../config';

export async function chatCommand(prompt: string, config: Config): Promise<void> {
  if (config.stream) {
    await streamingChat(prompt, config);
  } else {
    await nonStreamingChat(prompt, config);
  }
}

async function nonStreamingChat(prompt: string, config: Config): Promise<void> {
  const spinner = ora('Thinking...').start();
  
  try {
    const api = new DeepSeekAPI(config);
    const response = await api.complete(prompt);
    
    spinner.stop();
    console.log('\n' + formatResponse(response.content) + '\n');
    
    // Display token usage if available
    if (response.usage) {
      displayTokenUsage(response.usage);
    }
  } catch (error) {
    spinner.stop();
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function streamingChat(prompt: string, config: Config): Promise<void> {
  const spinner = ora('Thinking...').start();
  let responseStarted = false;
  
  try {
    const api = new DeepSeekAPI(config);
    const response = await api.completeStream(prompt, (chunk) => {
      if (!responseStarted) {
        spinner.stop();
        console.log(''); // Add a newline before the response
        responseStarted = true;
      }
      process.stdout.write(chunk);
    });
    
    if (!responseStarted) {
      spinner.stop();
    }
    console.log('\n'); // Add a newline after the response
    
    // Display token usage if available
    if (response.usage) {
      displayTokenUsage(response.usage);
    }
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

function displayTokenUsage(usage: TokenUsage): void {
  console.log(chalk.dim('─'.repeat(40)));
  console.log(chalk.dim('Token Usage:'));
  console.log(chalk.dim(`  Input: ${usage.promptTokens} tokens`));
  console.log(chalk.dim(`  Output: ${usage.completionTokens} tokens`));
  console.log(chalk.dim(`  Total: ${usage.totalTokens} tokens`));
  console.log(chalk.dim(`  Estimated Cost: $${usage.estimatedCost.toFixed(6)}`));
  console.log(chalk.dim('─'.repeat(40)));
}

