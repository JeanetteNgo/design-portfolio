/* ─────────────────────────────────────────────
   MAP POPUP
   An interactive globe with a pin for each place in PLACES (data/places.js), beside the same
   places as chips. Drag (or use the arrow keys) to turn it; zoom with the +/- buttons, a
   trackpad pinch or scroll, or two fingers (0 or the 1× button goes back to 100%). Tapping a
   pin or a chip selects it, shows its note and turns the globe to face it.
   The world outline is data/land.json (Natural Earth, public domain) and the globe maths is
   js/vendor/d3-geo.min.js; both are fetched only when the Map opens.
   Looks live in css/features/popups/map.css.
────────────────────────────────────────────── */

POPUP_RENDERERS.map = function (popup) {
  const STATUS = {
    home: ['Home base', 'Based in'],
    been: ['Been here', 'Been'],
    next: ['Next stop', 'Next stops'],
  };
  const calmMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const chips = []; // [button, place], so selecting a place can update them all

  /* ── Loading the globe (once; later opens reuse it) ── */

  const _script = (src) =>
    new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.onload = resolve;
      el.onerror = reject;
      document.head.appendChild(el);
    });
  const loading =
    POPUP_RENDERERS.map.loading ||
    (POPUP_RENDERERS.map.loading = Promise.all([
      window.d3geo ? null : _script('js/vendor/d3-geo.min.js'),
      fetch('data/land.json').then((r) => r.json()),
    ]).then(([, land]) => land));

  /* ── State ── */

  const canvas = popupEl('canvas', '', 'map-globe');
  const ctx = canvas.getContext('2d');
  const home = PLACES.find((p) => p.status === 'home') || PLACES[0];
  let land = null;
  let selected = home;
  let lng = home.lng - 25; // start a little to one side, so the globe isn't dead-on
  let lat = Math.max(-45, Math.min(45, home.lat)) + 10;
  let zoom = MIN_ZOOM;
  let zoomTo = MIN_ZOOM;
  let spin = calmMotion ? 0 : 4; // degrees a second until the visitor touches it
  let velocity = [0, 0]; // degrees a second, after a flick
  let turn = null; // an eased turn to a place: { from, to, start }
  let hits = []; // where each pin was drawn, for tapping
  let alive = true;
  let frame = 0;
  let last = 0;

  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* ── Drawing ── */

  function _draw() {
    const size = canvas.clientWidth;
    if (!size || !window.d3geo) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(size * dpr)) canvas.width = canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const radius = (size / 2 - 1.5) * zoom; // the outline just fits the canvas
    const projection = d3geo
      .geoOrthographic()
      .clipAngle(90)
      .translate([size / 2, size / 2])
      .scale(radius)
      .rotate([-lng, -lat]);
    const path = d3geo.geoPath(projection, ctx);
    const ink = css('--ink-brown');

    ctx.save();
    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.fillStyle = css('--accent-25');
    ctx.fill();
    ctx.clip(); // land and grid stay inside the globe

    ctx.beginPath();
    path(d3geo.geoGraticule10());
    ctx.strokeStyle = css('--accent-a33');
    ctx.lineWidth = 1;
    ctx.stroke();

    if (land) {
      ctx.beginPath();
      path(land);
      ctx.fillStyle = css('--pencil-d');
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    ctx.restore();

    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pins, drawn from the back of the globe forward so nearer ones sit on top (selected last)
    hits = [];
    const centre = [lng, lat];
    PLACES.filter((p) => d3geo.geoDistance([p.lng, p.lat], centre) < Math.PI / 2 - 0.05)
      .sort((a, b) => (a === selected) - (b === selected) || b.lat - a.lat)
      .forEach((place) => {
        const [x, y] = projection([place.lng, place.lat]);
        _pin(place, x, y, place === selected);
        hits.push({ place, x, y: y - 14 });
      });
  }

  // A teardrop pin whose point sits on (x, y)
  function _pin(place, x, y, isSelected) {
    const r = place.status === 'home' ? 10 : 8;
    const lift = isSelected ? 4 : 0;
    const cy = y - lift - r * 1.9; // centre of the round head
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, cy, r, Math.PI * 0.8, Math.PI * 0.2); // the round head...
    ctx.lineTo(x, y - lift); // ...down to the point
    ctx.closePath();
    ctx.fillStyle =
      place.status === 'home' ? css('--pencil-a') : place.status === 'next' ? css('--paper-bg') : css('--accent-300');
    ctx.fill();
    ctx.strokeStyle = css('--ink-brown');
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    if (place.status === 'next') ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(x, cy, r * 0.38, 0, Math.PI * 2);
    ctx.fillStyle = css('--paper-bg');
    ctx.fill();
    if (isSelected) {
      ctx.font = `400 14px ${css('--font-hand')}`;
      const w = ctx.measureText(place.name).width + 16;
      ctx.fillStyle = css('--paper-bg');
      ctx.shadowColor = 'rgb(0 0 0 / 25%)';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y + 4, w, 22, 4);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = css('--text-strong');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(place.name, x, y + 15);
    }
    ctx.restore();
  }

  /* ── Moving ──
     The loop only runs while something is moving (auto-spin, a flick, an eased turn, a zoom),
     so a still globe costs nothing. */

  function _tick(now) {
    frame = 0;
    if (!alive) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    let moving = false;

    if (turn) {
      const t = Math.min((now - turn.start) / 700, 1);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease in and out
      lng = turn.from[0] + turn.delta * e;
      lat = turn.from[1] + (turn.to[1] - turn.from[1]) * e;
      if (t >= 1) turn = null;
      moving = true;
    } else if (velocity[0] || velocity[1]) {
      lng += velocity[0] * dt;
      lat = Math.max(-80, Math.min(80, lat + velocity[1] * dt));
      velocity = velocity.map((v) => (Math.abs(v) < 2 ? 0 : v * Math.pow(0.04, dt))); // glides to a stop
      moving = true;
    } else if (spin) {
      lng += spin * dt;
      moving = true;
    }
    if (Math.abs(zoomTo - zoom) > 0.002) {
      zoom += (zoomTo - zoom) * Math.min(dt * 10, 1);
      moving = true;
    } else zoom = zoomTo;

    _draw();
    if (moving) _wake();
  }
  function _wake() {
    if (alive && !frame) frame = requestAnimationFrame(_tick);
  }
  function _stopSpin() {
    spin = 0;
  }

  function _turnTo(place) {
    _stopSpin();
    velocity = [0, 0];
    const to = [place.lng, Math.max(-60, Math.min(60, place.lat))];
    if (calmMotion) {
      [lng, lat] = to;
      _draw();
      return;
    }
    const delta = ((((to[0] - lng) % 360) + 540) % 360) - 180; // the short way round
    turn = { from: [lng, lat], to, delta, start: performance.now() };
    last = performance.now();
    _wake();
  }

  // Zoom to a level (kept between MIN_ZOOM and MAX_ZOOM). `instant` skips the easing, for
  // pinch and scroll, which already move smoothly by themselves.
  function _zoomTo(level, instant) {
    _stopSpin();
    zoomTo = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level));
    last = performance.now();
    if (instant || calmMotion) zoom = zoomTo;
    _wake();
    _draw();
  }
  const _zoomBy = (step) => _zoomTo(zoomTo + step);

  /* ── Selecting ── */

  const note = popupEl('div', '', 'map-note');
  note.setAttribute('aria-live', 'polite');

  function _select(place, turnGlobe) {
    selected = place;
    chips.forEach(([el, p]) => el.setAttribute('aria-pressed', String(p === place)));
    note.replaceChildren(
      popupEl('p', STATUS[place.status][0], 'map-note-status'),
      popupEl('h3', place.name, 'map-note-name'),
      popupEl('p', place.note || '', 'map-note-text')
    );
    if (!calmMotion) note.animate([{ opacity: 0, translate: '0 4px' }, { opacity: 1, translate: '0' }], 180);
    if (turnGlobe) _turnTo(place);
    _draw();
  }

  /* ── Touch, mouse and keyboard on the globe ── */

  let drag = null;
  const pointers = new Map(); // fingers currently down, for two-finger pinch
  let pinch = null;
  const _fingerGap = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1;
  };
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    _stopSpin();
    turn = null;
    velocity = [0, 0];
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      pinch = { gap: _fingerGap(), zoom: zoomTo };
      drag = null;
      return;
    }
    drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), moved: false };
  });
  canvas.addEventListener('pointermove', (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pointers.size === 2) return _zoomTo((pinch.zoom * _fingerGap()) / pinch.gap, true);
    if (!drag) return;
    const perPx = 0.3 / zoom; // degrees of turn per pixel dragged
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 5) drag.moved = true;
    lng -= dx * perPx;
    lat = Math.max(-80, Math.min(80, lat + dy * perPx));
    const now = performance.now();
    const dt = Math.max((now - drag.t) / 1000, 0.001);
    velocity = [(-dx * perPx) / dt, (dy * perPx) / dt].map((v) => Math.max(-300, Math.min(300, v)));
    Object.assign(drag, { x: e.clientX, y: e.clientY, t: now });
    _draw();
  });
  const _release = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (!drag) return;
    const wasTap = !drag.moved;
    if (performance.now() - drag.t > 80) velocity = [0, 0]; // held still before letting go: no flick
    drag = null;
    if (wasTap) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hit = hits
        .map((h) => ({ place: h.place, d: Math.hypot(h.x - x, h.y - y) }))
        .filter((h) => h.d < 24)
        .sort((a, b) => a.d - b.d)[0];
      if (hit) _select(hit.place, true);
    } else {
      last = performance.now();
      _wake();
    }
  };
  canvas.addEventListener('pointerup', _release);
  canvas.addEventListener('pointercancel', (e) => {
    pointers.delete(e.pointerId);
    pinch = drag = null;
  });
  canvas.addEventListener('dblclick', () => _zoomTo(MIN_ZOOM));

  // Trackpad: pinch (which arrives as a scroll with Ctrl held) or two-finger scroll zooms.
  // At the zoom limit a plain scroll is left alone, so the popup can still scroll past the globe.
  canvas.addEventListener(
    'wheel',
    (e) => {
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomTo * Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0025))));
      if (e.ctrlKey || next !== zoomTo) e.preventDefault(); // Ctrl-scroll would otherwise zoom the whole page
      if (next !== zoomTo) _zoomTo(next, true);
    },
    { passive: false }
  );
  // Safari sends trackpad pinches as its own gesture events
  let gestureStart = 1;
  canvas.addEventListener('gesturestart', (e) => {
    e.preventDefault();
    gestureStart = zoomTo;
  });
  canvas.addEventListener('gesturechange', (e) => {
    e.preventDefault();
    _zoomTo(gestureStart * e.scale, true);
  });

  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Globe. Use the arrow keys to turn it, plus and minus to zoom, zero for 100%.');
  canvas.addEventListener('keydown', (e) => {
    const keys = { ArrowLeft: [-15, 0], ArrowRight: [15, 0], ArrowUp: [0, 10], ArrowDown: [0, -10] };
    if (e.key === '+' || e.key === '=') return _zoomBy(0.5), e.preventDefault();
    if (e.key === '-') return _zoomBy(-0.5), e.preventDefault();
    if (e.key === '0') return _zoomTo(MIN_ZOOM), e.preventDefault();
    if (!keys[e.key] || e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    e.stopPropagation(); // ← would otherwise go back / close things
    _stopSpin();
    turn = null;
    lng += keys[e.key][0];
    lat = Math.max(-80, Math.min(80, lat + keys[e.key][1]));
    _draw();
  });

  const zoomButtons = popupEl('div', '', 'map-zoom');
  [
    ['+', 'Zoom in', () => _zoomBy(0.5)],
    ['1×', 'Reset zoom to 100%', () => _zoomTo(MIN_ZOOM)],
    ['−', 'Zoom out', () => _zoomBy(-0.5)],
  ].forEach(([text, label, onClick]) => {
    const b = popupEl('button', text, 'map-zoom-btn');
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.addEventListener('click', onClick);
    zoomButtons.appendChild(b);
  });

  const globeFrame = popupEl('div', '', 'map-globe-frame'); // holds the outline ring around the canvas
  globeFrame.appendChild(canvas);
  const globeWrap = popupEl('div', '', 'map-globe-wrap');
  globeWrap.append(globeFrame, zoomButtons);

  /* ── Legend and chips ── */

  const legend = popupEl('p', '', 'map-legend');
  legend.append(
    popupEl('span', 'been', 'map-key map-key--been'),
    popupEl('span', 'next stop', 'map-key map-key--next')
  );

  const lists = popupEl('div', '', 'map-lists');
  Object.entries(STATUS).forEach(([status, [, heading]]) => {
    const places = PLACES.filter((p) => p.status === status);
    if (!places.length) return;
    const list = popupEl('ul', '', 'map-chips');
    places.forEach((place) => {
      const chip = popupEl('button', place.name, `map-chip map-chip--${status}`);
      chip.type = 'button';
      chip.addEventListener('click', () => _select(place, true));
      list.appendChild(popupEl('li')).appendChild(chip);
      chips.push([chip, place]);
    });
    lists.append(popupEl('h3', heading, 'map-heading'), list);
  });

  const side = popupEl('div', '', 'map-side');
  if (popup.intro) side.appendChild(popupEl('p', popup.intro, 'popup-intro'));
  side.append(note, legend, lists);

  const layout = popupEl('div', '', 'map-layout');
  layout.append(globeWrap, side);
  const scroll = popupEl('div', '', 'popup-scroll');
  scroll.appendChild(layout);

  _select(home, false);

  /* ── Start and stop ── */

  const resizer = new ResizeObserver(_draw);
  resizer.observe(canvas);
  loading
    .then((data) => {
      land = data;
      last = performance.now();
      _draw();
      _wake();
    })
    .catch(() => {}); // no outline? the pins and chips still work
  popupOnClose(() => {
    alive = false;
    resizer.disconnect();
    cancelAnimationFrame(frame);
  });

  return [scroll];
};
