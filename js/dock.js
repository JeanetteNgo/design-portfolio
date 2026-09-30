/* ─────────────────────────────────────────────
   DOCK POPUPS
   Clicking a dock icon (button[data-popup="tools"]) opens the one
   <dialog id="popup"> in index.html, filled with that popup's words
   from POPUPS in data/popups.js.

   <dialog> gives us for free: Esc closes it, keyboard focus stays
   inside it, and focus returns to the icon when it closes.

   The dialog gets data-popup="tools" (etc.) while open, so each popup
   can be styled differently in css/features/popups/. Popups with paper: true in
   the data also get data-paper, which switches on the shared notebook-paper look.

   A popup that needs more than the default layout (intro + lists) adds
   its own builder in js/popups/, e.g.
     POPUP_RENDERERS['off-the-clock'] = function (popup) { return [elements]; };
   Any button with data-popup-close closes the popup.
────────────────────────────────────────────── */

/** Custom builders, keyed by popup id. Filled in by the files in js/popups/. */
const POPUP_RENDERERS = {};

/** Make an element with text, e.g. popupEl('h3', 'Design', 'popup-heading'). */
function popupEl(tag, text, className) {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  if (className) el.className = className;
  return el;
}

/** A key-hint tag button: "← back to the list". Clicking it calls onBack. */
function popupBackTag(label, onBack) {
  const tag = popupEl('button', '', 'esc-tag');
  tag.type = 'button';
  tag.append(popupEl('kbd', '←', 'esc-key'), ` ${label}`);
  tag.addEventListener('click', onBack);
  return tag;
}

/** Call fn once, the next time the popup closes (Esc, ×, tapping outside). */
function popupOnClose(fn) {
  document.getElementById('popup').addEventListener('close', fn, { once: true });
}

/** Call onBack when ← is pressed while isActive() says so, until the popup closes. Ignored
    while a video's own controls have focus, where ← rewinds it. */
function popupOnLeftKey(isActive, onBack) {
  const dialog = document.getElementById('popup');
  const onKey = (e) => {
    if (e.key !== 'ArrowLeft' || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (!isActive() || e.target.closest('video')) return;
    e.preventDefault();
    onBack();
  };
  dialog.addEventListener('keydown', onKey);
  popupOnClose(() => dialog.removeEventListener('keydown', onKey));
}

(function () {
  const dialog = document.getElementById('popup');
  if (!dialog || typeof POPUPS === 'undefined') return;

  const title = dialog.querySelector('.popup-title');
  const body = dialog.querySelector('.popup-body');

  /** Default layout: build the inside of a popup from its entry in POPUPS. */
  function _render(popup) {
    const parts = [];
    if (popup.intro) parts.push(popupEl('p', popup.intro, 'popup-intro'));

    (popup.groups || []).forEach((group) => {
      parts.push(popupEl('h3', group.heading, 'popup-heading'));
      const list = popupEl('ul', '', 'popup-list');
      group.items.forEach((item) => list.appendChild(popupEl('li', item)));
      parts.push(list);
    });
    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.append(...parts);
    return [scroll];
  }

  function open(id) {
    const popup = POPUPS[id];
    if (!popup) return;

    dialog.dataset.popup = id;
    dialog.toggleAttribute('data-paper', Boolean(popup.paper));
    title.textContent = popup.title;
    body.replaceChildren(...(POPUP_RENDERERS[id] || _render)(popup));
    dialog.showModal();
  }

  // Open: any dock icon with data-popup
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-popup]');
    if (button) open(button.dataset.popup);
  });

  // Close: any [data-popup-close] button (the ×, the Esc tag)
  dialog.addEventListener('click', (e) => {
    if (e.target.closest('[data-popup-close]')) dialog.close();
  });

  // Close: a click on the dimmed area outside the card. The press and the release must both
  // be outside, so dragging out of the card (e.g. while selecting text) doesn't close it
  let pressedOutside = false;
  dialog.addEventListener('pointerdown', (e) => (pressedOutside = e.target === dialog));
  dialog.addEventListener('pointerup', (e) => {
    if (pressedOutside && e.target === dialog) dialog.close();
    pressedOutside = false;
  });
})();
