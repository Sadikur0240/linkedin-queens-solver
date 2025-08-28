const linkedInBoard = [
    // Row 1: 9 purple
    [
        { color: 1, state: 'empty' }, { color: 1, state: 'empty' }, { color: 1, state: 'empty' },
        { color: 1, state: 'empty' }, { color: 1, state: 'empty' }, { color: 1, state: 'empty' },
        { color: 1, state: 'empty' }, { color: 1, state: 'empty' }, { color: 1, state: 'empty' }
    ],
    // Row 2: 4 purple, 1 pink, 4 purple
    [
        { color: 1, state: 'empty' }, { color: 1, state: 'empty' }, { color: 1, state: 'empty' },
        { color: 1, state: 'empty' }, { color: 2, state: 'empty' }, { color: 1, state: 'empty' },
        { color: 1, state: 'empty' }, { color: 1, state: 'empty' }, { color: 1, state: 'empty' }
    ],
    // Row 3: 2 purple, 2 blue, 2 green, 3 purple
    [
        { color: 1, state: 'empty' }, { color: 1, state: 'empty' }, { color: 3, state: 'empty' },
        { color: 3, state: 'empty' }, { color: 4, state: 'empty' }, { color: 4, state: 'empty' },
        { color: 1, state: 'empty' }, { color: 1, state: 'empty' }, { color: 1, state: 'empty' }
    ],
    // Row 4: 1 purple, 2 blue, 2 grey, 2 green, 2 purple
    [
        { color: 1, state: 'empty' }, { color: 3, state: 'empty' }, { color: 3, state: 'empty' },
        { color: 5, state: 'empty' }, { color: 5, state: 'empty' }, { color: 4, state: 'empty' },
        { color: 4, state: 'empty' }, { color: 1, state: 'empty' }, { color: 1, state: 'empty' }
    ],
    // Row 5: 2 blue, 2 grey, 1 red, 1 yellow, 2 green, 1 purple
    [
        { color: 3, state: 'empty' }, { color: 3, state: 'empty' }, { color: 5, state: 'empty' },
        { color: 5, state: 'empty' }, { color: 6, state: 'empty' }, { color: 7, state: 'empty' },
        { color: 4, state: 'empty' }, { color: 4, state: 'empty' }, { color: 1, state: 'empty' }
    ],
    // Row 6: 1 blue, 3 grey, 1 red, 1 yellow, 3 green
    [
        { color: 3, state: 'empty' }, { color: 5, state: 'empty' }, { color: 5, state: 'empty' },
        { color: 5, state: 'empty' }, { color: 6, state: 'empty' }, { color: 7, state: 'empty' },
        { color: 4, state: 'empty' }, { color: 4, state: 'empty' }, { color: 4, state: 'empty' }
    ],
    // Row 7: 1 brown, 3 grey, 1 red, 4 yellow
    [
        { color: 8, state: 'empty' }, { color: 5, state: 'empty' }, { color: 5, state: 'empty' },
        { color: 5, state: 'empty' }, { color: 6, state: 'empty' }, { color: 7, state: 'empty' },
        { color: 7, state: 'empty' }, { color: 7, state: 'empty' }, { color: 7, state: 'empty' }
    ],
    // Row 8: 3 brown, 3 red, 2 orange, 1 yellow
    [
        { color: 8, state: 'empty' }, { color: 8, state: 'empty' }, { color: 8, state: 'empty' },
        { color: 6, state: 'empty' }, { color: 6, state: 'empty' }, { color: 6, state: 'empty' },
        { color: 9, state: 'empty' }, { color: 9, state: 'empty' }, { color: 7, state: 'empty' }
    ],
    // Row 9: 1 brown, 6 red, 2 orange
    [
        { color: 8, state: 'empty' }, { color: 6, state: 'empty' }, { color: 6, state: 'empty' },
        { color: 6, state: 'empty' }, { color: 6, state: 'empty' }, { color: 6, state: 'empty' },
        { color: 6, state: 'empty' }, { color: 9, state: 'empty' }, { color: 9, state: 'empty' }
    ]
];

/**
 * Solves the LinkedIn Queens puzzle using a modified backtracking algorithm.
 * @param {object} board A 2D array of cell objects, e.g., [{color: 1, state: 'empty'}].
 * @returns {object|null} An array of queen coordinates {row, col} if a solution is found, otherwise null.
 */
