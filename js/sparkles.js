/* ─────────────────────────────────────────────
   SPARKLE BURST
   Clicking the dock's Sparkles tile (button[data-action="party"]) fires
   a stream of sparkles out of the icon like a party popper: they shoot up,
   fanning out a little, glance off the nav bar in random directions, then
   flutter down and fade out when they touch the dock's washi tape.
   The shapes and colours live in css/features/sparkles.css; this file
   creates the elements and moves them with a small physics loop.
────────────────────────────────────────────── */

(function () {
  const layer = document.querySelector('.home-sparkles');
  const button = document.querySelector('[data-action="party"]');
  if (!layer || !button) return;

  const SHAPES = ['sparkle', 'sparkle', 'star', 'heart', 'dot']; // sparkle listed twice = twice as likely
  const COLOURS = ['var(--sparkle-a)', 'var(--sparkle-b)'];
  const MAX_ON_SCREEN = 120; // fast repeat clicks can't pile up more than this

  // Feel of the motion
  const FAN = 20; // degrees either side of straight up as they shoot
  const DRAG = 3; // air resistance: higher = they slow down sooner
  const GRAVITY = 140; // higher = they float down faster
  const BOUNCE = 0.55; // how much speed survives the bounce off the nav
  const FADE = 0.5; // seconds to fade out once they touch the tape
  const STREAM = 0.7; // seconds the icon keeps firing for
  const SCATTER = 1.3; // how hard they glance sideways off the nav
  const FLUTTER = 160; // how much they waft side to side on the way down

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let sparkles = []; // the ones currently flying
  let lastTime = 0;

  /** A mix of sizes: mostly small and medium, a few big ones. */
  function _size() {
    const roll = Math.random();
    if (roll < 0.4) return rand(6, 10);
    if (roll < 0.8) return rand(8, 14);
    return rand(20, 28);
  }

  /** Where things are right now, measured inside the sparkle layer. */
  function _bounds() {
    const box = layer.getBoundingClientRect();
    const tile = button.querySelector('.dock-tile').getBoundingClientRect();
    const nav = document.getElementById('site-nav');
    const strip = document.querySelector('.dock-strip');
    return {
      width: box.width,
      startX: tile.left + tile.width * 0.6 - box.left, // the popper's mouth
      startY: tile.top + tile.height * 0.35 - box.top,
      ceiling: (nav ? nav.getBoundingClientRect().bottom : 0) - box.top - 24, // just inside the nav bar
      floor: strip.getBoundingClientRect().top - box.top, // top edge of the washi tape
    };
  }

  function _create(size) {
    const el = document.createElement('span');
    el.className = `sparkle sparkle--${pick(SHAPES)}`;
    el.style.setProperty('--size', `${Math.round(size)}px`);
    el.style.setProperty('--colour', pick(COLOURS));
    layer.appendChild(el);
    return el;
  }

  function burst() {
    const narrow = window.innerWidth < 640;
    const count = Math.min(narrow ? 20 : 36, MAX_ON_SCREEN - layer.childElementCount);
    const b = _bounds();

    if (reducedMotion.matches) {
      // No flying: a scatter fades in between the nav and the dock, then out again
      for (let i = 0; i < count; i++) {
        const el = _create(_size());
        el.classList.add('sparkle--still');
        el.style.setProperty('--opacity', rand(0.4, 0.9).toFixed(2));
        el.style.left = `${(((i + rand(0.1, 0.9)) / count) * b.width).toFixed(0)}px`;
        el.style.top = `${rand(b.ceiling + 30, b.floor - 20).toFixed(0)}px`;
        el.addEventListener('animationend', () => el.remove());
      }
      return;
    }

    // Queue them up; _tick releases them one after another over STREAM seconds
    const climb = b.startY - b.ceiling;
    for (let i = 0; i < count; i++) {
      const size = _size();
      // Adding two random numbers keeps most of the stream near the middle of the fan
      const angle = ((rand(-FAN, FAN) + rand(-FAN, FAN)) / 2) * (Math.PI / 180);
      const speed = climb * DRAG * rand(1.6, 2.6); // enough to reach the nav
      sparkles.push({
        el: _create(size),
        b,
        x: b.startX,
        y: b.startY,
        vx: Math.sin(angle) * speed,
        vy: -Math.cos(angle) * speed,
        bounced: false,
        weight: rand(0.7, 1.3) * (0.7 + size / 40), // bigger ones fall a little faster
        opacity: rand(0.45, 1),
        angle: rand(0, 360),
        spin: rand(-360, 360),
        flutterSpeed: rand(1.5, 3),
        flutterPhase: rand(0, 6.28),
        age: -(i / count) * STREAM, // negative = still waiting its turn to leave
        fading: 0,
      });
    }

    if (!lastTime) {
      lastTime = performance.now();
      requestAnimationFrame(_tick);
    }

    // Restart the icon's little "pop" wiggle
    button.classList.remove('is-popping');
    void button.offsetWidth;
    button.classList.add('is-popping');
  }

  function _tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05); // seconds since the last frame
    lastTime = now;

    sparkles = sparkles.filter((s) => {
      s.age += dt;
      if (s.age < 0) return true; // hasn't left yet

      // Air resistance slows it; gravity pulls it down
      s.vx -= s.vx * DRAG * dt;
      s.vy += (GRAVITY * s.weight - s.vy * DRAG) * dt;
      // Once it's falling it wafts from side to side like a scrap of paper
      if (s.bounced) s.vx += Math.sin(s.age * s.flutterSpeed + s.flutterPhase) * FLUTTER * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.angle += s.spin * dt;

      // Glance off the nav bar: lose some speed and deflect sideways by a random amount
      // (one that runs out of steam just short of it simply starts falling)
      if (!s.bounced && (s.y <= s.b.ceiling || s.vy > 0)) {
        const impact = Math.abs(s.vy);
        s.bounced = true;
        s.y = Math.max(s.y, s.b.ceiling);
        s.vy = impact * BOUNCE;
        s.vx += rand(-1, 1) * impact * SCATTER;
        s.spin = rand(-180, 180);
      }
      // Soft bounce off the sides of the screen
      if ((s.x < 0 && s.vx < 0) || (s.x > s.b.width && s.vx > 0)) s.vx = -s.vx * 0.5;

      // Touching the washi tape: start fading
      if (s.bounced && s.y >= s.b.floor) s.fading += dt;
      if (s.fading >= FADE) {
        s.el.remove();
        return false;
      }

      const grow = Math.min(1, 0.4 + s.age * 6); // pops up to full size as it leaves
      s.el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px) rotate(${s.angle.toFixed(0)}deg) scale(${grow.toFixed(2)})`;
      s.el.style.opacity = (s.opacity * (1 - s.fading / FADE)).toFixed(2);
      return true;
    });

    if (sparkles.length) requestAnimationFrame(_tick);
    else lastTime = 0;
  }

  button.addEventListener('click', burst);
})();
