import { Command } from 'commander';
import chalk from 'chalk';
import { getConfig } from './config';
import { chatCommand } from './commands/chat';
import { interactiveCommand } from './commands/interactive';
import { setupCommand } from './commands/setup';

export class CLI {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCLI();
  }

  private setupCLI(): void {
    this.program
      .name('deepseek')
      .description('AI-powered coding assistant with local Ollama support')
      .version('0.1.0')
      .option('-k, --api-key <key>', 'DeepSeek API key (for cloud mode)')
      .option('-m, --model <model>', 'Model to use (e.g., deepseek-coder:6.7b for local)')
      .option('-l, --local', 'Force local mode using Ollama')
      .option('--ollama-host <host>', 'Ollama host URL (default: http://localhost:11434)');

    // Chat command for single prompts
    this.program
      .command('chat <prompt>')
      .description('Send a single prompt')
      .action(async (prompt, options) => {
        const config = this.buildConfig(this.program.opts());
        await chatCommand(prompt, config);
      });

    // Setup command for local installation
    this.program
      .command('setup')
      .description('Setup local Ollama environment')
      .action(async () => {
        const config = this.buildConfig(this.program.opts());
        await setupCommand(config);
      });

    // Default action (interactive mode)
    this.program
      .action(async () => {
        const config = this.buildConfig(this.program.opts());
        
        // Show welcome
        console.log(chalk.cyan('\n🚀 DeepSeek CLI - Local Mode\n'));
        console.log(chalk.gray('Mode:'), config.useLocal ? chalk.green('Local (Ollama)') : chalk.blue('Cloud'));
        console.log(chalk.gray('Model:'), chalk.white(config.model));
        if (config.useLocal) {
          console.log(chalk.gray('Ollama Host:'), chalk.white(config.ollamaHost));
        }
        console.log(chalk.gray('Type "exit" or Ctrl+C to quit\n'));
        
        await interactiveCommand(config);
      });
  }

  private buildConfig(options: any): any {
    const config = getConfig();
    
    // Override with CLI options
    if (options.apiKey) config.apiKey = options.apiKey;
    if (options.model) config.model = options.model;
    if (options.local) config.useLocal = true;
    if (options.ollamaHost) config.ollamaHost = options.ollamaHost;
    
    // Update API URL if local mode is forced
    if (config.useLocal) {
      config.apiUrl = `${config.ollamaHost}/api/chat`;
    }
    
    // Validate based on mode
    if (!config.useLocal && !config.apiKey) {
      throw new Error(
        'API key required for cloud mode. Set DEEPSEEK_API_KEY or use --api-key flag.\n' +
        'Get your key at: https://platform.deepseek.com/api_keys\n' +
        'Or use local mode with --local flag'
      );
    }
    
    return config;
  }

  async run(): Promise<void> {
    await this.program.parseAsync(process.argv);
  }
}