function solveLinkedInQueens(board) {
    const n = board.length;
    const solution = [];
    let iterationCount = 0; // Counter for performance analysis
    
    // Auxiliary data structures for O(1) conflict checking
    const occupiedRows = new Set();
    const occupiedCols = new Set();
    const occupiedColors = new Set();

    /**
     * The main recursive backtracking function.
     * @param {number} row The current row to place a queen in.
     * @returns {boolean} True if a solution is found from this state, false otherwise.
     */
    function backtrack(row) {
        iterationCount++; // Increment counter on each backtrack call
        // Base case: If we have successfully placed a queen in every row, a solution is found.
        if (row === n) {
            return true;
        }

        // Iterate through each column in the current row.
        for (let col = 0; col < n; col++) {
            // Check if it's safe to place a queen at board[row][col].
            if (isSafe(board, row, col, n)) {
                // Place the queen.
                board[row][col].state = 'queen';
                solution.push({ row, col });
                
                // Update auxiliary data structures
                occupiedRows.add(row);
                occupiedCols.add(col);
                occupiedColors.add(board[row][col].color);

                // Recur to place a queen in the next row.
                if (backtrack(row + 1)) {
                    return true; // Solution found, propagate success up the call stack.
                }

                // Backtrack: If the recursive call failed, remove the queen and try the next column.
                board[row][col].state = 'empty';
                solution.pop();
                
                // Update auxiliary data structures
                occupiedRows.delete(row);
                occupiedCols.delete(col);
                occupiedColors.delete(board[row][col].color);
            }
        }

        // If no column in the current row leads to a solution, return false.
        return false;
    }

    /**
     * Optimized function to check if it's safe to place a queen at a given position.
     * Uses auxiliary data structures for O(1) conflict checking.
     * @param {object} board The current board state.
     * @param {number} row The row to check.
     * @param {number} col The column to check.
     * @param {number} n The size of the board.
     * @returns {boolean} True if the position is safe, false otherwise.
     */
    function isSafe(board, row, col, n) {
        const targetColor = board[row][col].color;

        // 1. O(1) check for queen in the same row or column using Sets
        if (occupiedRows.has(row) || occupiedCols.has(col)) {
            return false;
        }
        
        // 2. O(1) check for queen in the same colored region using Set
        if (occupiedColors.has(targetColor)) {
            return false;
        }

        // 3. Check for adjacent queens (8-directional proximity check) - still O(1) since it's fixed 8 positions
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
        ];

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
                if (board[newRow][newCol].state === 'queen') {
                    return false;
                }
            }
        }

        // The position is safe.
        return true;
    }

    // Start the backtracking process from the first row (row = 0).
    if (backtrack(0)) {
        return { solution, iterationCount };
    } else {
        return { solution: null, iterationCount }; // Return iteration count even if no solution found
    }
}

// Test the LinkedIn Queens solver and display results in console
function testLinkedInQueensSolver() {
    console.log('=== LinkedIn Queens Solver ===');
    console.log('Board size: 7x7');
    
    // Create a deep copy of the board for solving
    const boardCopy = linkedInBoard.map(row => 
        row.map(cell => ({ ...cell }))
    );
    
    console.log('\nSolving LinkedIn Queens puzzle...');
    const startTime = performance.now();
    const result = solveLinkedInQueens(boardCopy);
    const endTime = performance.now();
    
    const executionTime = (endTime - startTime).toFixed(2);
    console.log(`\nExecution completed in ${executionTime} ms`);
    console.log(`Total iterations (backtrack calls): ${result.iterationCount}`);
    console.log(`Average time per iteration: ${(parseFloat(executionTime) / result.iterationCount).toFixed(4)} ms`);
    
    if (result.solution) {
        console.log(`\n✅ Solution found!`);
        console.log(`Number of queens placed: ${result.solution.length}`);
        
        console.log('\nQueen positions:');
        result.solution.forEach((queen, index) => {
            const colorName = getColorName(boardCopy[queen.row][queen.col].color);
            console.log(`Queen ${index + 1}: Row ${queen.row + 1}, Column ${queen.col + 1} (${colorName})`);
        });
        
        console.log('\nBoard visualization:');
        console.log('Legend: Q = Queen, . = Empty');
        for (let row = 0; row < boardCopy.length; row++) {
            let rowString = '';
            for (let col = 0; col < boardCopy[row].length; col++) {
                if (boardCopy[row][col].state === 'queen') {
                    rowString += 'Q ';
                } else {
                    rowString += '. ';
                }
            }
            console.log(`Row ${row + 1}: ${rowString}`);
        }
        
        console.log('\nColor-coded board visualization:');
        for (let row = 0; row < linkedInBoard.length; row++) {
            let rowString = '';
            for (let col = 0; col < linkedInBoard[row].length; col++) {
                const colorName = getColorName(linkedInBoard[row][col].color);
                const isQueen = boardCopy[row][col].state === 'queen';
                rowString += `${colorName.charAt(0).toUpperCase()}${isQueen ? 'Q' : '.'} `;
            }
            console.log(`Row ${row + 1}: ${rowString}`);
        }
        
    } else {
        console.log(`\n❌ No solution found.`);
        console.log('The LinkedIn Queens puzzle may not have a valid solution with the current constraints.');
    }
}

// Helper function to get color names
function getColorName(colorNumber) {
    const colorMap = {
        1: 'purple',
        2: 'grey',
        3: 'green',
        4: 'yellow',
        5: 'blue',
        6: 'red',
        7: 'orange'
    };
    return colorMap[colorNumber] || 'unknown';
}

// Run the LinkedIn Queens solver test
testLinkedInQueensSolver();