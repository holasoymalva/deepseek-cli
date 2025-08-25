#!/bin/bash

echo "🚀 DeepSeek CLI Local Setup"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama not found. Installing Ollama..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install ollama
        else
            echo "Please install Homebrew first or download Ollama from https://ollama.ai"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        echo "Please install Ollama manually from https://ollama.ai"
        exit 1
    fi
fi

echo "✅ Ollama found: $(ollama --version)"

# Install the CLI
echo "📦 Installing DeepSeek CLI..."
npm install -g run-deepseek-cli

# Start Ollama service
echo "🔧 Starting Ollama service..."
ollama serve &
sleep 3

# Install the model
echo "📥 Installing DeepSeek Coder model (this may take a while)..."
ollama pull deepseek-coder:6.7b

echo ""
echo "🎉 Setup complete!"
echo ""
echo "You can now use DeepSeek CLI locally:"
echo "  deepseek"
echo ""
echo "Or test with a single prompt:"
echo "  deepseek chat 'Write a hello world function in Python'"