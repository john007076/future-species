"""Extract each visible display independently from the approved photographic reference.
Run from any working directory with Python 3, Pillow and NumPy.
"""
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'references/final-reference.png'
# Coordinates are clockwise: top-left, top-right, bottom-right, bottom-left.
SCREENS = {
    'upper_left':   ([(363,193),(448,234),(411,348),(326,313)], (512,640)),
    'upper_center': ([(551,229),(815,228),(816,394),(550,394)], (1024,640)),
    'upper_right':  ([(951,243),(1077,199),(1104,337),(974,375)], (640,768)),
    'center_main':  ([(522,456),(894,456),(894,677),(522,677)], (1280,768)),
    'portrait_left': ([(368,452),(465,462),(465,709),(367,709)], (384,1024)),
    'left_01':     ([(240,454),(291,467),(289,532),(240,523)], (384,512)),
    'left_02':     ([(247,596),(311,602),(311,691),(247,687)], (384,512)),
    'left_03':     ([(255,761),(335,761),(335,871),(255,882)], (384,512)),
    'right_01':    ([(1022,547),(1094,538),(1094,611),(1022,619)], (512,512)),
    'right_02':    ([(1023,661),(1117,657),(1117,753),(1023,752)], (512,512)),
    'right_03':    ([(1024,809),(1116,813),(1117,923),(1024,910)], (384,512)),
    # shortcut: only the unoccluded right section is available; replace with live content later.
    'desk':        ([(856,732),(876,732),(876,761),(856,761)], (256,256)),
}


def perspective_coefficients(quad, size):
    """Map output pixels back into the photographed quadrilateral."""
    w, h = size
    corners = [(0,0),(w-1,0),(w-1,h-1),(0,h-1)]
    rows, values = [], []
    for (x,y),(u,v) in zip(corners, quad):
        rows += [[x,y,1,0,0,0,-u*x,-u*y], [0,0,0,x,y,1,-v*x,-v*y]]
        values += [u,v]
    coefficients = np.linalg.solve(np.asarray(rows, dtype=float), np.asarray(values, dtype=float))
    for (x,y),(u,v) in zip(corners,quad):
        a,b,c,d,e,f,g,hc = coefficients
        denominator = g*x + hc*y + 1
        assert np.allclose([(a*x+b*y+c)/denominator,(d*x+e*y+f)/denominator],[u,v],atol=1e-6)
    return tuple(coefficients)


def main():
    source = Image.open(SOURCE).convert('RGB')
    assert source.size == (1374,1145), 'Reference dimensions changed; inspect and recalibrate quads.'
    assert len(SCREENS) == 12
    out_dir = ROOT / 'public/textures'
    out_dir.mkdir(parents=True, exist_ok=True)
    contact = Image.new('RGB', (1120,1050), '#d6d7d2')
    draw = ImageDraw.Draw(contact)
    metadata = {
        'source': 'references/final-reference.png',
        'source_dimensions': list(source.size),
        'source_sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        'corner_order': ['top_left','top_right','bottom_right','bottom_left'],
        'method': 'Inverse planar homography; bicubic sampling; no denoising, sharpening or invented screen text.',
        'notes': [
            'Crops contain source photographic grain, reflections and unreadable generated text.',
            'Each source crop is only tens to hundreds of pixels wide. Larger output dimensions do not add detail.',
            'The desk display is partly occluded. Its output uses only the visible right section stretched to a square; this is an explicit placeholder, not a complete recovery.',
            'Aspect ratios behind foreshortening are estimates, because only a single view is available.'
        ],
        'screens': []
    }
    for i,(name,(quad,size)) in enumerate(SCREENS.items()):
        assert all(0 <= x < source.width and 0 <= y < source.height for x,y in quad)
        image = source.transform(size,Image.Transform.PERSPECTIVE,perspective_coefficients(quad,size),Image.Resampling.BICUBIC)
        image.save(out_dir / f'{name}.png',optimize=True)
        metadata['screens'].append({'id':'screen.'+name.replace('left_0','left.0').replace('right_0','right.0'), 'file':f'textures/{name}.png','source_quad':quad,'output_dimensions':list(size),'partial_source':name=='desk'})
        thumbnail = image.copy()
        thumbnail.thumbnail((252,292), Image.Resampling.LANCZOS)
        x=(i%4)*280+(280-thumbnail.width)//2
        y=(i//4)*350+32+(302-thumbnail.height)//2
        contact.paste(thumbnail,(x,y))
        draw.text(((i%4)*280+14,(i//4)*350+10),name,fill='#273947')
        draw.text(((i%4)*280+14,(i//4)*350+331),f'{size[0]} x {size[1]}',fill='#40505c')
    (ROOT/'references/screens.json').write_text(json.dumps(metadata,indent=2)+'\n')
    (ROOT/'validation').mkdir(exist_ok=True)
    contact.save(ROOT/'validation/texture-contact-sheet.jpg',quality=94)
    print(f'Extracted and verified {len(SCREENS)} independent screen textures.')

if __name__ == '__main__':
    main()
