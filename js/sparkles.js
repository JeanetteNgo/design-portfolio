/* ─────────────────────────────────────────────
   SPARKLE BURST
   Clicking the dock's Sparkles tile (button[data-action="party"]) shoots
   sparkles up to the nav bar like a party popper, where they scatter and float down. They're added to .home-sparkles
   and removed again once they've faded.
   The look and the animation live in css/features/sparkles.css;
   this file only creates the elements and gives each one random values.
────────────────────────────────────────────── */

(function () {
  const layer = document.querySelector('.home-sparkles');
  const button = document.querySelector('[data-action="party"]');
  if (!layer || !button) return;

  const SHAPES = ['sparkle', 'sparkle', 'star', 'heart', 'dot']; // sparkle listed twice = twice as likely
  const COLOURS = ['var(--sparkle-a)', 'var(--sparkle-b)'];
  const MAX_ON_SCREEN = 120; // fast repeat clicks can't pile up more than this

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  function burst() {
    const narrow = window.innerWidth < 640;
    const count = Math.min(narrow ? 20 : 36, MAX_ON_SCREEN - layer.childElementCount);

    // Start point: the middle of the tile, measured inside the sparkle layer
    const from = button.querySelector('.dock-tile').getBoundingClientRect();
    const box = layer.getBoundingClientRect();
    const x = from.left + from.width / 2 - box.left;
    const y = from.top + from.height / 2 - box.top;

    // Where the shot "hits": the nav bar at the top of the screen
    const nav = document.getElementById('site-nav');
    const topY = (nav ? nav.getBoundingClientRect().bottom : 0) - box.top - 20;
    const room = box.height - topY; // space to float back down in

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = `sparkle sparkle--${pick(SHAPES)}`;

      // After the hit, each one heads for its own column so they cover the full width
      const landX = ((i + rand(0.1, 0.9)) / count) * box.width;
      const landY = topY + rand(10, room * 0.25);

      el.style.left = `${x.toFixed(0)}px`;
      el.style.top = `${y.toFixed(0)}px`;
      el.style.setProperty('--ux', `${rand(-24, 24).toFixed(0)}px`); // slight wobble in the shot
      el.style.setProperty('--uy', `${(topY - y).toFixed(0)}px`);
      el.style.setProperty('--dx', `${(landX - x).toFixed(0)}px`);
      el.style.setProperty('--dy', `${(landY - y).toFixed(0)}px`);
      el.style.setProperty('--fall', `${rand(room * 0.25, room * 0.6).toFixed(0)}px`);
      el.style.setProperty('--sway', `${rand(-50, 50).toFixed(0)}px`);
      el.style.setProperty('--spin', `${rand(-240, 240).toFixed(0)}deg`);
      el.style.setProperty('--size', `${Math.round(rand(12, 26))}px`);
      el.style.setProperty('--colour', pick(COLOURS));
      el.style.setProperty('--duration', `${rand(3.2, 4.6).toFixed(2)}s`);
      el.style.setProperty('--delay', `${rand(0, 0.18).toFixed(2)}s`); // leave as a stream, not a clump

      el.addEventListener('animationend', () => el.remove());
      layer.appendChild(el);
    }

    // Restart the icon's little "pop" wiggle
    button.classList.remove('is-popping');
    void button.offsetWidth;
    button.classList.add('is-popping');
  }

  button.addEventListener('click', burst);
})();
