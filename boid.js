class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.r = 10;
    this.maxspeed = 3; // Maximum speed
    this.maxforce = 0.15; // Maximum steering force
  }

  // We accumulate a new acceleration each time based on three rules
  flock(otherBoids, obstacles) {
    let neighbors = this.getNeighbors(otherBoids);

    let sep = this.separate(neighbors); // Separation
    let ali = this.align(neighbors); // Alignment
    let coh = this.cohesion(neighbors); // Cohesion
    let obs = this.obstacle(obstacles); // Obstacle Avoidance

    // Arbitrarily weight these forces
    // sep.mult(separationSlider.value());
    // ali.mult(alignSlider.value());
    // coh.mult(cohesionSlider.value());

    sep.mult(1.4);
    ali.mult(1.0);
    coh.mult(1.1);
    obs.mult(1.0);

    // Add the force vectors to acceleration
    this.acceleration.add(sep);
    this.acceleration.add(ali);
    this.acceleration.add(coh);
    this.acceleration.add(obs);
  }

  getNeighbors(boids) {
    const neighbors = [];

    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < 50) {
        neighbors.push(boids[i]);
      }
    }

    return neighbors;
  }

  // Method to update location
  update() {
    this.updateLocation();
    this.borders();
    this.render();
  }

  updateLocation() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  render() {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + radians(90);
    this.rotateAndDrawImage(this.position.x, this.position.y, theta);
  }

  rotateAndDrawImage(x, y, imgAngle) {
    translate(x, y);
    rotate(imgAngle);
    image(img, 0, 0, 20, 20);
    rotate(-imgAngle);
    translate(-x, -y);
  }

  // Wraparound
  borders() {
    this.position.x = (this.position.x + width) % width;
    this.position.y = (this.position.y + height) % height;
  }

  // Separation
  separate(neighbors) {
    let n = neighbors.length;
    let steering = createVector(0, 0);

    for (let i = 0; i < n; i++) {
      let d = p5.Vector.dist(this.position, neighbors[i].position);
      let diff = p5.Vector.sub(this.position, neighbors[i].position);
      diff.div(d * d);
      steering.add(diff);
    }

    // Average -- divide by how many
    if (n > 0) {
      steering.div(n);
      steering.setMag(this.maxspeed);
      steering.sub(this.velocity);
      steering.limit(this.maxforce);
    }

    return steering;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align(neighbors) {
    let n = neighbors.length;
    let steering = createVector();

    for (let i = 0; i < n; i++) {
      steering.add(neighbors[i].velocity);
    }

    if (n > 0) {
      steering.div(n);
      steering.setMag(this.maxspeed);
      steering.sub(this.velocity);
      steering.limit(this.maxforce);
    }

    return steering;
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohesion(neighbors) {
    let n = neighbors.length;
    let steering = createVector(); // Start with empty vector to accumulate all locations

    for (let i = 0; i < n; i++) {
      steering.add(neighbors[i].position); // Add location
    }

    if (n > 0) {
      steering.div(n);
      steering.sub(this.position);
      steering.setMag(this.maxspeed);
      steering.sub(this.velocity);
      steering.limit(this.maxforce);
    }

    return steering;
  }

  obstacle(obstacles) {
    let steering = createVector();

    return steering;
  }
}
