import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Add this import
import Timer from './Timer';
import { Button } from './ui/button';
import SudokuBoard from './puzzles/SudokuBoard';
import WordSearch from './puzzles/WordSearch';
import SlidingPuzzle from './puzzles/SlidingPuzzle';
// Remove Crossword import
import type { PuzzleProps } from './puzzles/types';
import { solveSudoku } from '../utils/puzzleUtils';

interface PuzzleBoardProps {
    puzzleType: string;
    puzzleData: any;
    onComplete?: () => void; // Add this prop
}

interface Props extends PuzzleProps { }

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ puzzleType, puzzleData, onComplete }) => {
    const router = useRouter(); // Add this line
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    const [time, setTime] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentPuzzleType, setCurrentPuzzleType] = useState(puzzleType);
    const [isAutoSolving, setIsAutoSolving] = useState(false);
    const [timeLimit, setTimeLimit] = useState(() => {
        switch (puzzleType) {
            case 'sudoku': return 30 * 60; // 30 minutes
            case 'word': return 15 * 60;   // 15 minutes
            case 'sliding': return 10 * 60; // 10 minutes
            default: return 30 * 60;
        }
    });

    // Reset timer and state when puzzle type changes
    useEffect(() => {
        setTime(0);
        setIsPlaying(false);
        setIsSolved(false);
        setHasStarted(false);
        setCurrentPuzzleType(puzzleType);
    }, [puzzleType]);

    // Separate useEffect for puzzle data changes
    useEffect(() => {
        if (puzzleData) {
            setTime(0);
            setIsPlaying(false);
            setIsSolved(false);
            setHasStarted(false);
        }
    }, [puzzleData]);

    // Add time limit check
    useEffect(() => {
        if (isPlaying && time >= timeLimit) {
            handleTimeUp();
        }
    }, [time, timeLimit, isPlaying]);

    const handleAutoSolve = () => {
        if (puzzleType !== 'sudoku' || !puzzleData?.grid) return;
        setIsAutoSolving(true);
        setIsSolved(true);
        setIsPlaying(false);
        onComplete?.(); // Now this is properly typed
    };

    const handleReset = () => {
        setIsSolved(false);
        setIsPlaying(false);
        setTime(0);
        setHasStarted(false); // Reset hasStarted state
        setIsAutoSolving(false);
    };

    const handleComplete = () => {
        setIsSolved(true);
        setIsPlaying(false);
        setIsAutoSolving(false);
    };

    const handleStartGame = () => {
        setHasStarted(true);
        setIsPlaying(true);
    };

    const handleTimeUp = () => {
        setIsPlaying(false);
        setIsSolved(true);
        handleComplete();

        // Calculate final score based on progress
        let finalScore = 0;
        switch (puzzleType) {
            case 'sudoku':
                finalScore = Math.round((puzzleData.filledCells / 81) * 100);
                break;
            case 'word':
                finalScore = Math.round((puzzleData.foundWords?.length / puzzleData.words.length) * 100);
                break;
            case 'sliding':
                finalScore = Math.round((puzzleData.correctTiles / 9) * 100);
                break;
        }

        router.push({
            pathname: '/puzzle-result',
            query: {
                type: puzzleType,
                score: finalScore.toString(),
                time: time.toString(),
                timeLimit: timeLimit.toString(),
                completed: 'timeout'
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                <Timer
                    isRunning={isPlaying && hasStarted && puzzleType === currentPuzzleType}
                    onTimeUpdate={setTime}
                    className="text-2xl font-mono text-white"
                    puzzleType={puzzleType} // Pass puzzle type to Timer
                />
                <div className="space-x-4">
                    {!hasStarted ? (
                        <Button
                            onClick={handleStartGame}
                            className="bg-green-600 hover:bg-green-700 min-w-[100px]"
                        >
                            Start Game
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={() => setIsPlaying(!isPlaying)}
                                variant={isPlaying ? "destructive" : "default"}
                                className="min-w-[100px]"
                            >
                                {isPlaying ? "Pause" : "Resume"}
                            </Button>
                            {puzzleType === 'sudoku' && (
                                <Button
                                    onClick={handleAutoSolve}
                                    disabled={isSolved || isAutoSolving}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    Auto Solve
                                </Button>
                            )}
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="border-white/20"
                            >
                                Reset
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="puzzle-container bg-white/10 p-6 rounded-xl">
                {renderPuzzle()}
            </div>
        </div>
    );

    function renderPuzzle() {
        const props: Props = {
            data: puzzleData,
            isPlaying,
            isSolved,
            onComplete: handleComplete,
            time,
            setIsPlaying,
            isAutoSolving: puzzleType === 'sudoku' ? isAutoSolving : false
        };

        switch (puzzleType) {
            case 'sudoku':
                return <SudokuBoard {...props} />;
            case 'word':
                return <WordSearch {...props} />;
            case 'sliding':
                return <SlidingPuzzle {...props} />;
            default:
                return <div className="text-white text-center">Invalid puzzle type</div>;
        }
    }
};

export default PuzzleBoard;
