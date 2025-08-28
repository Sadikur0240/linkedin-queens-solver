# LinkedIn Queens Solver

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)
![Status](https://img.shields.io/badge/status-Complete-brightgreen.svg)

A Chrome extension that automatically solves the daily 'Queens' puzzle game on LinkedIn. It uses a modified backtracking algorithm to handle the game's unique constraints, including colored regions and queen adjacency rules, providing instant solutions with visual guidance directly on the LinkedIn game page.

## Demo

![Demo Animation - Extension solving LinkedIn Queens puzzle in real-time](demo-placeholder.gif)
*Animated demonstration of the LinkedIn Queens Solver extension in action*

## 🤖 Tech Stack

- **JavaScript (ES6+)** - Core logic and algorithm implementation
- **Chrome Extension APIs (Manifest V3)** - Modern extension framework with enhanced security
- **HTML5** - Extension popup interface structure
- **CSS3** - Visual styling and highlighting effects
- **DOM Manipulation** - Real-time LinkedIn page interaction and solution visualization

## ✨ Features

- **Automated Board Parsing** - Automatically detects and extracts LinkedIn Queens game state via sophisticated DOM analysis
- **Custom Backtracking Algorithm** - Implements optimized solving algorithm respecting LinkedIn's unique rules (color regions, adjacency constraints)
- **Dynamic Solution Visualization** - Injects subtle visual highlights and crown icons directly onto the live game board
- **Instant Performance** - Solves 9x9 puzzles in under 1ms with ~49 iterations using O(1) conflict checking
- **SPA Navigation Support** - Seamlessly works across LinkedIn's single-page application routing
- **User-Friendly Interface** - Clean browser action popup with solution status and performance metrics

## ⚙️ Installation and Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/XaJason/linkedin-queens-solver.git
   ```

2. **Open Google Chrome and navigate to `chrome://extensions`**

3. **Enable "Developer mode" using the toggle in the top right corner**

4. **Click the "Load unpacked" button**

5. **Select the `/extensions` directory from the cloned project folder**

6. **Navigate to a LinkedIn Queens puzzle page and the extension will automatically solve the puzzle, displaying solutions in the console and highlighting positions on the board**

## 🏛️ Architectural Overview

The extension follows Chrome's Manifest V3 architecture with three core components working in harmony. The **Content Script** (`content.js`) handles DOM parsing and visual feedback, automatically detecting LinkedIn Queens game boards and extracting puzzle state including grid dimensions, color mappings, and existing queen placements. The **Background Script** (`background.js`) serves as the computational engine, implementing the optimized backtracking algorithm with auxiliary data structures for O(1) conflict checking. The **Popup Script** (`popup.js`) provides user interface controls and status information. Communication between components uses Chrome's secure message passing protocol, ensuring efficient data flow while maintaining the extension's security boundaries and respecting LinkedIn's game integrity.

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
