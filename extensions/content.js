// Content script for LinkedIn Queens Solver
// This script automatically extracts puzzle data from LinkedIn Queens game DOM and solves it

console.log('🚀 LinkedIn Queens Solver: Content script injected and starting...');

// Base color mapping from LinkedIn Queens game (expandable for larger grids)
const BASE_COLOR_MAP = {
    'cell-color-0': 'Lavender',     // Purple/Lavender
    'cell-color-1': 'Peach Orange', // Orange/Peach
    'cell-color-2': 'Soft Blue',    // Blue
    'cell-color-3': 'Pastel Green', // Green
    'cell-color-4': 'Yellow',       // Yellow
    'cell-color-5': 'Pink',         // Pink
    'cell-color-6': 'Red',          // Red
    'cell-color-7': 'Brown',        // Brown
    'cell-color-8': 'Gray',         // Gray
    'cell-color-9': 'Teal',         // Teal (for 10x10+)
    'cell-color-10': 'Orange',      // Orange (for 11x11+)
    'cell-color-11': 'Violet',      // Violet (for 12x12+)
    'cell-color-12': 'Cyan',        // Cyan (for 13x13+)
    'cell-color-13': 'Magenta',     // Magenta (for 14x14+)
    'cell-color-14': 'Lime',        // Lime (for 15x15+)
    'cell-color-15': 'Coral'        // Coral (for 16x16+)
};

// Extended color names for grids larger than our base mapping
const EXTENDED_COLOR_NAMES = [
    'Lavender', 'Peach Orange', 'Soft Blue', 'Pastel Green', 'Yellow', 'Pink', 'Red', 'Brown', 'Gray',
    'Teal', 'Orange', 'Violet', 'Cyan', 'Magenta', 'Lime', 'Coral', 'Navy', 'Maroon', 'Olive', 'Silver',
    'Gold', 'Indigo', 'Turquoise', 'Salmon', 'Khaki', 'Plum', 'Orchid', 'Peru', 'Tan', 'Azure',
    'Beige', 'Bisque', 'Crimson', 'Fuchsia', 'Ivory', 'Mint', 'Rose', 'Ruby', 'Sage', 'Cream'
];

/**
 * Dynamically gets color name for any cell-color-X class, supporting unlimited grid sizes
 * @param {string} colorClass - The CSS class like 'cell-color-12'
 * @returns {string} Human-readable color name
 */
function getColorName(colorClass) {
    // First try the base mapping
    if (BASE_COLOR_MAP[colorClass]) {
        return BASE_COLOR_MAP[colorClass];
    }
    
    // Extract color number for dynamic mapping
    const match = colorClass.match(/^cell-color-(\d+)$/);
    if (match) {
        const colorIndex = parseInt(match[1]);
        if (colorIndex < EXTENDED_COLOR_NAMES.length) {
            return EXTENDED_COLOR_NAMES[colorIndex];
        } else {
            // For extremely large grids, use descriptive fallback
            return `Color-${colorIndex + 1}`;
        }
    }
    
    // Fallback for unexpected format
    return `Unknown-${colorClass}`;
}

// Cell state constants
const CELL_STATES = {
    EMPTY: 'empty',
    QUEEN: 'queen',
    CROSS: 'cross'
};

/**
 * Extracts the board state from LinkedIn Queens game DOM
 * @returns {Object|null} Board data with size, colors, and queens, or null if not found
 */
