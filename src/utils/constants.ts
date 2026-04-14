export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;
export const GRID_SIZE = 30;

export const SPIDER_SPEED = 10;
export const CATCH_RADIUS = 4;
export const CARGO_LIMIT = 5;
export const RESPAWN_DELAY = 5000; // ms
export const INSECTS_PER_SPAWN = 5;

export const CATCH_TIMES = {
  fly: 2,
  butterfly: 3,
  beetle: 4,
} as const;

export const WANDER_SPEEDS = {
  fly: 2,
  butterfly: 2,
  beetle: 2,
} as const;

export const WANDER_RADII = {
  fly: 5,
  butterfly: 5,
  beetle: 5,
} as const;

export type InsectType = keyof typeof CATCH_TIMES;
