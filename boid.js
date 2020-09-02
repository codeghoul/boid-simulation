class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.r = 3.0;
    this.maxspeed = 3; // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
  }

  // We accumulate a new acceleration each time based on three rules
  flock(boids) {
    let neighbors = this.getNeighbors(boids);

    let sep = this.separate(neighbors); // Separation
    let ali = this.align(neighbors); // Alignment
    let coh = this.cohesion(neighbors); // Cohesion

    // Arbitrarily weight these forces
    // sep.mult(separationSlider.value());
    // ali.mult(alignSlider.value());
    // coh.mult(cohesionSlider.value());

    sep.mult(1.5);
    ali.mult(0.75);
    coh.mult(1.0);

    // Add the force vectors to acceleration
    this.acceleration.add(sep);
    this.acceleration.add(ali);
    this.acceleration.add(coh);
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
    let theta = this.velocity.heading() + radians(90);
    this.rotateAndDrawImage(this.position.x, this.position.y, 25, 20, theta);
  }

  rotateAndDrawImage(imgX, imgY, imgWidth, imgHeight, imgAngle) {
    imageMode(CENTER);
    translate(imgX + imgWidth / 2, imgY + imgWidth / 2);
    rotate(imgAngle);
    image(img, 0, 0, imgWidth, imgHeight);
    rotate(-imgAngle);
    translate(-(imgX + imgWidth / 2), -(imgY + imgWidth / 2));
    imageMode(CORNER);
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
}
