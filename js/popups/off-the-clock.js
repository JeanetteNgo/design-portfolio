/* ─────────────────────────────────────────────
   OFF THE CLOCK POPUP
   A side-quest checklist on notebook paper, built from QUESTS in
   data/quests.js. Looks live in css/features/popups/off-the-clock.css.

   Clicking a quest:
     done         swaps the list for that quest's memory (date, story, photo, caption)
     wip / todo   jiggles it and shows a short reply from QUEST_REPLIES
   Visitors can't tick anything; the state comes from the data.
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
    if (lines.length > 1 && line === lastReply) line = lines[(lines.indexOf(line) + 1) % lines.length];
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
    const { date, description, image, video, poster, alt, caption } = quest.memory || {};

    // A "Quest complete" stamp sits at the top, where the popup's title is on the list
    const parts = [popupEl('p', '✓ Quest complete', 'quest-stamp')];
    if (date) parts.push(popupEl('p', date, 'quest-memory-date'));
    parts.push(popupEl('h3', quest.title, 'quest-memory-title'));
    if (description) parts.push(popupEl('p', description));
    if (image || video) {
      // Polaroid: the photo or video, with an optional scribbled caption underneath
      const polaroid = popupEl('figure', '', 'quest-polaroid');
      let media;
      if (video) {
        // Plays on tap, never on its own. preload "none" means the file only downloads
        // when someone presses play; until then the poster frame (or the photo) shows.
        media = popupEl('video');
        media.src = video;
        media.poster = poster || image || '';
        media.controls = true;
        media.playsInline = true; // plays in the polaroid on iPhones, not full screen
        media.preload = 'none';
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

    const back = popupEl('button', 'back to the list', 'paper-btn');
    back.type = 'button';
    back.addEventListener('click', _showList);
    parts.push(back);

    lastButton = button;
    memoryView.replaceChildren(...parts);
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
  const close = popupEl('button', '', 'esc-tag');
  close.type = 'button';
  close.dataset.popupClose = '';
  close.append(popupEl('kbd', 'Esc', 'esc-key'), ' to close');

  if (popup.intro) listView.appendChild(popupEl('p', popup.intro, 'popup-intro'));
  listView.append(list, popupEl('p', 'tap a quest', 'quest-hint'), close);

  // Closing the popup (Esc, ×, tapping outside) stops a playing video too
  document.getElementById('popup').addEventListener('close', _stopVideo, { once: true });

  return [listView, memoryView];
};
