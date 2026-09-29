/* ─────────────────────────────────────────────
   SITE SHELL DATA
   The nav bar and footer on every page are built from this file
   by js/site-shell.js. Edit here once; every page updates.

   nav:
     id     → matches <body data-page="…"> to show the active tab
     href   → page links are relative to the site root (e.g. 'projects.html');
              full https:// links open in a new tab automatically
────────────────────────────────────────────── */

const RESUME_URL = 'https://tinyurl.com/dem4s9x2';
const LINKEDIN_URL = 'https://www.linkedin.com/in/jeanette-ngo/';

const SITE = {
  nav: [
    { id: 'home', label: 'Home', href: 'index.html' },
    { id: 'projects', label: 'Projects', href: 'projects.html' },
    // { id: 'about', label: 'About', href: 'about.html' },
    { id: 'resume', label: 'Resume', href: RESUME_URL },
  ],

  footer: {
    heading: 'Thanks for dropping by ❣',
    text: "If you would like to reach out for a chat, I'm just a click away.",
    links: [
      { label: 'Resume', href: RESUME_URL },
      { label: 'LinkedIn', href: LINKEDIN_URL },
    ],
    copyright: '© 2024 Jeanette Ngo. All rights reserved.',
  },
};
