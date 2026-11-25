'use strict';
/* EL/EN language switch. Shares the "orthway-lang" key with the site's other pages. */
(function () {
  var KEY = 'orthway-lang';
  var SEL = 'h1,h2,h3,p,li,td,th,figcaption';
  var UI = {
    home: '← Home',
    sizeLabel: 'Font size:'
  };
  var TITLE = { el: document.title, en: 'Introductory Memorandum — Holy Church of All Saints, Patras' };
  var descEl = document.querySelector('meta[name="description"]');
  var DESC = { el: descEl ? descEl.getAttribute('content') : '', en: 'Introductory text to the Canonical Memorandum of the drafting committee of Theologians, Jurists and Scholars.' };

  var els = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var greek = {};
  els.forEach(function (el) { greek[el.getAttribute('data-i18n')] = el.innerHTML; });
  var home = document.querySelector('.bar a[href^="../index.html"]');
  var aria = Array.prototype.slice.call(document.querySelectorAll('[data-aria-en]')).map(function (el) { return [el, el.getAttribute('aria-label')]; });

  var main = document.querySelector('main');
  var blocks = Array.prototype.slice.call(main.querySelectorAll(SEL)).filter(function (el) { return !el.querySelector(SEL); });
  var orig = blocks.map(function (el) { return el.innerHTML; });
  var EN = window.EIS_EN || {};

  var btn = document.getElementById('lang-btn'), menu = document.getElementById('lang-menu');
  var flag = document.querySelector('#lang-flag use'), code = document.getElementById('lang-code');
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function put(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function apply(lang) {
    var en = lang === 'en' && Object.keys(EN).length;
    if (lang === 'en' && !en) lang = 'el';
    els.forEach(function (el) { var k = el.getAttribute('data-i18n'); el.innerHTML = en ? UI[k] : greek[k]; });
    blocks.forEach(function (el, i) { el.innerHTML = (en && EN[i] !== undefined) ? EN[i] : orig[i]; });
    aria.forEach(function (p) { p[0].setAttribute('aria-label', en ? p[0].getAttribute('data-aria-en') : p[1]); });
    if (home) home.setAttribute('href', '../index.html' + (en ? '?lang=en' : ''));
    document.title = TITLE[lang];
    if (descEl) descEl.setAttribute('content', DESC[lang]);
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

  var q = (location.search.match(/[?&]lang=(el|en)/) || [])[1];
  var initial = q || get();
  if (q) put(q);
  window.__eisBlockCount = blocks.length;
  if (initial === 'en') apply('en');
})();
