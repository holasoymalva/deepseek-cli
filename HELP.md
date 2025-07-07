# DeepSeek CLI Help Guide

## Overview

DeepSeek CLI is a powerful command-line interface that leverages DeepSeek's AI models to assist with coding tasks, problem solving, and code analysis. This tool provides access to both the general-purpose `deepseek-chat` model and the advanced reasoning capabilities of the `deepseek-reasoner` model.

## Installation

```bash
# Install globally via npm
npm install -g run-deepseek-cli

# Or run directly without installation
npx run-deepseek-cli
```

## Configuration

### API Key Setup

Before using DeepSeek CLI, you need to set up your API key using one of these methods:

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
  "temperature": 0.2,
  "maxTokens": 4096,
  "stream": true,
  "showReasoning": false
}
```

**Option 3: Command line option**
```bash
deepseek --api-key="your_api_key_here" chat "Hello"
```

Get your API key from [DeepSeek Platform](https://platform.deepseek.com/api_keys).

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

## Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `-k, --api-key <key>` | DeepSeek API key | From config |
| `-m, --model <model>` | Model to use | `deepseek-chat` |
| `-t, --temperature <temp>` | Temperature (0.0-1.0) | `0.1` |
| `--max-tokens <tokens>` | Maximum tokens in response | `4096` |
| `-s, --stream` | Enable streaming responses | `false` |
| `-r, --show-reasoning` | Show reasoning process | `false` |
| `-V, --version` | Show version number | - |
| `-h, --help` | Show help information | - |

## Available Commands

### Interactive Mode

Start an interactive session with DeepSeek:

```bash
deepseek
```

In interactive mode:
- Type your questions or requests and press Enter
- Type `stats` to view token usage statistics for the current session
- Type `exit` or press Ctrl+C to quit

### Chat Command

Send a single prompt to DeepSeek:

```bash
deepseek chat "Write a Python function to implement binary search"
```

Options:
- Use `--stream` for real-time responses
- Use `--model` to specify which model to use

### Reason Command

Solve complex problems with detailed reasoning:

```bash
deepseek reason "Solve this math problem: If x + y = 10 and x * y = 24, what are the values of x and y?"
```

Options:
- Use `--show-reasoning` to display the model's reasoning process
- This command automatically uses the `deepseek-reasoner` model

### Analyze Command

Analyze a code file for quality, bugs, and improvements:

```bash
deepseek analyze path/to/your/file.js
```

This command will:
- Read the specified file
- Analyze the code for quality issues, bugs, and potential improvements
- Provide suggestions for improvement

### Tokens Command

Count tokens and estimate API costs:

```bash
# Count tokens in text
deepseek tokens "Your text here"

# Count tokens in a file
deepseek tokens -f path/to/file.txt
```

Options:
- `-f, --file`: Treat input as a file path
- `-m, --model <model>`: Model to use for cost estimation
- `-t, --time <period>`: Time period for pricing (standard or discount)
- `-j, --json`: Output in JSON format

### Models Command

List available DeepSeek models:

```bash
deepseek models
```

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
deepseek tokens "Your text here"
```

### Contextual Token Information

The CLI provides token usage information after each API call:
- Token counts for input and output
- Total tokens used
- Estimated cost based on current pricing

In interactive mode, you can:
- Type `stats` to see session token usage
- View a session summary when exiting

## Models & Pricing Overview

Prices listed are per 1 million tokens. Billing is based on the total number of input and output tokens processed.

### Model Comparison

| Feature | deepseek-chat | deepseek-reasoner |
|---------|---------------|-------------------|
| Full Model Name | DeepSeek-V3-0324 | DeepSeek-R1-0528 |
| Context Length | 64K | 64K |
| Max Output | Default: 4K<br>Maximum: 8K | Default: 32K<br>Maximum: 64K |
| JSON Output | ✓ | ✓ |
| Function Calling | ✓ | ✓ |

### Pricing Details (per 1M Tokens)

#### Standard Price (UTC 00:30 - 16:30)
| Type | deepseek-chat | deepseek-reasoner |
|------|---------------|-------------------|
| Input (Cache Hit) | $0.07 | $0.14 |
| Input (Cache Miss) | $0.27 | $0.55 |
| Output | $1.10 | $2.19 |

#### Discount Price (UTC 16:30 - 00:30)
| Type | deepseek-chat | deepseek-reasoner |
|------|---------------|-------------------|
| Input (Cache Hit) | $0.035 (50% OFF) | $0.035 (75% OFF) |
| Input (Cache Miss) | $0.135 (50% OFF) | $0.135 (75% OFF) |
| Output | $0.550 (50% OFF) | $0.550 (75% OFF) |

## Examples

### Chat Example

```bash
deepseek chat "Write a Python function to calculate the Fibonacci sequence"
```

### Reason Example

```bash
deepseek reason "What is the time complexity of quicksort in the worst case, and why?"
```

### Analyze Example

```bash
deepseek analyze app.js
```

### Tokens Example

```bash
deepseek tokens -f README.md -m deepseek-reasoner
```

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

## Support & Resources

- **GitHub Repository**: [DeepSeek CLI on GitHub](https://github.com/holasoymalva/deepseek-cli)
- **Issues**: [GitHub Issues](https://github.com/holasoymalva/deepseek-cli/issues)
- **DeepSeek API Documentation**: [DeepSeek API Docs](https://api-docs.deepseek.com)
- **DeepSeek Support**: service@deepseek.com
