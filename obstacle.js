class Obstacle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.r = random(30, 40);
    this.rotation = 0;
  }

  render() {
    // Draw a triangle rotated in the direction of velocity
    // let theta = this.velocity.heading() + radians(90);
    let x = this.position.x,
      y = this.position.y;

    translate(x, y);
    rotate(this.rotation);
    image(obstacle, 0, 0, this.r, this.r);
    rotate(-this.rotation);
    translate(-x, -y);
    this.rotation += 0.05;
    if (this.rotation > 360) {
      this.rotation = 0;
    }
  }
}
