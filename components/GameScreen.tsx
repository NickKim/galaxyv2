
import React from 'react';
import type { GameObject, Enemy } from '../types';
import { PLAYER_WIDTH, PLAYER_HEIGHT, ENEMY_WIDTH, ENEMY_HEIGHT } from '../constants';

interface GameScreenProps {
  playerPos: GameObject;
  bullets: GameObject[];
  enemies: Enemy[];
  enemyBullets: GameObject[];
  score: number;
}

// Player Ship SVG Component
const PlayerShip: React.FC = () => (
  <svg width={PLAYER_WIDTH} height={PLAYER_HEIGHT} viewBox="0 0 50 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 0L50 20H0L25 0Z" className="fill-cyan-400" />
    <path d="M20 15H30V20H20V15Z" className="fill-gray-400" />
  </svg>
);

// Enemy Ship SVG Component
const EnemyShip: React.FC = () => (
  <svg width={ENEMY_WIDTH} height={ENEMY_HEIGHT} viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 30L0 10H10L20 20L30 10H40L20 30Z" className="fill-red-500" />
    <circle cx="20" cy="10" r="5" className="fill-green-400" />
  </svg>
);


export const GameScreen: React.FC<GameScreenProps> = ({ playerPos, bullets, enemies, enemyBullets, score }) => {
  return (
    <>
      <div className="absolute top-2 left-2 text-white text-xl">SCORE: {score}</div>
      
      {/* Player */}
      <div style={{ position: 'absolute', left: playerPos.x, top: playerPos.y }}>
        <PlayerShip />
      </div>

      {/* Bullets */}
      {bullets.map(bullet => (
        <div
          key={bullet.id}
          className="absolute bg-cyan-400 rounded-sm"
          style={{ left: bullet.x, top: bullet.y, width: '6px', height: '15px' }}
        />
      ))}

      {/* Enemies */}
      {enemies.map(enemy => (
        <div
          key={enemy.id}
          style={{ position: 'absolute', left: enemy.x, top: enemy.y }}
        >
          <EnemyShip />
        </div>
      ))}

      {/* Enemy Bullets */}
      {enemyBullets.map(bullet => (
        <div
          key={bullet.id}
          className="absolute bg-red-500"
          style={{ left: bullet.x, top: bullet.y, width: '4px', height: '10px' }}
        />
      ))}
    </>
  );
};