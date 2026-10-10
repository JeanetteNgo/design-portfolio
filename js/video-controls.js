/* ─────────────────────────────────────────────
   VIDEO CONTROLS
   Swaps the browser's controls on case study videos for a slim bar with just
   play/pause, a scrub bar, the time (elapsed / length) and mute. Each video is
   wrapped in .video-player with the bar laid over its bottom edge. Without JavaScript the browser's own controls stay.
   Videos also need playsinline in the HTML, or iPhone Safari plays them full screen.
────────────────────────────────────────────── */

(() => {
  const ICONS = {
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    pause: '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>',
    muted:
      '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    sound:
      '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

  document.querySelectorAll('.project-container video').forEach((video) => {
    video.controls = false;
    video.playsInline = true;

    const player = document.createElement('div');
    player.className = 'video-player';
    video.before(player);
    player.append(video);

    const bar = document.createElement('div');
    bar.className = 'video-bar';
    bar.innerHTML = `
      <button type="button" class="video-play"></button>
      <input type="range" class="video-scrub" min="0" max="1000" value="0" aria-label="Seek" />
      <span class="video-time"></span>
      <button type="button" class="video-mute"></button>`;
    player.append(bar);
    const [play, scrub, time, mute] = bar.children;

    const clock = (seconds) =>
      `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
    const showTime = () => {
      if (video.duration) time.textContent = `${clock(video.currentTime)} / ${clock(video.duration)}`;
    };

    const showState = () => {
      play.innerHTML = icon(video.paused ? 'play' : 'pause');
      play.setAttribute('aria-label', video.paused ? 'Play' : 'Pause');
      mute.innerHTML = icon(video.muted ? 'muted' : 'sound');
      mute.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
      player.classList.toggle('is-paused', video.paused);
    };
    // The scrub bar follows the video smoothly while it plays
    let frame;
    const follow = () => {
      if (!scrubbing && video.duration) {
        scrub.value = (video.currentTime / video.duration) * 1000;
        scrub.style.setProperty('--progress', `${scrub.value / 10}%`);
      }
      showTime();
      frame = video.paused ? null : requestAnimationFrame(follow);
    };

    let scrubbing = false;
    scrub.addEventListener('pointerdown', () => (scrubbing = true));
    scrub.addEventListener('pointerup', () => (scrubbing = false));
    scrub.addEventListener('input', () => {
      if (video.duration) video.currentTime = (scrub.value / 1000) * video.duration;
      scrub.style.setProperty('--progress', `${scrub.value / 10}%`);
      showTime();
    });

    play.addEventListener('click', () => (video.paused ? video.play() : video.pause()));
    mute.addEventListener('click', () => (video.muted = !video.muted));
    video.addEventListener('click', () => (video.paused ? video.play() : video.pause()));
    video.addEventListener('play', () => {
      showState();
      if (!frame) follow();
    });
    video.addEventListener('pause', showState);
    video.addEventListener('volumechange', showState);
    video.addEventListener('seeked', () => video.paused && follow());
    video.addEventListener('loadedmetadata', showTime);

    showState();
    showTime();
    if (!video.paused) follow();
  });
})();
