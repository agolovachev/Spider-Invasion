import { Insect } from './Insect';
import { INSECTS_PER_SPAWN, RESPAWN_DELAY, type InsectType, GRID_SIZE } from '../utils/constants';

interface SpawnPoint {
  x: number;
  y: number;
  type: InsectType;
  respawnTimers: number[];
}

export class Spawner {
  spawnPoints: SpawnPoint[];

  insects: Insect[] = [];

  constructor() {
    const center = GRID_SIZE / 2;
    const offset = GRID_SIZE / 4;
    
    this.spawnPoints = [
      { x: center - offset, y: center - offset, type: 'fly', respawnTimers: [] },
      { x: center + offset, y: center - offset, type: 'butterfly', respawnTimers: [] },
      { x: center - offset, y: center + offset, type: 'beetle', respawnTimers: [] },
      { x: center + offset, y: center + offset, type: 'fly', respawnTimers: [] },
      { x: center, y: center - offset, type: 'butterfly', respawnTimers: [] },
      { x: center, y: center + offset, type: 'beetle', respawnTimers: [] },
      { x: center - offset, y: center, type: 'butterfly', respawnTimers: [] },
      { x: center + offset, y: center, type: 'beetle', respawnTimers: [] },
    ];

    this.initialSpawn();
  }

  private initialSpawn() {
    this.spawnPoints.forEach(sp => {
      for (let i = 0; i < INSECTS_PER_SPAWN; i++) {
        this.insects.push(new Insect(sp.type, sp.x, sp.y));
      }
    });
  }

  update(dt: number, spider: any, catchRadius: number) {
    // Update existing insects
    this.insects.forEach(insect => {
      insect.update(dt, spider.position, spider.isFull, catchRadius);
    });

    // Handle caught insects
    const caught = this.insects.filter(i => i.state === 'caught');
    caught.forEach(i => {
      // Add to spider cargo
      if (spider.cargo.length < 5) {
        spider.cargo.push(i);
        // Find the spawn point
        const sp = this.spawnPoints.find(p => p.x === i.spawnPoint.x && p.y === i.spawnPoint.y);
        if (sp) {
          sp.respawnTimers.push(RESPAWN_DELAY);
        }
      }
    });

    // Remove caught insects from world
    this.insects = this.insects.filter(i => i.state !== 'caught');

    // Handle respawning
    this.spawnPoints.forEach(sp => {
      for (let i = sp.respawnTimers.length - 1; i >= 0; i--) {
        sp.respawnTimers[i] -= dt * 1000;
        if (sp.respawnTimers[i] <= 0) {
          this.insects.push(new Insect(sp.type, sp.x, sp.y));
          sp.respawnTimers.splice(i, 1);
        }
      }
    });
  }
}
