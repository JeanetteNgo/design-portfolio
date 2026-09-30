/* ─────────────────────────────────────────────
   FLOATING SPARKLES
   Fills .home-sparkles (home page intro) with decorative shapes.
   The look and the float-up animation live in css/features/sparkles.css;
   this file only creates the elements and gives each one random values.
────────────────────────────────────────────── */

(function () {
  const layer = document.querySelector('.home-sparkles');
  if (!layer) return;

  const SHAPES = ['sparkle', 'sparkle', 'star', 'plus', 'dot']; // sparkle listed twice = twice as likely
  const COLOURS = ['var(--sparkle-a)', 'var(--sparkle-b)'];
  const COUNT = window.innerWidth < 640 ? 10 : 22;

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className = `sparkle sparkle--${pick(SHAPES)}`;

    // One per column (with a little jitter) so they spread out instead of clumping
    const x = ((i + rand(0.15, 0.85)) / COUNT) * 100;
    const duration = rand(9, 16);
    const height = rand(0.18, 0.85); // static position for reduced motion (0 = dock, 1 = top)

    el.style.setProperty('--x', `${x.toFixed(1)}%`);
    el.style.setProperty('--size', `${Math.round(rand(14, 28))}px`);
    el.style.setProperty('--colour', pick(COLOURS));
    el.style.setProperty('--duration', `${duration.toFixed(1)}s`);
    el.style.setProperty('--delay', `${(-rand(0, duration)).toFixed(1)}s`); // negative = already mid-flight
    el.style.setProperty('--y', `${(height * 100).toFixed(0)}%`);
    el.style.setProperty('--scale', (1 - 0.7 * height).toFixed(2));
    el.style.setProperty('--opacity', (0.75 * (1 - height)).toFixed(2));

    layer.appendChild(el);
  }
})();
