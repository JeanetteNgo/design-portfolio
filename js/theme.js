/* ─────────────────────────────────────────────
   THEME
   Loaded in every page's <head>, before the stylesheets, so a saved colour theme
   (css/themes.css) is on <html data-theme="…"> before anything is drawn.
   The Palette popup calls setTheme(id); 'salmon' is the default and isn't stored.
────────────────────────────────────────────── */

function currentTheme() {
  return document.documentElement.dataset.theme || 'salmon';
}

function setTheme(id) {
  const root = document.documentElement;
  if (id === 'salmon') delete root.dataset.theme;
  else root.dataset.theme = id;
  try {
    if (id === 'salmon') localStorage.removeItem('theme');
    else localStorage.setItem('theme', id);
  } catch (e) {} // storage blocked (private mode): the theme lasts until the page closes
}

try {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.dataset.theme = saved;
} catch (e) {}
