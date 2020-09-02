let flock;

function setup() {
  createCanvas(vmin(80), vmin(80), P2D);
  img = loadImage("img/bug20.svg");
  flock = new Flock();
  for (let i = 0; i < 50; i++) {
    let b = new Boid(width / 2, height / 2);
    flock.addBoid(b);
  }
}

function draw() {
  background(255);
  flock.run();
  flock.update();
  let fps = frameRate();
  fill(127);
  text("FPS: " + fps.toFixed(2), 15, height - 15);
}

function vmin(viewportPercent) {
  viewportPercent = viewportPercent / 100;
  var viewportMinSize = Math.min(window.innerWidth, window.innerHeight);
  return viewportPercent * viewportMinSize;
}
