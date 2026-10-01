/* ─────────────────────────────────────────────
   OFF THE CLOCK POPUP
   What I'm into outside work, on a notebook page with tabs. This file is the shell (heading,
   tabs, the opened view); each tab is a section in js/popups/off-the-clock/ that adds itself:
     OFF_CLOCK_SECTIONS.push({ id, label, build(shell) { return element; } });
   Tabs appear in the order the section scripts load. A section that opens an item calls
   shell.open(elements, backLabel, buttonToReturnTo); shell.close() brings the tabs back.
   Styles: css/features/popups/off-the-clock.css.
────────────────────────────────────────────── */

const OFF_CLOCK_SECTIONS = [];

POPUP_RENDERERS['off-the-clock'] = function (popup) {
  const mainView = popupEl('div', '', 'popup-view');
  const detailView = popupEl('div', '', 'popup-view otc-detail');
  detailView.hidden = true;
  let lastButton = null; // so focus can return to the item after it closes

  /* ── Opened view ── */

  const shell = {
    open(content, backLabel, from) {
      const scroll = popupEl('div', '', 'popup-scroll');
      scroll.append(...content);
      const back = popupBackTag(backLabel, shell.close);
      const footer = popupEl('div', '', 'otc-footer');
      footer.appendChild(back);

      lastButton = from;
      detailView.replaceChildren(scroll, footer);
      mainView.hidden = true;
      detailView.hidden = false;
      back.focus();
    },
    close() {
      detailView.querySelector('video')?.pause();
      detailView.hidden = true;
      mainView.hidden = false;
      lastButton?.focus();
    },
  };

  /* ── Heading ── */

  // The dialog's hidden title names the popup for screen readers
  const head = popupEl('header', '', 'otc-head');
  const title = popupEl('span', popup.title, 'otc-title');
  title.setAttribute('aria-hidden', 'true');
  head.appendChild(title);
  if (popup.intro) head.appendChild(popupEl('p', popup.intro, 'popup-intro'));

  /* ── Tabs ── */

  const tabs = popupEl('div', '', 'otc-tabs');
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Off the clock');
  const panels = popupEl('div', '', 'otc-panels');
  const parts = OFF_CLOCK_SECTIONS.map((section) => {
    const tab = popupEl('button', section.label, 'otc-tab');
    tab.type = 'button';
    tab.id = `otc-tab-${section.id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `otc-panel-${section.id}`);

    const panel = popupEl('div', '', 'otc-panel');
    panel.id = `otc-panel-${section.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.appendChild(section.build(shell));
    tabs.appendChild(tab);
    panels.appendChild(panel);
    return { tab, panel };
  });

  function _select(chosen, focus) {
    parts.forEach(({ tab, panel }) => {
      const on = tab === chosen;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
    });
    if (focus) chosen.focus();
  }
  parts.forEach(({ tab }) => tab.addEventListener('click', () => _select(tab)));
  tabs.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    const at = parts.findIndex(({ tab }) => tab === e.target);
    if (!step || at < 0) {
      if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        _select(parts[e.key === 'Home' ? 0 : parts.length - 1].tab, true);
      }
      return;
    }
    e.preventDefault();
    _select(parts[(at + step + parts.length) % parts.length].tab, true);
  });
  _select(parts[0].tab);

  const footer = popupEl('div', '', 'otc-footer');
  footer.appendChild(popupCloseTag());
  mainView.append(head, tabs, panels, footer);

  popupOnLeftKey(() => !detailView.hidden, shell.close);
  popupOnClose(() => detailView.querySelector('video')?.pause());

  return [mainView, detailView];
};
