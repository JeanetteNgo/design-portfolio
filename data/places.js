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

// Placeholder photos and notes: replace with your own
const PLACES = [
  {
    name: 'Singapore',
    status: 'home',
    lat: 1.35,
    lng: 103.82,
    note: 'Where I live and design.',
    photo:
      'img/map/placeholder/singapore.svg',
    alt: 'Illustration of the Marina Bay towers at sunset',
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
    note: 'Good food',
    photo:
      'img/quests/240913-bungy.webp',
    alt: 'A photo of Malaysia',
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
    note: 'Great beaches',
    photo:
      'img/map/placeholder/thailand.svg',
    alt: 'Illustration of a palm tree and boat at a tropical sunset',
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
    note: 'Beautiful landscapes',
    photo:
      'img/map/placeholder/china.svg',
    alt: 'Illustration of a wall winding over misty hills',
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
    note: 'Good food',
    photo:
      'img/map/placeholder/taiwan.svg',
    alt: 'Illustration of a tall tower against a blue sky',
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
    note: 'Pasta, gelato, repeat.',
    photo:
      'img/map/placeholder/italy.svg',
    alt: 'Illustration of a stone arcade at golden hour',
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
    note: 'Trains with a view.',
    photo:
      'img/map/placeholder/switzerland.svg',
    alt: 'Illustration of an alpine peak above a small chalet',
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
    note: 'So many bikes.',
    photo:
      'img/map/placeholder/netherlands.svg',
    alt: 'Illustration of a windmill in a flower field',
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
    note: 'Croissants over museums.',
    photo:
      'img/map/placeholder/france.svg',
    alt: 'Illustration of a tall iron tower at dusk',
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
    note: 'Late-night food runs.',
    photo:
      'img/map/placeholder/korea.svg',
    alt: 'Illustration of a pagoda at sunrise',
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
    note: 'Hiking, huts and road trips.',
    photo:
      'img/map/placeholder/newzealand.svg',
    alt: 'Illustration of green hills below snowy mountains',
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
    note: 'Vending machines for everything.',
    photo:
      'img/map/placeholder/japan.svg',
    alt: 'Illustration of a snow-capped mountain at sunset',
  },
  {
    name: 'Indonesia',
    status: 'next',
    lat: -6.21,
    lng: 106.85,
    when: 'Someday',
    cities: [
      'Ubud',
    ],
    note: 'Beaches and volcano sunrises.',
    photo:
      'img/map/placeholder/indonesia.svg',
    alt: 'Illustration of a volcano over the sea at sunrise',
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
      'img/map/placeholder/australia.svg',
    alt: 'Illustration of white sails on the harbour',
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
      'img/map/placeholder/kyrgyzstan.svg',
    alt: 'Illustration of a yurt below mountain peaks',
  },
];
