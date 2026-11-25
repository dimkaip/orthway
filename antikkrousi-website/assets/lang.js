'use strict';
/* EL/EN language switch. Shares the "orthway-lang" key with the site's main index.html. */
(function () {
  var KEY = 'orthway-lang';
  var UI_EN = {
    title: 'Refutation of Erroneous Positions',
    desc: 'Complete digital edition of the 59 pages of the original, with polytonic text, quotations and images.',
    skip: 'Skip to the text', brand: 'THEOLOGICAL ARCHIVE', pdf: 'Original PDF ↗',
    eyebrow: 'LETTER · THEOLOGICAL TEXT', h1: 'Refutation<br>of Erroneous Positions',
    deck: 'The full text in digital form.', m1: '59 pages', m2: 'Polytonic script', m3: 'Text and images',
    start: 'Start reading ↓', nav: 'Page navigation',
    note: 'Numbering follows the PDF. The script, emphases and quotations of the original are preserved.',
    searchLabel: 'Search the text', placeholder: 'Word or phrase…', print: 'Print',
    fEnd: 'End of the text · 59 pages', fDl: 'Download original PDF ↓', fTop: 'Back to top ↑'
  };
  var UI_RO = {
    title: 'Respingerea pozițiilor greșite',
    desc: 'Ediție digitală completă a celor 59 de pagini ale originalului, cu text politonic, citate și imagini.',
    skip: 'Treci la text', brand: 'ARHIVĂ TEOLOGICĂ', pdf: 'PDF-ul original ↗',
    eyebrow: 'SCRISOARE · TEXT TEOLOGIC', h1: 'Respingerea<br>pozițiilor greșite',
    deck: 'Textul integral în format digital.', m1: '59 de pagini', m2: 'Scriere politonică', m3: 'Text și imagini',
    start: 'Începe lectura ↓', nav: 'Navigare pe pagini',
    note: 'Numerotarea urmează PDF-ul. Scrierea, accentele și citatele originalului sunt păstrate.',
    searchLabel: 'Caută în text', placeholder: 'Cuvânt sau expresie…', print: 'Tipărește',
    fEnd: 'Sfârșitul textului · 59 de pagini', fDl: 'Descarcă PDF-ul original ↓', fTop: 'Înapoi sus ↑'
  };
  var LANGS = {
    en: { ui: UI_EN, doc: function () { return window.DOCUMENT_EN; }, status: ['matches', 'No results'], page: 'Page', orig: 'Original ↗', img: 'Image of the original, page ' },
    ro: { ui: UI_RO, doc: function () { return window.DOCUMENT_RO; }, status: ['rezultate', 'Niciun rezultat'], page: 'Pagina', orig: 'Original ↗', img: 'Imagine a originalului, pagina ' }
  };
  var STATUS_EL = ['ἐπισημάνσεις', 'Κανένα ἀποτέλεσμα'];

  var els = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var greek = {};
  els.forEach(function (el) { greek[el.getAttribute('data-i18n')] = el.innerHTML; });
  var placeholderEl = document.getElementById('search');
  var greekPh = placeholderEl ? placeholderEl.getAttribute('placeholder') : '';
  var descEl = document.querySelector('meta[name="description"]');
  var greekTitle = document.title, greekDesc = descEl ? descEl.getAttribute('content') : '';

  var paras = Array.prototype.slice.call(document.querySelectorAll('#document p'));
  var orig = paras.map(function (p) { return p.innerHTML; });
  var look = paras.map(function (p) {            // dominant colour / weight of the original paragraph
    var colors = {}, bold = 0, total = 0;
    Array.prototype.forEach.call(p.querySelectorAll('span'), function (s) {
      var n = s.textContent.length, st = s.style;
      total += n;
      if (st.color) colors[st.color] = (colors[st.color] || 0) + n;
      if (parseInt(st.fontWeight, 10) >= 600 || st.fontWeight === 'bold') bold += n;
    });
    var best = null, max = 0;
    for (var c in colors) if (colors[c] > max) { max = colors[c]; best = c; }
    return { color: best, bold: total && bold / total > 0.6 };
  });
  var headings = Array.prototype.slice.call(document.querySelectorAll('.page-heading'));
  var headOrig = headings.map(function (h) { return { h2: h.querySelector('h2').textContent, a: h.querySelector('a').textContent }; });
  var imgs = Array.prototype.slice.call(document.querySelectorAll('#document img'));
  var imgAlt = imgs.map(function (i) { return i.getAttribute('alt'); });

  var btn = document.getElementById('lang-btn');
  var menu = document.getElementById('lang-menu');
  var flag = document.querySelector('#lang-flag use');
  var code = document.getElementById('lang-code');

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&lt;(\/?)i&gt;/g, '<$1i>'); }
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function put(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function clearSearch() {
    var input = document.getElementById('search');
    if (input && input.value) { input.value = ''; input.dispatchEvent(new Event('input')); }
    var st = document.getElementById('status'); if (st) st.textContent = '';
  }

  function docFor(lang, i) {
    var d = LANGS[lang].doc(), t = d && d[i];
    if (t == null && lang === 'ro' && window.DOCUMENT_EN) t = window.DOCUMENT_EN[i];   // fallback while a block is untranslated
    return t;
  }
  function apply(lang) {
    var L = LANGS[lang];
    if (lang !== 'el' && (!L || !L.doc() || L.doc().length !== paras.length)) lang = 'el';
    L = LANGS[lang];
    var tr = lang !== 'el';
    clearSearch();
    els.forEach(function (el) { var k = el.getAttribute('data-i18n'); el.innerHTML = tr ? L.ui[k] : greek[k]; });
    if (placeholderEl) placeholderEl.setAttribute('placeholder', tr ? L.ui.placeholder : greekPh);
    document.title = tr ? L.ui.title : greekTitle;
    if (descEl) descEl.setAttribute('content', tr ? L.ui.desc : greekDesc);
    paras.forEach(function (p, i) {
      var t = tr ? docFor(lang, i) : null;
      if (tr && t != null) {
        p.innerHTML = esc(t);
        p.style.color = look[i].color || ''; p.style.fontWeight = look[i].bold ? '700' : '';
      } else { p.innerHTML = orig[i]; p.style.color = ''; p.style.fontWeight = ''; }
    });
    headings.forEach(function (h, i) {
      h.querySelector('h2').textContent = tr ? headOrig[i].h2.replace('Σελίδα', L.page) : headOrig[i].h2;
      h.querySelector('a').textContent = tr ? L.orig : headOrig[i].a;
    });
    imgs.forEach(function (im, i) { im.setAttribute('alt', tr ? imgAlt[i].replace(/^.*σελίδα\s*/, L.img) : imgAlt[i]); });
    document.documentElement.lang = lang;
    window.__statusText = tr ? L.status : STATUS_EL;
    flag.setAttribute('href', '#flag-' + lang);
    code.textContent = lang.toUpperCase();
    Array.prototype.forEach.call(menu.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
  }
  function toggle(open) { menu.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }

  btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(menu.hidden); });
  menu.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-lang]'); if (!b) return;
    var l = b.getAttribute('data-lang'); put(l); apply(l); toggle(false); btn.focus();
  });
  document.addEventListener('click', function () { toggle(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { toggle(false); btn.focus(); } });

  var q = (location.search.match(/[?&]lang=(el|en|ro)/) || [])[1];
  var initial = q || get();
  if (q) put(q);
  window.__statusText = STATUS_EL;
  if (initial === 'en' || initial === 'ro') apply(initial);
})();
