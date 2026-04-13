import { Spider } from './Spider';
import { World } from './World';
import { Spawner } from './Spawner';
import { Nest } from './Nest';
import { CATCH_RADIUS } from '../utils/constants';

export class GameEngine {
  spider: Spider;
  world: World;
  spawner: Spawner;
  nest: Nest;
  lastTime: number = 0;
  isRunning: boolean = false;
  onUpdate?: () => void;

  camera = { x: 0, y: 0 };

  constructor() {
    this.spider = new Spider();
    this.world = new World();
    this.spawner = new Spawner();
    this.nest = new Nest();
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
  }

  private loop = (now: number) => {
    if (!this.isRunning) return;

    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(dt);
    if (this.onUpdate) this.onUpdate();

    requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    // Clamp dt to avoid huge jumps
    const clampedDt = Math.min(dt, 0.1);

    this.spider.update(clampedDt);
    this.spawner.update(clampedDt, this.spider, CATCH_RADIUS);
    this.nest.update(this.spider);

    // Camera follow (lerp)
    const targetCamX = this.spider.position.x;
    const targetCamY = this.spider.position.y;
    this.camera.x += (targetCamX - this.camera.x) * 0.1;
    this.camera.y += (targetCamY - this.camera.y) * 0.1;
  }
}
