
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED, 
  BULLET_SPEED, ENEMY_ROWS, ENEMY_COLS, ENEMY_WIDTH, ENEMY_HEIGHT, ENEMY_GAP, 
  ENEMY_SPEED, ENEMY_VERTICAL_SPEED, ENEMY_FIRE_RATE, MAX_PLAYER_BULLETS
} from './constants';
import type { GameObject, Enemy } from './types';
import { GameScreen } from './components/GameScreen';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [playerPos, setPlayerPos] = useState<GameObject>({ id: 0, x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20 });
  const [bullets, setBullets] = useState<GameObject[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<GameObject[]>([]);
  const [enemyDirection, setEnemyDirection] = useState<number>(1);
  const keysPressed = useRef<Record<string, boolean>>({});

  const createEnemies = useCallback(() => {
    const newEnemies: Enemy[] = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        newEnemies.push({
          id: Date.now() + row * ENEMY_COLS + col,
          x: col * (ENEMY_WIDTH + ENEMY_GAP) + ENEMY_GAP,
          y: row * (ENEMY_HEIGHT + ENEMY_GAP) + 50,
          type: 'default'
        });
      }
    }
    setEnemies(newEnemies);
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setPlayerPos({ id: 0, x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20 });
    setBullets([]);
    setEnemyBullets([]);
    createEnemies();
    setEnemyDirection(1);
    setGameOver(false);
    setGameStarted(true);
  }, [createEnemies]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      if (e.key === ' ' && gameStarted && !gameOver) {
        e.preventDefault();
        setBullets(prev => {
          if (prev.length <= MAX_PLAYER_BULLETS - 3) {
            const now = Date.now();
            const newBullets: GameObject[] = [
              { id: now, x: playerPos.x, y: playerPos.y }, // Left
              { id: now + 1, x: playerPos.x + PLAYER_WIDTH / 2 - 3, y: playerPos.y }, // Center
              { id: now + 2, x: playerPos.x + PLAYER_WIDTH - 6, y: playerPos.y }, // Right
            ];
            return [...prev, ...newBullets];
          }
          return prev;
        });
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerPos.x, playerPos.y, gameStarted, gameOver]);

  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) return;

    // Player movement
    setPlayerPos(prev => {
      let newX = prev.x;
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) newX -= PLAYER_SPEED;
      if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) newX += PLAYER_SPEED;
      newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, newX));
      return { ...prev, x: newX };
    });

    // Bullet movement
    setBullets(prev => prev.map(b => ({ ...b, y: b.y - BULLET_SPEED })).filter(b => b.y > 0));

    // Enemy bullet movement
    setEnemyBullets(prev => prev.map(b => ({ ...b, y: b.y + BULLET_SPEED })).filter(b => b.y < GAME_HEIGHT));

    // Enemy movement
    let wallHit = false;
    let moveDown = false;
    
    setEnemies(prev => {
      const newEnemies = prev.map(e => {
        if (!wallHit && (e.x + ENEMY_WIDTH >= GAME_WIDTH || e.x <= 0)) {
          wallHit = true;
        }
        return { ...e, x: e.x + ENEMY_SPEED * enemyDirection };
      });

      if (wallHit) {
        setEnemyDirection(prevDir => -prevDir);
        moveDown = true;
      }

      if (moveDown) {
        return newEnemies.map(e => ({ ...e, y: e.y + ENEMY_VERTICAL_SPEED }));
      }
      return newEnemies;
    });

    // Enemy firing
    setEnemies(prev => {
      prev.forEach(enemy => {
        if (Math.random() < ENEMY_FIRE_RATE) {
          setEnemyBullets(eb => [...eb, { id: Date.now() + enemy.id, x: enemy.x + ENEMY_WIDTH / 2 - 2, y: enemy.y + ENEMY_HEIGHT }]);
        }
      });
      return prev;
    });

    // Collision detection
    // Bullets vs Enemies
    const newBullets = [...bullets];
    let newEnemies = [...enemies];
    let scoreToAdd = 0;

    newBullets.forEach((bullet, bIndex) => {
      newEnemies.forEach((enemy, eIndex) => {
        if (
          bullet.x < enemy.x + ENEMY_WIDTH &&
          bullet.x + 6 > enemy.x &&
          bullet.y < enemy.y + ENEMY_HEIGHT &&
          bullet.y + 15 > enemy.y
        ) {
          newBullets.splice(bIndex, 1);
          newEnemies.splice(eIndex, 1);
          scoreToAdd += 10;
        }
      });
    });

    if (scoreToAdd > 0) {
      setScore(s => s + scoreToAdd);
      setBullets(newBullets);
      setEnemies(newEnemies);
    }

    // Enemy Bullets vs Player
    enemyBullets.forEach(bullet => {
      if (
        bullet.x < playerPos.x + PLAYER_WIDTH &&
        bullet.x + 4 > playerPos.x &&
        bullet.y < playerPos.y + PLAYER_HEIGHT &&
        bullet.y + 10 > playerPos.y
      ) {
        setGameOver(true);
      }
    });
    
    // Enemies vs Player or bottom
    enemies.forEach(enemy => {
        if(
            enemy.y + ENEMY_HEIGHT > GAME_HEIGHT ||
            (enemy.x < playerPos.x + PLAYER_WIDTH &&
            enemy.x + ENEMY_WIDTH > playerPos.x &&
            enemy.y < playerPos.y + PLAYER_HEIGHT &&
            enemy.y + ENEMY_HEIGHT > playerPos.y)
        ) {
            setGameOver(true);
        }
    });

    if(enemies.length === 0 && gameStarted){
        // Win condition, start new level
        createEnemies();
        setScore(s => s + 100); // Level clear bonus
    }

  }, [bullets, enemies, enemyBullets, playerPos, gameStarted, gameOver, enemyDirection, createEnemies]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
  }, [gameLoop]);

  return (
    <div className="flex justify-center items-center h-screen font-mono">
      <div className="relative bg-black border-4 border-indigo-500 shadow-lg shadow-indigo-500/50" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {!gameStarted ? (
          <StartScreen onStart={resetGame} />
        ) : gameOver ? (
          <GameOverScreen score={score} onRestart={resetGame} />
        ) : (
          <GameScreen 
            playerPos={playerPos} 
            bullets={bullets} 
            enemies={enemies} 
            enemyBullets={enemyBullets} 
            score={score} 
          />
        )}
      </div>
    </div>
  );
};

export default App;