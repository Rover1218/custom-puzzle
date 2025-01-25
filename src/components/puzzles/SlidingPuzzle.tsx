import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { PuzzleProps } from './types';

interface SlidingTileProps {
    number: number;
    position: { x: number; y: number };
    onClick: () => void;
    size: number;
}

// Update the SlidingTile component to be responsive
const SlidingTile: React.FC<SlidingTileProps> = ({ number, position, onClick, size }) => (
    <motion.div
        className="absolute bg-white rounded-lg flex items-center justify-center cursor-pointer
                   shadow-lg hover:shadow-xl transition-shadow font-bold text-lg sm:text-2xl"
        style={{
            width: size === 3 ? 'calc(min(80px, 25vw))' : 'calc(min(60px, 25vw))',
            height: size === 3 ? 'calc(min(80px, 25vw))' : 'calc(min(60px, 25vw))'
        }}
        initial={false}
        animate={{
            x: `calc(${position.x / (size === 3 ? 85 : 65)} * min(85px, 26vw))`,
            y: `calc(${position.y / (size === 3 ? 85 : 65)} * min(85px, 26vw))`,
            scale: 1
        }}
        whileHover={{ scale: 0.95 }}
        whileTap={{ scale: 0.95 }}
        transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
        }}
        onClick={onClick}
    >
        {number}
    </motion.div>
);

const SlidingPuzzle: React.FC<PuzzleProps> = ({ data, isPlaying, isSolved, onComplete, time }) => {
    const router = useRouter();
    const [tiles, setTiles] = useState<number[]>(data.tiles);
    const [moves, setMoves] = useState(0);
    const [showCompletion, setShowCompletion] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const size = data.size || 3;

    // Reset when puzzle data changes or when not playing
    useEffect(() => {
        resetPuzzle();
    }, [data, isPlaying]);

    const resetPuzzle = () => {
        if (!isPlaying) {
            setTiles(data.tiles);
            setMoves(0);
            setShowCompletion(false);
            setCountdown(5);
        }
    };

    const getPosition = (index: number) => {
        const tileSize = size === 3 ? 85 : 65;
        return {
            x: (index % size) * tileSize,
            y: Math.floor(index / size) * tileSize
        };
    };

    const handleTileClick = (index: number) => {
        if (!isPlaying || isSolved) return;

        const emptyIndex = tiles.indexOf(0);
        if (isAdjacent(index, emptyIndex)) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
            setMoves(prev => prev + 1);

            if (isPuzzleSolved(newTiles)) {
                handlePuzzleComplete();
            }
        }
    };

    const isAdjacent = (index1: number, index2: number): boolean => {
        const row1 = Math.floor(index1 / size);
        const col1 = index1 % size;
        const row2 = Math.floor(index2 / size);
        const col2 = index2 % size;

        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) ||
            (Math.abs(col1 - col2) === 1 && row1 === row2)
        );
    };

    const isPuzzleSolved = (currentTiles: number[]): boolean => {
        return currentTiles.every((tile, index) => {
            if (index === currentTiles.length - 1) return tile === 0;
            return tile === index + 1;
        });
    };

    const calculateScore = () => {
        const correctTiles = tiles.filter((tile, index) =>
            tile === data.solution[index]
        ).length;

        const baseScore = (correctTiles / 9) * 100;
        const movesPenalty = Math.min(30, moves * 0.5);
        const timeBonus = Math.max(0, 20 - Math.floor(time / 60));

        return Math.round(Math.max(0, Math.min(100, baseScore - movesPenalty + timeBonus)));
    };

    const handlePuzzleComplete = () => {
        const stats = {
            type: 'sliding',
            score: calculateScore().toString(),
            moves: moves.toString(),
            time: time.toString(),
            completed: 'success',
            correctTiles: tiles.filter((tile, index) => tile === data.solution[index]).length
        };

        console.log('Sliding puzzle completion stats:', stats);
        onComplete();

        router.push({
            pathname: '/puzzle-result',
            query: stats
        });
    };

    return (
        <div className="space-y-6">
            <div className="text-white text-xl mb-4 text-center sm:text-left">
                Moves: <span className="font-bold">{moves}</span>
            </div>

            <div
                className="relative bg-white/10 p-2 rounded-lg mx-auto"
                style={{
                    width: size === 3 ? 'min(260px, 80vw)' : 'min(200px, 80vw)',
                    height: size === 3 ? 'min(260px, 80vw)' : 'min(200px, 80vw)'
                }}
            >
                {tiles.map((tile, index) => (
                    tile !== 0 && (
                        <SlidingTile
                            key={tile}
                            number={tile}
                            position={getPosition(index)}
                            onClick={() => handleTileClick(index)}
                            size={size}
                        />
                    )
                ))}
            </div>

            <div className="text-center text-white/70 text-sm sm:text-base px-4">
                Tap or click tiles next to the empty space to move them
            </div>

            {showCompletion && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 
                             bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg
                             flex items-center gap-3"
                >
                    <span className="text-2xl">🎉</span>
                    <div>
                        <p className="font-bold">Puzzle completed!</p>
                        <p className="text-sm">Redirecting to results in {countdown} seconds...</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default SlidingPuzzle;