function extractBoardState() {
    try {
        // Find the game board container
        const gameBoard = document.querySelector('#queens-grid');
        if (!gameBoard) {
            console.warn('LinkedIn Queens: Game board not found');
            return null;
        }

        // Extract grid dimensions from CSS custom properties
        const style = getComputedStyle(gameBoard);
        const rows = parseInt(style.getPropertyValue('--rows').trim()) || 0;
        const cols = parseInt(style.getPropertyValue('--cols').trim()) || 0;
        
        if (rows === 0 || cols === 0) {
            console.warn('LinkedIn Queens: Invalid grid dimensions', { rows, cols });
            return null;
        }

        console.log(`LinkedIn Queens: Found ${rows}x${cols} board`);

        // Find all game cells
        const cells = gameBoard.querySelectorAll('[data-cell-idx]');
        if (cells.length !== rows * cols) {
            console.warn('LinkedIn Queens: Cell count mismatch', { 
                expected: rows * cols, 
                found: cells.length 
            });
            return null;
        }

        // Initialize board data structures
        const board = Array(rows).fill(null).map(() => Array(cols).fill(CELL_STATES.EMPTY));
        const colors = Array(rows).fill(null).map(() => Array(cols).fill(null));
        const queens = [];
        let totalColors = 0;

        // Process each cell
        cells.forEach((cell) => {
            const cellIdx = parseInt(cell.getAttribute('data-cell-idx'));
            const row = Math.floor(cellIdx / cols);
            const col = cellIdx % cols;

            // Extract color information
            let cellColor = null;
            let colorClass = null;
            for (const className of cell.classList) {
                if (className.startsWith('cell-color-')) {
                    colorClass = className;
                    cellColor = getColorName(className);
                    break;
                }
            }

            if (cellColor) {
                colors[row][col] = cellColor;
                // Track unique colors for statistics
                const colorNum = parseInt(colorClass.replace('cell-color-', ''));
                totalColors = Math.max(totalColors, colorNum + 1);
            }

            // Extract cell state (empty, queen, or cross)
            const cellContent = cell.querySelector('.cell-content');
            if (cellContent) {
                if (cellContent.querySelector('.cell-input--queen')) {
                    board[row][col] = CELL_STATES.QUEEN;
                    queens.push({ row, col, color: cellColor });
                } else if (cellContent.querySelector('.cell-input--cross')) {
                    board[row][col] = CELL_STATES.CROSS;
                }
                // If no specific input found, it remains EMPTY
            }
        });

        // Validate extracted data
        if (queens.length === 0) {
            console.info('LinkedIn Queens: No queens found on board (game might not be started)');
        }

        const boardData = {
            size: rows,
            rows: rows,
            cols: cols,
            board: board,
            colors: colors,
            queens: queens,
            totalColors: totalColors,
            timestamp: Date.now(),
            url: window.location.href
        };

        console.log('LinkedIn Queens: Board state extracted successfully', {
            size: `${rows}x${cols}`,
            queens: queens.length,
            colors: totalColors,
            queenPositions: queens.map(q => `(${q.row + 1},${q.col + 1}) ${q.color}`)
        });

        return boardData;

    } catch (error) {
        console.error('LinkedIn Queens: Error extracting board state:', error);
        return null;
    }
}

/**
 * Sends board data to background script for solving
 * @param {Object} boardData - The extracted board data
 */
function sendToSolver(boardData) {
    if (!boardData) {
        console.error('❌ LinkedIn Queens: No board data to send to solver');
        return;
    }

    console.log('📤 LinkedIn Queens: Sending puzzle to background solver...', {
        size: `${boardData.size}x${boardData.size}`,
        preplacedQueens: boardData.queens.length,
        totalColors: boardData.totalColors
    });

    // Send message to background script
    chrome.runtime.sendMessage({
        action: 'solvePuzzle',
        data: boardData
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('❌ LinkedIn Queens: Failed to communicate with background script:', chrome.runtime.lastError);
            return;
        }

        if (response && response.success) {
            console.log('✅ LinkedIn Queens: Puzzle solved successfully!');
            console.log('⚡ Performance:', {
                solvingTime: `${response.performance.solvingTime.toFixed(2)}ms`,
                iterations: response.performance.iterations,
                queensPlaced: response.performance.queensPlaced,
                newQueens: response.performance.newQueens
            });
            
            if (response.solution) {
                displaySolution(response.solution, boardData);
            }
        } else {
            console.error('❌ LinkedIn Queens: Solver failed:', response?.error || 'Unknown error');
            if (response?.performance) {
                console.log('⚡ Failed attempt performance:', {
                    solvingTime: `${response.performance.solvingTime.toFixed(2)}ms`,
                    iterations: response.performance.iterations
                });
            }
        }
    });
}

