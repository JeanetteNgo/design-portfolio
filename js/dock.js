/* ─────────────────────────────────────────────
   DOCK POPUPS
   A dock icon (button[data-popup="tools"]) opens the one <dialog id="popup">,
   filled from POPUPS in data/popups.js. The dialog gets data-popup="<id>" while
   open (for per-popup CSS), plus data-paper when the data says paper: true.

   A popup with its own layout adds a builder in js/popups/:
     POPUP_RENDERERS['<id>'] = function (popup) { return [elements]; };
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

/** Reserve a picture's shape (item.width / item.height, else 4 / 3) until loadedEvent fires. */
function popupReserveShape(el, item, loadedEvent) {
  el.style.aspectRatio = item.width && item.height ? `${item.width} / ${item.height}` : '4 / 3';
  if (loadedEvent)
    el.addEventListener(loadedEvent, () => (el.style.aspectRatio = ''), { once: true });
}

/** A key-hint tag button: "← back to the list". Clicking it calls onBack. */
function popupBackTag(label, onBack) {
  const tag = popupEl('button', '', 'esc-tag');
  tag.type = 'button';
  tag.append(popupEl('kbd', '←', 'esc-key'), ` ${label}`);
  tag.addEventListener('click', onBack);
  return tag;
}

/** The "Esc to close" tag every popup shows on its main view. Clicking it closes (for touch). */
function popupCloseTag() {
  const tag = popupEl('button', '', 'esc-tag');
  tag.type = 'button';
  tag.dataset.popupClose = '';
  tag.append(popupEl('kbd', 'Esc', 'esc-key'), ' to close');
  return tag;
}

/** Call fn once, the next time the popup closes (Esc, ×, tapping outside). */
function popupOnClose(fn) {
  document.getElementById('popup').addEventListener('close', fn, { once: true });
}

/** Call onBack on ← while isActive() is true, until the popup closes. Skipped on video controls. */
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
    const footer = popupEl('div', '', 'popup-footer');
    footer.appendChild(popupCloseTag());
    return [scroll, footer];
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

  // Close: click outside the card (press and release both outside, so text selection is safe)
  let pressedOutside = false;
  dialog.addEventListener('pointerdown', (e) => (pressedOutside = e.target === dialog));
  dialog.addEventListener('pointerup', (e) => {
    if (pressedOutside && e.target === dialog) dialog.close();
    pressedOutside = false;
  });
})();
