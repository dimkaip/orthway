from pathlib import Path
import fitz,html,json,re,collections
root=Path(__file__).resolve().parents[1]; doc=fitz.open(root/'assets/original.pdf'); esc=html.escape
fonts={}; rules=[]
for page in doc:
 for f in page.get_fonts(full=True):
  xref,ext,typ,base=f[:4]; name=base.split('+')[-1]
  if name in fonts: continue
  try:
   _,ext,_,data=doc.extract_font(xref)
   if not data: continue
   key='pdf'+str(len(fonts)); fn=f'{key}.{ext}';(root/'assets/fonts'/fn).write_bytes(data);fonts[name]=key
   rules.append(f'@font-face{{font-family:{key};src:url("fonts/{fn}");font-display:swap}}')
  except Exception: pass
sections=[]; count=0; chars=0
for n,page in enumerate(doc,1):
 content=[]
 links=page.get_links()
 underlines=[]
 for drawing in page.get_drawings():
  for item in drawing['items']:
   if item[0]=='l' and abs(item[1].y-item[2].y)<.3:
    underlines.append((min(item[1].x,item[2].x),max(item[1].x,item[2].x),item[1].y))
 for b in sorted(page.get_text('dict')['blocks'],key=lambda b:(round(b['bbox'][1],1),b['bbox'][0])):
  if b['type']==1:
   count+=1; fn=f'page-{n:02d}-{count}.{b["ext"]}';(root/'assets/images'/fn).write_bytes(b['image'])
   content.append(f'<figure><img src="assets/images/{fn}" width="{b["width"]}" height="{b["height"]}" loading="lazy" alt="Εἰκόνα τοῦ πρωτοτύπου, σελίδα {n}" /></figure>');continue
  if b['bbox'][1]<60 or b['bbox'][1]>779:continue
  if not ''.join(s['text'] for l in b['lines'] for s in l['spans']).strip():continue
  parts=[]; sizes=[]
  for li,l in enumerate(b['lines']):
   spans=l['spans']; text=''.join(s['text'] for s in spans); last=li<len(b['lines'])-1
   for si,s in enumerate(spans):
    t=s['text'];chars+=len(t);size=s['size'];sizes.append(size);font=s['font']; style=[]
    if font in fonts:style.append('font-family:'+fonts[font])
    if 'Bold' in font:style.append('font-weight:700')
    if 'Itali' in font:style.append('font-style:italic')
    if s['color']:style.append('color:#%06x'%s['color'])
    style.append(f'font-size:{max(.72,min(1.6,size/16)):.3f}em')
    if s['flags']&1:style.append('vertical-align:super')
    rect=fitz.Rect(s['bbox'])
    if any(abs(y-(s['origin'][1]+2))<3 and min(x1,rect.x1)-max(x0,rect.x0)>.7*rect.width for x0,x1,y in underlines):style.append('text-decoration:underline')
    if si==len(spans)-1 and last and t.rstrip().endswith('-'):t=t.rstrip()[:-1]+'\u00ad'
    markup='<span style="'+';'.join(style)+'">'+esc(t)+'</span>'
    for link in links:
     if rect.intersects(link['from']) and (rect & link['from']).get_area()>.4*rect.get_area():
      target=link.get('uri','')
      if link.get('kind')==fitz.LINK_GOTO:target='#page-'+str(link['page']+1)
      if target.startswith(('https://','http://','mailto:','#page-')):markup='<a href="'+esc(target,quote=True)+'">'+markup+'</a>';break
    parts.append(markup)
   if last and not text.rstrip().endswith('-'):parts.append(' ')
  centered=abs((b['bbox'][0]+b['bbox'][2])/2-300)<32 and b['bbox'][2]-b['bbox'][0]<420
  cls=' class="centered"' if centered else ''
  content.append('<p'+cls+'>'+''.join(parts)+'</p>')
 sections.append(f'<section class="document-page" id="page-{n}" aria-labelledby="heading-{n}"><header class="page-heading"><h2 id="heading-{n}">Σελίδα {n:02d}</h2><a href="assets/original.pdf#page={n}" target="_blank" rel="noopener">Πρωτότυπο ↗</a></header>'+''.join(content)+'</section>')
nav=''.join(f'<a href="#page-{n}" aria-label="Σελίδα {n}">{n:02d}</a>' for n in range(1,60))
(root/'index.html').write_text('''<!doctype html>
<html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Πλήρης ψηφιακή έκδοση των 59 σελίδων του πρωτοτύπου, με πολυτονικό κείμενο, παραθέματα και εικόνες."><title>Ἀντίκκρουση ἐσφαλμένων θέσεων</title><link rel="stylesheet" href="assets/style.css"><script src="assets/reader.js" defer></script></head>
<body><a class="skip" href="#document">Μετάβαση στὸ κείμενο</a><header class="masthead"><a class="brand" href="#top">✝ <span>ΘΕΟΛΟΓΙΚΟ ΑΡΧΕΙΟ</span></a><a href="assets/original.pdf" target="_blank" rel="noopener">Πρωτότυπο PDF ↗</a></header>
<main id="top"><section class="intro"><p class="eyebrow">ΕΠΙΣΤΟΛΗ · ΘΕΟΛΟΓΙΚΟ ΚΕΙΜΕΝΟ</p><h1>Ἀντίκκρουση<br>ἐσφαλμένων θέσεων</h1><p class="deck">Τὸ πλήρες κείμενο σὲ ψηφιακὴ μορφή.</p><div class="intro-meta"><span>59 σελίδες</span><span>Πολυτονικὴ γραφή</span><span>Κείμενο καὶ εἰκόνες</span></div><a class="start" href="#document">Ἀρχὴ ἀναγνώσεως ↓</a></section>
<div class="reading-layout"><aside class="sidebar"><details open><summary>Πλοήγηση σελίδων</summary><nav aria-label="Σελίδες πρωτοτύπου">'''+nav+'''</nav></details><p>Ἡ ἀρίθμηση ἀκολουθεῖ τὸ PDF. Διατηροῦνται ἡ γραφή, οἱ ἐμφάσεις καὶ τὰ παραθέματα τοῦ πρωτοτύπου.</p><label for="search">Ἀναζήτηση στὸ κείμενο</label><input id="search" type="search" placeholder="Λέξη ἢ φράση…"><div class="search-actions"><button id="previous" type="button" aria-label="Προηγούμενο αποτέλεσμα">↑</button><button id="next" type="button" aria-label="Επόμενο αποτέλεσμα">↓</button><output id="status" aria-live="polite"></output></div><div class="settings"><button id="smaller" type="button" aria-label="Μικρότερα γράμματα">Α−</button><button id="larger" type="button" aria-label="Μεγαλύτερα γράμματα">Α+</button><button id="print" type="button">Ἐκτύπωση</button></div></aside><article id="document" class="document" aria-label="Πλήρες κείμενο">'''+''.join(sections)+'''</article></div></main><footer><span>Τέλος τοῦ κειμένου · 59 σελίδες</span><a href="assets/original.pdf" download>Λήψη πρωτοτύπου PDF ↓</a><a href="#top">Ἐπιστροφὴ στὴν ἀρχή ↑</a></footer></body></html>''')
(root/'assets/font-faces.css').write_text('\n'.join(rules))
print(json.dumps({'pages':len(sections),'images':count,'fonts':len(fonts),'characters':chars}))
