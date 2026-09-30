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
     when     optional. When you went, e.g. 'Mar 2025' or '2019 and 2024'. For a next stop, when
              you hope to go, e.g. 'Someday'.
     cities   optional. The cities you visited, e.g. ['Tokyo', 'Kyoto'].
     note     optional. A line in handwriting, shown when the pin is tapped
     photo    optional. A small photo, e.g. 'img/map/tokyo.webp' (WebP, around 400px wide)
     alt      describes the photo for screen readers
   All of these show in the card next to the globe when a pin or chip is selected; any you
   leave out are simply skipped. The names and coordinates below are placeholders, so swap in your own.
────────────────────────────────────────────── */

const PLACES = [
  { name: 'Singapore', status: 'home', lat: 1.35, lng: 103.82, note: 'Where I live and design.' },
  { name: 'Place 1', status: 'been', lat: 35.68, lng: 139.69, when: '[Year]', cities: ['[City]', '[City]'], note: '[A line about this place.]' },
  { name: 'Place 2', status: 'been', lat: -36.85, lng: 174.76, when: '[Year]', cities: ['[City]', '[City]'], note: '[A line about this place.]' },
  { name: 'Place 3', status: 'been', lat: -33.87, lng: 151.21, when: '[Year]', cities: ['[City]', '[City]'], note: '[A line about this place.]' },
  { name: 'Place 4', status: 'been', lat: 13.76, lng: 100.5, when: '[Year]', cities: ['[City]', '[City]'], note: '[A line about this place.]' },
  { name: 'Place 5', status: 'next', lat: 51.51, lng: -0.13, when: '[When]', cities: ['[City]'], note: '[Why it is on the list.]' },
  { name: 'Place 6', status: 'next', lat: 40.71, lng: -74.0, when: '[When]', cities: ['[City]'], note: '[Why it is on the list.]' },
];
