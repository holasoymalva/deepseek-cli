# Changelog

All notable changes to the DeepSeek CLI project will be documented in this file.

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
