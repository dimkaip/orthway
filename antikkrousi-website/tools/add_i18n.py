#!/usr/bin/env python3
"""Adds the EL/EN language switcher hooks to index.html (idempotent).
Run after tools/build_from_pdf.py, because that script regenerates index.html without them."""
import pathlib, sys
p = pathlib.Path(__file__).resolve().parent.parent / 'index.html'
s = p.read_text(encoding='utf-8')
if 'assets/lang.js' in s:
    sys.exit('already patched')

def rep(old, new):
    global s
    assert s.count(old) == 1, old
    s = s.replace(old, new)

def tag(open_tag, key):                      # add data-i18n to a unique opening tag
    rep(open_tag, open_tag[:-1] + f' data-i18n="{key}">')

rep('<link rel="stylesheet" href="assets/style.css"><script src="assets/reader.js" defer></script>',
    '<link rel="stylesheet" href="assets/style.css"><link rel="stylesheet" href="assets/lang.css">'
    '<script src="assets/reader.js" defer></script><script src="assets/en.js" defer></script><script src="assets/ro.js" defer></script><script src="assets/lang.js" defer></script>')
tag('<a class="skip" href="#document">', 'skip')
rep('<span>ΘΕΟΛΟΓΙΚΟ ΑΡΧΕΙΟ</span>', '<span data-i18n="brand">ΘΕΟΛΟΓΙΚΟ ΑΡΧΕΙΟ</span>')
rep('<a href="assets/original.pdf" target="_blank" rel="noopener">Πρωτότυπο PDF ↗</a></header>',
    '<a href="assets/original.pdf" target="_blank" rel="noopener" data-i18n="pdf">Πρωτότυπο PDF ↗</a>@@SWITCH@@</header>')
tag('<p class="eyebrow">', 'eyebrow')
tag('<h1>', 'h1')
tag('<p class="deck">', 'deck')
rep('<span>59 σελίδες</span>', '<span data-i18n="m1">59 σελίδες</span>')
rep('<span>Πολυτονικὴ γραφή</span>', '<span data-i18n="m2">Πολυτονικὴ γραφή</span>')
rep('<span>Κείμενο καὶ εἰκόνες</span>', '<span data-i18n="m3">Κείμενο καὶ εἰκόνες</span>')
tag('<a class="start" href="#document">', 'start')
tag('<summary>', 'nav')
rep('</details><p>Ἡ ἀρίθμηση', '</details><p data-i18n="note">Ἡ ἀρίθμηση')
tag('<label for="search">', 'searchLabel')
tag('<button id="print" type="button">', 'print')
rep('<footer><span>Τέλος', '<footer><span data-i18n="fEnd">Τέλος')
tag('<a href="assets/original.pdf" download>', 'fDl')
tag('<a href="#top">Ἐπιστροφὴ', 'fTop') if False else rep('<a href="#top">Ἐπιστροφὴ', '<a href="#top" data-i18n="fTop">Ἐπιστροφὴ')

switch = '''<div class="lang-switch"><svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><symbol id="flag-el" viewBox="0 0 27 18"><rect width="27" height="18" fill="#0D5EAF"/><g fill="#fff"><rect y="2" width="27" height="2"/><rect y="6" width="27" height="2"/><rect y="10" width="27" height="2"/><rect y="14" width="27" height="2"/></g><rect width="10" height="10" fill="#0D5EAF"/><path d="M4,0h2v10h-2z M0,4h10v2h-10z" fill="#fff"/></symbol><symbol id="flag-en" viewBox="0 0 60 40" preserveAspectRatio="none"><clipPath id="uk-c"><path d="M30,20h30v20zv20h-30zh-30v-20zv-20h30z"/></clipPath><rect width="60" height="40" fill="#012169"/><path d="M0,0L60,40M60,0L0,40" stroke="#fff" stroke-width="7"/><path d="M0,0L60,40M60,0L0,40" clip-path="url(#uk-c)" stroke="#C8102E" stroke-width="4"/><path d="M30,0v40M0,20h60" stroke="#fff" stroke-width="12"/><path d="M30,0v40M0,20h60" stroke="#C8102E" stroke-width="7"/></symbol></defs></svg><button type="button" class="lang-btn" id="lang-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="lang-menu" aria-label="Γλώσσα / Language"><svg class="flag" id="lang-flag" aria-hidden="true"><use href="#flag-el"/></svg><span id="lang-code">EL</span><svg class="chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M1.5,3.5 L5,7 L8.5,3.5"/></svg></button><ul class="lang-menu" id="lang-menu" role="listbox" aria-label="Γλώσσα / Language" hidden><li role="presentation"><button type="button" role="option" data-lang="el" aria-selected="true"><svg class="flag" aria-hidden="true"><use href="#flag-el"/></svg>Ελληνικά</button></li><li role="presentation"><button type="button" role="option" data-lang="en" aria-selected="false"><svg class="flag" aria-hidden="true"><use href="#flag-en"/></svg>English</button></li></ul></div>'''
rep('@@SWITCH@@', switch)
p.write_text(s, encoding='utf-8')
print('patched', p)
