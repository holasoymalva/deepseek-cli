import chalk from 'chalk';

export const helpText = `
${chalk.cyan('DeepSeek CLI')} - AI-powered coding assistant

${chalk.yellow('USAGE')}
  $ deepseek [options] [command]
  $ deepseek                    Start interactive mode
  $ deepseek chat <prompt>      Send a single prompt
  $ deepseek reason <prompt>    Solve problems with reasoning
  $ deepseek analyze <file>     Analyze code quality
  $ deepseek tokens <input>     Count tokens and estimate costs
  $ deepseek models             List available models

${chalk.yellow('OPTIONS')}
  -k, --api-key <key>       DeepSeek API key
  -m, --model <model>       Model to use (deepseek-chat, deepseek-reasoner)
  -t, --temperature <temp>  Temperature for creativity (0.0-1.0)
  --max-tokens <tokens>     Maximum tokens in response
  -s, --stream              Enable streaming responses
  -r, --show-reasoning      Show reasoning (for deepseek-reasoner)
  -V, --version             Show version number
  -h, --help                Show help information

${chalk.yellow('COMMANDS & ALIASES')}
  chat, ask <prompt>        Send a single prompt
  reason, solve <prompt>    Solve problems with reasoning
  analyze, review <file>    Analyze code quality
  tokens, count <input>     Count tokens and estimate costs
  models, list              List available models
  explain <topic>           Get an explanation on a topic
  fix <file>                Fix issues in a code file
  improve <file>            Suggest improvements for a code file
  cost <text>               Estimate the cost of processing text
  help                      Display help information

${chalk.yellow('TOKEN OPTIONS')}
  -f, --file                Treat input as a file path
  -m, --model <model>       Model for cost estimation
  -t, --time <period>       Time period (standard/discount)
  -j, --json                Output in JSON format

${chalk.yellow('EXAMPLES')}
  $ deepseek ask "Write a function to calculate prime numbers"
  $ deepseek solve "Find the roots of x^2 - 5x + 6 = 0"
  $ deepseek review app.js
  $ deepseek fix broken.js
  $ deepseek improve code.py
  $ deepseek explain "async/await in JavaScript"
  $ deepseek count "How many tokens is this text?"
  $ deepseek cost -f README.md

${chalk.yellow('CONFIGURATION')}
  Set API key via:
  - Environment variable: export DEEPSEEK_API_KEY="your_key"
  - Config file: ~/.deepseekrc
  - Command line: --api-key="your_key"

${chalk.yellow('DOCUMENTATION')}
  Full documentation: https://github.com/holasoymalva/deepseek-cli
`;

export function showHelp(): void {
  console.log(helpText);
}
