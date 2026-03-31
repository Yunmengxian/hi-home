// ============================================
// 烟花效果（性能优化版）
// ============================================

(function () {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  let W, H, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); // 限制 DPR 避免高分屏性能问题
    W = canvas.width = window.innerWidth * dpr;
    H = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // 对象池，避免频繁 GC
  const MAX_PARTICLES = 300;
  const particles = [];
  const rockets = [];

  const colors = ['#22d3ee', '#a78bfa', '#f472b6', '#fbbf24', '#34d399', '#60a5fa'];

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
    const count = 35 + Math.floor(Math.random() * 25); // 减少粒子数
    for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const speed = 1.5 + Math.random() * 2.5;
      const color = Math.random() < 0.7 ? r.palette : colors[Math.floor(Math.random() * colors.length)];
      particles.push(new Particle(
        r.x, r.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        1 + Math.random() * 1.5
      ));
    }
  }

  let lastLaunch = 0;

  function loop(time) {
    requestAnimationFrame(loop);

    // 用半透明清除产生拖尾，不用 clearRect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W / dpr, H / dpr);

    ctx.globalCompositeOperation = 'lighter';

    // 自动发射（间隔拉大）
    if (time - lastLaunch > 2500 + Math.random() * 2000) {
      if (rockets.length < 3) {
        const r = new Rocket(
          window.innerWidth * 0.15 + Math.random() * window.innerWidth * 0.7,
          window.innerHeight * 0.1 + Math.random() * window.innerHeight * 0.3
        );
        rockets.push(r);
        lastLaunch = time;
      }
    }

    // 更新火箭
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.y -= r.speed;

      // 火箭光点
      ctx.beginPath();
      ctx.arc(r.x, r.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fill();

      if (r.y <= r.targetY) {
        explode(r);
        rockets.splice(i, 1);
      }
    }

    // 更新粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.vy += 0.018;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.012;
      p.alpha = p.life;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(loop);

  // 点击发射
  document.addEventListener('click', (e) => {
    const r = new Rocket(e.clientX, e.clientY);
    rockets.push(r);
  });
})();
