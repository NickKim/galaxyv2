
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-white bg-black bg-opacity-70">
      <h1 className="text-6xl font-bold text-cyan-400 mb-4" style={{ textShadow: '0 0 10px #0ff' }}>GALAXY SHOOTER</h1>
      <p className="text-xl mb-8">Defend the galaxy from invaders!</p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-indigo-600 text-white font-bold text-2xl rounded-lg hover:bg-indigo-500 transition-colors duration-300 shadow-lg shadow-indigo-500/50 border-2 border-indigo-400"
      >
        START GAME
      </button>
       <div className="mt-12 text-center text-gray-400">
          <p className="font-bold">Controls:</p>
          <p>Move: Left/Right Arrow Keys or 'A'/'D'</p>
          <p>Shoot: Spacebar</p>
        </div>
    </div>
  );
};
