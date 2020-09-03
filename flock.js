// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

class Flock {
  // An array for all the boids
  constructor() {
    this.boids = new Array();
  }

  run(obstacles) {
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].flock(this.boids, obstacles); // Passing the entire list of boids to each boid individually
    }
  }

  update() {
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].update(); // Passing the entire list of boids to each boid individually
    }
  }

  addBoid(b) {
    this.boids.push(b);
  }
}
