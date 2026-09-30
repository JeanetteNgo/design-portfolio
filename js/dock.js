/* ─────────────────────────────────────────────
   DOCK POPUPS
   Clicking a dock icon (button[data-popup="tools"]) opens the one
   <dialog id="popup"> in index.html, filled with that popup's words
   from POPUPS in data/popups.js.

   <dialog> gives us for free: Esc closes it, keyboard focus stays
   inside it, and focus returns to the icon when it closes.

   The dialog gets data-popup="tools" (etc.) while open, so each popup
   can be styled differently in css/features/popups/.

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
    return parts;
  }

  function open(id) {
    const popup = POPUPS[id];
    if (!popup) return;

    dialog.dataset.popup = id;
    title.textContent = popup.title;
    body.replaceChildren(...(POPUP_RENDERERS[id] || _render)(popup));
    dialog.showModal();
  }

  // Open: any dock icon with data-popup
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-popup]');
    if (button) open(button.dataset.popup);
  });

  // Close: any [data-popup-close] button (the ×, the Esc tag), or a click on the dimmed area outside the card
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-popup-close]')) dialog.close();
  });
})();
