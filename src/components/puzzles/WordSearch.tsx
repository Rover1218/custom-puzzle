import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { PuzzleProps } from './types';

interface WordSearchCell {
    letter: string;
    isSelected: boolean;
    isFound: boolean;
}

interface WordSearchProps extends PuzzleProps {
    data: {
        grid: string[][];
        words: string[];
        size: number;
    };
}

const WordSearch: React.FC<WordSearchProps> = ({ data, isPlaying, isSolved, onComplete, time }) => {
    const router = useRouter();
    const [grid, setGrid] = useState<WordSearchCell[][]>([]);
    const [words, setWords] = useState<string[]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [startCell, setStartCell] = useState<[number, number] | null>(null);
    const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [selectionLine, setSelectionLine] = useState<{ start: [number, number], end: [number, number] } | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (data?.grid) {
            const initialGrid = data.grid.map(row =>
                row.map(letter => ({
                    letter,
                    isSelected: false,
                    isFound: false
                }))
            );
            setGrid(initialGrid);
            setWords(data.words);
        }
    }, [data]);

    const handleMouseDown = (row: number, col: number) => {
        if (!isPlaying || isSolved) return;
        setIsDragging(true);
        setStartCell([row, col]);
        updateSelection([row, col]);
        updateSelectionLine([row, col], [row, col]);
    };

    const handleMouseMove = (e: React.MouseEvent, row: number, col: number) => {
        if (!isDragging || !isPlaying || isSolved || !startCell) return;

        const [startRow, startCol] = startCell;
        const rowDiff = row - startRow;
        const colDiff = col - startCol;

        // Only allow straight or diagonal lines
        if (Math.abs(rowDiff) === Math.abs(colDiff) || rowDiff === 0 || colDiff === 0) {
            updateSelection([row, col]);
            updateSelectionLine(startCell, [row, col]);
        }
    };

    const handleMouseUp = () => {
        if (!isDragging || !isPlaying || isSolved) return;
        setIsDragging(false);
        setSelectionLine(null);
        checkSelectedWord();
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setSelectionLine(null);
        clearSelection();
    };

    const updateSelection = (endCell: [number, number]) => {
        if (!startCell) return;
        const [startRow, startCol] = startCell;
        const [endRow, endCol] = endCell;

        // Calculate direction
        const rowDiff = endRow - startRow;
        const colDiff = endCol - startCol;

        // Only allow straight or diagonal lines
        if (Math.abs(rowDiff) === Math.abs(colDiff) || rowDiff === 0 || colDiff === 0) {
            const newSelected = getLineCells(startRow, startCol, endRow, endCol);
            setSelectedCells(newSelected);
        }
    };

    const clearSelection = () => {
        setSelectedCells([]);
        setStartCell(null);
    };

    const checkSelectedWord = () => {
        if (!startCell || !isPlaying || isSolved) return;

        const selectedWord = getWordFromCells(selectedCells);
        const reversedWord = selectedWord.split('').reverse().join('');
        let wordToAdd = '';

        // Check both forward and reversed word
        if (words.includes(selectedWord)) {
            wordToAdd = selectedWord;
        } else if (words.includes(reversedWord)) {
            wordToAdd = reversedWord;
        }

        if (wordToAdd && !foundWords.includes(wordToAdd)) {
            // Mark cells as found
            const newGrid = [...grid];
            selectedCells.forEach(([row, col]) => {
                newGrid[row][col].isFound = true;
            });
            setGrid(newGrid);

            // Update foundWords array
            const newFoundWords = [...foundWords, wordToAdd];
            setFoundWords(newFoundWords);

            // Check if all words are found
            if (newFoundWords.length === words.length) {
                handlePuzzleComplete(newFoundWords);
            }
        }

        // Reset selection
        const newGrid = grid.map(row => row.map(cell => ({ ...cell, isSelected: false })));
        setGrid(newGrid);
        setStartCell(null);
        setSelectedCells([]);
    };

    const getLineCells = (startRow: number, startCol: number, endRow: number, endCol: number): [number, number][] => {
        const cells: [number, number][] = [];
        const rowDiff = endRow - startRow;
        const colDiff = endCol - startCol;
        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
        const rowStep = rowDiff / (steps || 1);
        const colStep = colDiff / (steps || 1);

        for (let i = 0; i <= steps; i++) {
            const row = Math.round(startRow + rowStep * i);
            const col = Math.round(startCol + colStep * i);
            cells.push([row, col]);
        }

        return cells;
    };

    const getWordFromCells = (cells: [number, number][]): string => {
        return cells.map(([row, col]) => grid[row][col].letter).join('');
    };

    const calculateScore = (wordsFoundCount: number) => {
        // Base score based on words found percentage
        const wordsFoundPercentage = (wordsFoundCount / words.length) * 100;

        // Time bonus: max 20 points, decreases over time
        const timeBonus = Math.max(0, 20 - Math.floor(time / 60));

        // Calculate final score
        const finalScore = Math.round(wordsFoundPercentage + timeBonus);

        return Math.min(100, finalScore); // Cap at 100
    };

    const updateSelectionLine = (start: [number, number], end: [number, number]) => {
        setSelectionLine({ start, end });
    };

    const renderSelectionLine = () => {
        if (!selectionLine || !gridRef.current) return null;

        const cellSize = 40; // Match your grid cell size
        const startX = selectionLine.start[1] * cellSize + cellSize / 2;
        const startY = selectionLine.start[0] * cellSize + cellSize / 2;
        const endX = selectionLine.end[1] * cellSize + cellSize / 2;
        const endY = selectionLine.end[0] * cellSize + cellSize / 2;

        return (
            <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 10 }}
            >
                <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="rgba(59, 130, 246, 0.5)"
                    strokeWidth="30"
                    strokeLinecap="round"
                />
            </svg>
        );
    };

    const handlePuzzleComplete = (completedWords = foundWords) => {
        const finalScore = calculateScore(completedWords.length);
        onComplete();

        const stats = {
            type: 'word',
            score: finalScore.toString(),
            wordsFound: completedWords.length.toString(),
            totalWords: words.length.toString(),
            time: time.toString(),
            completed: completedWords.length === words.length ? 'success' : 'timeout'
        };

        console.log('Word search completion stats:', stats);

        router.push({
            pathname: '/puzzle-result',
            query: stats
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
                <div
                    ref={gridRef}
                    className="relative"
                    onMouseLeave={handleMouseLeave}
                    onTouchEnd={handleMouseUp}
                >
                    {renderSelectionLine()}
                    <div className="grid grid-cols-1 gap-1 relative">
                        {grid.map((row, i) => (
                            <div key={`row-${i}`} className="flex gap-1">
                                {row.map((cell, j) => (
                                    <motion.div
                                        key={`cell-${i}-${j}`}
                                        className={`
                                            w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center
                                            text-base sm:text-xl font-bold rounded select-none
                                            ${cell.isFound ? 'bg-green-200' : 'bg-white'}
                                            ${selectedCells.some(([r, c]) => r === i && c === j) ? 'bg-blue-200' : ''}
                                            cursor-pointer relative
                                        `}
                                        onMouseDown={() => handleMouseDown(i, j)}
                                        onMouseMove={(e) => handleMouseMove(e, i, j)}
                                        onMouseUp={handleMouseUp}
                                        onTouchStart={() => handleMouseDown(i, j)}
                                        onTouchMove={(e) => {
                                            const touch = e.touches[0];
                                            const element = document.elementFromPoint(touch.clientX, touch.clientY);
                                            const cellCoords = element?.getAttribute('data-cell')?.split('-');
                                            if (cellCoords) {
                                                handleMouseMove(e as any, parseInt(cellCoords[0]), parseInt(cellCoords[1]));
                                            }
                                        }}
                                        data-cell={`${i}-${j}`}
                                    >
                                        {cell.letter}
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-white/10 rounded-lg w-full lg:w-48">
                    <h3 className="text-white font-bold mb-4">Words to Find:</h3>
                    <div className="flex flex-wrap lg:flex-col gap-2">
                        {words.map((word, index) => (
                            <span
                                key={word}
                                className={`${foundWords.includes(word)
                                        ? 'text-green-400 line-through'
                                        : 'text-white'
                                    } px-2 py-1`}
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordSearch;
