/* ─────────────────────────────────────────────
   TOOLS POPUP
   A paper note of tool groups beside a pen holder with one pencil per group, from
   POPUPS.tools (data/popups.js). The pencils are decoration, hidden from screen readers.
   Styles: css/features/popups/tools.css.
────────────────────────────────────────────── */

POPUP_RENDERERS.tools = function (popup) {
  const groups = popup.groups || [];

  /* ── Pen holder ── */

  const pencils = popupEl('div', '', 'pencils');
  groups.forEach((group) => {
    const pencil = popupEl('div', '', 'pencil');
    const body = popupEl('span', '', 'pencil-body');
    body.appendChild(popupEl('span', group.pencil || group.heading, 'pencil-label'));
    pencil.append(popupEl('span', '', 'pencil-tip'), body);
    pencils.appendChild(pencil);
  });

  const holder = popupEl('div', '', 'pen-holder');
  holder.setAttribute('aria-hidden', 'true');
  holder.append(pencils, popupEl('div', '', 'pouch'));

  /* ── The note ── */

  const note = popupEl('div', '', 'tools-note');
  if (popup.intro) note.appendChild(popupEl('p', popup.intro, 'popup-intro'));

  const list = popupEl('div', '', 'tools-groups');
  groups.forEach((group) => {
    const section = popupEl('section', '', 'tools-group');
    const items = popupEl('ul', '', 'tools-items');
    group.items.forEach((item) => items.appendChild(popupEl('li', item)));
    section.append(popupEl('h3', group.heading, 'tools-heading'), items);
    list.appendChild(section);
  });
  note.appendChild(list);

  const layout = popupEl('div', '', 'tools');
  layout.append(holder, note); // the holder comes first, so it sits above the note on phones

  const scroll = popupEl('div', '', 'popup-scroll');
  scroll.appendChild(layout);
  const footer = popupEl('div', '', 'popup-footer');
  footer.appendChild(popupCloseTag());
  return [scroll, footer];
};