/**
 * Displays the solution in the console with a visual representation
 * @param {Array} solution - Array of queen positions [{row, col}]
 * @param {Object} boardData - Original board data for reference
 */
function displaySolution(solution, boardData) {
    if (!solution || !Array.isArray(solution)) {
        console.error('❌ LinkedIn Queens: Invalid solution format');
        return;
    }

    console.log('');
    console.log('🔷 ═══════════════════════════════════════');
    console.log('🏆    LINKEDIN QUEENS SOLUTION FOUND    🏆');
    console.log('🔷 ═══════════════════════════════════════');
    console.log(`📊 Board Size: ${boardData.size}x${boardData.size}`);
    console.log(`👑 Total Queens: ${solution.length}`);
    console.log(`🔄 Pre-placed: ${boardData.queens.length}`);
    console.log(`⭐ New Queens: ${solution.length - boardData.queens.length}`);
    console.log('');
    
    // Create visual board representation
    const visualBoard = Array(boardData.size).fill(null).map(() => Array(boardData.size).fill('·'));
    
    // Mark existing queens with 'Q' 
    boardData.queens.forEach(queen => {
        visualBoard[queen.row][queen.col] = 'Q';
    });
    
    // Mark solution queens with '★' (new ones only)
    solution.forEach(queen => {
        if (boardData.board[queen.row][queen.col] !== CELL_STATES.QUEEN) {
            visualBoard[queen.row][queen.col] = '★';
        }
    });

    // Print the visual board with better formatting
    console.log('🎯 VISUAL SOLUTION:');
    console.log('   Q = Existing Queens  |  ★ = New Queens  |  · = Empty');
    console.log('');
    
    const colHeaders = '   ' + Array.from({length: boardData.size}, (_, i) => (i + 1).toString().padStart(2)).join('');
    console.log(colHeaders);
    console.log('  ' + '─'.repeat(boardData.size * 2 + 1));
    
    visualBoard.forEach((row, i) => {
        const rowNum = (i + 1).toString().padStart(2, ' ');
        const rowDisplay = row.map(cell => cell.padStart(2)).join('');
        console.log(`${rowNum}│${rowDisplay}`);
    });
    console.log('');

    // List all queen positions with detailed information
    console.log('📍 DETAILED QUEEN POSITIONS:');
    console.log('   Row | Col | Color           | Status');
    console.log('   ────┼─────┼─────────────────┼──────────');
    
    solution.forEach((queen, index) => {
        const color = boardData.colors[queen.row][queen.col] || 'Unknown';
        const isExisting = boardData.queens.some(q => q.row === queen.row && q.col === queen.col);
        const status = isExisting ? 'Existing' : 'NEW ⭐';
        const marker = isExisting ? 'Q' : '★';
        
        console.log(`   ${(queen.row + 1).toString().padStart(3)} │ ${(queen.col + 1).toString().padStart(3)} │ ${color.padEnd(15)} │ ${status} ${marker}`);
    });
    
    console.log('');
    console.log('🔷 ═══════════════════════════════════════');
    console.log('🎉 SOLUTION COMPLETE - PUZZLE SOLVED! 🎉');
    console.log('🔷 ═══════════════════════════════════════');
    console.log('');
    
    // Apply permanent highlighting to the actual LinkedIn game board
    try {
        highlightSolutionOnPage(solution, boardData);
        console.log('🎯 Check the game board above - golden highlights show where to place queens!');
    } catch (error) {
        console.error('❌ Failed to highlight solution on page:', error);
        console.log('💡 Tip: You can still use the console solution above to solve manually');
    }
}

/**
 * Attempts to highlight the solution visually on the LinkedIn page
 * @param {Array} solution - Array of queen positions
 * @param {Object} boardData - Original board data
 */
