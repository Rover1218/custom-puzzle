import React, { useState, useEffect } from 'react';

interface TimerProps {
    isRunning: boolean;
    onTimeUpdate?: (time: number) => void;
    className?: string;
    onReset?: () => void;
    puzzleType?: string; // Add this new prop
}

const Timer: React.FC<TimerProps> = ({ isRunning, onTimeUpdate, className, onReset, puzzleType }) => {
    const [time, setTime] = useState(0);

    // Reset timer when puzzle type changes
    useEffect(() => {
        setTime(0);
        onTimeUpdate?.(0);
    }, [puzzleType]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isRunning) {
            intervalId = setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime + 1;
                    onTimeUpdate?.(newTime);
                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, onTimeUpdate]);

    // Don't automatically reset the timer when not running
    // Only reset when explicitly called through handleReset
    const handleReset = () => {
        setTime(0);
        onTimeUpdate?.(0);
        onReset?.();
    };

    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`text-xl font-mono bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 ${className}`}>
            {formatTime(time)}
        </div>
    );
};

export default Timer;
