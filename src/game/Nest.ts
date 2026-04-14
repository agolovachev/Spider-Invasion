import { GRID_SIZE } from '../utils/constants';

export class Nest {
  position = { x: GRID_SIZE / 2, y: GRID_SIZE / 2 }; // Center of the map
  deliveredCount = 0;
  radius = 1.5; // World units for collision, matches nest visual border

  update(spider: any) {
    const dist = Math.sqrt(
      Math.pow(this.position.x - spider.position.x, 2) + 
      Math.pow(this.position.y - spider.position.y, 2)
    );

    if (dist < this.radius && spider.cargo.length > 0) {
      this.deliveredCount += spider.cargo.length;
      spider.cargo = [];
      return true; // Unloaded
    }
    return false;
  }
}
