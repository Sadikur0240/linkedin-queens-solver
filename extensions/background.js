// Background script for LinkedIn Queens Solver Chrome Extension
// Contains optimized N-Queens algorithm with O(1) conflict checking

/**
 * Optimized N-Queens solver using auxiliary data structures for O(1) conflict checking
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
        
        // Auxiliary data structures for O(1) conflict checking
        const cols = new Set();           // Occupied columns
        const diag1 = new Set();          // row - col diagonals (↗)  
        const diag2 = new Set();          // row + col diagonals (↖)
        const solution = [];              // Final queen positions
        
        // Add pre-placed queens to auxiliary sets
        if (preplacedQueens && Array.isArray(preplacedQueens)) {
            preplacedQueens.forEach(queen => {
                const { row, col } = queen;
                cols.add(col);
                diag1.add(row - col);
                diag2.add(row + col);
                solution.push({ row, col, preplaced: true });
            });
        }
        
        /**
         * Check if placing a queen at (row, col) is safe using O(1) auxiliary sets
         * @param {number} row - Row position
         * @param {number} col - Column position  
         * @returns {boolean} True if safe to place queen
         */
        function isSafe(row, col) {
            return !cols.has(col) && 
                   !diag1.has(row - col) && 
                   !diag2.has(row + col);
        }
        
        /**
         * Place a queen at (row, col) and update auxiliary sets
         * @param {number} row - Row position
         * @param {number} col - Column position
         */
        function placeQueen(row, col) {
            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);
            solution.push({ row, col, preplaced: false });
        }
        
        /**
         * Remove a queen from (row, col) and update auxiliary sets
         * @param {number} row - Row position  
         * @param {number} col - Column position
         */
        function removeQueen(row, col) {
            cols.delete(col);
            diag1.delete(row - col);
            diag2.delete(row + col);
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
                
                // Check if it's safe to place queen here
                if (isSafe(row, col)) {
                    // Place the queen
                    placeQueen(row, col);
                    
                    // Recursively solve for remaining rows
                    if (solveNQueens(row + 1)) {
                        return true;
                    }
                    
                    // Backtrack: remove the queen
                    removeQueen(row, col);
                }
            }
            
            return false;
        }
        
        // Solve the puzzle
        const solvable = solveNQueens(0);
        const endTime = performance.now();
        const solvingTime = endTime - startTime;
        
        if (solvable) {
            console.log(`✅ LinkedIn Queens: Solution found!`);
            console.log(`⚡ Performance: ${solvingTime.toFixed(2)}ms, ${iterations} iterations`);
            console.log(`👑 Queens placed: ${solution.length} (${solution.filter(q => !q.preplaced).length} new)`);
            
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
