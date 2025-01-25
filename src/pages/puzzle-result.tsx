import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShimmerButton } from "../components/ui/shimmer-button";
import { Badge } from "../components/ui/badge";
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import '../app/globals.css';
import { useSession, getSession } from 'next-auth/react';

// Add type definitions
type PuzzleType = 'sudoku' | 'word' | 'sliding';

type MetricLabels = {
    [key: string]: string;
};

interface PuzzleMetricInfo {
    icon: string;
    metrics: string[];
    labels: MetricLabels;
}

type PuzzleMetricsType = {
    [K in PuzzleType]: PuzzleMetricInfo;
};

const PuzzleMetrics: PuzzleMetricsType = {
    sudoku: {
        icon: "🔢",
        metrics: ["score", "time", "mistakes"],
        labels: {
            score: "Accuracy",
            time: "Time Taken",
            mistakes: "Mistakes Made"
        }
    },
    word: {
        icon: "📝",
        metrics: ["wordsFound", "totalWords", "time"],
        labels: {
            wordsFound: "Words Found",
            totalWords: "Total Words",
            time: "Time Taken"
        }
    },
    sliding: {
        icon: "🎯",
        metrics: ["moves", "time"],
        labels: {
            moves: "Total Moves",
            time: "Time Taken"
        }
    }
} as const;

