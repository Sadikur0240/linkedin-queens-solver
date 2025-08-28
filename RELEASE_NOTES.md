# Release Preparation Script
# LinkedIn Queens Solver v1.1.0

# Preparation Steps for GitHub Release:

## 1. Pre-Release Checklist
- [x] Version bumped to 1.1.0 in manifest.json
- [x] CHANGELOG.md updated with release notes
- [x] README.md updated with new features
- [x] All files tested and verified working
- [x] Documentation updated

## 2. Files to Include in Release
- extensions/manifest.json (v1.1.0)
- extensions/content.js (with iframe support)
- extensions/background.js (stable solver algorithm)
- extensions/icons/ (all icon files)
- README.md
- LICENSE
- CHANGELOG.md
- PRIVACY.md

## 3. Release Archive Creation
Create a ZIP file named: `linkedin-queens-solver-v1.1.0.zip`
Include only the /extensions folder contents for easy installation.

## 4. GitHub Release Notes Template

### LinkedIn Queens Solver v1.1.0 - Universal Compatibility Update

🚀 **Major Update: Universal LinkedIn Compatibility**

This release introduces comprehensive support for both signed-in and signed-out LinkedIn users, making the extension truly universal.

#### 🆕 What's New
- **Universal Compatibility**: Now works seamlessly for both signed-in and signed-out users
- **Smart Iframe Support**: Automatic detection and handling of LinkedIn's iframe-based game loading
- **Intelligent Context Detection**: Runtime environment detection with automatic adaptation
- **Enhanced Cross-Frame Communication**: Improved message passing with context awareness

#### 🔧 Technical Improvements
- Dual URL matching for main page and iframe contexts
- Advanced iframe loading detection with timeout handling
- Context-aware SPA navigation handling
- Enhanced debugging with context indicators

#### 📦 Installation
1. Download the `linkedin-queens-solver-v1.1.0.zip` file
2. Extract to a local directory
3. Open Chrome and go to `chrome://extensions`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extracted folder
6. Visit LinkedIn Queens and enjoy automatic solving!

#### 🐛 Bug Fixes
- Fixed extension not working for signed-out users
- Resolved iframe isolation issues
- Improved navigation detection reliability

---

**Full Changelog**: [CHANGELOG.md](https://github.com/XaJason/linkedin-queens-solver/blob/main/CHANGELOG.md)
