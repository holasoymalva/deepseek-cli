import { Command } from 'commander';
import chalk from 'chalk';
import { getConfig } from './config';
import { chatCommand } from './commands/chat';
import { interactiveCommand } from './commands/interactive';

export class CLI {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCLI();
  }

  private setupCLI(): void {
    this.program
      .name('deepseek')
      .description('AI-powered coding assistant (MVP)')
      .version('0.1.0')
      .option('-k, --api-key <key>', 'DeepSeek API key')
      .option('-m, --model <model>', 'Model to use');

    // Chat command for single prompts
    this.program
      .command('chat <prompt>')
      .description('Send a single prompt')
      .action(async (prompt, options) => {
        const config = this.buildConfig(this.program.opts());
        await chatCommand(prompt, config);
      });

    // Default action (interactive mode)
    this.program
      .action(async () => {
        const config = this.buildConfig(this.program.opts());
        
        // Show welcome
        console.log(chalk.cyan('\n🚀 DeepSeek CLI - MVP\n'));
        console.log(chalk.gray('Model:'), chalk.white(config.model));
        console.log(chalk.gray('Type "exit" or Ctrl+C to quit\n'));
        
        await interactiveCommand(config);
      });
  }

  private buildConfig(options: any): any {
    const config = getConfig();
    
    // Override with CLI options
    if (options.apiKey) config.apiKey = options.apiKey;
    if (options.model) config.model = options.model;
    
    // Validate
    if (!config.apiKey) {
      throw new Error(
        'API key required. Set DEEPSEEK_API_KEY or use --api-key flag.\n' +
        'Get your key at: https://platform.deepseek.com/api_keys'
      );
    }
    
    return config;
  }

  async run(): Promise<void> {
    await this.program.parseAsync(process.argv);
  }
}
