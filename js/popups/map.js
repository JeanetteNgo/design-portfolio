/* ─────────────────────────────────────────────
   MAP POPUP
   An illustrated folded map with a pin for each place in PLACES (data/places.js), and the same
   places as chips underneath. Tapping a pin or a chip selects it and shows its note.
   Looks live in css/features/popups/map.css.
────────────────────────────────────────────── */

POPUP_RENDERERS.map = function (popup) {
  const STATUS = {
    home: ['Home base', 'Based in'],
    been: ['Been here', 'Been'],
    next: ['Next stop', 'Next stops'],
  };
  const calmMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const buttons = []; // every pin and chip, so selecting one can update the rest

  /* ── The map ── */

  const art = popupEl('div', '', 'map-art');
  const note = popupEl('div', '', 'map-note');
  note.setAttribute('aria-live', 'polite');

  function _select(place) {
    buttons.forEach(({ el, place: p }) => el.setAttribute('aria-pressed', String(p === place)));
    note.replaceChildren(
      popupEl('p', STATUS[place.status][0], 'map-note-status'),
      popupEl('h3', place.name, 'map-note-name'),
      popupEl('p', place.note || '', 'map-note-text')
    );
    if (!calmMotion) note.animate([{ opacity: 0, translate: '0 4px' }, { opacity: 1, translate: '0' }], 180);
  }

  PLACES.forEach((place) => {
    const pin = popupEl('button', '', `map-pin map-pin--${place.status}`);
    pin.type = 'button';
    pin.style.left = `${place.x}%`;
    pin.style.top = `${place.y}%`;
    pin.setAttribute('aria-label', `${place.name} (${STATUS[place.status][0].toLowerCase()})`);
    pin.append(popupEl('span', '', 'map-pin-head'), popupEl('span', place.name, 'map-pin-name'));
    pin.addEventListener('click', () => _select(place));
    art.appendChild(pin);
    buttons.push({ el: pin, place });
  });

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
      chip.addEventListener('click', () => _select(place));
      list.appendChild(popupEl('li')).appendChild(chip);
      buttons.push({ el: chip, place });
    });
    lists.append(popupEl('h3', heading, 'map-heading'), list);
  });

  _select(PLACES.find((p) => p.status === 'home') || PLACES[0]);

  const scroll = popupEl('div', '', 'popup-scroll');
  if (popup.intro) scroll.appendChild(popupEl('p', popup.intro, 'popup-intro'));
  scroll.append(art, note, legend, lists);
  return [scroll];
};
