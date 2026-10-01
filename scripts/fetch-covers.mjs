/* ─────────────────────────────────────────────
   FETCH COVERS
   Fills in the album and book covers listed in data/music.js and data/books.js.

     node scripts/fetch-covers.mjs          show what it would download (nothing is saved)
     node scripts/fetch-covers.mjs --yes    download, and add image / alt / preview to the data files
     --force                                also redo entries that already have an image
     --credits                              only correct each entry's artist to the credit on the
                                            store (no downloads), e.g. BORNS to BØRNS

   Songs and albums come from the iTunes Search API (the 30-second preview is a link to
   Apple's file, never copied). Books come from Open Library. Covers are saved as JPEG,
   resized to about 400px with macOS `sips`, into img/music/ and img/books/.
   Entries that already have an image are left alone, and so are placeholders like "[Book title]".
────────────────────────────────────────────── */

import { readFileSync, writeFileSync, mkdirSync, statSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const YES = process.argv.includes('--yes');
const FORCE = process.argv.includes('--force');
const CREDITS = process.argv.includes('--credits');
const WIDTH = 400;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const slug = (text) =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[øØ]/g, 'o')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Lower case, no accents, so BORNS finds BØRNS; a result by someone else is never used
const plain = (text) =>
  text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[øØ]/g, 'o')
    .toLowerCase();

async function getJson(url) {
  await wait(300); // one request at a time, politely
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} from ${url}`);
  return res.json();
}

/* ── Lookups: each returns { cover, preview? } or null ── */

async function findMusic(item) {
  const kind = item.kind === 'album' ? 'album' : 'song';
  const term = encodeURIComponent(`${item.title} ${item.artist}`);
  const { results } = await getJson(
    `https://itunes.apple.com/search?term=${term}&entity=${kind}&limit=15`
  );
  const wanted = plain(item.artist);
  const byArtist = results.filter((r) => r.artistName && plain(r.artistName).includes(wanted));
  // An optional `album` picks the release (and so the cover) when a song is on several
  const onAlbum = item.album
    ? byArtist.filter((r) => plain(r.collectionName || '').includes(plain(item.album)))
    : byArtist;
  const hit = onAlbum[0] || (item.album ? undefined : byArtist[0]);
  if (!hit?.artworkUrl100) return null;

  let preview = hit.previewUrl;
  if (kind === 'album') {
    const { results: tracks } = await getJson(
      `https://itunes.apple.com/lookup?id=${hit.collectionId}&entity=song&limit=3`
    );
    preview = tracks.find((t) => t.previewUrl)?.previewUrl;
  }
  return {
    cover: hit.artworkUrl100.replace(/\d+x\d+bb/, '600x600bb'),
    preview,
    found: `${hit.trackName || hit.collectionName} by ${hit.artistName}`,
    artist: hit.artistName,
  };
}

async function findBook(item) {
  if (item.isbn) {
    return { cover: `https://covers.openlibrary.org/b/isbn/${item.isbn}-L.jpg?default=false` };
  }
  const query = encodeURIComponent(`${item.title} ${item.author}`);
  const { docs } = await getJson(
    `https://openlibrary.org/search.json?q=${query}&limit=5&fields=title,author_name,cover_i`
  );
  const hit = docs.find((d) => d.cover_i);
  return hit
    ? {
        cover: `https://covers.openlibrary.org/b/id/${hit.cover_i}-L.jpg?default=false`,
        found: `${hit.title} by ${(hit.author_name || []).join(', ')}`,
      }
    : null;
}

/* ── Reading and writing the data files (plain `const NAME = [ ... ];` lists) ── */

function readList(file, name) {
  const source = readFileSync(join(ROOT, file), 'utf8');
  const start = source.indexOf(`const ${name} = [`);
  const end = source.lastIndexOf('];');
  const list = vm.runInNewContext(`(${source.slice(start + `const ${name} = `.length, end + 1)})`);
  return { source, start, end, list };
}

const quote = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
function writeList(file, name, { source, start, end }, list, keys) {
  const body = list
    .map((item) => {
      const lines = keys
        .filter((key) => item[key] !== undefined)
        .map((key) => `    ${key}: ${quote(item[key])},`);
      return `  {\n${lines.join('\n')}\n  },`;
    })
    .join('\n');
  const text = `${source.slice(0, start)}const ${name} = [\n${body}\n${source.slice(end)}`;
  writeFileSync(join(ROOT, file), text);
}

/* ── Downloading ── */

async function save(url, folder, name) {
  const dir = join(ROOT, 'img', folder);
  mkdirSync(dir, { recursive: true });
  const out = join(dir, `${name}.jpg`);
  await wait(300);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  execFileSync('sips', ['-Z', String(WIDTH), '--setProperty', 'formatOptions', '70', out], {
    stdio: 'ignore',
  });
  return { path: `img/${folder}/${name}.jpg`, kb: Math.round(statSync(out).size / 1024) };
}

async function fillCovers({ file, name, keys, folder, find, label, altText }) {
  const data = readList(file, name);
  let changed = false;
  for (const item of data.list) {
    const title = item.title || '';
    if (title.startsWith('[')) continue; // a placeholder, not a real entry
    if (item.image && !FORCE && !CREDITS) continue;
    const who = `${title} (${label(item)})`;
    try {
      const found = await find(item);
      if (!found) {
        console.log(`  not found   ${who}; it keeps its placeholder`);
        continue;
      }
      if (CREDITS) {
        if (found.artist && found.artist !== item.artist) {
          console.log(`  credit      ${title}: ${item.artist} -> ${found.artist}`);
          item.artist = found.artist;
          changed = true;
        }
        continue;
      }
      const file = `${slug(title)}-${slug(label(item))}`;
      if (!YES) {
        console.log(
          `  would save  ${who}\n              as img/${folder}/${file}.jpg  from ${found.cover}`
        );
        if (found.found) console.log(`              matched: ${found.found}`);
        if (found.preview) console.log(`              plus a link to a 30s preview clip`);
        continue;
      }
      const saved = await save(found.cover, folder, file);
      if (found.artist) item.artist = found.artist; // always the credited artist
      item.image = saved.path;
      item.alt = altText(item);
      if (found.preview) item.preview = found.preview;
      changed = true;
      console.log(`  saved       ${who} -> ${saved.path} (${saved.kb} KB)`);
    } catch (error) {
      console.log(`  failed      ${who}: ${error.message}`);
    }
  }
  if (changed) writeList(file, name, data, data.list, keys);
}

console.log(YES ? 'Downloading covers...' : 'Dry run (add --yes to download). Nothing is saved.');
console.log('\nMusic');
await fillCovers({
  file: 'data/music.js',
  name: 'MUSIC',
  keys: ['kind', 'title', 'artist', 'album', 'image', 'alt', 'preview', 'note'],
  folder: 'music',
  find: findMusic,
  label: (item) => item.artist,
  altText: (item) => `Cover of ${item.title} by ${item.artist}`,
});
console.log('\nBooks');
await fillCovers({
  file: 'data/books.js',
  name: 'BOOKS',
  keys: ['title', 'author', 'isbn', 'status', 'image', 'alt', 'take'],
  folder: 'books',
  find: findBook,
  label: (item) => item.author,
  altText: (item) => `Cover of ${item.title} by ${item.author}`,
});
