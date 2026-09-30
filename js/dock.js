/* ─────────────────────────────────────────────
   DOCK POPUPS
   Clicking a dock icon (button[data-popup="tools"]) opens the one
   <dialog id="popup"> in index.html, filled with that popup's words
   from POPUPS in data/popups.js.

   <dialog> gives us for free: Esc closes it, keyboard focus stays
   inside it, and focus returns to the icon when it closes.

   The dialog gets data-popup="tools" (etc.) while open, so each popup
   can be styled differently in css/features/popups/.
────────────────────────────────────────────── */

(function () {
  const dialog = document.getElementById('popup');
  if (!dialog || typeof POPUPS === 'undefined') return;

  const title = dialog.querySelector('.popup-title');
  const body = dialog.querySelector('.popup-body');

  /** Make an element with text, e.g. _el('h3', 'Design'). */
  function _el(tag, text, className) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  }

  /** Build the inside of a popup from its entry in POPUPS. */
  function _render(popup) {
    const parts = [];
    if (popup.intro) parts.push(_el('p', popup.intro, 'popup-intro'));

    (popup.groups || []).forEach((group) => {
      parts.push(_el('h3', group.heading, 'popup-heading'));
      const list = _el('ul', '', 'popup-list');
      group.items.forEach((item) => list.appendChild(_el('li', item)));
      parts.push(list);
    });
    return parts;
  }

  function open(id) {
    const popup = POPUPS[id];
    if (!popup) return;

    dialog.dataset.popup = id;
    title.textContent = popup.title;
    body.replaceChildren(..._render(popup));
    dialog.showModal();
  }

  // Open: any dock icon with data-popup
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-popup]');
    if (button) open(button.dataset.popup);
  });

  // Close: the × button, or a click on the dimmed area outside the card
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('.popup-close')) dialog.close();
  });
})();
