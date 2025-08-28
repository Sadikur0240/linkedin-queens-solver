// Background script for LinkedIn Queens Solver Chrome Extension
// Implements the official LinkedIn Queens game rules:
//
// OFFICIAL LINKEDIN QUEENS RULES:
// 1. Each row must contain exactly one queen
// 2. Each column must contain exactly one queen  
// 3. Each color region must contain exactly one queen
// 4. Two queens cannot touch each other, not even diagonally
//
// This algorithm uses backtracking with constraint checking to solve puzzles
// following these exact rules - nothing more, nothing less.

/**
 * LinkedIn Queens solver implementing official game rules
 * @param {Object} boardData - Board data from content script
 * @returns {Object} Solution result with queens positions or error
 */
function solveLinkedInQueens(boardData) {
    const startTime = performance.now();
    let iterations = 0;
    
    try {
        // Validate input data
        if (!boardData || typeof boardData !== 'object') {
            throw new Error('Invalid board data');
        }
        
        const { size, rows, cols: boardCols, board, queens: preplacedQueens } = boardData;
        
        // Validate board dimensions
        if (!size || size !== rows || size !== boardCols) {
            throw new Error(`Invalid board dimensions: ${size}x${rows}x${boardCols}`);
        }
        
        if (!board || !Array.isArray(board) || board.length !== size) {
            throw new Error('Invalid board array');
        }
        
        console.log(`🏰 LinkedIn Queens Solver: Starting ${size}x${size} puzzle`);
        console.log(`Pre-placed queens: ${preplacedQueens ? preplacedQueens.length : 0}`);
        
        // Auxiliary data structures for LinkedIn Queens constraints
        const cols = new Set();           // Occupied columns (Rule 2)
        const usedColors = new Set();     // Used colors (Rule 3)
        const solution = [];              // Final queen positions
        
        // Add pre-placed queens to auxiliary sets
        if (preplacedQueens && Array.isArray(preplacedQueens)) {
            preplacedQueens.forEach(queen => {
                const { row, col, color } = queen;
                cols.add(col);              // Track column usage
                if (color) {
                    usedColors.add(color);  // Track color usage
                }
                solution.push({ row, col, color, preplaced: true });
            });
        }
        
        /**
         * Check if two queens touch each other (including diagonally adjacent)
         * @param {number} row1 - First queen row
         * @param {number} col1 - First queen column
         * @param {number} row2 - Second queen row
         * @param {number} col2 - Second queen column
         * @returns {boolean} True if queens touch each other
         */
        function queensTouch(row1, col1, row2, col2) {
            const rowDiff = Math.abs(row1 - row2);
            const colDiff = Math.abs(col1 - col2);
            // Queens touch if they are adjacent (including diagonally)
            return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
        }
        
        /**
         * Check if placing a queen at (row, col) follows all LinkedIn Queens rules
         * @param {number} row - Row position
         * @param {number} col - Column position  
         * @param {string} color - Color of the cell
         * @returns {boolean} True if safe to place queen
         */
        function isSafe(row, col, color) {
            // Rule 1: Each column must contain exactly one queen
            if (cols.has(col)) {
                return false;
            }
            
            // Rule 2: Each color region must contain exactly one queen
            if (usedColors.has(color)) {
                return false;
            }
            
            // Rule 3: Two queens cannot touch each other, not even diagonally
            for (const queen of solution) {
                if (queensTouch(row, col, queen.row, queen.col)) {
                    return false;
                }
            }
            
            return true;
        }
        
        /**
         * Place a queen at (row, col) and update auxiliary sets
         * @param {number} row - Row position
         * @param {number} col - Column position
         * @param {string} color - Color of the cell
         */
        function placeQueen(row, col, color) {
            cols.add(col);              // Track column usage
            usedColors.add(color);      // Track color usage
            solution.push({ row, col, color, preplaced: false });
        }
        
        /**
         * Remove a queen from (row, col) and update auxiliary sets
         * @param {number} row - Row position  
         * @param {number} col - Column position
         * @param {string} color - Color of the cell
         */
        function removeQueen(row, col, color) {
            cols.delete(col);           // Remove column usage
            usedColors.delete(color);   // Remove color usage
            solution.pop();
        }
        
        /**
         * Check if there's already a queen (pre-placed) at this position
         * @param {number} row - Row position
         * @param {number} col - Column position
         * @returns {boolean} True if position has pre-placed queen
         */
        function hasPreplacedQueen(row, col) {
            return preplacedQueens && preplacedQueens.some(q => q.row === row && q.col === col);
        }
        
        /**
         * Recursive backtracking function to solve N-Queens
         * @param {number} row - Current row being processed
         * @returns {boolean} True if solution found
         */
        function solveNQueens(row) {
            iterations++;
            
            // Base case: all queens placed successfully
            if (row >= size) {
                return true;
            }
            
            // Skip rows that already have pre-placed queens
            if (preplacedQueens && preplacedQueens.some(q => q.row === row)) {
                return solveNQueens(row + 1);
            }
            
            // Try placing a queen in each column of current row
            for (let col = 0; col < size; col++) {
                // Skip if position has pre-placed queen
                if (hasPreplacedQueen(row, col)) {
                    continue;
                }
                
                // Skip if position is blocked by crosses
                if (board[row] && board[row][col] === 'cross') {
                    continue;
                }
                
                // Get the color of this cell (required for LinkedIn Queens)
                const cellColor = boardData.colors && boardData.colors[row] && boardData.colors[row][col];
                if (!cellColor) {
                    console.warn(`LinkedIn Queens: No color found for cell (${row}, ${col})`);
                    continue;
                }
                
                // Check if it's safe to place queen here (including color constraint)
                if (isSafe(row, col, cellColor)) {
                    // Place the queen
                    placeQueen(row, col, cellColor);
                    
                    // Recursively solve for remaining rows
                    if (solveNQueens(row + 1)) {
                        return true;
                    }
                    
                    // Backtrack: remove the queen
                    removeQueen(row, col, cellColor);
                }
            }
            
            return false;
        }
        
        // Solve the puzzle
        const solvable = solveNQueens(0);
        const endTime = performance.now();
        const solvingTime = endTime - startTime;
        
        if (solvable) {
            const newQueens = solution.filter(q => !q.preplaced);
            const uniqueColors = new Set(solution.map(q => q.color)).size;
            
            console.log(`✅ LinkedIn Queens: Solution found!`);
            console.log(`⚡ Performance: ${solvingTime.toFixed(2)}ms, ${iterations} iterations`);
            console.log(`👑 Queens placed: ${solution.length} (${newQueens.length} new)`);
            console.log(`🎨 Colors used: ${uniqueColors}/${solution.length} (each queen in different color: ${uniqueColors === solution.length ? '✅' : '❌'})`);
            
            // Verify all LinkedIn Queens rules are satisfied
            console.log(`🔍 Rule verification:`);
            console.log(`  - Each row has exactly one queen: ✅ (by algorithm design)`);
            console.log(`  - Each column has exactly one queen: ✅`);  
            console.log(`  - Each color has exactly one queen: ${uniqueColors === solution.length ? '✅' : '❌'}`);
            console.log(`  - No queens touch diagonally: ✅ (verified during placement)`);
            
            return {
                success: true,
                solution: solution.map(q => ({ row: q.row, col: q.col })), // Clean format for content script
                performance: {
                    solvingTime: solvingTime,
                    iterations: iterations,
                    queensPlaced: solution.length,
                    newQueens: solution.filter(q => !q.preplaced).length
                },
                boardData: {
                    size: size,
                    preplacedQueens: preplacedQueens ? preplacedQueens.length : 0
                }
            };
        } else {
            console.log(`❌ LinkedIn Queens: No solution exists for this configuration`);
            return {
                success: false,
                error: 'No solution exists for the given board configuration',
                performance: {
                    solvingTime: solvingTime,
                    iterations: iterations
                }
            };
        }
        
    } catch (error) {
        const endTime = performance.now();
        const solvingTime = endTime - startTime;
        
        console.error('LinkedIn Queens: Solver error:', error.message);
        return {
            success: false,
            error: error.message,
            performance: {
                solvingTime: solvingTime,
                iterations: iterations
            }
        };
    }
}

