export class Nest {
  position = { x: 10, y: 10 }; // Center of the map
  deliveredCount = 0;
  radius = 30; // World units for collision

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
