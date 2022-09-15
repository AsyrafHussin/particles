const canvasSketch = require("canvas-sketch");
const { range } = require("canvas-sketch-util/random");
const { mapRange } = require("canvas-sketch-util/math");

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Particle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(range(-1, 1), range(-1, 1));
    this.radius = range(4, 12);
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = ({ width, height }) => {
  const particles = [];

  for (let i = 0; i < 40; i++) {
    const x = range(0, width);
    const y = range(0, height);
    particles.push(new Particle(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];

        const dist = particle.pos.getDistance(other.pos);

        if (dist > 200) continue;

        context.lineWidth = mapRange(dist, 0, 200, 6, 1);

        context.beginPath();
        context.moveTo(particle.pos.x, particle.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

    particles.map((particle) => {
      particle.update();
      particle.draw(context);
      particle.bounce(width, height);
    });
  };
};

canvasSketch(sketch, settings);