function highlightSolutionOnPage(solution, boardData) {
    const gameBoard = document.querySelector('#queens-grid');
    if (!gameBoard) return;
    
    console.log('🎨 LinkedIn Queens: Applying subtle border highlighting to game board...');
    
    // Add subtle visual indicators for all queen positions
    solution.forEach(queen => {
        const cellIdx = queen.row * boardData.size + queen.col;
        const cell = gameBoard.querySelector(`[data-cell-idx="${cellIdx}"]`);
        if (cell) {
            const isExisting = boardData.queens.some(q => q.row === queen.row && q.col === queen.col);
            
            if (isExisting) {
                // Subtle blue border for existing queens (already placed)
                cell.style.border = '3px solid #4A90E2';
                cell.style.borderRadius = '4px';
            } else {
                // Subtle golden border for new queen positions (where to place)
                cell.style.border = '3px solid #FFD700';
                cell.style.borderRadius = '4px';
                
                // Add a subtle queen icon marker for new positions
                const marker = document.createElement('div');
                marker.style.cssText = `
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    width: 16px;
                    height: 16px;
                    background: #FFD700;
                    border-radius: 50%;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #333;
                    font-weight: bold;
                    z-index: 1000;
                    pointer-events: none;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                `;
                marker.textContent = '♕';
                
                // Ensure cell has relative positioning for absolute marker
                if (getComputedStyle(cell).position === 'static') {
                    cell.style.position = 'relative';
                }
                cell.appendChild(marker);
            }
            
            // Smooth transition for visual feedback
            cell.style.transition = 'border 0.3s ease-in-out';
        }
    });
    
    // Add a success message to the page
    addSolutionMessage(solution.length, boardData.queens.length);
    
    console.log('✨ LinkedIn Queens: Subtle border highlighting applied!');
    console.log(`🎯 Golden borders with crown icons show ${solution.length - boardData.queens.length} positions where you need to place queens`);
}

/**
 * Adds a success message to the LinkedIn page
 * @param {number} totalQueens - Total queens in solution
 * @param {number} existingQueens - Number of existing queens
 */
