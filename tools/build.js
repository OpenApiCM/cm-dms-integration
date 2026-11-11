/**
 * Genera el sitio estático en dist/ (Cloudflare Pages / GitHub Pages / local).
 *
 *   npm run build                 -> dist/index.html + dist/_headers
 *   ALLOW_INDEXING=true npm run build   -> permite que buscadores indexen el sitio
 *
 * Reutiliza los mismos archivos de apps-script/ (Content.gs = única fuente).
 * Los 3 idiomas se incluyen en la página; un texto sin traducción manual se
 * muestra en español (en estático no hay traducción automática).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'apps-script');
const DIST = path.join(ROOT, 'dist');
const read = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');

// 1) Evaluar Content.gs + Code.gs (sin servicios de Google)
const ctx = { console: { log() {}, warn: console.warn } };
vm.createContext(ctx);
vm.runInContext(read('Content.gs') + '\n' + read('Code.gs'), ctx);
const langs = vm.runInContext('SUPPORTED_LANGS', ctx);
const guides = {};
for (const l of langs) guides[l] = vm.runInContext(`buildGuide_(${JSON.stringify(l)})`, ctx);
const safe = vm.runInContext('safeJson_', ctx);

// 2) Validaciones básicas (fallan el build si algo está roto)
const ids = new Set(guides.es.endpoints.map((e) => e.id));
if (ids.size !== guides.es.endpoints.length) throw new Error('IDs de endpoint duplicados');
const missingRefs = [];
(function walk(n) {
  if (Array.isArray(n)) return n.forEach(walk);
  if (n && typeof n === 'object') {
    if (n.type === 'endpoints') n.ids.forEach((id) => ids.has(id) || missingRefs.push(id));
    Object.values(n).forEach(walk);
  }
})(guides.es.sections);
if (missingRefs.length) throw new Error('Endpoints referenciados que no existen: ' + missingRefs.join(', '));
const missingTr = vm.runInContext('listMissingTranslations()', ctx);
if (missingTr) console.warn(`⚠ ${missingTr} textos sin traducción manual (se mostrarán en español). Ejecuta en Apps Script: listMissingTranslations()`);

// 3) Armar el HTML
const meta = guides.es.meta;
const indexable = String(process.env.ALLOW_INDEXING).toLowerCase() === 'true';
const favicon = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1f3864"/>' +
  '<text x="32" y="43" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#fff" text-anchor="middle">CM</text></svg>');
const head = [
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<title>ClearMechanic · DMS Integration Guide</title>',
  '<meta name="description" content="ClearMechanic DMS integration guide: flows, authentication, webhooks and endpoint reference (ES · EN · PT).">',
  `<meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}">`,
  '<meta property="og:title" content="ClearMechanic · DMS Integration Guide">',
  '<meta property="og:type" content="website">',
  `<link rel="icon" href="${favicon}">`
].join('\n    ');

const html = read('index.html')
  .replace('<meta charset="utf-8">', () => '<meta charset="utf-8">\n    ' + head)
  .replace("<?!= include('styles'); ?>", () => read('styles.html'))
  .replace("<?!= include('app'); ?>", () => read('app.html'))
  .replace('<?!= guideJson ?>', () => safe(guides.es) + ';\n      window.__GUIDES__ = ' + safe(guides))
  .replace('<?!= bootJson ?>', () => safe({ lang: 'es', explicitLang: false, page: '' }));
if (/<\?/.test(html)) throw new Error('Quedó un scriptlet de Apps Script sin reemplazar');

// 4) Escribir dist/
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'index.html'), html);
fs.writeFileSync(path.join(DIST, '_headers'), [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
  '  Cache-Control: public, max-age=0, must-revalidate',
  ...(indexable ? [] : ['  X-Robots-Tag: noindex, nofollow']),
  ''
].join('\n'));
fs.writeFileSync(path.join(DIST, 'robots.txt'), indexable ? 'User-agent: *\nAllow: /\n' : 'User-agent: *\nDisallow: /\n');

const kb = (fs.statSync(path.join(DIST, 'index.html')).size / 1024).toFixed(0);
console.log(`✔ dist/index.html (${kb} KB) · v${meta.version} · ${guides.es.endpoints.length} endpoints · ${langs.join('/')} · ${indexable ? 'indexable' : 'noindex'}`);
