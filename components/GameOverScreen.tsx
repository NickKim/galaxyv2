
import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-white bg-black bg-opacity-80">
      <h2 className="text-6xl font-bold text-red-500 mb-4" style={{ textShadow: '0 0 10px #f00' }}>GAME OVER</h2>
      <p className="text-3xl mb-8">Final Score: {score}</p>
      <button
        onClick={onRestart}
        className="px-8 py-4 bg-green-600 text-white font-bold text-2xl rounded-lg hover:bg-green-500 transition-colors duration-300 shadow-lg shadow-green-500/50 border-2 border-green-400"
      >
        RESTART
      </button>
    </div>
  );
};
