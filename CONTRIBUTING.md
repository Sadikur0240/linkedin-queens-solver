# Contributing to LinkedIn Queens Solver

Thank you for your interest in contributing to the LinkedIn Queens Solver! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Google Chrome browser
- Git
- Basic knowledge of JavaScript and Chrome Extension development

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/linkedin-queens-solver.git`
3. Navigate to the project: `cd linkedin-queens-solver`
4. Load the extension in Chrome:
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extensions/` folder

## 📝 How to Contribute

### Reporting Bugs
1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser version and extension version
   - Screenshots if applicable

### Suggesting Features
1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the proposed feature
   - Use case and benefits
   - Implementation suggestions (if any)

### Code Contributions

#### Pull Request Process
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes thoroughly:
   - Test with both signed-in and signed-out LinkedIn users
   - Verify puzzle solving accuracy
   - Test navigation between different puzzle pages
4. Commit with descriptive messages following our format:
   ```
   🎯 Brief description of change
   
   - Detailed explanation of what changed
   - Why the change was necessary
   - Any breaking changes or considerations
   ```
5. Push your branch: `git push origin feature/your-feature-name`
6. Create a pull request with:
   - Clear title and description
   - Reference to related issues
   - Testing steps performed

#### Code Style Guidelines
- Use modern JavaScript (ES6+)
- Follow existing naming conventions
- Add comments for complex logic
- Keep functions focused and single-purpose
- Use descriptive variable names

#### Testing Requirements
- Test with different LinkedIn puzzle sizes (8x8, 9x9, etc.)
- Verify compatibility with signed-in and signed-out users
- Test SPA navigation scenarios
- Ensure no console errors or warnings

## 🏗️ Project Structure

```
linkedin-queens-solver/
├── extensions/           # Chrome extension files
│   ├── manifest.json    # Extension manifest
│   ├── background.js    # Solving algorithm
│   ├── content.js       # DOM interaction
│   └── icons/          # Extension icons
├── docs/               # Documentation
├── scripts/            # Build and utility scripts
├── assets/            # Images and media
└── .github/           # GitHub workflows
```

## 🔍 Key Areas for Contribution

### Algorithm Improvements
- Optimization of the backtracking algorithm
- Support for additional puzzle constraints
- Performance enhancements

### User Experience
- Better visual feedback
- Improved error handling
- Enhanced accessibility

### Compatibility
- Support for new LinkedIn interface changes
- Cross-browser compatibility (if expanding beyond Chrome)
- Mobile/responsive considerations

### Documentation
- Code documentation and comments
- User guides and tutorials
- API documentation

## 🐛 Debugging Tips

### Common Issues
- **Extension not loading**: Check manifest.json syntax
- **Puzzle not detected**: Verify DOM selectors in content.js
- **Solver failing**: Check algorithm logic in background.js
- **Visual highlights not showing**: Verify CSS injection in content.js

### Debugging Tools
- Chrome DevTools Console
- Chrome Extension DevTools
- LinkedIn Queens game console logs

## 📋 Code Review Process

All contributions go through code review:
1. Automated checks (if any CI is configured)
2. Manual review by maintainers
3. Testing verification
4. Merge approval

## 🏷️ Versioning

We use [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Feel free to create an issue for any questions about contributing!

---

Thank you for helping make LinkedIn Queens Solver better! 🎉
