// src/components/PuzzleGenerator.tsx
import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"
import { copyGrid, removeNumbers, isValid } from '../utils/puzzleUtils';
import { CrosswordCell } from '../types/puzzleTypes';

interface PuzzleGeneratorProps {
    puzzleType: string;
    onPuzzleGenerated: (data: any) => void;
    onDifficultyChange?: () => void;  // Add new prop
}

const PuzzleGenerator: React.FC<PuzzleGeneratorProps> = ({
    puzzleType,
    onPuzzleGenerated,
    onDifficultyChange
}) => {
    const [size, setSize] = useState<number>(3); // Changed back to 3
    const [difficulty, setDifficulty] = useState<string>('medium');
    const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);

    const generateSudoku = (difficulty: string, existingSolution?: number[][]) => {
        const solution = existingSolution || generateValidSudoku();
        const puzzleGrid = copyGrid(solution);

        const difficultyMap = {
            easy: 30,
            medium: 45,
            hard: 55
        } as const;

        const cellsToRemove = difficultyMap[difficulty as keyof typeof difficultyMap] || 30;
        removeNumbers(puzzleGrid, cellsToRemove);

        return {
            type: 'sudoku',
            difficulty,
            grid: puzzleGrid,
            solution: solution,
            startTime: Date.now()
        };
    };

    // Helper functions for Sudoku generation
    function generateValidSudoku() {
        const grid = Array(9).fill(null).map(() => Array(9).fill(0));
        fillGrid(grid);
        return grid;
    }

    function fillGrid(grid: number[][]) {
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (fillGrid(grid)) return true;
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
        return true;
    }

    // After puzzle generation, maintain the same solution but update grid based on difficulty
    const handleDifficultyChange = (newDifficulty: string) => {
        if (puzzleType === 'sudoku') {
            let newPuzzle;
            if (currentPuzzle?.solution) {
                // Use existing solution when changing difficulty mid-game
                newPuzzle = generateSudoku(newDifficulty, currentPuzzle.solution);
            } else {
                newPuzzle = generateSudoku(newDifficulty);
            }
            setCurrentPuzzle(newPuzzle);
            onPuzzleGenerated(newPuzzle);
            onDifficultyChange?.();  // Call the callback when difficulty changes
        }
    };

    const generatePuzzle = async () => {
        let puzzleData;

        switch (puzzleType) {
            case 'sudoku':
                puzzleData = generateSudoku(difficulty);
                break;
            case 'word':
                puzzleData = generateWordSearch(size);
                break;
            case 'sliding':
                puzzleData = generateSlidingPuzzle();
                break;
        }

        onPuzzleGenerated(puzzleData);
    };

    return (
        <div className="puzzle-generator space-y-6">
            <div className="controls space-y-4">
                {puzzleType === 'word' && (
                    <div className="flex items-center gap-4">
                        <label htmlFor="size" className="text-white">Size: </label>
                        <input
                            type="number"
                            id="size"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            min="3"
                            max="10"
                            className="bg-white/20 text-white border-white/30 backdrop-blur-sm 
                                     focus:ring-2 focus:ring-purple-500 rounded px-3 py-2"
                        />
                    </div>
                )}

                {puzzleType === 'sudoku' && (
                    <div className="w-full max-w-xs">
                        <Select
                            value={difficulty}
                            onValueChange={(value) => {
                                setDifficulty(value);
                                handleDifficultyChange(value);
                            }}
                        >
                            <SelectTrigger className="w-full bg-white/20 text-white border-white/30
                                                    backdrop-blur-sm focus:ring-2 focus:ring-purple-500">
                                <SelectValue placeholder="Select Difficulty" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 text-white border-white/30">
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <button
                onClick={generatePuzzle}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 
                         hover:to-blue-600 text-white px-6 py-3 rounded-lg
                         transition-all duration-200 transform hover:scale-105
                         focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
                Generate {puzzleType.charAt(0).toUpperCase() + puzzleType.slice(1)}
            </button>
        </div>
    );
};

const generateWordSearch = (size: number) => {
    const words = [
        "REACT",
        "NEXT",
        "JAVASCRIPT",
        "TYPESCRIPT",
        "WEB"
    ].filter(word => word.length <= size);

    // Create empty grid
    const grid = Array(size).fill(null)
        .map(() => Array(size).fill(''));

    const directions = [
        [0, 1],   // right
        [1, 0],   // down
        [1, 1],   // diagonal
        [-1, 1],  // up-right
    ];

    // Place words
    for (const word of words) {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 100) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const [dx, dy] = direction;

            // Random starting position
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);

            // Check if word fits
            if (canPlaceWord(grid, word, row, col, dx, dy, size)) {
                placeWord(grid, word, row, col, dx, dy);
                placed = true;
            }
            attempts++;
        }
    }

    // Fill empty spaces with random letters
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    return {
        type: 'word',
        size,
        grid,
        words
    };
};

function canPlaceWord(grid: string[][], word: string, row: number, col: number, dx: number, dy: number, size: number): boolean {
    if (row + dx * (word.length - 1) >= size || row + dx * (word.length - 1) < 0) return false;
    if (col + dy * (word.length - 1) >= size || col + dy * (word.length - 1) < 0) return false;

    for (let i = 0; i < word.length; i++) {
        const currentRow = row + dx * i;
        const currentCol = col + dy * i;
        if (grid[currentRow][currentCol] !== '' && grid[currentRow][currentCol] !== word[i]) {
            return false;
        }
    }
    return true;
}

function placeWord(grid: string[][], word: string, row: number, col: number, dx: number, dy: number): void {
    for (let i = 0; i < word.length; i++) {
        grid[row + dx * i][col + dy * i] = word[i];
    }
}

const generateSlidingPuzzle = () => {
    const size = 3; // Fixed 3x3 size
    const tiles = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    tiles.push(0); // Add empty tile

    // Shuffle tiles to create a solvable puzzle
    let inversions;
    let currentTiles;
    do {
        currentTiles = [...tiles];
        for (let i = currentTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentTiles[i], currentTiles[j]] = [currentTiles[j], currentTiles[i]];
        }
        inversions = countInversions(currentTiles);
    } while (!isSolvable(inversions, size));

    return {
        type: 'sliding',
        size,
        tiles: currentTiles,
        solution: tiles
    };
};

function countInversions(tiles: number[]): number {
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] === 0) continue;
        for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[j] === 0) continue;
            if (tiles[i] > tiles[j]) inversions++;
        }
    }
    return inversions;
}

function isSolvable(inversions: number, size: number): boolean {
    // For 3x3 puzzles, the number of inversions must be even
    return inversions % 2 === 0;
}

export default PuzzleGenerator;
