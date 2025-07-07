import { Command } from 'commander';
import chalk from 'chalk';
import { getConfig, AVAILABLE_MODELS } from './config';
import { chatCommand } from './commands/chat';
import { interactiveCommand } from './commands/interactive';
import { analyzeCommand } from './commands/analyze';

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
      .option('-m, --model <model>', `Model to use (available: ${Object.values(AVAILABLE_MODELS).join(', ')})`, AVAILABLE_MODELS.CHAT)
      .option('-t, --temperature <temp>', 'Temperature for response creativity (0.0-1.0)', '0.1')
      .option('--max-tokens <tokens>', 'Maximum tokens in response', '4096');

    // Chat command for single prompts
    this.program
      .command('chat <prompt>')
      .description('Send a single prompt')
      .action(async (prompt, options) => {
        const config = this.buildConfig(this.program.opts());
        await chatCommand(prompt, config);
      });

    // Analyze command for code files
    this.program
      .command('analyze <file>')
      .description('Analyze a code file for quality, bugs, and improvements')
      .action(async (file, options) => {
        const config = this.buildConfig(this.program.opts());
        await analyzeCommand(file, config);
      });

    // Models command to list available models
    this.program
      .command('models')
      .description('List available DeepSeek models')
      .action(() => {
        console.log(chalk.cyan('\nAvailable DeepSeek Models:\n'));
        Object.entries(AVAILABLE_MODELS).forEach(([key, value]) => {
          console.log(`${chalk.bold(value)} - ${this.getModelDescription(value)}`);
        });
        console.log('');
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

  private getModelDescription(model: string): string {
    switch (model) {
      case AVAILABLE_MODELS.CHAT:
        return 'General purpose chat model';
      case AVAILABLE_MODELS.REASONER:
        return 'Advanced reasoning capabilities for complex problems';
      default:
        return 'Unknown model';
    }
  }

  private buildConfig(options: any): any {
    const config = getConfig();
    
    // Override with CLI options
    if (options.apiKey) config.apiKey = options.apiKey;
    if (options.model) config.model = options.model;
    if (options.temperature) config.temperature = parseFloat(options.temperature);
    if (options.maxTokens) config.maxTokens = parseInt(options.maxTokens, 10);
    
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
