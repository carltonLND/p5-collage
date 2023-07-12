new p5(vectorDrawing);
new p5(walkDrawing);
new p5(noiseDrawing);

function vectorDrawing(p5) {
  let selectedCircle;

  const circleArray = [];
  const circleUndoArray = [];

  let jiggle = false;
  let circlesHidden = false;

  p5.setup = function () {
    const parentElement = document.getElementById("vector-container");
    const canvas = p5.createCanvas(
      parentElement.offsetWidth,
      parentElement.offsetHeight
    );
    canvas.parent(parentElement);
    canvas.id("vector-canvas");
  };

  p5.draw = function () {
    p5.background("gray");
    connectAllCircles("orange");
    drawAllCircles("lightblue");
    jiggleAllCircles();
  };

  p5.keyPressed = function () {
    switch (p5.key) {
      case " ":
        newCircleObj(p5.mouseX, p5.mouseY, 20);
        break;
      case "c":
        circleArray.splice(0, circleArray.length);
        break;
      case "j":
        jiggle = jiggle === false ? true : false;
        break;
      case "h":
        circlesHidden = circlesHidden === false ? true : false;
        break;
    }

    if (p5.keyIsDown(p5.CONTROL)) {
      switch (p5.key) {
        case "z":
          if (circleArray.length !== 0) {
            circleUndoArray.push(circleArray.pop());
          }
          break;
        case "y":
          if (circleUndoArray.length !== 0) {
            circleArray.push(circleUndoArray.pop());
          }
          break;
      }
    }
  };

  p5.mousePressed = function () {
    if (p5.mouseButton === p5.LEFT) {
      selectCircle();
      if (selectedCircle == undefined) {
        return;
      }

      updateCirclePosition();
    }
  };

  p5.mouseReleased = function () {
    selectedCircle = undefined;
  };

  p5.mouseDragged = function () {
    if (selectedCircle === undefined) {
      return;
    }

    updateCirclePosition();
  };

  function selectCircle(deviation = 0) {
    for (const circleObj of circleArray) {
      const offsetX = circleObj.x - p5.mouseX;
      const offsetY = circleObj.y - p5.mouseY;
      const absX = p5.abs(offsetX);
      const absY = p5.abs(offsetY);
      const distance = circleObj.size / 2 + deviation;

      if (absX <= distance && absY <= distance) {
        if (
          selectedCircle === undefined ||
          (absX < selectedCircle.x && absY < selectedCircle.y)
        ) {
          selectedCircle = circleObj;
          selectedCircle.offsetX = offsetX;
          selectedCircle.offsetY = offsetY;
        }
      }
    }
  }

  function newCircleObj(x, y, size) {
    const newCircle = {
      x,
      y,
      size,
    };
    circleArray.push(newCircle);
    return newCircle;
  }

  function connectAllCircles(color) {
    p5.push();
    p5.fill(color);
    p5.beginShape();
    for (const circleObj of circleArray) {
      p5.vertex(circleObj.x, circleObj.y);
    }
    p5.endShape(p5.CLOSE);
    p5.pop();
  }

  function drawAllCircles(color) {
    if (circlesHidden) {
      return;
    }

    p5.push();
    p5.fill(color);
    for (const circleObj of circleArray) {
      p5.circle(circleObj.x, circleObj.y, circleObj.size);
    }
    p5.pop();
  }

  function updateCirclePosition() {
    selectedCircle.x = p5.mouseX + selectedCircle.offsetX;
    selectedCircle.y = p5.mouseY + selectedCircle.offsetY;
  }

  function jiggleAllCircles() {
    if (jiggle === false) {
      return;
    }

    for (const circleObj of circleArray) {
      const deviationX = p5.random([-1, 1]);
      const deviationY = p5.random([-1, 1]);
      circleObj.x += deviationX;
      circleObj.y += deviationY;
    }
  }
}

function walkDrawing(p5) {
  const palette = ["#0d3b66", "f#af0ca", "#f4d35e", "#ee964b", "#f95738"];
  const circles = [];

  p5.setup = function () {
    const parentElement = document.getElementById("walk-container");
    const canvas = p5.createCanvas(
      parentElement.offsetWidth,
      parentElement.offsetHeight
    );
    canvas.parent(parentElement);
    canvas.id("walk-canvas");

    p5.background("black");
    createNumCircles(palette.length);
  };

  p5.draw = function () {
    p5.noStroke();
    for (const circ of circles) {
      p5.fill(circ.color);
      p5.circle(circ.x, circ.y, 20);
      updateCirclePos(circ);
    }
  };

  function createCircle() {
    const color = p5.random(palette);
    palette.splice(palette.indexOf(color), 1);
    return {
      x: p5.random() * p5.width,
      y: p5.random() * p5.height,
      velocity: 0.01,
      color: color,
    };
  }

  function createNumCircles(times) {
    for (let i = 0; i < times; i++) {
      circles.push(createCircle());
    }
  }

  function updateCirclePos(circ) {
    circ.x += p5.random([-1, 1]) * circ.velocity;
    circ.y += p5.random([-1, 1]) * circ.velocity;
    circ.velocity += p5.noise(circ.x, circ.y) * 0.01;
  }
}

function noiseDrawing(p5) {
  const drawLayer1 = setupLayer(0.1);
  const drawLayer2 = setupLayer(0.01);

  p5.setup = function () {
    const parentElement = document.getElementById("noise-container");
    const canvas = p5.createCanvas(
      parentElement.offsetWidth,
      parentElement.offsetHeight
    );
    canvas.parent(parentElement);
    canvas.id("noise-canvas");
  };

  p5.draw = function () {
    p5.background("black");

    drawLayer1("white");
    drawLayer2("gray");
  };

  function setupLayer(speed) {
    let start = 0;
    let off = 0;
    let inc = speed;

    return (color) => {
      p5.stroke(color);
      p5.noFill();

      const graphWidth = Math.ceil(p5.width * 0.7);
      off = start;
      for (let x = 0; x <= graphWidth; x++) {
        const n = p5.noise(off) * p5.height;
        p5.line(x, n, x, p5.height);
        off += inc;

        if (x === graphWidth) {
          p5.line(p5.width, p5.height / 2, x, n);
        }
      }

      start += inc;
    };
  }
}
