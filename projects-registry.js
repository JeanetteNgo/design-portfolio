/* ─────────────────────────────────────────────
   PROJECTS REGISTRY

   type:
     "case-study"  → internal link to a dedicated case study page
     "external"    → links to a live site / external URL (dashed card style)
     "disabled"    → coming soon, not yet clickable (muted card style)

   featured:
     true  → shown on the Home page in the Selected Works section
     false → only shown on the Projects timeline page

   featuredOrder:
     Controls the order of cards on the Home page (lower = first).
     Ignored for non-featured projects.

   year:
     Used to group projects on the timeline. Must be a string.
────────────────────────────────────────────── */

const PROJECTS = [

  /* ── 2026 ─────────────────────────────────── */
  {
    id:           "nz-blog",
    title:        "NZ Work Holiday Blog",
    description:  "Vibe coding a personal blog to document my work holiday experience in NZ.",
    year:         "2026",
    cover:        "projects/img/nz-blog-cover.png",
    coverAlt:     "NZ Work Holiday Blog cover",
    tags:         ["Personal Project"],
    tagOutlines:  ["Web"],
    type:         "external",
    href:         "https://nz.jeanettengo.com/",
    note:         "✦ Work in Progress",
    featured:     false,
  },

  /* ── 2025 ─────────────────────────────────── */
  {
    id:           "asua",
    title:        "Aureus Trial Booking",
    description:  "Simplifying trial lesson bookings for aspiring musicians.",
    year:         "2025",
    cover:        "projects/asua/img/cover.png",
    coverAlt:     "Aureus Trial Booking cover",
    tags:         ["UI/UX", "Case Study"],
    tagOutlines:  ["Web"],
    type:         "disabled",
    href:         "projects/asua/index.html",
    note:         "✦ Coming soon!",
    featured:     true,
    featuredOrder: 3,
  },

  /* ── 2023 ─────────────────────────────────── */
  {
    id:           "ata",
    title:        "Aureus Trial Adventure",
    description:  "Reimagining the classroom experience for Singapore's budding musicians.",
    year:         "2023",
    cover:        "projects/ata/img/cover.png",
    coverAlt:     "Aureus Trial Adventure cover",
    tags:         ["UI/UX", "Case Study"],
    tagOutlines:  ["Tablet"],
    type:         "case-study",
    href:         "projects/ata/index.html",
    featured:     true,
    featuredOrder: 1,
  },

  /* ── 2022 ─────────────────────────────────── */
  {
    id:           "koko",
    title:        "KOKO Music",
    description:  "Leveraging e-learning to make music more accessible for all.",
    year:         "2022",
    cover:        "projects/img/koko-cover.png",
    coverAlt:     "KOKO Music cover",
    tags:         ["UI/UX", "Live Site"],
    tagOutlines:  ["Web"],
    type:         "external",
    href:         "https://www.kokomusic.com/",
    featured:     false,
  },

  {
    id:           "univus",
    title:        "uNivUS",
    description:  "Centralising campus resources for busy university students.",
    year:         "2022",
    cover:        "projects/univus/img/cover.png",
    coverAlt:     "uNivUS cover",
    tags:         ["UI", "Showcase"],
    tagOutlines:  ["Mobile"],
    type:         "case-study",
    href:         "projects/univus/index.html",
    featured:     true,
    featuredOrder: 2,
  },

];
