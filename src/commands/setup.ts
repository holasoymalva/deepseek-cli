import chalk from 'chalk';
import ora from 'ora';
import { DeepSeekAPI } from '../api';
import { Config } from '../config';
import { executeBash } from '../utils/exec';

export async function setupCommand(config: Config): Promise<void> {
  console.log(chalk.cyan('\n🔧 DeepSeek CLI Setup\n'));
  
  if (!config.useLocal) {
    console.log(chalk.yellow('Setup is only needed for local mode.'));
    console.log(chalk.gray('For cloud mode, just set your DEEPSEEK_API_KEY.'));
    return;
  }

  const api = new DeepSeekAPI(config);
  
  // Check if Ollama is installed
  console.log(chalk.gray('Checking Ollama installation...'));
  const ollamaInstalled = await checkOllamaInstalled();
  
  if (!ollamaInstalled) {
    console.log(chalk.red('❌ Ollama not found'));
    console.log(chalk.yellow('Please install Ollama first:'));
    console.log(chalk.white('  macOS: brew install ollama'));
    console.log(chalk.white('  Linux: curl -fsSL https://ollama.ai/install.sh | sh'));
    console.log(chalk.white('  Windows: Download from https://ollama.ai'));
    return;
  }
  
  console.log(chalk.green('✅ Ollama is installed'));
  
  // Check if Ollama is running
  console.log(chalk.gray('Checking Ollama connection...'));
  const isRunning = await api.checkOllamaConnection();
  
  if (!isRunning) {
    console.log(chalk.yellow('⚠️  Ollama is not running'));
    console.log(chalk.gray('Starting Ollama service...'));
    
    try {
      await executeBash('ollama serve &');
      // Wait a bit for the service to start
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.log(chalk.red('Failed to start Ollama automatically'));
      console.log(chalk.yellow('Please start it manually:'), chalk.white('ollama serve'));
      return;
    }
  }
  
  // Check if model is available
  console.log(chalk.gray('Checking available models...'));
  const models = await api.listOllamaModels();
  
  if (models.includes(config.model)) {
    console.log(chalk.green(`✅ Model '${config.model}' is already installed`));
  } else {
    console.log(chalk.yellow(`⚠️  Model '${config.model}' not found`));
    console.log(chalk.gray(`Installing ${config.model}...`));
    
    const spinner = ora(`Downloading ${config.model} (this may take a while)`).start();
    
    try {
      await executeBash(`ollama pull ${config.model}`);
      spinner.succeed(`Model ${config.model} installed successfully`);
    } catch (error) {
      spinner.fail(`Failed to install ${config.model}`);
      console.log(chalk.red('Error:'), error);
      console.log(chalk.yellow('Try manually:'), chalk.white(`ollama pull ${config.model}`));
      return;
    }
  }
  
  console.log(chalk.green('\n🎉 Setup complete! You can now use DeepSeek CLI locally.'));
  console.log(chalk.gray('Start with:'), chalk.white('deepseek'));
}

async function checkOllamaInstalled(): Promise<boolean> {
  try {
    await executeBash('which ollama');
    return true;
  } catch {
    return false;
  }
}