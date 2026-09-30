/* ─────────────────────────────────────────────
   PLACES
   The pins on the globe in the "Map" popup (built by js/popups/map.js).
   Add a place by adding a block to the list. Keep to city level, no exact addresses.

   Each place has:
     name     shown on its pin and stamp, e.g. 'Singapore'
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
   These show on the postcard when a pin or stamp is chosen; leave out any you don't need.
   Pins sit on each country's capital.
────────────────────────────────────────────── */

const PLACES = [
  {
    name: 'Singapore',
    status: 'home',
    lat: 1.35,
    lng: 103.82,
    note: 'Where I live and design.',
  },

  {
    name: 'Malaysia',
    status: 'been',
    lat: 3.14,
    lng: 101.69,
    when: '2010, 2023, 2025, 2026',
    cities: [
      'Malacca',
      'Johor Bahru',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'Thailand',
    status: 'been',
    lat: 13.76,
    lng: 100.5,
    when: '2015',
    cities: [
      'Bangkok',
      'Pattaya',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'China',
    status: 'been',
    lat: 39.9,
    lng: 116.41,
    when: '2005, 2007, 2011, 2017, 2023',
    cities: [
      'Hainan Island',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'Taiwan',
    status: 'been',
    lat: 23.5,
    lng: 121,
    when: '2013, 2018',
    cities: [
      'Taipei',
      'Kaohsiung',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'Italy',
    status: 'been',
    lat: 41.9029,
    lng: 12.4964,
    when: '2016',
    cities: [
      'Rome',
      'Venice',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'Switzerland',
    status: 'been',
    lat: 46.8182,
    lng: 8.2275,
    when: '2016',
    cities: [
      'Lucerne',
      'Interlaken',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'The Netherlands',
    status: 'been',
    lat: 52.3676,
    lng: 4.9041,
    when: '2016',
    cities: [
      'Amsterdam',
      'Rotterdam',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'France',
    status: 'been',
    lat: 48.8566,
    lng: 2.3522,
    when: '2016',
    cities: [
      'Paris',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'South Korea',
    status: 'been',
    lat: 37.57,
    lng: 126.98,
    when: '2023, 2026',
    cities: [
      'Seoul',
      'Busan',
      'Gangneung',
      'Sokcho',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'New Zealand',
    status: 'been',
    lat: -41.29,
    lng: 174.78,
    when: '2024, 2025',
    cities: [
      'Christchurch',
      'Hanmer Springs',
      'Queenstown',
      'Wanaka',
      'Auckland',
      'Taupo',
      'Rotorua',
      'Wellington',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'Japan',
    status: 'been',
    lat: 35.68,
    lng: 139.69,
    when: '2026',
    cities: [
      'Tokyo',
      'Kamakura',
      'Kawaguchiko',
      'Hakone',
    ],
    note: '[A line about this place.]',
  },
  {
    name: 'Australia',
    status: 'next',
    lat: -35.28,
    lng: 149.13,
    when: '[When]',
    cities: [
      '[City]',
    ],
    note: '[Why it is on the list.]',
  },
  {
    name: 'Kyrgyzstan',
    status: 'next',
    lat: 42.87,
    lng: 74.59,
    when: '[When]',
    cities: [
      '[City]',
    ],
    note: '[Why it is on the list.]',
  },
];