function addSolutionMessage(totalQueens, existingQueens) {
    // Remove any existing message
    const existingMessage = document.getElementById('queens-solver-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const newQueens = totalQueens - existingQueens;
    const gameContainer = document.querySelector('#queens-grid')?.parentElement;
    if (!gameContainer) return;
    
    const message = document.createElement('div');
    message.id = 'queens-solver-message';
    message.style.cssText = `
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #333;
        padding: 12px 20px;
        border-radius: 8px;
        margin: 15px 0;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        border: 2px solid #FFD700;
        animation: fadeIn 0.5s ease-in-out;
    `;
    
    message.innerHTML = `
        🏆 <strong>Solution Found!</strong> 
        Place ${newQueens} queens in the golden-highlighted positions to solve the puzzle.
        ${existingQueens > 0 ? `<br>Blue highlights show ${existingQueens} existing queens.` : ''}
    `;
    
    // Add CSS animation
    if (!document.getElementById('queens-solver-styles')) {
        const style = document.createElement('style');
        style.id = 'queens-solver-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    gameContainer.insertBefore(message, gameContainer.firstChild);
}

/**
 * Waits for the game board to be fully loaded and ready
 * @param {number} maxAttempts - Maximum number of attempts to find the board
 * @param {number} delay - Delay between attempts in milliseconds
 * @returns {Promise<boolean>} True if board is found, false if timeout
 */
function waitForGameBoard(maxAttempts = 50, delay = 100) {
    return new Promise((resolve) => {
        let attempts = 0;
        
        const checkForBoard = () => {
            attempts++;
            const gameBoard = document.querySelector('#queens-grid');
            
            if (gameBoard) {
                // Also check if the board has cells loaded
                const cells = gameBoard.querySelectorAll('[data-cell-idx]');
                if (cells.length > 0) {
                    console.log(`✅ LinkedIn Queens: Game board found with ${cells.length} cells after ${attempts} attempts`);
                    resolve(true);
                    return;
                }
            }
            
            if (attempts >= maxAttempts) {
                console.warn(`⏰ LinkedIn Queens: Timeout waiting for game board after ${attempts} attempts (${attempts * delay / 1000}s)`);
                resolve(false);
                return;
            }
            
            if (attempts % 10 === 0) {
                console.log(`🔍 LinkedIn Queens: Still looking for game board... (attempt ${attempts}/${maxAttempts})`);
            }
            
            setTimeout(checkForBoard, delay);
        };
        
        checkForBoard();
    });
}

/**
 * Main initialization function - automatically executes when DOM is ready
 */
async function initializeQueensSolver() {
    console.log('🏰 LinkedIn Queens Solver: Content script loaded and initializing...');
    
    // Check if we're on a LinkedIn Queens page
    if (!window.location.href.includes('linkedin.com/games/queens')) {
        console.log('LinkedIn Queens: Not on Queens game page, script inactive');
        return;
    }
    
    console.log('🎯 LinkedIn Queens: Detected Queens game page, starting automatic solver...');
    
    // First, try immediate detection (board might already be ready)
    const gameBoard = document.querySelector('#queens-grid');
    const cells = gameBoard?.querySelectorAll('[data-cell-idx]');
    
    if (gameBoard && cells && cells.length > 0) {
        console.log('✅ LinkedIn Queens: Game board already ready, proceeding immediately...');
        await processPuzzle();
        return;
    }
    
    console.log('⏳ LinkedIn Queens: Waiting for game board to load...');
    // Wait for the game board to load
    const boardFound = await waitForGameBoard();
    
    if (!boardFound) {
        console.error('❌ LinkedIn Queens: Could not find game board after waiting, aborting');
        return;
    }
    
    console.log('✅ LinkedIn Queens: Game board detected, processing puzzle...');
    await processPuzzle();
}

/**
 * Processes the puzzle once the board is ready
 */
async function processPuzzle() {
    console.log('📊 LinkedIn Queens: Extracting puzzle data...');
    
    // Extract board data
    const boardData = extractBoardState();
    if (!boardData) {
        console.error('❌ LinkedIn Queens: Failed to extract board data');
        return;
    }
    
    console.log('� LinkedIn Queens: Sending to solver...');
    
    // Send to solver immediately
    sendToSolver(boardData);
}

// Execute immediately when DOM is ready - no waiting for user interaction
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeQueensSolver);
} else {
    // DOM is already ready, execute immediately
    initializeQueensSolver();
}

// Handle SPA navigation - automatically re-execute when navigating to Queens pages
let currentUrl = window.location.href;
let navigationTimeout = null;

const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
        const oldUrl = currentUrl;
        currentUrl = window.location.href;
        
        console.log(`🔄 LinkedIn Queens: URL changed from ${oldUrl} to ${currentUrl}`);
        
        if (currentUrl.includes('linkedin.com/games/queens')) {
            console.log('🎯 LinkedIn Queens: Navigation detected to Queens page, auto-initializing...');
            
            // Clear any existing timeout to avoid multiple executions
            if (navigationTimeout) {
                clearTimeout(navigationTimeout);
            }
            
            // Use a shorter delay for SPA navigation, but also try immediate execution
            navigationTimeout = setTimeout(() => {
                initializeQueensSolver();
            }, 300);
            
            // Also try immediate execution in case content is already ready
            setTimeout(() => {
                initializeQueensSolver();
            }, 50);
        }
    }
});

observer.observe(document, { 
    childList: true, 
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
});

// Additional listener for pushstate/popstate events (SPA navigation)
window.addEventListener('popstate', () => {
    console.log('🔄 LinkedIn Queens: Popstate event detected');
    if (window.location.href.includes('linkedin.com/games/queens')) {
        setTimeout(initializeQueensSolver, 200);
    }
});

// Listen for pushstate events (when LinkedIn changes URL programmatically)
const originalPushState = history.pushState;
history.pushState = function(...args) {
    originalPushState.apply(history, args);
    console.log('🔄 LinkedIn Queens: PushState event detected');
    setTimeout(() => {
        if (window.location.href.includes('linkedin.com/games/queens')) {
            initializeQueensSolver();
        }
    }, 200);
};