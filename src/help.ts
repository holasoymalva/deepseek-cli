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

${chalk.yellow('COMMANDS')}
  chat <prompt>             Send a single prompt
  reason <prompt>           Solve problems with reasoning
  analyze <file>            Analyze code quality
  tokens <input>            Count tokens and estimate costs
    -f, --file              Treat input as a file path
    -m, --model <model>     Model for cost estimation
    -t, --time <period>     Time period (standard/discount)
    -j, --json              Output in JSON format
  models                    List available models

${chalk.yellow('EXAMPLES')}
  $ deepseek chat "Write a function to calculate prime numbers"
  $ deepseek --stream chat "Explain quantum computing"
  $ deepseek reason "Solve: x + y = 10, x * y = 24"
  $ deepseek analyze app.js
  $ deepseek tokens "How many tokens is this text?"
  $ deepseek tokens -f README.md

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
