import { TILE_WIDTH, TILE_HEIGHT } from './constants';

export function worldToScreen(x: number, y: number): { x: number; y: number } {
  return {
    x: x * TILE_WIDTH,
    y: y * TILE_HEIGHT,
  };
}

export function screenToWorld(px: number, py: number): { x: number; y: number } {
  return {
    x: px / TILE_WIDTH,
    y: py / TILE_HEIGHT,
  };
}
