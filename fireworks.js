// 烟花特效
(function () {
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d', { alpha: true });
  var W, H, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = window.innerWidth * dpr;
    H = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  var MAX_PARTICLES = 300;
  var particles = [];
  var rockets = [];
  var colors = ['#22d3ee', '#a78bfa', '#f472b6', '#fbbf24', '#34d399', '#60a5fa'];

  function Particle(x, y, vx, vy, color, size) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.color = color; this.size = size;
    this.alpha = 1; this.life = 1;
  }

  function Rocket(x, targetY) {
    this.x = x;
    this.y = window.innerHeight;
    this.targetY = targetY;
    this.speed = 3 + Math.random() * 2;
    this.palette = colors[Math.floor(Math.random() * colors.length)];
    this.dead = false;
  }

  function explode(r) {
    var count = 35 + Math.floor(Math.random() * 25);
    for (var i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
      var angle = (Math.PI * 2 / count) * i;
      var speed = 1.5 + Math.random() * 2.5;
      var color = Math.random() < 0.7 ? r.palette : colors[Math.floor(Math.random() * colors.length)];
      particles.push(new Particle(r.x, r.y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 1 + Math.random() * 1.5));
    }
  }

  var lastLaunch = 0;

  function loop(time) {
    requestAnimationFrame(loop);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, W / dpr, H / dpr);
    ctx.globalCompositeOperation = 'lighter';

    if (time - lastLaunch > 2500 + Math.random() * 2000 && rockets.length < 3) {
      rockets.push(new Rocket(window.innerWidth * (0.15 + Math.random() * 0.7), window.innerHeight * (0.1 + Math.random() * 0.3)));
      lastLaunch = time;
    }

    for (var i = rockets.length - 1; i >= 0; i--) {
      var r = rockets[i];
      r.y -= r.speed;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fill();
      if (r.y <= r.targetY) { explode(r); rockets.splice(i, 1); }
    }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.vy += 0.018;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.012;
      p.alpha = p.life;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(loop);
  document.addEventListener('click', function (e) { rockets.push(new Rocket(e.clientX, e.clientY)); });
})();