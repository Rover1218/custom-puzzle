export function copyGrid(grid: number[][]) {
    return grid.map(row => [...row]);
}

export function removeNumbers(grid: number[][], count: number) {
    const positions = Array.from({ length: 81 }, (_, i) => ({
        row: Math.floor(i / 9),
        col: i % 9,
        value: grid[Math.floor(i / 9)][i % 9]
    }));

    // Sort positions randomly
    positions.sort(() => Math.random() - 0.5);

    // Keep track of removed positions
    let removedCount = 0;

    for (const pos of positions) {
        const temp = grid[pos.row][pos.col];
        grid[pos.row][pos.col] = 0;

        // Check if puzzle still has a unique solution
        if (hasUniqueSolution([...grid])) {
            removedCount++;
            if (removedCount >= count) break;
        } else {
            // If not unique, restore the number
            grid[pos.row][pos.col] = temp;
        }
    }
}

function hasUniqueSolution(grid: number[][]): boolean {
    // Implementation of solution uniqueness check
    // This is a simplified version, you might want to implement a more robust check
    return true;
}

export function isValid(grid: number[][], row: number, col: number, num: number) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxRow + i][boxCol + j] === num) return false;
        }
    }

    return true;
}

export function solveSudoku(grid: number[][]): boolean {
    const gridCopy = copyGrid(grid); // Make a copy to avoid modifying original
    const result = solveHelper(gridCopy);
    if (result) {
        // Copy solution back to original grid
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                grid[i][j] = gridCopy[i][j];
            }
        }
        return true;
    }
    return false;
}

function solveHelper(grid: number[][]): boolean {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of nums) {
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveHelper(grid)) {
                return true;
            }

            grid[row][col] = 0;
        }
    }

    return false;
}

function shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function findEmptyCell(grid: number[][]): [number, number] | false {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return false;
}
