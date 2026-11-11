/**
 * ClearMechanic — Guía de Integración DMS (Web App para Google Sites)
 *
 * URL params:
 *   ?lang=es|en|pt   idioma inicial (si no se envía, se detecta del navegador)
 *   ?page=<id>       sección inicial (overview, auth, appointments, orders, quotes…)
 *
 * El contenido vive en Content.gs. Este archivo solo arma y sirve la página.
 */

var SUPPORTED_LANGS = ['es', 'en', 'pt'];
var DEFAULT_LANG = 'es';
var TRANSLATION_CACHE_SECONDS = 21600; // 6 h (máximo de CacheService)

function doGet(e) {
  var p = (e && e.parameter) || {};
  var explicitLang = SUPPORTED_LANGS.indexOf(String(p.lang || '').toLowerCase()) >= 0;
  var lang = explicitLang ? String(p.lang).toLowerCase() : DEFAULT_LANG;

  var tpl = HtmlService.createTemplateFromFile('index');
  tpl.guideJson = safeJson_(buildGuide_(lang));
  tpl.bootJson = safeJson_({ lang: lang, explicitLang: explicitLang, page: String(p.page || '') });

  return tpl.evaluate()
    .setTitle('ClearMechanic · DMS Integration Guide')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // necesario para Google Sites
}

/** Llamado desde el cliente (google.script.run) al cambiar de idioma. */
function getGuide(lang) {
  lang = SUPPORTED_LANGS.indexOf(lang) >= 0 ? lang : DEFAULT_LANG;
  return JSON.stringify(buildGuide_(lang));
}

/** Incluye otro archivo HTML del proyecto (styles, app). */
function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

/* ------------------------------------------------------------------------ */

function buildGuide_(lang) {
  var src = getGuideSource_();
  var out = resolve_(src, lang, {});
  out.lang = lang;
  out.langs = SUPPORTED_LANGS;
  return out;
}

/** Recorre el contenido: cada T(es,en,pt) se convierte en HTML del idioma pedido. */
function resolve_(node, lang, memo) {
  if (Array.isArray(node)) {
    return node.map(function (n) { return resolve_(n, lang, memo); });
  }
  if (node && typeof node === 'object') {
    if (isI18n_(node)) return pick_(node, lang, memo);
    var out = {};
    for (var k in node) if (Object.prototype.hasOwnProperty.call(node, k)) out[k] = resolve_(node[k], lang, memo);
    return out;
  }
  return node;
}

function isI18n_(o) {
  if (!Object.prototype.hasOwnProperty.call(o, 'es')) return false;
  for (var k in o) if (SUPPORTED_LANGS.indexOf(k) < 0) return false;
  return true;
}

function pick_(o, lang, memo) {
  var v = o[lang];
  if (v != null && v !== '') return md_(v);
  var base = md_(o.es);
  if (lang === 'es') return base;
  return autoTranslate_(base, lang, memo);
}

/** Marcado mínimo: `code`, **bold**, [texto](url|#seccion|mailto:) */
function md_(s) {
  if (s == null) return s;
  s = String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  s = s.replace(/`([^`]+)`/g, '<code class="notranslate" translate="no">$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\(#([\w-]+)\)/g, '<a href="#$2" data-goto="$2">$1</a>');
  s = s.replace(/\[([^\]]+)\]\(((?:https?:|mailto:)[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}

/** Traducción automática (solo para textos sin traducción manual), con caché. */
function autoTranslate_(html, lang, memo) {
  var key = 'tr:' + lang + ':' + hash_(html);
  if (memo[key]) return memo[key];
  var cache = (typeof CacheService !== 'undefined') ? CacheService.getScriptCache() : null;
  var hit = cache && cache.get(key);
  if (hit) return (memo[key] = hit);
  var result = html;
  try {
    if (typeof LanguageApp !== 'undefined') {
      result = LanguageApp.translate(html, 'es', lang, { contentType: 'html' });
      if (cache) cache.put(key, result, TRANSLATION_CACHE_SECONDS);
    }
  } catch (err) {
    console.warn('Auto-translate failed (' + lang + '): ' + err);
  }
  return (memo[key] = result);
}

function hash_(s) {
  if (typeof Utilities === 'undefined') return s.length + ':' + s.slice(0, 40);
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, s, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ((b + 256) % 256).toString(16).padStart(2, '0'); }).join('');
}

/** JSON seguro para incrustar en <script>. */
function safeJson_(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(new RegExp('\u2028', 'g'), '\\u2028')
    .replace(new RegExp('\u2029', 'g'), '\\u2029');
}

/* ------------------------------------------------------------------------ */
/*  Utilidades para mantenimiento (ejecutar desde el editor de Apps Script)  */
/* ------------------------------------------------------------------------ */

/** Lista en el registro los textos sin traducción manual en EN o PT. */
function listMissingTranslations() {
  var missing = [];
  (function walk(node, path) {
    if (Array.isArray(node)) return node.forEach(function (n, i) { walk(n, path + '[' + i + ']'); });
    if (node && typeof node === 'object') {
      if (isI18n_(node)) {
        SUPPORTED_LANGS.forEach(function (l) {
          if (l !== 'es' && (node[l] == null || node[l] === '')) missing.push(l.toUpperCase() + '  ' + path + '  →  ' + node.es);
        });
        return;
      }
      for (var k in node) walk(node[k], path + '.' + k);
    }
  })(getGuideSource_(), 'guide');
  console.log(missing.length ? missing.join('\n') : 'Todo traducido ✔');
  return missing.length;
}

/** Limpia la caché de traducciones automáticas (tras corregir textos en español). */
function clearTranslationCache() {
  var cache = CacheService.getScriptCache();
  var keys = [];
  (function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === 'object') {
      if (isI18n_(node)) {
        SUPPORTED_LANGS.forEach(function (l) { if (l !== 'es') keys.push('tr:' + l + ':' + hash_(md_(node.es))); });
        return;
      }
      for (var k in node) walk(node[k]);
    }
  })(getGuideSource_());
  cache.removeAll(keys);
  console.log('Removed ' + keys.length + ' cache keys');
}
