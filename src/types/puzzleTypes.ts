export interface CrosswordCell {
    letter: string;
    isBlack: boolean;
    isRevealed: boolean;
    isSelected: boolean;
    number?: number;
}

export interface CrosswordData {
    grid: CrosswordCell[][];
    clues: {
        across: { [key: string]: string };
        down: { [key: string]: string };
    };
    size: number;
    solution: string[][];
}
