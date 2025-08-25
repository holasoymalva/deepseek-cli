# DeepSeek CLI - Local Setup Guide

This guide will help you set up DeepSeek CLI to run completely locally using Ollama, providing free and private AI assistance.

## 🎯 Benefits of Local Setup

- **Free**: No API costs or usage limits
- **Private**: Your code never leaves your machine
- **Fast**: No network latency for requests
- **Offline**: Works without internet connection
- **Customizable**: Full control over models and settings

## 📋 Prerequisites

1. **Node.js 18+**: [Download here](https://nodejs.org)
2. **Ollama**: [Download here](https://ollama.ai)
3. **Sufficient RAM**: 
   - 2GB+ for `deepseek-coder:1.3b`
   - 8GB+ for `deepseek-coder:6.7b` (recommended)
   - 32GB+ for `deepseek-coder:33b`

## 🚀 Quick Installation

### Option 1: Automated Script (macOS/Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/holasoymalva/deepseek-cli/main/install-local.sh | bash
```

### Option 2: Manual Installation

1. **Install Ollama:**
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows: Download from https://ollama.ai
   ```

2. **Install DeepSeek CLI:**
   ```bash
   npm install -g run-deepseek-cli
   ```

3. **Start Ollama:**
   ```bash
   ollama serve
   ```

4. **Install DeepSeek Model:**
   ```bash
   # Choose one based on your system:
   ollama pull deepseek-coder:1.3b    # Lightweight (1GB)
   ollama pull deepseek-coder:6.7b    # Recommended (4GB)
   ollama pull deepseek-coder:33b     # Most capable (19GB)
   ```

5. **Test Installation:**
   ```bash
   deepseek chat "Write a hello world function in Python"
   ```

## 🔧 Configuration

Create a `.env` file in your project or home directory:

```bash
# Local mode (default)
DEEPSEEK_USE_LOCAL=true
DEEPSEEK_MODEL=deepseek-coder:6.7b
OLLAMA_HOST=http://localhost:11434
```

## 📖 Usage Examples

### Interactive Mode
```bash
deepseek
```

### Single Prompt
```bash
deepseek chat "Explain how async/await works in JavaScript"
```

### Force Local Mode
```bash
deepseek --local --model deepseek-coder:1.3b
```

### Setup Helper
```bash
deepseek setup
```

## 🛠️ Troubleshooting

### Ollama Not Running
```bash
# Start Ollama service
ollama serve

# Or run in background
nohup ollama serve > /dev/null 2>&1 &
```

### Model Not Found
```bash
# List installed models
ollama list

# Install missing model
ollama pull deepseek-coder:6.7b
```

### Connection Issues
```bash
# Check if Ollama is accessible
curl http://localhost:11434/api/tags

# Use custom host
deepseek --ollama-host http://192.168.1.100:11434
```

### Memory Issues
- Use smaller model: `deepseek-coder:1.3b`
- Close other applications
- Increase system swap space

## 🔄 Switching Between Local and Cloud

### Use Local (Default)
```bash
export DEEPSEEK_USE_LOCAL=true
deepseek
```

### Use Cloud API
```bash
export DEEPSEEK_USE_LOCAL=false
export DEEPSEEK_API_KEY="your-api-key"
deepseek
```

## 📊 Model Comparison

| Model | Size | RAM Needed | Speed | Quality | Best For |
|-------|------|------------|-------|---------|----------|
| `deepseek-coder:1.3b` | 1GB | 2GB | Fast | Good | Quick completions |
| `deepseek-coder:6.7b` | 4GB | 8GB | Medium | Better | General coding |
| `deepseek-coder:33b` | 19GB | 32GB | Slow | Best | Complex analysis |

## 🎉 You're Ready!

Your DeepSeek CLI is now configured to run locally. Enjoy free, private, and powerful AI coding assistance!

For more advanced features and configurations, check the main [README.md](./README.md).