# Contributing to DeepSeek CLI

Thank you for your interest in contributing to DeepSeek CLI! This document provides guidelines and instructions for contributing to this project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/deepseek-cli.git
   cd deepseek-cli
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Make your changes** to the codebase
2. **Build the project** to verify your changes:
   ```bash
   npm run build
   ```
3. **Test your changes** manually:
   ```bash
   node dist/index.js --help
   node dist/index.js chat "Hello"
   ```
4. **Commit your changes** with a descriptive commit message:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
5. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a pull request** from your fork to the main repository

## Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Include proper error handling

## Adding New Commands

To add a new command to the CLI:

1. Create a new file in the `src/commands` directory
2. Implement your command logic
3. Update the `src/cli.ts` file to include your new command
4. Update the README.md to document your new command

## Testing

Currently, the project doesn't have automated tests. When adding new features, please test them manually and document the testing process in your pull request.

## Documentation

When adding new features or making changes, please update the relevant documentation:

- Update the README.md for user-facing changes
- Update the CHANGELOG.md with your additions, changes, or fixes
- Add inline documentation for complex code

## Submitting a Pull Request

When submitting a pull request, please:

1. Provide a clear description of the changes
2. Link to any related issues
3. Explain how you tested the changes
4. Update documentation as needed

## Getting Help

If you have questions or need help, please:

- Open an issue on GitHub
- Reach out in the GitHub Discussions

Thank you for contributing to DeepSeek CLI!
