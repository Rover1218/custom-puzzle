import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { removeNumbers } from '../../utils/puzzleUtils';
import styles from '../../styles/Sudoku.module.css';

interface SudokuBoardProps {
    data: {
        grid: number[][];
        difficulty: string;
        time: number;
        solution?: number[][]; // Add solution as optional property
    };
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    onComplete: () => void;
    isAutoSolving: boolean;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ data, isPlaying, setIsPlaying, onComplete, isAutoSolving }) => {
    const router = useRouter();
    const [board, setBoard] = useState<number[][]>(data.grid);
    const [initialBoard, setInitialBoard] = useState<number[][]>(data.grid.map(row => [...row]));
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [conflicts, setConflicts] = useState<Set<string>>(new Set());
    const [score, setScore] = useState(100);
    const [mistakes, setMistakes] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showRedirectAlert, setShowRedirectAlert] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const [lockedCells, setLockedCells] = useState<Set<string>>(new Set());

    useEffect(() => {
        const locked = new Set<string>();
        initialBoard.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) locked.add(`${i}-${j}`);
            });
        });
        setLockedCells(locked);
    }, [initialBoard]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedCell, isPlaying]);

    useEffect(() => {
        checkCompletion();
    }, [board]);

    // Reset board when puzzle data changes
    useEffect(() => {
        setBoard(data.grid);
        setInitialBoard(data.grid.map(row => [...row]));
        setSelectedCell(null);
        setConflicts(new Set());
        setScore(100);
        setMistakes(0);

        // Update locked cells
        const locked = new Set<string>();
        data.grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) locked.add(`${i}-${j}`);
            });
        });
        setLockedCells(locked);
    }, [data.grid]);

    // Add new effect for auto-solve
    useEffect(() => {
        if (isAutoSolving) {
            const solvedBoard = [...board];
            // Check if solution exists, if not, use the current board
            const solution = data.solution || solvedBoard;

            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (solvedBoard[i][j] === 0) {
                        solvedBoard[i][j] = solution[i][j];
                    }
                }
            }
            setBoard(solvedBoard);
            setConflicts(new Set());

            // Immediately redirect to results
            router.push({
                pathname: '/puzzle-result',
                query: {
                    type: 'sudoku',
                    score: '100',
                    time: data.time?.toString() || '0',
                    mistakes: '0',
                    difficulty: data.difficulty || 'medium',
                    completed: 'auto-solved',
                    autoSolved: 'true'
                }
            });
        }
    }, [isAutoSolving]);

    const handleCellClick = (row: number, col: number) => {
        if (!isPlaying || initialBoard[row][col] !== 0) return;
        setSelectedCell([row, col]);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (!isPlaying) return;

        if ((e.key >= '1' && e.key <= '9') || (e.key >= 'Numpad1' && e.key <= 'Numpad9')) {
            const num = parseInt(e.key.replace('Numpad', ''));
            handleNumberInput(num);
            return;
        }

        if (selectedCell) {
            const [row, col] = selectedCell;
            switch (e.key) {
                case 'ArrowUp':
                    if (row > 0) setSelectedCell([row - 1, col]);
                    break;
                case 'ArrowDown':
                    if (row < 8) setSelectedCell([row + 1, col]);
                    break;
                case 'ArrowLeft':
                    if (col > 0) setSelectedCell([row, col - 1]);
                    break;
                case 'ArrowRight':
                    if (col < 8) setSelectedCell([row, col + 1]);
                    break;
            }
        }
    };

    const handleNumberInput = (num: number) => {
        if (!selectedCell || !isPlaying) return;
        const [row, col] = selectedCell;

        if (lockedCells.has(`${row}-${col}`)) return;

        // Update cell and check for conflicts
        updateCell(row, col, num);

        // Check if the move creates any conflicts
        const newBoard = [...board];
        newBoard[row][col] = num;
        const conflicts = getConflicts(newBoard, row, col);

        if (conflicts.size > 0) {
            setMistakes(prev => prev + 1);
            setScore(prev => Math.max(0, prev - 10)); // Deduct 10 points for mistakes

            // Add visual feedback for wrong input
            const cell = document.querySelector(`[data-cell="${row}-${col}"]`);
            cell?.classList.add(styles.shake);
            setTimeout(() => cell?.classList.remove(styles.shake), 500);
        }
    };

    const getConflicts = (board: number[][], row: number, col: number): Set<string> => {
        const conflicts = new Set<string>();
        const value = board[row][col];

        // Check row
        for (let j = 0; j < 9; j++) {
            if (j !== col && board[row][j] === value) {
                conflicts.add(`${row}-${j}`);
                conflicts.add(`${row}-${col}`);
            }
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (i !== row && board[i][col] === value) {
                conflicts.add(`${i}-${col}`);
                conflicts.add(`${row}-${col}`);
            }
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (i !== row && j !== col && board[i][j] === value) {
                    conflicts.add(`${i}-${j}`);
                    conflicts.add(`${row}-${col}`);
                }
            }
        }

        return conflicts;
    };

    const updateCell = (row: number, col: number, value: number) => {
        const newBoard = [...board];
        newBoard[row][col] = value;
        setBoard(newBoard);
        validateBoard(newBoard);
    };

    const validateBoard = (newBoard: number[][]) => {
        const newConflicts = new Set<string>();

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (newBoard[i][j] === 0) continue;

                // Fix loop conditions
                for (let k = 0; k < 9; k++) {
                    if (k !== j && newBoard[i][k] === newBoard[i][j]) {
                        newConflicts.add(`${i}-${j}`);
                        newConflicts.add(`${i}-${k}`);
                    }
                }

                for (let k = 0; k < 9; k++) {
                    if (k !== i && newBoard[k][j] === newBoard[i][j]) {
                        newConflicts.add(`${i}-${j}`);
                        newConflicts.add(`${k}-${j}`);
                    }
                }

                const boxRow = Math.floor(i / 3) * 3;
                const boxCol = Math.floor(j / 3) * 3;
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        const row = boxRow + r;
                        const col = boxCol + c;
                        if (row !== i && col !== j && newBoard[row][col] === newBoard[i][j]) {
                            newConflicts.add(`${i}-${j}`);
                            newConflicts.add(`${row}-${col}`);
                        }
                    }
                }
            }
        }

        setConflicts(newConflicts);
    };

    const calculateFinalScore = () => {
        // Calculate filled cells percentage
        const filledCells = board.flat().filter(cell => cell !== 0).length;
        const totalCells = 81;
        const completionRate = (filledCells / totalCells) * 100;

        // Base score (completion rate - mistakes penalty)
        const baseScore = Math.max(0, completionRate - (mistakes * 5));

        // Time bonus (faster completion = more points)
        const timeBonus = Math.max(0, 20 - Math.floor(data.time / 60));

        // Difficulty multiplier
        const difficultyMultiplier =
            data.difficulty === 'hard' ? 1.2 :
                data.difficulty === 'medium' ? 1.1 : 1;

        const finalScore = Math.round(Math.min(100, (baseScore + timeBonus) * difficultyMultiplier));
        return finalScore;
    };

    const checkCompletion = () => {
        const isFilled = board.every(row => row.every(cell => cell !== 0));

        if (isFilled && conflicts.size === 0) {
            const finalScore = calculateFinalScore();
            onComplete();

            const stats = {
                type: 'sudoku',
                score: finalScore.toString(),
                time: Math.max(0, data.time || 0).toString(),
                mistakes: mistakes.toString(),
                difficulty: data.difficulty || 'medium',
                completed: 'success',
                filledCells: board.flat().filter(cell => cell !== 0).length
            };

            console.log('Sudoku completion stats:', stats);

            router.push({
                pathname: '/puzzle-result',
                query: stats
            });
        }
    };

    const getBackgroundColor = (i: number, j: number) => {
        const key = `${i}-${j}`;
        if (conflicts.has(key)) {
            return 'bg-red-200';
        }
        if (selectedCell?.[0] === i && selectedCell?.[1] === j) {
            return 'bg-blue-200';
        }
        const boxRow = Math.floor(i / 3);
        const boxCol = Math.floor(j / 3);
        return (boxRow + boxCol) % 2 === 0 ? 'bg-white' : 'bg-gray-50';
    };

    const resetBoard = () => {
        setBoard(data.grid.map(row => [...row]));
        setSelectedCell(null);
        setConflicts(new Set());
        setScore(100);
        setMistakes(0);
    };

    useEffect(() => {
        if (!isPlaying) {
            resetBoard();
        }
    }, [isPlaying]);

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center mb-4">
                <div className="text-white space-x-6">
                    <span className="bg-purple-500/20 px-4 py-2 rounded-lg">
                        Score: <span className="font-bold">{score}</span>
                    </span>
                    <span className="bg-red-500/20 px-4 py-2 rounded-lg">
                        Mistakes: <span className="font-bold">{mistakes}/20</span>
                    </span>
                </div>
            </div>

            <motion.div
                className="inline-block bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="grid grid-cols-9 gap-[1px] bg-gray-600">
                    <AnimatePresence>
                        {board.map((row, i) =>
                            row.map((cell, j) => (
                                <motion.div
                                    key={`${i}-${j}`}
                                    data-cell={`${i}-${j}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={[
                                        'w-12 h-12 flex items-center justify-center',
                                        getBackgroundColor(i, j),
                                        initialBoard[i][j] !== 0 ? 'font-bold' : 'font-normal',
                                        selectedCell?.[0] === i && selectedCell?.[1] === j ? 'ring-2 ring-blue-500' : '',
                                        'text-xl cursor-pointer transition-all duration-200',
                                        'hover:bg-opacity-90',
                                        (j + 1) % 3 === 0 && j !== 8 ? 'border-r-2 border-gray-600' : '',
                                        (i + 1) % 3 === 0 && i !== 8 ? 'border-b-2 border-gray-600' : '',
                                        mistakes >= 20 ? 'pointer-events-none opacity-50' : ''
                                    ].filter(Boolean).join(' ')}
                                    onClick={() => handleCellClick(i, j)}
                                >
                                    {cell !== 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={`
                                                ${conflicts.has(`${i}-${j}`) ? 'text-red-600' : 'text-gray-800'}
                                                ${initialBoard[i][j] !== 0 ? 'text-black' : ''}
                                            `}
                                        >
                                            {cell}
                                        </motion.span>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <div className="text-center text-white/70 mt-4">
                Use keyboard numbers 1-9 to input values
            </div>

            {showRedirectAlert && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 
                             bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg
                             flex items-center gap-3"
                >
                    <span className="text-2xl">🎉</span>
                    <div>
                        <p className="font-bold">Congratulations! Puzzle completed!</p>
                        <p className="text-sm">Redirecting to results in {countdown} seconds...</p>
                    </div>
                </motion.div>
            )}

            {/* Add game over alert when mistakes reach 20 */}
            {mistakes >= 20 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                             bg-red-500 text-white px-8 py-6 rounded-xl shadow-2xl
                             text-center z-50"
                >
                    <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
                    <p className="mb-4">Too many mistakes. Try again?</p>
                    <button
                        onClick={resetBoard}
                        className="bg-white text-red-500 px-6 py-2 rounded-lg
                                 hover:bg-red-50 transition-colors"
                    >
                        Restart Puzzle
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default SudokuBoard;
