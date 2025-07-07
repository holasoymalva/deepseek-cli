# Changelog

All notable changes to the DeepSeek CLI project will be documented in this file.

## [0.3.4] - 2025-07-07

### Added
- Human-friendly command aliases for improved accessibility
- New `ask` alias for the `chat` command
- New `solve` alias for the `reason` command
- New `review` alias for the `analyze` command
- New `count` alias for the `tokens` command
- New `list` alias for the `models` command
- New task-specific commands: `explain`, `fix`, `improve`, and `cost`
- Updated help documentation to include all aliases and new commands

### Changed
- Enhanced help text with better organization and examples
- Improved command descriptions for clarity

## [0.3.3] - 2025-07-07

### Added
- Contextual token usage information after each API call
- Session token tracking in interactive mode
- Cost estimation for each API call
- Session summary with total tokens and costs
- New "stats" command in interactive mode to display session statistics

### Changed
- Enhanced UI with token usage information
- Improved interactive mode with more feedback

## [0.3.2] - 2025-07-07

### Added
- New `tokens` command for counting tokens and estimating API costs
- Support for token counting in both text and files
- Cost estimation for different models and time periods
- JSON output option for programmatic use
- DeepSeek V3 tokenizer integration

## [0.3.1] - 2025-07-07

### Added
- Detailed model comparison and pricing information
- Comprehensive documentation on model capabilities and limitations
- Pricing details for both standard and discount time periods
- Explanatory notes on context length, max output, and token counting

## [0.3.0] - 2025-07-07

### Added
- Streaming responses for real-time output
- New `reason` command for complex problem solving with the deepseek-reasoner model
- Chain of Thought (CoT) reasoning display with the `--show-reasoning` flag
- Support for streaming API responses
- Enhanced error handling for streaming responses

### Changed
- Updated CLI interface with new options for streaming and reasoning
- Improved response formatting for better readability
- Updated documentation to reflect new features

## [0.2.0] - 2025-07-07

### Added
- Support for multiple configuration sources (environment variables, .env file, .deepseekrc file)
- New `analyze` command for code review and analysis
- New `models` command to list available DeepSeek models
- Support for both available DeepSeek models: deepseek-chat and deepseek-reasoner
- Model validation to ensure only valid models are used
- Additional command-line options (temperature, max-tokens)
- Better error handling for API calls
- Enhanced response formatting for better readability

### Fixed
- Environment variable loading issue
- Improved error handling for configuration loading
- Fixed maxTokens parsing issue

### Changed
- Updated default model to deepseek-chat
- Improved help text and documentation
- Enhanced code organization and type safety

## [0.1.0] - 2025-07-01

### Added
- Initial release with basic functionality
- Support for chat command
- Interactive mode
- Basic configuration options
