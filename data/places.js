/* ─────────────────────────────────────────────
   PLACES
   The pins on the globe in the "Map" popup (built by js/popups/map.js).
   Add a place by adding a block to the list. Keep to city level, no exact addresses.

   Each place has:
     name     shown on its pin and chip, e.g. 'Singapore'
     status   'home'  where I am based (one is enough)
              'been'  a solid pin, somewhere I have been
              'next'  a dashed pin, somewhere I want to go
     lat      where it is on Earth, in degrees. Right-click a place in Google Maps and click
     lng      the numbers to copy them. lat: north is +, south is -. lng: east is +, west is -.
              e.g. Singapore is lat 1.35, lng 103.82. Two or three decimals is plenty.
     note     a line shown when the pin is tapped
   The names and coordinates below are placeholders, so swap in your own.
────────────────────────────────────────────── */

const PLACES = [
  { name: 'Singapore', status: 'home', lat: 1.35, lng: 103.82, note: 'Where I live and design.' },
  { name: 'Place 1', status: 'been', lat: 35.68, lng: 139.69, note: '[A line about this place.]' },
  { name: 'Place 2', status: 'been', lat: -36.85, lng: 174.76, note: '[A line about this place.]' },
  { name: 'Place 3', status: 'been', lat: -33.87, lng: 151.21, note: '[A line about this place.]' },
  { name: 'Place 4', status: 'been', lat: 13.76, lng: 100.5, note: '[A line about this place.]' },
  { name: 'Place 5', status: 'next', lat: 51.51, lng: -0.13, note: '[Why it is on the list.]' },
  { name: 'Place 6', status: 'next', lat: 40.71, lng: -74.0, note: '[Why it is on the list.]' },
];
