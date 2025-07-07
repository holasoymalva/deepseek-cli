# Publishing Guide for DeepSeek CLI

This document outlines the process for publishing the DeepSeek CLI package to npm.

## Prerequisites

- You need to have an npm account with publish access to the `run-deepseek-cli` package
- You need to have your npm token available

## Local Publishing

### 1. Set up your npm token

First, set your npm token as an environment variable:

```bash
export NPM_TOKEN="your-npm-token-here"
```

### 2. Verify your package

Before publishing, make sure to:

1. Update the version number in `package.json`
2. Update the `CHANGELOG.md` with the latest changes
3. Build and test the package:

```bash
npm run build
npm test
```

### 3. Publish the package

Use the publish script:

```bash
npm run publish-package
```

## GitHub Actions Publishing

We've set up automated publishing via GitHub Actions:

1. Update the version in `package.json`
2. Commit and push your changes
3. Create a new release on GitHub
4. The GitHub Action will automatically publish to npm

### Setting up the GitHub Secret

To enable GitHub Actions to publish to npm:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add a new repository secret named `NPM_TOKEN` with your npm token as the value

## Version Management

Follow semantic versioning:

- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backward compatible manner
- PATCH version for backward compatible bug fixes

## Post-Publishing

After publishing:

1. Verify the package is available on npm: `npm view run-deepseek-cli`
2. Test installation: `npm install -g run-deepseek-cli`
3. Announce the new version in appropriate channels
