import { TILE_WIDTH, TILE_HEIGHT } from './constants';

export function worldToScreen(x: number, y: number): { x: number; y: number } {
  return {
    x: (x - y) * (TILE_WIDTH / 2),
    y: (x + y) * (TILE_HEIGHT / 2),
  };
}

export function screenToWorld(px: number, py: number): { x: number; y: number } {
  const halfWidth = TILE_WIDTH / 2;
  const halfHeight = TILE_HEIGHT / 2;
  
  return {
    x: (px / halfWidth + py / halfHeight) / 2,
    y: (py / halfHeight - px / halfWidth) / 2,
  };
}
