# DeepSeek CLI
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![npm version](https://badge.fury.io/js/run-deepseek-cli.svg)](https://www.npmjs.com/package/run-deepseek-cli)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

![image](https://github.com/user-attachments/assets/5686866b-a841-4303-b7c4-c2c437816644)

This repository contains the DeepSeek CLI, a command-line AI assistant that leverages the powerful DeepSeek models to accelerate your development workflows and enhance your coding experience.

With the DeepSeek CLI you can:

- **Code Completion & Generation**: Get intelligent code suggestions and generate complete functions across multiple programming languages.
- **Code Analysis & Review**: Analyze code for quality, bugs, and improvements.
- **Problem Solving with Reasoning**: Solve complex problems with the reasoning capabilities of DeepSeek models.
- **Interactive Chat**: Have multi-turn conversations about coding and other topics.
- **Multiple Models**: Choose between different DeepSeek models for different tasks.
- **Streaming Responses**: Get real-time responses as they're generated.

## Quickstart

1. **Prerequisites:** Ensure you have [Node.js version 18](https://nodejs.org/en/download) or higher installed.

2. **Install the CLI:** Install globally using npm:

   ```bash
   npm install -g run-deepseek-cli
   deepseek
   ```

   Or run directly without installation:

   ```bash
   npx run-deepseek-cli
   ```

3. **Configure API Access:** Set up your DeepSeek API key using one of these methods:

   **Option 1: Environment variable**
   ```bash
   export DEEPSEEK_API_KEY="your_api_key_here"
   ```

   **Option 2: Configuration file**
   Create a `.deepseekrc` file in your home directory:
   ```json
   {
     "apiKey": "your_api_key_here",
     "model": "deepseek-chat",
     "temperature": 0.2
   }
   ```

   **Option 3: Command line option**
   ```bash
   deepseek --api-key="your_api_key_here" chat "Hello"
   ```

   Get your API key from [DeepSeek Platform](https://platform.deepseek.com/api_keys).

4. **Choose Your Model:** The CLI supports multiple DeepSeek models:
   - `deepseek-chat` (General purpose chat model)
   - `deepseek-reasoner` (Advanced reasoning capabilities)

   View available models with:
   ```bash
   deepseek models
   ```

You are now ready to use the DeepSeek CLI!

## Examples

Once the CLI is running, you can start interacting with DeepSeek from your shell.

### Chat with DeepSeek

```sh
# Single prompt
deepseek chat "Write a Python function to implement binary search with proper error handling"

# Interactive mode
deepseek
> Write a Python function to implement binary search with proper error handling

# Streaming responses
deepseek --stream chat "Write a Python function to implement binary search with proper error handling"
```

### Analyze Code

```sh
# Analyze a code file
deepseek analyze path/to/your/file.js

# Analyze with the reasoning model
deepseek --model deepseek-reasoner analyze path/to/your/file.js
```

### Solve Problems with Reasoning

```sh
# Use the reason command for complex problems
deepseek reason "Solve this math problem: If x + y = 10 and x * y = 24, what are the values of x and y?"

# Show the reasoning process
deepseek reason --show-reasoning "Solve this math problem: If x + y = 10 and x * y = 24, what are the values of x and y?"
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEEPSEEK_API_KEY` | Your DeepSeek API key | Required |
| `DEEPSEEK_MODEL` | Model to use | `deepseek-chat` |
| `DEEPSEEK_API_URL` | API endpoint | `https://api.deepseek.com/chat/completions` |
| `DEEPSEEK_MAX_TOKENS` | Maximum tokens per response | `4096` |
| `DEEPSEEK_TEMPERATURE` | Response creativity (0.0-1.0) | `0.1` |
| `DEEPSEEK_STREAM` | Enable streaming responses | `false` |
| `DEEPSEEK_SHOW_REASONING` | Show reasoning process | `false` |

### Configuration File

Create a `.deepseekrc` file in your home directory:

```json
{
  "apiKey": "your_api_key_here",
  "model": "deepseek-chat",
  "temperature": 0.2,
  "maxTokens": 4096,
  "stream": true,
  "showReasoning": false
}
```

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `-k, --api-key <key>` | DeepSeek API key | From config |
| `-m, --model <model>` | Model to use | `deepseek-chat` |
| `-t, --temperature <temp>` | Temperature (0.0-1.0) | `0.1` |
| `--max-tokens <tokens>` | Maximum tokens in response | `4096` |
| `-s, --stream` | Enable streaming responses | `false` |
| `-r, --show-reasoning` | Show reasoning process | `false` |

## CLI Commands

| Command | Description |
|---------|-------------|
| `deepseek` | Start interactive mode |
| `deepseek --help` | Show help information |
| `deepseek --version` | Show version |
| `deepseek chat <prompt>` | Send a single prompt |
| `deepseek analyze <file>` | Analyze a code file |
| `deepseek reason <prompt>` | Solve complex problems with reasoning |
| `deepseek tokens <input>` | Count tokens and estimate costs |
| `deepseek models` | List available models |

### Interactive Mode

The interactive mode provides a REPL experience:

- **Syntax Highlighting**: Color-coded responses for better readability
- **Code Block Detection**: Automatic language detection and formatting
- **Multi-turn Conversations**: Maintain context across interactions

## Available Models

| Model | Description | Best For |
|-------|-------------|----------|
| `deepseek-chat` | General purpose chat model | Code generation, explanations, general assistance |
| `deepseek-reasoner` | Advanced reasoning capabilities | Complex problems, mathematical reasoning, logical analysis |

## Advanced Features

### Streaming Responses

Get real-time responses as they're generated:

```bash
deepseek --stream chat "Explain how quantum computing works"
```

### Chain of Thought Reasoning

See the model's reasoning process when solving complex problems:

```bash
deepseek reason --show-reasoning "What is the derivative of f(x) = x^3 + 2x^2 - 5x + 7?"
```

### Token Counting and Cost Estimation

Count tokens and estimate API costs for text or files:

```bash
# Count tokens in text
deepseek tokens "Your text here"

# Count tokens in a file
deepseek tokens -f path/to/file.txt

# Specify model and time period for accurate cost estimation
deepseek tokens -f path/to/file.txt -m deepseek-reasoner -t discount

# Get JSON output for programmatic use
deepseek tokens "Your text here" -j
```

### Contextual Token Information

The CLI now provides contextual token usage information after each API call:

- **Token Usage Display**: See token counts and cost estimates after each command
- **Interactive Mode Stats**: Type `stats` in interactive mode to see session totals
- **Session Summary**: View total token usage and costs when exiting interactive mode

This helps you:
- Monitor your API usage in real-time
- Track costs across multiple requests
- Optimize your prompts for token efficiency
- Plan your API budget more effectively

## Documentation Structure

The documentation for the DeepSeek CLI is organized into two main folders:

### API Reference Documentation (api-docs)

The `api-docs` folder contains detailed API reference documentation for the DeepSeek API. This includes:

- API endpoints and their parameters
- Request and response formats
- Authentication information
- Error handling

This documentation is essential for developers who need to understand the technical details of the API.

### Feature Guides and Tutorials (deepseek-docs)

The `deepseek-docs` folder contains guides and tutorials on how to use specific features of the DeepSeek API. This includes:

- Function calling examples
- JSON mode usage
- Reasoning model examples
- Multi-round chat examples
- And more

These guides are useful for understanding concepts and seeing examples of how to use the API features.

Both sets of documentation are valuable and complement each other. When implementing a feature, it's recommended to consult both the API reference and the relevant guides.

## Installation Options

### NPM (Recommended)

```bash
npm install -g run-deepseek-cli
```

### Development Installation

```bash
git clone https://github.com/holasoymalva/deepseek-cli.git
cd deepseek-cli
npm install
npm run build
npm link
```

## Contributing

We welcome contributions! Here's how to get started:

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Make your changes
4. Build the project: `npm run build`
5. Test your changes
6. Submit a pull request

## Troubleshooting

### Common Issues

**API Key Issues:**
```bash
# Check if your API key is set
echo $DEEPSEEK_API_KEY

# Or pass it directly
deepseek --api-key="your_api_key" chat "Hello"
```

**Configuration File:**
```bash
# Create or edit your .deepseekrc file
echo '{"apiKey": "your_api_key", "model": "deepseek-chat"}' > ~/.deepseekrc
```

**Model Not Found:**
```bash
# List available models
deepseek models

# Use a valid model
deepseek --model deepseek-chat chat "Hello"
```

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Contact & Support

- **Issues**: [GitHub Issues](https://github.com/holasoymalva/deepseek-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/holasoymalva/deepseek-cli/discussions)
- **DeepSeek Support**: service@deepseek.com

## Acknowledgments

- Powered by [DeepSeek](https://deepseek.com) models
- Thanks to the open-source community for contributions and feedback
