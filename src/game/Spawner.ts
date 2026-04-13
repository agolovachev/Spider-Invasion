import { Insect } from './Insect';
import { INSECTS_PER_SPAWN, RESPAWN_DELAY, type InsectType } from '../utils/constants';

interface SpawnPoint {
  x: number;
  y: number;
  type: InsectType;
  respawnTimers: number[];
}

export class Spawner {
  spawnPoints: SpawnPoint[] = [
    { x: 5, y: 5, type: 'fly', respawnTimers: [] },
    { x: 15, y: 5, type: 'butterfly', respawnTimers: [] },
    { x: 5, y: 15, type: 'beetle', respawnTimers: [] },
    { x: 15, y: 15, type: 'fly', respawnTimers: [] },
    { x: 10, y: 5, type: 'butterfly', respawnTimers: [] },
    { x: 10, y: 15, type: 'beetle', respawnTimers: [] },
    { x: 5, y: 10, type: 'butterfly', respawnTimers: [] },
    { x: 15, y: 10, type: 'beetle', respawnTimers: [] },
  ];

  insects: Insect[] = [];

  constructor() {
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
