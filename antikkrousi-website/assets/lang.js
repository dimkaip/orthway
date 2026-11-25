'use strict';
/* EL/EN language switch. Shares the "orthway-lang" key with the site's main index.html. */
(function () {
  var KEY = 'orthway-lang';
  var UI = {
    title: 'Refutation of Erroneous Positions',
    desc: 'Complete digital edition of the 59 pages of the original, with polytonic text, quotations and images.',
    skip: 'Skip to the text',
    brand: 'THEOLOGICAL ARCHIVE',
    pdf: 'Original PDF ↗',
    eyebrow: 'LETTER · THEOLOGICAL TEXT',
    h1: 'Refutation<br>of Erroneous Positions',
    deck: 'The full text in digital form.',
    m1: '59 pages', m2: 'Polytonic script', m3: 'Text and images',
    start: 'Start reading ↓',
    nav: 'Page navigation',
    note: 'Numbering follows the PDF. The script, emphases and quotations of the original are preserved.',
    searchLabel: 'Search the text',
    placeholder: 'Word or phrase…',
    print: 'Print',
    fEnd: 'End of the text · 59 pages',
    fDl: 'Download original PDF ↓',
    fTop: 'Back to top ↑'
  };
  var STATUS = { el: ['ἐπισημάνσεις', 'Κανένα ἀποτέλεσμα'], en: ['matches', 'No results'] };

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

  function apply(lang) {
    var en = lang === 'en' && window.DOCUMENT_EN && window.DOCUMENT_EN.length === paras.length;
    if (lang === 'en' && !en) lang = 'el';
    clearSearch();
    els.forEach(function (el) { var k = el.getAttribute('data-i18n'); el.innerHTML = en ? UI[k] : greek[k]; });
    if (placeholderEl) placeholderEl.setAttribute('placeholder', en ? UI.placeholder : greekPh);
    document.title = en ? UI.title : greekTitle;
    if (descEl) descEl.setAttribute('content', en ? UI.desc : greekDesc);
    paras.forEach(function (p, i) {
      if (en) {
        p.innerHTML = esc(window.DOCUMENT_EN[i]);
        p.style.color = look[i].color || ''; p.style.fontWeight = look[i].bold ? '700' : '';
      } else { p.innerHTML = orig[i]; p.style.color = ''; p.style.fontWeight = ''; }
    });
    headings.forEach(function (h, i) {
      h.querySelector('h2').textContent = en ? headOrig[i].h2.replace('Σελίδα', 'Page') : headOrig[i].h2;
      h.querySelector('a').textContent = en ? 'Original ↗' : headOrig[i].a;
    });
    imgs.forEach(function (im, i) { im.setAttribute('alt', en ? imgAlt[i].replace(/^.*σελίδα\s*/, 'Image of the original, page ') : imgAlt[i]); });
    document.documentElement.lang = lang;
    window.__statusText = STATUS[lang];
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

  var q = (location.search.match(/[?&]lang=(el|en)/) || [])[1];
  var initial = q || get();
  if (q) put(q);
  window.__statusText = STATUS.el;
  if (initial === 'en') apply('en');
})();
