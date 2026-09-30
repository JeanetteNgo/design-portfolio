/* ─────────────────────────────────────────────
   PLACES
   The pins on the map in the "Map" popup (built by js/popups/map.js).
   Add a place by adding a block to the list. Keep to city level, no exact addresses.

   Each place has:
     name     shown on its pin and chip, e.g. 'Singapore'
     status   'home'  where I am based (one is enough)
              'been'  a solid pin, somewhere I have been
              'next'  a dashed pin, somewhere I want to go
     x, y     where the pin sits on the map picture, in percent (x from the left, y from
              the top). The map is illustrated, not real geography, so put pins wherever
              they look nice. Try x: 50, y: 50 for the middle.
     note     a line shown when the pin is tapped
────────────────────────────────────────────── */

const PLACES = [
  { name: 'Singapore', status: 'home', x: 49, y: 80, note: 'Where I live and design.' },
  { name: 'Place 1', status: 'been', x: 17, y: 35, note: '[A line about this place.]' },
  { name: 'Place 2', status: 'been', x: 24, y: 62, note: '[A line about this place.]' },
  { name: 'Place 3', status: 'been', x: 66, y: 25, note: '[A line about this place.]' },
  { name: 'Place 4', status: 'been', x: 84, y: 58, note: '[A line about this place.]' },
  { name: 'Place 5', status: 'next', x: 58, y: 50, note: '[Why it is on the list.]' },
  { name: 'Place 6', status: 'next', x: 80, y: 78, note: '[Why it is on the list.]' },
];
