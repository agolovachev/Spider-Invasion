export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;
export const GRID_SIZE = 20;

export const SPIDER_SPEED = 80;
export const CATCH_RADIUS = 40;
export const CARGO_LIMIT = 5;
export const RESPAWN_DELAY = 5000; // ms
export const INSECTS_PER_SPAWN = 3;

export const CATCH_TIMES = {
  fly: 2,
  butterfly: 3,
  beetle: 4,
} as const;

export const WANDER_SPEEDS = {
  fly: 60,
  butterfly: 45,
  beetle: 30,
} as const;

export const WANDER_RADII = {
  fly: 80,
  butterfly: 60,
  beetle: 40,
} as const;

export type InsectType = keyof typeof CATCH_TIMES;
