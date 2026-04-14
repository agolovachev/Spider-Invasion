import { GameEngine } from './GameEngine';
import { ResourceManager } from './ResourceManager';
import { worldToScreen } from '../utils/isoMath';
import { TILE_WIDTH, TILE_HEIGHT, GRID_SIZE } from '../utils/constants';

export class Renderer {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dpr: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupCanvas();
  }

  setupCanvas() {
    this.dpr = window.devicePixelRatio || 1;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth * this.dpr;
    this.canvas.height = window.innerHeight * this.dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  render(engine: GameEngine, rm: ResourceManager) {
    if (!rm.loaded) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Viewport-to-world offset based on camera
    const camScreen = worldToScreen(engine.camera.x, engine.camera.y);
    const offsetX = centerX - camScreen.x;
    const offsetY = centerY - camScreen.y;

    this.ctx.save();
    this.ctx.translate(offsetX, offsetY);

    // 1. Draw Tiles (Grass)
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const screen = worldToScreen(x, y);
        this.ctx.drawImage(rm.images.grass, screen.x - TILE_WIDTH / 2, screen.y);
      }
    }

    // 2. Collect and Sort Entities for Depth
    const entities: any[] = [
      { type: engine.nest, y: engine.nest.position.y, x: engine.nest.position.x, kind: 'nest' },
      { type: engine.spider, y: engine.spider.position.y, x: engine.spider.position.x, kind: 'spider' },
      ...engine.spawner.insects.map(i => ({ type: i, y: i.position.y, x: i.position.x, kind: 'insect' }))
    ];

    // Painter's algorithm: sort by y to handle orthogonal depth
    entities.sort((a, b) => a.y - b.y);

    // 3. Draw Entities
    entities.forEach(ent => {
      const screen = worldToScreen(ent.x, ent.y);
      
      if (ent.kind === 'nest') {
        this.ctx.drawImage(rm.images.nest, screen.x - 64, screen.y - 64);
        // Draw delivered count
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${ent.type.deliveredCount}`, screen.x, screen.y - 70);
      } else if (ent.kind === 'spider') {
        this.ctx.drawImage(rm.images.spider, screen.x - 32, screen.y - 32);
        
        // Full cargo indicator
        if (ent.type.isFull) {
          this.ctx.beginPath();
          this.ctx.arc(screen.x, screen.y - 40, 5, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(Date.now() / 200) * 0.5})`;
          this.ctx.fill();
        }
      } else if (ent.kind === 'insect') {
        const img = rm.images[ent.type.type];
        
        this.ctx.save();
        this.ctx.translate(screen.x, screen.y);
        // Subtle wobble animation
        const wobble = Math.sin(Date.now() / 800 * Math.PI * 2) * (5 * Math.PI / 180);
        this.ctx.rotate(wobble);
        this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
        this.ctx.restore();

        // If being caught, draw progress arc and web string
        if (ent.type.state === 'beingCaught') {
          // Web string
          const sPos = worldToScreen(engine.spider.position.x, engine.spider.position.y);
          this.ctx.beginPath();
          this.ctx.moveTo(sPos.x, sPos.y);
          this.ctx.lineTo(screen.x, screen.y);
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          this.ctx.stroke();

          // Progress arc
          this.ctx.beginPath();
          this.ctx.arc(screen.x, screen.y, 20, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * ent.type.catchProgress));
          this.ctx.strokeStyle = 'white';
          this.ctx.lineWidth = 3;
          this.ctx.stroke();
        }
      }
    });

    this.ctx.restore();
  }
}
