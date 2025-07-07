import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { DeepSeekAPI, TokenUsage } from '../api';
import { Config } from '../config';

interface Conversation {
  role: string;
  content: string;
}

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

  // Track conversation history
  let conversationHistory: Conversation[] = [
    {
      role: 'system',
      content: 'You are DeepSeek Coder, an AI programming assistant. Help with coding tasks, provide clear code examples, and follow best practices.'
    }
  ];

  // Display welcome message and help
  console.log(chalk.cyan('\n🚀 Welcome to DeepSeek CLI Interactive Mode\n'));
  console.log(chalk.white('Available commands:'));
  console.log(chalk.dim('  /help     - Show available commands'));
  console.log(chalk.dim('  /clear    - Clear conversation history'));
  console.log(chalk.dim('  /stats    - View token usage statistics'));
  console.log(chalk.dim('  /model    - Show current model'));
  console.log(chalk.dim('  /exit     - Exit interactive mode'));
  console.log(chalk.white('\nStart typing to chat with DeepSeek AI...\n'));

  rl.on('line', async (input) => {
    const trimmed = input.trim();
    
    // Handle special commands
    if (trimmed.startsWith('/')) {
      const command = trimmed.toLowerCase();
      
      if (command === '/exit' || command === '/quit') {
        // Display session summary
        displaySessionSummary(sessionTokens);
        console.log(chalk.yellow('\nGoodbye! 👋'));
        rl.close();
        process.exit(0);
      }
      else if (command === '/help') {
        // Display help information
        console.log(chalk.cyan('\nAvailable Commands:'));
        console.log(chalk.white('  /help     - Show this help message'));
        console.log(chalk.white('  /clear    - Clear conversation history'));
        console.log(chalk.white('  /stats    - View token usage statistics'));
        console.log(chalk.white('  /model    - Show current model'));
        console.log(chalk.white('  /exit     - Exit interactive mode'));
        console.log(chalk.white('\nTips:'));
        console.log(chalk.dim('  • Type normally to chat with the AI'));
        console.log(chalk.dim('  • Multi-turn conversations are supported'));
        console.log(chalk.dim('  • Code blocks are automatically formatted'));
        console.log(chalk.dim('  • Token usage is tracked and displayed after each response'));
        console.log('');
      }
      else if (command === '/stats') {
        // Display current session stats
        displaySessionSummary(sessionTokens);
      }
      else if (command === '/clear') {
        // Clear conversation history
        conversationHistory = [
          {
            role: 'system',
            content: 'You are DeepSeek Coder, an AI programming assistant. Help with coding tasks, provide clear code examples, and follow best practices.'
          }
        ];
        console.log(chalk.yellow('Conversation history cleared.'));
      }
      else if (command === '/model') {
        // Show current model
        console.log(chalk.cyan(`\nCurrent model: ${chalk.white(config.model)}`));
        console.log(chalk.dim(`Temperature: ${config.temperature}`));
        console.log(chalk.dim(`Max tokens: ${config.maxTokens}`));
        console.log(chalk.dim(`Streaming: ${config.stream ? 'enabled' : 'disabled'}`));
      }
      else {
        console.log(chalk.red(`Unknown command: ${command}`));
        console.log(chalk.dim('Type /help for available commands'));
      }
      
      rl.prompt();
      return;
    }

    if (trimmed) {
      // Add user message to conversation history
      conversationHistory.push({
        role: 'user',
        content: trimmed
      });
      
      const spinner = ora('Thinking...').start();
      
      try {
        // Create a copy of the conversation history for the API call
        const messages = [...conversationHistory];
        
        let response;
        if (config.stream) {
          spinner.stop();
          console.log(chalk.dim('\nDeepSeek is responding...'));
          
          response = await api.completeStreamWithHistory(messages, (chunk) => {
            process.stdout.write(chunk);
          });
          
          console.log('\n');
        } else {
          response = await api.completeWithHistory(messages);
          spinner.stop();
          console.log('\n' + formatResponse(response.content) + '\n');
        }
        
        // Add assistant response to conversation history
        conversationHistory.push({
          role: 'assistant',
          content: response.content
        });
        
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
