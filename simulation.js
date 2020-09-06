let flock;
let obstacles = [];
let running = true;
let obstacleMode = false;
let debugMode = false;
let canvasContainer;

function setup() {
  canvasContainer = document.getElementById("canvas-container");

  const myCanvas = createCanvas(
    canvasContainer.clientWidth,
    canvasContainer.clientHeight,
    P2D
  );

  myCanvas.parent("canvas-container");
  myCanvas.mouseClicked(addObstacle);

  separationSlider = createSlider(0, 2, 1.4, 0.1);
  alignSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1.1, 0.1);

  separationSlider.parent("seperation");
  alignSlider.parent("alignment");
  cohesionSlider.parent("cohesion");

  imageMode(CENTER);
  img = loadImage("img/bug20.svg");
  obstacle = loadImage("img/tornado.svg");

  flock = new Flock();
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
    case "o":
      obstacles = [];
      obstacleMode = !obstacleMode;
      break;
    case "d":
      debugMode = !debugMode;
      break;
    default:
      break;
  } // flip the boolean
}

function addObstacle() {
  if (!obstacleMode) {
    return;
  }

  obstacles.push(new Obstacle(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight);
}
