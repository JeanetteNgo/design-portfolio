/* ─────────────────────────────────────────────
   CONFETTI BURST
   Clicking the dock's Confetti tile (button[data-action="party"]) shoots
   sparkles out of it like a party popper. They're added to .home-sparkles
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

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = `sparkle sparkle--${pick(SHAPES)}`;

      // Fan out upwards: 0° is straight up, ±80° either side, reaching up to half the screen
      const angle = (rand(-80, 80) * Math.PI) / 180;
      const distance = rand(120, Math.max(260, Math.min(window.innerWidth * 0.5, 640)));

      el.style.left = `${x.toFixed(0)}px`;
      el.style.top = `${y.toFixed(0)}px`;
      el.style.setProperty('--dx', `${(Math.sin(angle) * distance).toFixed(0)}px`);
      el.style.setProperty('--dy', `${(-Math.cos(angle) * distance).toFixed(0)}px`);
      el.style.setProperty('--spin', `${rand(-240, 240).toFixed(0)}deg`);
      el.style.setProperty('--size', `${Math.round(rand(12, 26))}px`);
      el.style.setProperty('--colour', pick(COLOURS));
      el.style.setProperty('--fall', `${rand(140, 320).toFixed(0)}px`);
      el.style.setProperty('--sway', `${rand(-50, 50).toFixed(0)}px`);
      el.style.setProperty('--duration', `${rand(2.4, 3.6).toFixed(2)}s`);

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
