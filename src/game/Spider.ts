import { INSECTS_PER_SPAWN, SPIDER_SPEED, CARGO_LIMIT, GRID_SIZE } from '../utils/constants';

export interface Position {
  x: number;
  y: number;
}

export class Spider {
  position: Position = { x: GRID_SIZE / 2, y: GRID_SIZE / 2 }; // Start near center of grid
  cargo: any[] = []; // Will be Insect[]
  isFull = false;
  direction = { x: 0, y: 0 };

  update(dt: number) {
    // Movement
    if (this.direction.x !== 0 || this.direction.y !== 0) {
      // Normalize direction if needed
      const length = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);
      if (length > 0) {
        const dx = (this.direction.x / length) * SPIDER_SPEED * dt;
        const dy = (this.direction.y / length) * SPIDER_SPEED * dt;
        this.position.x += dx;
        this.position.y += dy;
      }
    }

    this.isFull = this.cargo.length >= CARGO_LIMIT;
  }

  setDirection(dx: number, dy: number) {
    this.direction = { x: dx, y: dy };
  }
}
