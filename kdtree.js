class KDTree {
  constructor(boids) {
    this.root = null;
    this.size = 0;
    for (let boid of boids) {
      this.insert(boid);
    }
  }

  isEmpty() {
    return this.size === 0;
  }

  insert(boid) {
    if (this.isEmpty()) {
      this.root = this.insertV(this.root, boid, null);
    } else {
      this.root = this.insertV(this.root, boid, this.root.rect);
    }
  }

  insertV(current, boid, rect) {
    if (current == null) {
      this.size++;
      return new Node(boid, rect);
    }

    let cmp = this.compareX(boid, current.boid);
    let newRect;

    if (cmp < 0) {
      if (current.lb == null) {
        newRect = new Rectangle(
          rect.xmin,
          rect.ymin,
          current.boid.position.x,
          rect.ymax
        );
      } else {
        newRect = current.lb.rect;
      }

      current.lb = this.insertH(current.lb, boid, newRect);
    } else {
      if (current.rt == null) {
        newRect = new Rectangle(
          current.boid.position.x,
          rect.ymin,
          rect.xmax,
          rect.ymax
        );
      } else {
        newRect = current.rt.rect;
      }

      current.rt = this.insertH(current.rt, boid, newRect);
    }

    return current;
  }

  insertH(current, boid, rect) {
    if (current == null) {
      this.size++;
      return new Node(boid, rect);
    }

    let cmp = this.compareY(boid, current.boid);
    let newRect;

    if (cmp < 0) {
      if (current.lb == null) {
        newRect = new Rectangle(
          rect.xmin,
          rect.ymin,
          rect.xmax,
          current.boid.position.y
        );
      } else {
        newRect = current.lb.rect;
      }

      current.lb = this.insertV(current.lb, boid, newRect);
    } else {
      if (current.rt == null) {
        newRect = new Rectangle(
          rect.xmin,
          current.boid.position.y,
          rect.xmax,
          rect.ymax
        );
      } else {
        newRect = current.rt.rect;
      }

      current.rt = this.insertV(current.rt, boid, newRect);
    }

    return current;
  }

  getNeighbors(boid) {
    let neighbors = [];
    let rect = new Rectangle(
      Math.max(0, boid.position.x - 50),
      Math.max(0, boid.position.y - 50),
      Math.min(width, boid.position.x + 50),
      Math.min(height, boid.position.y + 50)
    );
    this.rangeV(this.root, boid, neighbors, rect);
    return neighbors;
  }

  rangeV(current, boid, neighbors, rect) {
    if (current == null) {
      return;
    }

    if (current.boid != boid && rect.contains(current.boid)) {
      neighbors.push(current.boid);
    }

    let x = current.boid.position.x;

    if (rect.xmin <= x && x <= rect.xmax) {
      this.rangeH(current.lb, boid, neighbors, rect);
      this.rangeH(current.rt, boid, neighbors, rect);
    } else if (rect.xmax < x) {
      this.rangeH(current.lb, boid, neighbors, rect);
    } else {
      this.rangeH(current.rt, boid, neighbors, rect);
    }
  }

  rangeH(current, boid, neighbors, rect) {
    if (current == null) {
      return;
    }

    if (current.boid != boid && rect.contains(current.boid)) {
      neighbors.push(current.boid);
    }

    let y = current.boid.position.y;

    if (rect.ymin <= y && y <= rect.ymax) {
      this.rangeV(current.lb, boid, neighbors, rect);
      this.rangeV(current.rt, boid, neighbors, rect);
    } else if (rect.ymax < y) {
      this.rangeV(current.lb, boid, neighbors, rect);
    } else {
      this.rangeV(current.rt, boid, neighbors, rect);
    }
  }

  compareX(p, q) {
    if (p.position.x < q.position.x) return -1;
    if (p.position.x > q.position.x) return +1;
    return 0;
  }

  compareY(p, q) {
    if (p.position.y < q.position.y) return -1;
    if (p.position.y > q.position.y) return +1;
    return 0;
  }

  draw() {
    if (this.isEmpty()) {
      return;
    }

    this.drawV(this.root);
  }

  drawV(current) {
    if (current.lb != null) {
      this.drawH(current.lb);
    }

    if (current.rt != null) {
      this.drawH(current.rt);
    }

    stroke("red");
    line(
      current.boid.position.x,
      current.rect.ymin,
      current.boid.position.x,
      current.rect.ymax
    );
    noStroke();
  }

  drawH(current) {
    if (current.lb != null) {
      this.drawV(current.lb);
    }

    if (current.rt != null) {
      this.drawV(current.rt);
    }

    stroke("blue");
    line(
      current.rect.xmin,
      current.boid.position.y,
      current.rect.xmax,
      current.boid.position.y
    );
    noStroke();
  }
}

class Node {
  constructor(boid, rect) {
    if (rect === null) {
      rect = new Rectangle(0, 0, width, height);
    }
    this.boid = boid;
    this.rect = rect;
    this.lb = null;
    this.rt = null;
  }
}

class Rectangle {
  constructor(xmin, ymin, xmax, ymax) {
    this.xmin = xmin;
    this.ymin = ymin;
    this.xmax = xmax;
    this.ymax = ymax;
    // Add checks later.
  }

  intersects(other) {
    return (
      this.xmax >= other.xmin &&
      this.ymax >= other.ymin &&
      other.xmax >= this.xmin &&
      other.ymax >= this.ymin
    );
  }

  contains(boid) {
    return (
      boid.position.x >= this.xmin &&
      boid.position.x <= this.xmax &&
      boid.position.y >= this.ymin &&
      boid.position.y <= this.ymax
    );
  }
}
