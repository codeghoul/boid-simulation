let flock;
const obstacles = [];
let running = true;

function setup() {
  createCanvas(vmin(80), vmin(80), P2D);
  imageMode(CENTER);
  img = loadImage("img/butterfly20.svg");
  obstacle = loadImage("img/tornado.svg");
  flock = new Flock();
  for (let i = 0; i < 150; i++) {
    let b = new Boid(width / 2, height / 2);
    flock.addBoid(b);
  }
}

function draw() {
  if (!running) {
    return;
  }

  background(255);

  for (let o of obstacles) {
    o.render();
  }

  flock.run(obstacles);
  flock.update();

  let fps = frameRate();
  fill(0);
  text("FPS: " + fps.toFixed(2), 15, height - 15);
}

function vmin(viewportPercent) {
  viewportPercent = viewportPercent / 100;
  var viewportMinSize = Math.min(window.innerWidth, window.innerHeight);
  return viewportPercent * viewportMinSize;
}

function keyPressed() {
  switch (key) {
    case "p":
      running = !running;
      break;
    default:
      break;
  } // flip the boolean
}

function mouseClicked() {
  obstacles.push(new Obstacle(mouseX, mouseY));
}
