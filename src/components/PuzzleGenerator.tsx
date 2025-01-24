// src/components/PuzzleGenerator.tsx
import React, { useState } from 'react';

const PuzzleGenerator = () => {
    const [size, setSize] = useState<number>(3);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to generate puzzle
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="size">Puzzle Size:</label>
            <input
                type="number"
                id="size"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                min="3"
                max="10"
            />
            <button type="submit">Generate Puzzle</button>
        </form>
    );
};

export default PuzzleGenerator;