/**
 * Validates board data received from content script
 * @param {Object} data - Board data to validate
 * @returns {boolean} True if data is valid
 */
function validateBoardData(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }
    
    const { size, rows, cols, board } = data;
    
    // Check required properties
    if (!size || !rows || !cols || !board) {
        return false;
    }
    
    // Check dimensions consistency
    if (size !== rows || size !== cols) {
        return false;
    }
    
    // Check board array structure
    if (!Array.isArray(board) || board.length !== size) {
        return false;
    }
    
    // Check each row
    for (let i = 0; i < size; i++) {
        if (!Array.isArray(board[i]) || board[i].length !== size) {
            return false;
        }
    }
    
    return true;
}

// Message listener for communication with content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('LinkedIn Queens Background: Message received:', request.action);
    
    if (request.action === 'solvePuzzle') {
        // Validate sender is from a LinkedIn Queens page
        if (!sender.tab || !sender.tab.url.includes('linkedin.com/games/queens')) {
            console.warn('LinkedIn Queens: Rejecting request from non-LinkedIn source:', sender.tab?.url);
            sendResponse({
                success: false,
                error: 'Request must come from LinkedIn Queens page'
            });
            return;
        }
        
        // Validate board data
        if (!validateBoardData(request.data)) {
            console.error('LinkedIn Queens: Invalid board data received');
            sendResponse({
                success: false,
                error: 'Invalid board data format'
            });
            return;
        }
        
        console.log('LinkedIn Queens Background: Solving puzzle...', {
            size: `${request.data.size}x${request.data.size}`,
            preplacedQueens: request.data.queens?.length || 0,
            url: sender.tab.url
        });
        
        // Solve the puzzle
        const result = solveLinkedInQueens(request.data);
        
        // Send response back to content script
        sendResponse(result);
        
        // Log result summary
        if (result.success) {
            console.log(`LinkedIn Queens Background: ✅ Solved in ${result.performance.solvingTime.toFixed(2)}ms`);
        } else {
            console.log(`LinkedIn Queens Background: ❌ Failed: ${result.error}`);
        }
    } else {
        console.warn('LinkedIn Queens Background: Unknown action:', request.action);
        sendResponse({
            success: false,
            error: 'Unknown action'
        });
    }
    
    // Return true to indicate we will send a response asynchronously
    return true;
});

// Extension installation/startup logging
chrome.runtime.onInstalled.addListener((details) => {
    console.log('LinkedIn Queens Solver: Extension installed/updated', details.reason);
});

chrome.runtime.onStartup.addListener(() => {
    console.log('LinkedIn Queens Solver: Extension started');
});

console.log('LinkedIn Queens Solver: Background script loaded and ready');
