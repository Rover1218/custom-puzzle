// src/pages/generate.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import PuzzleGenerator from '../components/PuzzleGenerator';
import PuzzleBoard from '../components/PuzzleBoard';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import '../app/globals.css';
import { motion } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import ClickSpark from '../components/ui/Animations/ClickSpark/ClickSpark';
import Head from 'next/head';

// Add type definitions
type PuzzleType = 'sudoku' | 'word' | 'sliding';

interface PuzzleInfo {
    title: string;
    description: string;
    tips: string[];
    icon: string;
}

type PuzzleInfoMap = {
    [K in PuzzleType]: PuzzleInfo;
};

const GeneratePage = () => {
    const { user, loading } = useAuth(true);
    const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleType | ''>('');
    const [puzzleData, setPuzzleData] = useState(null);
    const [resetKey, setResetKey] = useState(0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    const puzzleInfo: PuzzleInfoMap = {
        sudoku: {
            title: "Sudoku",
            description: "Challenge yourself with number puzzles of varying difficulty",
            tips: ["Start with the most obvious numbers", "Use process of elimination", "Look for patterns"],
            icon: "🔢"
        },
        word: {
            title: "Word Search",
            description: "Generate custom word search puzzles with your words",
            tips: ["Look diagonally", "Work systematically", "Circle found words"],
            icon: "📝"
        },
        sliding: {
            title: "Sliding Puzzle",
            description: "Slide tiles to arrange them in order",
            tips: ["Work row by row", "Plan your moves", "Use empty space wisely"],
            icon: "🎯"
        }
    } as const;

    return (
        <ProtectedRoute>
            <Head>
                <link
                    rel="icon"
                    type="image/png"
                    sizes="512x512"
                    href="https://cdn-icons-png.flaticon.com/512/4489/4489661.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="256x256"
                    href="https://cdn-icons-png.flaticon.com/256/4489/4489661.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="128x128"
                    href="https://cdn-icons-png.flaticon.com/128/4489/4489661.png"
                />
                <link
                    rel="apple-touch-icon"
                    href="https://cdn-icons-png.flaticon.com/512/4489/4489661.png"
                />
                <title>Generate Puzzle - Custom Puzzle Generator</title>
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <ClickSpark
                    sparkColor="rgba(255, 255, 255, 0.8)"
                    sparkSize={1.5}
                    sparkCount={20}
                    sparkRadius={25}
                    duration={600}
                    extraScale={1.2}
                    easing="ease-out"
                >
                    {/* Navbar */}
                    <div className="relative z-40">
                        <Navbar />
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="container mx-auto px-4 py-8"
                    >
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left Column - Puzzle Selection */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-white/10 backdrop-blur-lg rounded-xl p-8 sticky top-24"
                                >
                                    <h2 className="text-3xl font-bold text-white mb-6">
                                        Choose Your Puzzle
                                    </h2>

                                    <Select
                                        value={selectedPuzzle}
                                        onValueChange={(value: PuzzleType) => {
                                            setSelectedPuzzle(value);
                                            setPuzzleData(null);
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-white/20 text-white border-white/30
                                                        backdrop-blur-sm focus:ring-2 focus:ring-purple-500">
                                            <SelectValue placeholder="Select Puzzle Type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800/90 backdrop-blur-md text-white border-white/30">
                                            {(Object.entries(puzzleInfo) as [PuzzleType, PuzzleInfo][]).map(([key, info]) => (
                                                <SelectItem key={key} value={key}>
                                                    <span className="flex items-center gap-2">
                                                        <span>{info.icon}</span>
                                                        <span>{info.title}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {selectedPuzzle && (
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="mt-6 space-y-4"
                                        >
                                            <div className="text-6xl text-center mb-4">
                                                {puzzleInfo[selectedPuzzle].icon}
                                            </div>
                                            <h3 className="text-xl text-white font-semibold">
                                                {puzzleInfo[selectedPuzzle].description}
                                            </h3>
                                            <div className="bg-white/5 rounded-lg p-4">
                                                <h4 className="text-white font-semibold mb-2">Pro Tips:</h4>
                                                <ul className="text-white/80 space-y-2">
                                                    {puzzleInfo[selectedPuzzle].tips.map((tip: string, index: number) => (
                                                        <li key={index} className="flex items-center gap-2">
                                                            <span className="text-purple-400">•</span>
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Right Column - Generator and Preview */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-white/10 backdrop-blur-lg rounded-xl p-8"
                                >
                                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300 mb-8">
                                        Create Your Perfect Puzzle
                                    </h1>

                                    {selectedPuzzle ? (
                                        <div className="space-y-8">
                                            <PuzzleGenerator
                                                puzzleType={selectedPuzzle}
                                                onPuzzleGenerated={setPuzzleData}
                                                onDifficultyChange={() => setResetKey(prev => prev + 1)}
                                            />

                                            {puzzleData && (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
                                                >
                                                    <h3 className="text-2xl font-bold text-white mb-4">Preview</h3>
                                                    <PuzzleBoard
                                                        key={resetKey} // Add key to force remount
                                                        puzzleType={selectedPuzzle}
                                                        puzzleData={puzzleData}
                                                    />
                                                </motion.div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center text-white/70 py-12">
                                            <span className="text-6xl mb-4 block">🎮</span>
                                            <p className="text-xl">Select a puzzle type to get started!</p>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </ClickSpark>
            </div>
        </ProtectedRoute>
    );
};

export default GeneratePage;
