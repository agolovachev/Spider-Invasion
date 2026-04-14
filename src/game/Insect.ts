import { type InsectType, WANDER_RADII, WANDER_SPEEDS, CATCH_TIMES } from '../utils/constants';

export class Insect {
  id: string;
  position: { x: number; y: number };
  spawnPoint: { x: number; y: number };
  targetPosition: { x: number; y: number };
  state: 'wandering' | 'beingCaught' | 'caught' = 'wandering';
  catchProgress = 0;
  waitTime = 0;
  
  constructor(
    public type: InsectType,
    spawnX: number,
    spawnY: number
  ) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.spawnPoint = { x: spawnX, y: spawnY };
    this.position = { ...this.spawnPoint };
    this.targetPosition = this.getRandomTarget();
  }

  private getRandomTarget() {
    const radius = WANDER_RADII[this.type];
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    // Note: radius is in world units, same as position
    return {
      x: this.spawnPoint.x + Math.cos(angle) * dist,
      y: this.spawnPoint.y + Math.sin(angle) * dist,
    };
  }

  update(dt: number, spiderPos: { x: number; y: number }, isSpiderFull: boolean, isTargeted: boolean) {
    if (this.state === 'caught') return;

    if (isTargeted && !isSpiderFull) {
      this.state = 'beingCaught';
      this.catchProgress += (1 / CATCH_TIMES[this.type]) * dt;
      if (this.catchProgress >= 1) {
        this.state = 'caught';
        this.catchProgress = 1;
      }
    } else {
      this.state = 'wandering';
      this.catchProgress = 0;

      // Wandering logic
      if (this.waitTime > 0) {
        this.waitTime -= dt;
      } else {
        const dx = this.targetPosition.x - this.position.x;
        const dy = this.targetPosition.y - this.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) {
          this.waitTime = 1 + Math.random(); // Wait 1-2s
          this.targetPosition = this.getRandomTarget();
        } else {
          const speed = WANDER_SPEEDS[this.type];
          this.position.x += (dx / dist) * speed * dt;
          this.position.y += (dy / dist) * speed * dt;
        }
      }
    }
  }
}
