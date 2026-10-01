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

// Placeholder photos and notes: replace with your own. been.svg stands in until a photo is added.
const PLACES = [
  {
    name: 'Singapore',
    status: 'home',
    lat: 1.35,
    lng: 103.82,
    note: 'Where I live and design.',
    photo:
      'img/map/placeholder/singapore.svg',
    alt: 'Me in Singapore',
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
    note: 'Once is never enough!',
    photo:
      'img/map/japan.webp',
    alt: 'Me in Japan',
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
    note: 'Where I pursue my fangirl fantasies :)',
    photo:
      'img/map/korea.webp',
    alt: 'Me in South Korea',
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
      'Genting Highlands',
    ],
    note: 'Hello, neighbour!',
    photo:
      'img/map/malaysia.webp',
    alt: 'Me in Malaysia',
  },
  {
    name: 'New Zealand',
    status: 'been',
    lat: -41.29,
    lng: 174.78,
    when: '2024, 2025',
    cities: [
      'Christchurch',
      'Nelson',
      'Kaikoura',
      'Hanmer Springs',
      'Haast',
      'Fox Glacier',
      'Queenstown',
      'Wanaka',
      'Dunedin',
      'Oamaru',
      'Invercargill',
      'Te Anau',
      'Bluff',
      'Whangārei',
      'Auckland',
      'Taupo',
      'Rotorua',
      'Tauranga',
      'Coromandel',
      'Wellington',
      '...and many more!',
    ],
    note: 'Embarked on my own Hobbit adventure! 👣',
    photo:
      'img/map/new-zealand.webp',
    alt: 'Me in New Zealand',
  },

  {
    name: 'China',
    status: 'been',
    lat: 39.9,
    lng: 116.41,
    when: '2005, 2007, 2011, 2017, 2023',
    cities: [
      'Hainan',
    ],
    note: 'Reconnecting with my roots?',
    photo: 'img/map/placeholder/been.svg',
    alt: 'Me in China',
  },
  {
    name: 'Taiwan',
    status: 'been',
    lat: 25.03,
    lng: 121.57,
    when: '2013, 2018',
    cities: [
      'Taipei',
      'Kaohsiung',
    ],
    note: 'Once is never enough! x2',
    photo: 'img/map/placeholder/been.svg',
    alt: 'Me in Taiwan',
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
    note: 'Beautiful churches.',
    photo: 'img/map/placeholder/been.svg',
    alt: 'Me in Italy',
  },
  {
    name: 'Switzerland',
    status: 'been',
    lat: 46.95,
    lng: 7.45,
    when: '2016',
    cities: [
      'Lucerne',
      'Interlaken',
    ],
    note: 'Freshest air, probably ever.',
    photo: 'img/map/placeholder/been.svg',
    alt: 'Me in Switzerland',
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
    note: 'Windmills!',
    photo: 'img/map/placeholder/been.svg',
    alt: 'Me in The Netherlands',
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
    note: 'Did someone say "croissant"? 😀',
    photo: 'img/map/placeholder/been.svg',
    alt: 'Me in France',
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
    note: 'Gotta revisit!',
    photo: 'img/map/placeholder/been.svg',
    alt: 'Me in Thailand',
  },
  {
    name: 'Indonesia',
    status: 'next',
    lat: -6.21,
    lng: 106.85,
    when: '2027',
    cities: [
      'Ubud',
    ],
    note: 'Beaches and volcano sunrises.',
    photo:
      'img/map/placeholder/next-stop.svg',
    alt: 'Illustration of a dashed flight path to a map pin',
  },
  {
    name: 'Australia',
    status: 'next',
    lat: -35.28,
    lng: 149.13,
    when: '2027',
    cities: [
      'Sydney',
    ],
    note: 'Coastal drives and good coffee.',
    photo:
      'img/map/placeholder/next-stop.svg',
    alt: 'Illustration of a dashed flight path to a map pin',
  },
  {
    name: 'Kyrgyzstan',
    status: 'next',
    lat: 42.87,
    lng: 74.59,
    when: 'Someday',
    cities: [
      'Bishkek',
    ],
    note: 'Mountain lakes and yurt stays.',
    photo:
      'img/map/placeholder/next-stop.svg',
    alt: 'Illustration of a dashed flight path to a map pin',
  },
];
