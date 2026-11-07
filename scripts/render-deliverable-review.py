"""Render real PDF/Office exports for human inspection; never generate sample content."""
import json
import sys
from pathlib import Path
import pymupdf as fitz

root = Path(sys.argv[1]).resolve()
allowed = Path(__file__).resolve().parents[1] / '.local' / 'artifact-evals'
if not root.is_relative_to(allowed):
    raise SystemExit('Review must stay inside artifact-evals')
run = json.loads((root / 'run.json').read_text(encoding='utf-8'))
review = root / 'host-review'
review.mkdir(exist_ok=True)
pdfs = sorted(review.glob('*.pdf')) + [root / f['filename'] for f in run['files'] if f['filename'].endswith('.pdf')]
result = []
for pdf in pdfs:
    with fitz.open(pdf) as document:
        pages = []
        for index, page in enumerate(document):
            name = f'{pdf.stem}-page-{index+1}.png'
            page.get_pixmap(dpi=110, alpha=False).save(review / name)
            words = page.get_text('words')
            outside = [w[4] for w in words if w[0] < -1 or w[1] < -1 or w[2] > page.rect.width+1 or w[3] > page.rect.height+1]
            outside_drawings = [list(d['rect']) for d in page.get_drawings() if d['rect'].x0 < -2 or d['rect'].y0 < -2 or d['rect'].x1 > page.rect.width+2 or d['rect'].y1 > page.rect.height+2]
            pages.append({'page': index+1, 'image': name, 'text': page.get_text(), 'wordsOutsidePage': outside, 'drawingsOutsidePage': outside_drawings})
        result.append({'filename': pdf.name, 'pageCount': len(document), 'pages': pages})
(review / 'render-observations.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps([{'file': p['filename'], 'pages': p['pageCount'], 'outsideText': sum(len(x['wordsOutsidePage']) for x in p['pages']), 'outsideDrawings':sum(len(x['drawingsOutsidePage']) for x in p['pages'])} for p in result]))
