let flock;

function setup() {
  createCanvas(vmin(100), vmin(80), P2D);
  img = loadImage("img/bug.svg");
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = -5;
  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = "black";
  flock = new Flock();
  for (let i = 0; i < 50; i++) {
    let b = new Boid(width / 2, height / 2);
    flock.addBoid(b);
  }
}

function draw() {
  background(127);
  flock.run();
  flock.update();
}

// // Add a new boid into the System
// function mouseDragged() {
//   flock.addBoid(new Boid(mouseX, mouseY));
// }

function vmin(viewportPercent) {
  viewportPercent = viewportPercent / 100;
  var viewportMinSize = Math.min(window.innerWidth, window.innerHeight);
  return viewportPercent * viewportMinSize;
}
