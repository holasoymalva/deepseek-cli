import chalk from 'chalk';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Config } from '../config';

export async function tokensCommand(input: string, options: { file?: boolean, model?: string, time?: string, json?: boolean }, config: Config): Promise<void> {
  try {
    // Determine the path to the token counter script
    const scriptPath = path.join(__dirname, '..', '..', 'deepseek_v3_tokenizer', 'token_counter.py');
    
    // Check if the script exists
    if (!fs.existsSync(scriptPath)) {
      console.error(chalk.red('Error:'), 'Token counter script not found. Make sure the deepseek_v3_tokenizer directory is in the project root.');
      process.exit(1);
    }
    
    // Build the command arguments
    const args: string[] = [];
    
    if (options.model) {
      args.push('--model', options.model);
    } else if (config.model) {
      args.push('--model', config.model);
    }
    
    if (options.time) {
      args.push('--time', options.time);
    }
    
    if (options.json) {
      args.push('--json');
    }
    
    if (options.file) {
      args.push('--file', input);
    } else {
      args.push(input);
    }
    
    // Spawn the Python process
    const pythonProcess = spawn('python3', [scriptPath, ...args]);
    
    // Collect stdout
    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    // Collect stderr
    let errorOutput = '';
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(chalk.red('Error:'), 'Token counter script exited with code', code);
        if (errorOutput) {
          console.error(errorOutput);
        }
        process.exit(1);
      }
      
      // Print the output
      console.log(output);
    });
  } catch (error) {
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
