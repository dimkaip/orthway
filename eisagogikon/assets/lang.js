'use strict';
/* EL/EN language switch. Shares the "orthway-lang" key with the site's other pages. */
(function () {
  var KEY = 'orthway-lang';
  var SEL = 'h1,h2,h3,p,li,td,th,figcaption';
  var L = {
    en: { ui: { home: '← Home', sizeLabel: 'Font size:' }, title: 'Introductory Memorandum — Holy Church of All Saints, Patras',
          desc: 'Introductory text to the Canonical Memorandum of the drafting committee of Theologians, Jurists and Scholars.', data: function () { return window.EIS_EN; } },
    ro: { ui: { home: '← Acasă', sizeLabel: 'Mărimea literelor:' }, title: 'Memoriu introductiv — Sfânta Biserică a Tuturor Sfinților din Patras',
          desc: 'Text introductiv la Memoriul canonic al comisiei de redactare formate din teologi, juriști și oameni de știință.', data: function () { return window.EIS_RO; } }
  };
  var TITLE = { el: document.title };
  var descEl = document.querySelector('meta[name="description"]');
  var DESC = { el: descEl ? descEl.getAttribute('content') : '' };

  var els = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var greek = {};
  els.forEach(function (el) { greek[el.getAttribute('data-i18n')] = el.innerHTML; });
  var home = document.querySelector('.bar a[href^="../index.html"]');
  var aria = Array.prototype.slice.call(document.querySelectorAll('[data-aria-en]')).map(function (el) { return [el, el.getAttribute('aria-label')]; });

  var main = document.querySelector('main');
  var blocks = Array.prototype.slice.call(main.querySelectorAll(SEL)).filter(function (el) { return !el.querySelector(SEL); });
  var orig = blocks.map(function (el) { return el.innerHTML; });

  var btn = document.getElementById('lang-btn'), menu = document.getElementById('lang-menu');
  var flag = document.querySelector('#lang-flag use'), code = document.getElementById('lang-code');
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function put(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function textFor(lang, i) {
    var d = L[lang].data() || {}, t = d[i];
    if (t === undefined && lang === 'ro') t = (window.EIS_EN || {})[i];   // fallback while a block is untranslated
    return t;
  }
  function apply(lang) {
    if (lang !== 'el' && !(L[lang] && L[lang].data() && Object.keys(L[lang].data()).length)) lang = 'el';
    var tr = lang !== 'el';
    els.forEach(function (el) { var k = el.getAttribute('data-i18n'); el.innerHTML = tr ? L[lang].ui[k] : greek[k]; });
    blocks.forEach(function (el, i) { var t = tr ? textFor(lang, i) : undefined; el.innerHTML = (t !== undefined) ? t : orig[i]; });
    aria.forEach(function (p) { p[0].setAttribute('aria-label', tr ? p[0].getAttribute('data-aria-' + lang) || p[0].getAttribute('data-aria-en') : p[1]); });
    if (home) home.setAttribute('href', '../index.html' + (tr ? '?lang=' + lang : ''));
    document.title = tr ? L[lang].title : TITLE.el;
    if (descEl) descEl.setAttribute('content', tr ? L[lang].desc : DESC.el);
    document.documentElement.lang = lang;
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
  window.__eisBlockCount = blocks.length;
  if (initial === 'en' || initial === 'ro') apply(initial);
})();
