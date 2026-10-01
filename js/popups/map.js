/* ─────────────────────────────────────────────
   MAP POPUP
   An interactive globe with a pin per place in PLACES (data/places.js), beside a "Based in"
   banner and passport stamps. A stamp or pin opens that place as a postcard; ← or the back
   tag returns. Drag, arrow keys, pinch, scroll and +/- turn and zoom (0 or 1× resets).
   data/land.json (Natural Earth) and js/vendor/d3-geo.min.js load only when the Map opens.
   Styles: css/features/popups/map.css.
────────────────────────────────────────────── */

POPUP_RENDERERS.map = function (popup) {
  const STATUS = {
    home: ['Home base', 'Currently based in'],
    been: ['Been here', 'Visited'],
    next: ['Next stop', 'Next stops'],
  };
  const calmMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const stamps = new Map(); // place -> its stamp button, so focus can return to it

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
  let world = null; // { land, ice } outlines, once loaded
  let selected = home;
  let lng = home.lng - 25; // start a little to one side, so the globe isn't dead-on
  let lat = Math.max(-45, Math.min(45, home.lat)) + 10;
  let zoom = MIN_ZOOM;
  let zoomTo = MIN_ZOOM;
  const SPIN = calmMotion ? 0 : 4; // slow auto-spin, in degrees a second
  let spin = SPIN; // stops when the visitor touches the globe; starts again on "back to all places"
  let velocity = [0, 0]; // degrees a second, after a flick
  let turn = null; // an eased turn to a place: { from, to, start }
  let hits = []; // where each pin was drawn, for tapping
  let pointerAt = null; // where the pointer is over the globe, for the pointer cursor
  let alive = true;
  let frame = 0;
  let last = 0;

  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* ── Drawing ── */

  function _draw() {
    const size = canvas.clientWidth;
    if (!size || !window.d3geo) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(size * dpr))
      canvas.width = canvas.height = Math.round(size * dpr);
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
    ctx.fillStyle = css('--globe-water');
    ctx.fill();
    ctx.clip(); // land and grid stay inside the globe

    ctx.beginPath();
    path(d3geo.geoGraticule10());
    ctx.strokeStyle = css('--globe-grid');
    ctx.lineWidth = 1;
    ctx.stroke();

    if (world) {
      [
        [world.land, '--pencil-d'],
        [world.ice, '--globe-ice'], // Antarctica and Greenland
      ].forEach(([outline, colour]) => {
        ctx.beginPath();
        path(outline);
        ctx.fillStyle = css(colour);
        ctx.fill();
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';
        ctx.stroke();
      });
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
    _hover();
  }

  // Pointer cursor over a pin, grab hand elsewhere (rechecked each draw, as pins move)
  function _pinAt(x, y) {
    return hits
      .map((h) => ({ place: h.place, d: Math.hypot(h.x - x, h.y - y) }))
      .filter((h) => h.d < 24)
      .sort((a, b) => a.d - b.d)[0];
  }
  function _hover() {
    canvas.classList.toggle(
      'is-over-pin',
      Boolean(pointerAt && !drag && _pinAt(pointerAt.x, pointerAt.y))
    );
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
      place.status === 'home'
        ? css('--pencil-a')
        : place.status === 'next'
          ? css('--paper-bg')
          : css('--accent-300');
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

  /* ── Moving ── (the loop only runs while something moves) */

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
  // Touching the globe stops the spin; it resumes after a pause unless dragging, zoomed in or a place is open.
  const IDLE_MS = 6000;
  let idleTimer = 0;
  function _stopSpin() {
    spin = 0;
    clearTimeout(idleTimer);
    if (SPIN && alive) idleTimer = setTimeout(_resumeSpin, IDLE_MS);
  }
  function _resumeSpin() {
    if (!alive || spin || openPlace || zoomTo > MIN_ZOOM) return;
    if (drag || pinch || turn) return _stopSpin(); // still busy: wait another pause
    spin = SPIN;
    last = performance.now();
    _wake();
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

  // Zoom to a level within MIN_ZOOM..MAX_ZOOM. `instant` skips easing (pinch and scroll).
  function _zoomTo(level, instant) {
    _stopSpin();
    zoomTo = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level));
    _syncZoomButtons();
    last = performance.now();
    if (instant || calmMotion) zoom = zoomTo;
    _wake();
    _draw();
  }
  const _zoomBy = (step) => _zoomTo(zoomTo + step);

  /* ── Selecting ── (stamps under the banner, or one place's postcard) */

  // "2024, 2025" -> { latest: 2025, earlier: 1 }; with no years, `latest` is the text as written
  function _years(place) {
    const years = (place.when || '').match(/\b\d{4}\b/g) || [];
    return {
      latest: years.length ? Math.max(...years) : place.when || '',
      earlier: Math.max(years.length - 1, 0),
    };
  }

  const listView = popupEl('div', '', 'map-stamps-view');
  const closeTag = popupCloseTag();
  const footer = popupEl('div', '', 'popup-footer'); // bottom left: "Esc to close", or "← back" on a postcard
  footer.appendChild(closeTag);
  const detailView = popupEl('div', '', 'map-detail');
  detailView.hidden = true;
  let openPlace = null; // the place whose details are showing

  // One place as a landscape postcard: greeting and photo on the left; stamp, note, cities and years on the right
  function _detail(place) {
    const card = popupEl('article', '', 'map-postcard');
    const stampButton = stamps.get(place);
    const ink = stampButton && getComputedStyle(stampButton).getPropertyValue('--ink').trim();
    if (ink) card.style.setProperty('--ink', ink);

    const message = popupEl('div', '', 'postcard-message');
    message.append(
      popupEl('p', STATUS[place.status][0], 'postcard-status'),
      popupEl(
        'h3',
        place.status === 'next' ? `Dreaming of ${place.name}` : `Greetings from ${place.name}`,
        'postcard-greeting'
      )
    );
    // The photo, taped on and keeping its 3:4 or 4:3 shape
    if (place.photo) {
      const slot = popupEl('div', '', 'postcard-slot');
      const print = popupEl('div', '', 'postcard-print');
      const photo = popupEl('div', '', 'postcard-photo');
      const img = popupEl('img');
      img.src = place.photo;
      img.alt = place.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('load', () => {
        print.style.setProperty('--ratio', img.naturalHeight > img.naturalWidth ? '0.75' : '1.333');
      });
      photo.appendChild(img);
      print.appendChild(photo);
      slot.appendChild(print);
      message.appendChild(slot);
    }
    const sign = popupEl('span', '- J.N.', 'postcard-sign'); // my initials, as if signed
    sign.setAttribute('aria-hidden', 'true');
    message.appendChild(sign);

    // The stamp and postmark are decoration; the years are in the footer
    const address = popupEl('div', '', 'postcard-address');
    const stampArt = popupEl(
      'div',
      place.status === 'home' ? 'Home' : _years(place).latest,
      'postcard-stamp'
    );
    stampArt.classList.toggle('is-word', !/\d{4}/.test(stampArt.textContent)); // "Someday", "Home"
    stampArt.setAttribute('aria-hidden', 'true');
    const postmark = popupEl('div', '', 'postcard-postmark');
    postmark.setAttribute('aria-hidden', 'true');
    const body = popupEl('div', '', 'postcard-body'); // scrolls when it is long
    if (place.note) body.appendChild(popupEl('p', place.note, 'postcard-note'));
    const lines = popupEl('ul', '', 'postcard-lines');
    (place.cities || []).forEach((city) => lines.appendChild(popupEl('li', city)));
    body.appendChild(lines);
    address.append(postmark, stampArt, body);
    if (place.when) {
      const when = popupEl('p', place.when, 'postcard-when');
      when.prepend(popupEl('span', place.status === 'next' ? 'Planned' : 'Visited'));
      address.appendChild(when);
    }

    card.append(message, address);
    const back = popupBackTag('back to all places', () => _close(true));
    detailView.replaceChildren(card);
    footer.replaceChildren(back);
    return back;
  }

  // Shows the stamps again. `refocus` puts keyboard focus back on the stamp that was open.
  function _close(refocus) {
    if (!openPlace) return;
    const place = openPlace;
    openPlace = null;
    selected = home;
    detailView.hidden = true;
    listView.hidden = false;
    footer.replaceChildren(closeTag);
    banner.hidden = false;
    if (refocus) {
      (stamps.get(place) || banner).focus();
      clearTimeout(idleTimer);
      spin = SPIN; // back on the stamps: the globe drifts again
      last = performance.now();
      _wake();
    }
    _draw();
  }

  // Turns the globe to a place and opens its postcard
  function _select(place, turnGlobe) {
    selected = place;
    openPlace = place;
    const back = _detail(place);
    listView.hidden = true;
    banner.hidden = true; // a place is open: the postcard gets the room
    detailView.hidden = false;
    if (!calmMotion)
      detailView.animate(
        [
          { opacity: 0, translate: '0 4px' },
          { opacity: 1, translate: '0' },
        ],
        180
      );
    back.focus({ preventScroll: true });
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
    drag = {
      x: e.clientX,
      y: e.clientY,
      sx: e.clientX,
      sy: e.clientY,
      t: performance.now(),
      moved: false,
    };
  });
  canvas.addEventListener('pointermove', (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (e.pointerType === 'mouse') {
      const rect = canvas.getBoundingClientRect();
      pointerAt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      _hover();
    }
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
    if (performance.now() - drag.t > 80) velocity = [0, 0]; // held still: no flick
    drag = null;
    if (wasTap) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hit = _pinAt(x, y);
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
  canvas.addEventListener('pointerleave', () => {
    pointerAt = null;
    _hover();
  });
  canvas.addEventListener('dblclick', () => _zoomTo(MIN_ZOOM));

  // Trackpad pinch (Ctrl-scroll) or two-finger scroll zooms; at a limit, plain scroll passes through
  canvas.addEventListener(
    'wheel',
    (e) => {
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const next = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, zoomTo * Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0025)))
      );
      if (e.ctrlKey || next !== zoomTo) e.preventDefault(); // else the page zooms
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
  canvas.setAttribute(
    'aria-label',
    'Globe. Use the arrow keys to turn it, plus and minus to zoom, zero for 100%.'
  );
  canvas.addEventListener('keydown', (e) => {
    const keys = {
      ArrowLeft: [-15, 0],
      ArrowRight: [15, 0],
      ArrowUp: [0, 10],
      ArrowDown: [0, -10],
    };
    if (e.key === '+' || e.key === '=') return (_zoomBy(0.5), e.preventDefault());
    if (e.key === '-') return (_zoomBy(-0.5), e.preventDefault());
    if (e.key === '0') return (_zoomTo(MIN_ZOOM), e.preventDefault());
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
    ['−', 'Zoom out', 'paper-sticker--minus', () => _zoomBy(-0.5)],
    ['1×', 'Zoom 1×', '', () => _zoomTo(MIN_ZOOM)], // shows the zoom; resets to 1×
    ['+', 'Zoom in', 'paper-sticker--plus', () => _zoomBy(0.5)],
  ].forEach(([text, label, glyph, onClick]) => {
    const b = popupEl('button', text, `map-zoom-btn paper-sticker ${glyph}`.trim());
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.addEventListener('click', () => b.getAttribute('aria-disabled') !== 'true' && onClick());
    zoomButtons.appendChild(b);
  });

  // Middle button shows the zoom and resets to 1×. aria-disabled (not disabled) keeps focus at the limits.
  function _syncZoomButtons() {
    const [minus, level, plus] = zoomButtons.children;
    if (level) {
      const text = `${Number(zoomTo.toFixed(1))}×`;
      level.textContent = text;
      level.setAttribute(
        'aria-label',
        zoomTo > MIN_ZOOM ? `Zoom ${text}. Reset to 1×` : `Zoom ${text}`
      );
    }
    minus?.setAttribute('aria-disabled', String(zoomTo <= MIN_ZOOM));
    plus?.setAttribute('aria-disabled', String(zoomTo >= MAX_ZOOM));
  }
  _syncZoomButtons();

  const globeFrame = popupEl('div', '', 'map-globe-frame'); // outline ring around the canvas
  globeFrame.appendChild(canvas);
  const globeWrap = popupEl('div', '', 'map-globe-wrap');
  globeWrap.append(globeFrame, zoomButtons);

  /* ── "Based in" banner and stamps ── */

  const banner = popupEl('button', '', 'map-home');
  banner.type = 'button';
  banner.setAttribute('aria-label', `Currently based in ${home.name}. Open its postcard.`);
  const bannerText = popupEl('span', '', 'map-home-text');
  const nameRow = popupEl('span', '', 'map-home-row');
  nameRow.append(popupEl('span', home.name, 'map-home-name'), popupEl('span', '', 'map-home-pin'));
  bannerText.append(popupEl('span', 'Currently based in', 'map-home-label'), nameRow);
  banner.appendChild(bannerText);
  banner.addEventListener('click', () => _select(home, true));

  Object.entries(STATUS).forEach(([status, [, heading]]) => {
    if (status === 'home') return;
    const places = PLACES.filter((p) => p.status === status);
    if (!places.length) return;
    const list = popupEl('ul', '', 'map-stamps');
    places.forEach((place) => {
      const stamp = popupEl('button', '', `map-stamp map-stamp--${status}`);
      stamp.type = 'button';
      stamp.append(popupEl('span', place.name, 'map-stamp-name'));
      const { latest, earlier } = _years(place);
      if (place.when) stamp.appendChild(popupEl('span', latest, 'map-stamp-when'));
      if (earlier) stamp.appendChild(popupEl('span', `+${earlier} earlier`, 'map-stamp-earlier'));
      stamp.addEventListener('click', () => _select(place, true));
      list.appendChild(popupEl('li')).appendChild(stamp);
      stamps.set(place, stamp);
    });
    listView.append(popupEl('h3', heading, 'map-heading'), list);
  });

  const side = popupEl('div', '', 'map-side');
  side.append(banner, listView, detailView);

  const layout = popupEl('div', '', 'map-layout');
  layout.append(globeWrap, side);
  const scroll = popupEl('div', '', 'popup-scroll');
  scroll.appendChild(layout);

  popupOnLeftKey(
    () => !detailView.hidden,
    () => _close(true)
  );

  /* ── Start and stop ── */

  const resizer = new ResizeObserver(_draw);
  resizer.observe(canvas);
  loading
    .then((data) => {
      world = data;
      last = performance.now();
      _draw();
      _wake();
    })
    .catch(() => {}); // no outline? the pins and stamps still work
  popupOnClose(() => {
    alive = false;
    clearTimeout(idleTimer);
    resizer.disconnect();
    cancelAnimationFrame(frame);
  });

  return [scroll, footer];
};
