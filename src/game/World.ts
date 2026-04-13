import { GRID_SIZE } from '../utils/constants';

export class World {
  gridSize = GRID_SIZE;
  
  // For now, we just have a static grid. 
  // We could have an array of tile types if we wanted variety.
  
  getTileAt(x: number, y: number) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return null;
    return { type: 'grass' };
  }
}
