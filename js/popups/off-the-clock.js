/* ─────────────────────────────────────────────
   SIDE QUESTS POPUP
   A side-quest checklist from QUESTS (data/quests.js). Done quests open their memory;
   wip/todo jiggle and show a reply from QUEST_REPLIES. State comes from the data.
   Styles: css/features/popups/off-the-clock.css.
────────────────────────────────────────────── */

POPUP_RENDERERS['off-the-clock'] = function (popup) {
  const REPLY_TIME = 2200; // ms a reply stays up
  const STATUS_TEXT = { done: 'Done', wip: 'In progress', todo: 'Not started' }; // for screen readers

  const listView = popupEl('div', '', 'quest-view');
  const memoryView = popupEl('div', '', 'quest-memory');
  memoryView.hidden = true;

  let lastReply = '';
  let lastButton = null; // so focus can return to the quest after its memory closes

  /* ── Replies for unfinished quests ── */

  function _reply(item, status) {
    const lines = QUEST_REPLIES[status];
    let line = lines[Math.floor(Math.random() * lines.length)];
    if (lines.length > 1 && line === lastReply)
      line = lines[(lines.indexOf(line) + 1) % lines.length];
    lastReply = line;

    const bubble = item.querySelector('.quest-reply');
    bubble.textContent = line;

    // Restart the jiggle
    item.classList.remove('is-jiggling');
    void item.offsetWidth;
    item.classList.add('is-jiggling');

    clearTimeout(item.replyTimer);
    item.replyTimer = setTimeout(() => {
      bubble.textContent = '';
      item.classList.remove('is-jiggling');
    }, REPLY_TIME);
  }

  /* ── Memory for finished quests ── */

  function _showMemory(quest, button) {
    const { date, description, image, video, poster, loop, alt, caption } = quest.memory || {};

    // A "Quest complete" stamp sits at the top, where the popup's title is on the list
    const head = popupEl('div', '', 'quest-head');
    head.appendChild(popupEl('p', '✓ Quest complete', 'quest-stamp'));
    const parts = [];
    if (date) parts.push(popupEl('p', date, 'quest-memory-date'));
    parts.push(popupEl('h3', quest.title, 'quest-memory-title'));
    if (description) parts.push(popupEl('p', description));
    if (image || video) {
      // Polaroid: the photo or video, with an optional scribbled caption underneath
      const polaroid = popupEl('figure', '', 'quest-polaroid');
      let media;
      if (video) {
        // Tap to play (preload none, poster shows); loop: true autoplays silently, unless motion is reduced
        const silentLoop = loop && !matchMedia('(prefers-reduced-motion: reduce)').matches;
        media = popupEl('video');
        media.src = video;
        media.poster = poster || image || '';
        media.controls = true;
        media.playsInline = true; // plays in the polaroid on iPhones, not full screen
        if (silentLoop) {
          media.muted = true; // browsers only autoplay silent video
          media.loop = true;
          media.autoplay = true;
        } else {
          media.preload = 'none';
        }
        if (alt) media.setAttribute('aria-label', alt);
      } else {
        media = popupEl('img');
        media.src = image;
        media.alt = alt || '';
      }
      polaroid.appendChild(media);
      if (caption) polaroid.appendChild(popupEl('figcaption', caption));
      parts.push(polaroid);
    }

    // Same key-hint tag as "Esc to close"; the ← key does the same thing
    const back = popupBackTag('back to the list', _showList);

    // The stamp (with the ×) stays at the top and the back tag at the bottom; the story scrolls
    const scroll = popupEl('div', '', 'popup-scroll');
    scroll.append(...parts);
    const footer = popupEl('div', '', 'quest-footer');
    footer.appendChild(back);

    lastButton = button;
    memoryView.replaceChildren(head, scroll, footer);
    listView.hidden = true;
    memoryView.hidden = false;
    back.focus();
  }

  // A video mustn't keep playing (and talking) once its memory is out of sight
  function _stopVideo() {
    memoryView.querySelector('video')?.pause();
  }

  function _showList() {
    _stopVideo();
    memoryView.hidden = true;
    listView.hidden = false;
    if (lastButton) lastButton.focus();
  }

  /* ── The checklist ── */

  const list = popupEl('ul', '', 'quest-list');
  QUESTS.forEach((quest) => {
    const item = popupEl('li', '', `quest quest--${quest.status}`);
    const button = popupEl('button', '', 'quest-btn');
    button.type = 'button';
    const title = popupEl('span', '', 'quest-title');
    title.appendChild(popupEl('span', quest.title, 'quest-text')); // inner span carries the strike line
    button.append(
      popupEl('span', '', 'quest-box'),
      title,
      popupEl('span', ` (${STATUS_TEXT[quest.status]})`, 'visually-hidden')
    );
    button.addEventListener('click', () =>
      quest.status === 'done' ? _showMemory(quest, button) : _reply(item, quest.status)
    );

    const bubble = popupEl('span', '', 'quest-reply');
    bubble.setAttribute('role', 'status'); // read out by screen readers when it appears

    item.append(button, bubble);
    list.appendChild(item);
  });

  // "Esc to close" tag: shows the keyboard shortcut, and closes on click for touch screens
  const close = popupCloseTag();

  // Title and intro sit in a header above the scrolling list. The title is repeated here
  // for the eye; the dialog's own (hidden) title still names it for screen readers.
  const head = popupEl('div', '', 'quest-head');
  const headTitle = popupEl('p', popup.title, 'quest-head-title');
  headTitle.setAttribute('aria-hidden', 'true');
  head.appendChild(headTitle);
  if (popup.intro) head.appendChild(popupEl('p', popup.intro, 'popup-intro'));
  // Only the list scrolls; the header above and the Esc tag below stay put
  const scroll = popupEl('div', '', 'popup-scroll');
  scroll.appendChild(list);
  const footer = popupEl('div', '', 'quest-footer');
  footer.appendChild(close);
  listView.append(head, scroll, footer);

  // ← goes back from a memory to the list, and closing the popup stops a playing video
  popupOnLeftKey(() => !memoryView.hidden, _showList);
  popupOnClose(_stopVideo);

  return [listView, memoryView];
};
