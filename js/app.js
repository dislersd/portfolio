// $(window).load(function() {
//   $("body").removeClass("preload");
// });

const background = () => {
  //   var canvas = document.getElementById("container");
  //   var clone = document.getElementById("blurCanvasBottom");

  //   var cloneCtx = clone.getContext("2d");
  //   var ctx = canvas.getContext("2d");

  //   var w = $("#blurCanvasTop").width();
  //   var h = $("#blurCanvasTop").height();

  //   var ww = $(window).width();
  //   var wh = $(window).height();
  //   canvas.width = ww;
  //   canvas.height = wh;
  //   var partCount = 500;
  //   var particles = [];

  //   function particle() {
  //     colors = ["rgb(200, 230, 221)", "rgb(247, 100, 100)"];
  //     this.color = colors[Math.floor(Math.random() * colors.length)];
  //     this.x = randomInt(0, ww);
  //     this.y = randomInt(0, wh);
  //     this.direction = {
  //       x: -1 + Math.random() * 2,
  //       y: -1 + Math.random() * 2
  //     };
  //     this.vx = 0.4 * Math.random();
  //     this.vy = 0.4 * Math.random();
  //     this.radius = randomInt(0.8, 3);
  //     this.float = function() {
  //       this.x += this.vx * this.direction.x;
  //       this.y += this.vy * this.direction.y;
  //     };
  //     this.changeDirection = function(axis) {
  //       this.direction[axis] *= -1;
  //     };
  //     this.boundaryCheck = function() {
  //       if (this.x >= ww) {
  //         this.x = ww;
  //         this.changeDirection("x");
  //       } else if (this.x <= 0) {
  //         this.x = 0;
  //         this.changeDirection("x");
  //       }
  //       if (this.y >= wh) {
  //         this.y = wh;
  //         this.changeDirection("y");
  //       } else if (this.y <= 0) {
  //         this.y = 0;
  //         this.changeDirection("y");
  //       }
  //     };
  //     this.draw = function() {
  //       ctx.beginPath();
  //       ctx.fillStyle = this.color;
  //       ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  //       ctx.fill();
  //     };
  //   }
  //   function clearCanvas() {
  //     cloneCtx.clearRect(0, 0, ww, wh);
  //     ctx.clearRect(0, 0, ww, wh);
  //   }
  //   function createParticles() {
  //     for (i = 0; i < partCount; i++) {
  //       var p = new particle();
  //       particles.push(p);
  //     }
  //   }
  //   function drawParticles() {
  //     for (i = 0; i < particles.length; i++) {
  //       p = particles[i];
  //       p.draw();
  //     }
  //   }
  //   function updateParticles() {
  //     for (var i = particles.length - 1; i >= 0; i--) {
  //       p = particles[i];
  //       p.float();
  //       p.boundaryCheck();
  //     }
  //   }
  //   createParticles();
  //   drawParticles();
  //   function animateParticles() {
  //     clearCanvas();
  //     drawParticles();
  //     updateParticles();
  //     cloneCtx.drawImage(canvas, 0, 0);
  //     requestAnimationFrame(animateParticles);
  //   }
  //   requestAnimationFrame(animateParticles);
  //   cloneCtx.drawImage(canvas, 0, 0);

  //   $(window).on("resize", function() {
  //     ww = $(window).width();
  //     wh = $(window).height();
  //     canvas.width = ww;
  //     canvas.height = wh;
  //     clearCanvas();
  //     particles = [];
  //     createParticles();
  //     drawParticles();
  //   });
  //   function randomInt(min, max) {
  //     return Math.floor(Math.random() * (max - min + 1) + min);
  //   }
  //   function velocityInt(min, max) {
  //     return Math.random() * (max - min + 1) + min;
  //   }
  // };

  var NUM_PARTICLES = (ROWS = 150) * (COLS = 300),
    THICKNESS = Math.pow(80, 2),
    SPACING = 4,
    MARGIN = 100,
    COLOR = 1,
    DRAG = 0.95,
    EASE = 0.25,
    /*
    
    used for sine approximation, but Math.sin in Chrome is still fast enough :)http://jsperf.com/math-sin-vs-sine-approximation

    B = 4 / Math.PI,
    C = -4 / Math.pow( Math.PI, 2 ),
    P = 0.225,

    */

    container,
    particle,
    canvas,
    mouse,
    stats,
    list,
    ctx,
    tog,
    man,
    dx,
    dy,
    mx,
    my,
    d,
    t,
    f,
    a,
    b,
    i,
    n,
    w,
    h,
    p,
    s,
    r,
    c;

  particle = {
    vx: 0,
    vy: 0,
    x: 0,
    y: 0
  };

  function init() {
    container = document.getElementById("container");
    canvas = document.createElement("canvas");

    ctx = canvas.getContext("2d");
    man = false;
    tog = true;

    list = [];

    var ww = $(window).width();
    var wh = $(window).height();
    canvas.width = ww;
    canvas.height = wh;

    w = canvas.width = COLS * SPACING + MARGIN * 2;
    h = canvas.height = ROWS * SPACING + MARGIN * 2;

    container.style.marginLeft = Math.round(w * -0.5) + "px";
    container.style.marginTop = Math.round(h * -0.5) + "px";

    for (i = 0; i < NUM_PARTICLES; i++) {
      p = Object.create(particle);
      p.x = p.ox = MARGIN + SPACING * (i % COLS);
      p.y = p.oy = MARGIN + SPACING * Math.floor(i / COLS);

      list[i] = p;
    }

    container.addEventListener("mousemove", function(e) {
      bounds = container.getBoundingClientRect();
      mx = e.clientX - bounds.left;
      my = e.clientY - bounds.top;
      man = true;
    });

    if (typeof Stats === "function") {
      document.body.appendChild((stats = new Stats()).domElement);
    }

    container.appendChild(canvas);
  }

  function step() {
    if (stats) stats.begin();

    if ((tog = !tog)) {
      if (!man) {
        t = +new Date() * 0.001;
        mx = w * 0.5 + Math.cos(t * 2.1) * Math.cos(t * 0.9) * w * 0.45;
        my =
          h * 0.5 + Math.sin(t * 3.2) * Math.tan(Math.sin(t * 0.8)) * h * 0.45;
      }

      for (i = 0; i < NUM_PARTICLES; i++) {
        p = list[i];

        d = (dx = mx - p.x) * dx + (dy = my - p.y) * dy;
        f = -THICKNESS / d;

        if (d < THICKNESS) {
          t = Math.atan2(dy, dx);
          p.vx += f * Math.cos(t);
          p.vy += f * Math.sin(t);
        }

        p.x += (p.vx *= DRAG) + (p.ox - p.x) * EASE;
        p.y += (p.vy *= DRAG) + (p.oy - p.y) * EASE;
      }
    } else {
      b = (a = ctx.createImageData(w, h)).data;

      for (i = 0; i < NUM_PARTICLES; i++) {
        p = list[i];
        (b[(n = (~~p.x + ~~p.y * w) * 4)] = b[n + 1] = b[n + 2] = COLOR),
          (b[n + 3] = 255);
      }

      ctx.putImageData(a, 0, 0);
    }

    if (stats) stats.end();

    requestAnimationFrame(step);
  }

  init();
  step();
};

$(document).ready(background);
