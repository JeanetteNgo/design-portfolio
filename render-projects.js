/* ─────────────────────────────────────────────
   RENDER PROJECTS
   Consumes the PROJECTS array from projects-registry.js.
   Exposes two public functions:
     renderFeatured(selector)  → Home page Selected Works section
     renderTimeline(selector)  → Projects page timeline
────────────────────────────────────────────── */

/* ── Helpers ───────────────────────────────── */

/** Build the tag row HTML from a project object. */
function _buildTagsHTML(project) {
  const filled  = (project.tags        || []).map(t => `<span class="tag">${t}</span>`).join('');
  const outline = (project.tagOutlines || []).map(t => `<span class="tag-outline">${t}</span>`).join('');
  return `<div class="tag-row">${filled}${outline}</div>`;
}

/** Build the external-link badge SVG snippet. */
const _externalBadge = `
  <span class="external-badge">
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"
         stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 10L10 2M10 2H5M10 2V7"/>
    </svg>
    External link
  </span>`;

/**
 * Build a full .feature-container element for a given project.
 * Handles all three types: case-study, external, disabled.
 */
function _buildCard(project) {
  // Modifier classes
  const modifiers = [];
  if (project.type === 'external')  modifiers.push('feature-container--external');
  if (project.type === 'disabled')  modifiers.push('feature-container--disabled');
  const classAttr = ['feature-container', ...modifiers].join(' ');

  // Link attributes
  const isDisabled = project.type === 'disabled';
  const isExternal = project.type === 'external';
  const linkAttrs  = [
    `href="${project.href}"`,
    isDisabled ? 'tabindex="-1" aria-disabled="true"' : '',
    isExternal ? 'target="_blank" rel="noopener noreferrer"' : '',
  ].filter(Boolean).join(' ');

  // Optional note + external badge
  const noteHTML    = project.note ? `<span class="note" style="margin-top:10px;">${project.note}</span>` : '';
  const badgeHTML   = isExternal   ? _externalBadge : '';

  // If there's both a note and a badge, wrap them in a tag-row
  const extras = (noteHTML && badgeHTML)
    ? `<div class="tag-row" style="margin-top:10px;">${noteHTML}${badgeHTML}</div>`
    : noteHTML + badgeHTML;

  return `
    <section class="${classAttr}">
      <a ${linkAttrs}>
        <img src="${project.cover}" alt="${project.coverAlt || project.title + ' cover'}">
        <div class="feature-info">
          ${_buildTagsHTML(project)}
          <h2>${project.title}</h2>
          <p>${project.description}</p>
          ${extras}
        </div>
      </a>
    </section>`;
}

/* ── Public: Featured (Home page) ──────────── */

/**
 * Renders featured projects into the element matching `selector`.
 * Projects are sorted by featuredOrder (ascending).
 */
function renderFeatured(selector) {
  const container = document.querySelector(selector);
  if (!container) { console.warn('renderFeatured: selector not found —', selector); return; }

  const featured = PROJECTS
    .filter(p => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

  container.innerHTML = featured.map(_buildCard).join('');
}

/* ── Public: Timeline (Projects page) ──────── */

/**
 * Groups PROJECTS by year (descending) and renders a timeline
 * into the element matching `selector`.
 */
function renderTimeline(selector) {
  const container = document.querySelector(selector);
  if (!container) { console.warn('renderTimeline: selector not found —', selector); return; }

  // Group by year, preserving registry order within each year
  const grouped = {};
  PROJECTS.forEach(p => {
    if (!grouped[p.year]) grouped[p.year] = [];
    grouped[p.year].push(p);
  });

  // Sort years descending (newest first)
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  const html = years.map((year, i) => {
    const cards = grouped[year].map(_buildCard).join('');
    return `
      <div class="timeline-group">
        <div class="timeline-left">
          <span class="timeline-pill">${year}</span>
          <div class="timeline-line"></div>
        </div>
        <div class="timeline-cards">
          ${cards}
        </div>
      </div>`;
  }).join('');

  container.innerHTML = html;
}
