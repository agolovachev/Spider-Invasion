import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import { Renderer } from './game/Renderer';
import { ResourceManager } from './game/ResourceManager';
import HUD from './ui/HUD';
import Joystick from './ui/Joystick';
import './App.css';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const resourceManagerRef = useRef<ResourceManager>(new ResourceManager());
  const [gameState, setGameState] = useState<{ cargo: any[], deliveredCount: number }>({ cargo: [], deliveredCount: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine();
    const renderer = new Renderer(canvasRef.current);
    const rm = resourceManagerRef.current;

    engineRef.current = engine;
    rendererRef.current = renderer;

    const init = async () => {
      await rm.loadAll();
      engine.start();
    };

    init();

    engine.onUpdate = () => {
      renderer.render(engine, rm);
      setGameState({
        cargo: [...engine.spider.cargo],
        deliveredCount: engine.nest.deliveredCount
      });
    };

    // Keyboard controls
    const keys: Record<string, boolean> = {};
    const handleKey = (e: KeyboardEvent, isDown: boolean) => {
      keys[e.key.toLowerCase()] = isDown;
      let dx = 0;
      let dy = 0;
      if (keys['w'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;
      engine.spider.setDirection(dx, dy);
    };

    window.addEventListener('keydown', (e) => handleKey(e, true));
    window.addEventListener('keyup', (e) => handleKey(e, false));

    return () => {
      engine.stop();
      window.removeEventListener('keydown', (e) => handleKey(e, true));
      window.removeEventListener('keyup', (e) => handleKey(e, false));
    };
  }, []);

  const handleJoystickMove = (dx: number, dy: number) => {
    if (engineRef.current) {
      engineRef.current.spider.setDirection(dx, dy);
    }
  };

  return (
    <div className="game-container">
      <canvas ref={canvasRef} id="game-canvas" />
      <HUD cargo={gameState.cargo} deliveredCount={gameState.deliveredCount} />
      <Joystick onMove={handleJoystickMove} />
    </div>
  );
};

export default App;