const PuzzleResult = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { type, score, time, mistakes } = router.query;

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
            router.replace('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (score && status === 'authenticated') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [score, status]);

    // Show loading state
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    // Show error if not authenticated
    if (status === 'unauthenticated') {
        return null; // Will redirect to login
    }

    // Update the validation check at the start of the component
    if (!type ||
        (type === 'sudoku' && !router.query.score) ||
        (type === 'word' && (!router.query.wordsFound || !router.query.totalWords))) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
                    <p className="mb-6">We couldn't find your puzzle results.</p>
                    <div className="space-y-4">
                        <p className="text-sm text-white/70">Received parameters:</p>
                        <pre className="text-xs bg-white/10 p-2 rounded overflow-auto max-w-md mx-auto">
                            {JSON.stringify(router.query, null, 2)}
                        </pre>
                        <div className="text-sm text-white/70 mt-4">
                            <p>Debug Info:</p>
                            <ul className="list-disc list-inside">
                                <li>Type: {type || 'undefined'}</li>
                                <li>Score: {router.query.score || 'undefined'}</li>
                                <li>Query: {JSON.stringify(router.query)}</li>
                            </ul>
                        </div>
                        <Link href="/generate">
                            <ShimmerButton>Try a New Puzzle</ShimmerButton>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const formatTime = (seconds: string | string[] | undefined) => {
        if (!seconds || Array.isArray(seconds)) return "00:00";
        const nums = parseInt(seconds);
        const mins = Math.floor(nums / 60);
        const secs = nums % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getMetricValue = (metric: string, value: any) => {
        // Special case for auto-solved puzzles
        if (router.query.autoSolved === 'true') {
            switch (metric) {
                case 'score':
                    return '100%';
                case 'mistakes':
                    return '0';
                case 'time':
                    return formatTime(value);
                default:
                    return value;
            }
        }

        // Regular metric handling
        if (!value && value !== '0') return 'N/A';

        switch (metric) {
            case 'time':
                return formatTime(value);
            case 'score':
                const scoreNum = parseInt(String(value));
                return !isNaN(scoreNum) ? `${scoreNum}%` : 'N/A';
            case 'wordsFound':
                return `${value}/${router.query.totalWords}`;
            case 'moves':
                return value;
            case 'mistakes':
                return value;
            default:
                return value;
        }
    };

    const getGradeAndMessage = () => {
        // Special case for auto-solved puzzles
        if (router.query.autoSolved === 'true') {
            return {
                grade: 'S',
                message: 'Puzzle solved automatically!'
            };
        }

        // Regular grading logic
        if (!type) return { grade: 'N/A', message: '' };

        switch (type) {
            case 'sudoku':
                const sudokuScore = parseInt(String(router.query.score));
                return !isNaN(sudokuScore) ? getSudokuGrade(sudokuScore) :
                    { grade: 'N/A', message: 'Score calculation error' };
            case 'word':
                const wordsFound = parseInt(String(router.query.wordsFound));
                const totalWords = parseInt(String(router.query.totalWords));
                return !isNaN(wordsFound) && !isNaN(totalWords) ?
                    getWordSearchGrade(wordsFound, totalWords) :
                    { grade: 'N/A', message: 'Score calculation error' };
            case 'sliding':
                const moves = parseInt(String(router.query.moves));
                const timeSpent = parseInt(String(router.query.time));
                return !isNaN(moves) && !isNaN(timeSpent) ?
                    getSlidingGrade(moves, timeSpent) :
                    { grade: 'N/A', message: 'Score calculation error' };
            default:
                return { grade: 'N/A', message: '' };
        }
    };

    // Add specific grading functions
    const getSudokuGrade = (score: number) => {
        // Ensure score is a number and within valid range
        const validScore = Math.max(0, Math.min(100, score));
        return {
            grade: validScore >= 90 ? 'S' :
                validScore >= 80 ? 'A' :
                    validScore >= 70 ? 'B' :
                        validScore >= 60 ? 'C' : 'D',
            message: validScore >= 90 ? 'Perfect! Outstanding performance!' :
                validScore >= 80 ? 'Excellent work!' :
                    validScore >= 70 ? 'Good job!' :
                        validScore >= 60 ? 'Nice try!' : 'Keep practicing!'
        };
    };

    // Update function to handle missing data
    const getWordSearchGrade = (found: number, total: number) => {
        if (!found || !total) return { grade: 'N/A', message: 'Invalid puzzle data' };

        const percentage = (found / total) * 100;
        const grade =
            percentage === 100 ? 'S' :
                percentage >= 80 ? 'A' :
                    percentage >= 60 ? 'B' :
                        percentage >= 40 ? 'C' : 'D';

        const message =
            percentage === 100 ? 'Perfect! All words found!' :
                `Found ${found} out of ${total} words (${Math.round(percentage)}%)`;

        return { grade, message };
    };

    // Update function to handle missing data
    const getSlidingGrade = (moves: number, time: number) => {
        if (!moves || !time) return { grade: 'N/A', message: 'Invalid puzzle data' };
        const efficiency = moves * (time / 60); // Example metric
        return {
            grade: efficiency < 50 ? 'S' : efficiency < 100 ? 'A' : efficiency < 150 ? 'B' : 'C',
            message: efficiency < 50 ? 'Lightning fast!' : 'Good solve!'
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
            <motion.div
                className="container mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-6xl mb-4"
                        >
                            {PuzzleMetrics[type as PuzzleType]?.icon || "🎮"}
                        </motion.div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Puzzle Completed!
                        </h1>
                        <Badge variant="secondary" className="text-lg px-4 py-1">
                            {type?.toString().toUpperCase()}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {type && PuzzleMetrics[type as PuzzleType]?.metrics.map((metric) => (
                            <motion.div
                                key={metric}
                                className="bg-white/5 rounded-xl p-4 text-center"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                            >
                                <div className="text-white/60 text-sm mb-1">
                                    {PuzzleMetrics[type as PuzzleType].labels[metric]}
                                </div>
                                <div className="text-3xl font-bold text-white">
                                    {getMetricValue(metric, router.query[metric])}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="text-center mb-8"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <div className="text-4xl font-bold mb-2">
                            Grade: <span className="text-purple-400">{getGradeAndMessage().grade}</span>
                        </div>
                        <div className="text-white/80">
                            {getGradeAndMessage().message}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/generate" className="block">
                            <ShimmerButton className="w-full">
                                Try Another Puzzle
                            </ShimmerButton>
                        </Link>
                        <Link href="/" className="block">
                            <ShimmerButton className="w-full bg-purple-600">
                                Back to Home
                            </ShimmerButton>
                        </Link>
                    </div>

                    {/* Progress Chart or History could be added here */}
                </div>
            </motion.div>
        </div>
    );
};

// Add getServerSideProps to enforce authentication
export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        };
    }

    return {
        props: { session }
    };
}

export default PuzzleResult;
