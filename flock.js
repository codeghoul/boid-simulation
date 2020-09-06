// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

class Flock {
  // An array for all the boids
  constructor() {
    this.boids = new Array();
    this.kd = new KDTree([]);
    for (let i = 0; i < 150; i++) {
      this.addBoid(new Boid(random() * width, random() * height));
    }
  }

  run(obstacles) {
    for (let i = 0; i < this.boids.length; i++) {
      let neighbors = this.kd.getNeighbors(this.boids[i]);
      this.boids[i].flock(neighbors, obstacles); // Passing the entire list of boids to each boid individually
    }
  }

  update() {
    this.kd = new KDTree(this.boids);
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].update(); // Passing the entire list of boids to each boid individually
    }

    if (debugMode) {
      this.kd.draw();
    }
  }

  addBoid(b) {
    this.boids.push(b);
    this.kd.insert(b);
  }
}
