/* ─────────────────────────────────────────────
   OFF THE CLOCK POPUP
   What I'm into outside work, as a scrapbook page: each section is a clipping with a
   handwritten title; clicking either opens its full view (← goes back). This file is the
   shell; each section is a file in js/popups/off-the-clock/ that adds itself:
     OFF_CLOCK_SECTIONS.push({ id, label, build(shell) {
       return { preview, view, note, count, noun };
     } });
   preview is the clipping, view the full view, note the title, and count / noun name the
   title button for screen readers ("See all 12 songs").
   Add `soon: true` to leave a section off the page. Spots appear in the order the section
   scripts load. Inside a full view, shell.open(elements, backLabel, buttonToReturnTo) opens
   an item; shell.onChange(fn) runs fn whenever the view changes (e.g. to stop audio).
   Styles: css/features/popups/off-the-clock.css.
────────────────────────────────────────────── */

const OFF_CLOCK_SECTIONS = [];

POPUP_RENDERERS['off-the-clock'] = function (popup) {
  const mainView = popupEl('div', '', 'popup-view');
  const detailView = popupEl('div', '', 'popup-view otc-detail');
  detailView.hidden = true;
  const stack = []; // views opened over the page, each { nodes, from }
  const changeHandlers = [];

  // Stop anything playing in the view being left
  function _leave() {
    changeHandlers.forEach((fn) => fn());
    detailView.querySelector('video')?.pause();
  }

  function _footer(backLabel) {
    const footer = popupEl('div', '', 'otc-footer');
    footer.appendChild(popupBackTag(backLabel, shell.close));
    return footer;
  }

  function _push(nodes, from) {
    _leave();
    stack.push({ nodes, from });
    detailView.replaceChildren(...nodes);
    mainView.hidden = true;
    detailView.hidden = false;
    detailView.querySelector('.otc-footer button').focus();
  }

  const shell = {
    open(content, backLabel, from) {
      const scroll = popupEl('div', '', 'popup-scroll');
      scroll.append(...content);
      _push([scroll, _footer(backLabel)], from);
    },
    close() {
      _leave();
      const { from } = stack.pop();
      if (stack.length) {
        detailView.replaceChildren(...stack.at(-1).nodes);
      } else {
        detailView.hidden = true;
        mainView.hidden = false;
      }
      from?.focus();
    },
    onChange(fn) {
      changeHandlers.push(fn);
    },
  };

  /* ── Heading ── */

  // The dialog's hidden title names the popup for screen readers
  const head = popupEl('header', '', 'otc-head');
  const title = popupEl('span', popup.title, 'otc-title');
  title.setAttribute('aria-hidden', 'true');
  head.appendChild(title);
  if (popup.intro) head.appendChild(popupEl('p', popup.intro, 'popup-intro'));

  /* ── The page: a clipping per section, with a handwritten title ── */

  const cover = popupEl('ul', '', 'otc-cover');
  OFF_CLOCK_SECTIONS.filter((section) => !section.soon).forEach((section) => {
    const { preview, view, note, count, noun } = section.build(shell);
    const spot = popupEl('li', '', 'otc-spot');
    spot.dataset.section = section.id;

    const clip = popupEl('div', '', 'otc-clip');
    clip.appendChild(preview);

    const opener = popupEl('button', note, 'otc-spot-title');
    opener.type = 'button';
    opener.setAttribute('aria-label', `See all ${count} ${noun}`);
    opener.addEventListener('click', () => {
      const viewHead = popupEl('header', '', 'otc-head');
      viewHead.appendChild(popupEl('h3', section.label, 'otc-title'));
      _push([viewHead, view, _footer(`back to ${popup.title}`)], opener);
    });
    // The whole spot opens it too, except its own buttons (e.g. a record's play)
    spot.addEventListener('click', (e) => !e.target.closest('button') && opener.click());

    spot.append(clip, opener);
    cover.appendChild(spot);
  });

  const scroll = popupEl('div', '', 'popup-scroll otc-page');
  scroll.appendChild(cover);
  const footer = popupEl('div', '', 'otc-footer');
  footer.appendChild(popupCloseTag());
  mainView.append(head, scroll, footer);

  popupOnLeftKey(() => !detailView.hidden, shell.close);
  popupOnClose(_leave);

  return [mainView, detailView];
};
