export interface PuzzleProps {
    data: any;
    isPlaying: boolean;
    isSolved: boolean;
    onComplete: () => void;
    time: number;
    setIsPlaying: (playing: boolean) => void;
    isAutoSolving: boolean; // Add this new property
}
