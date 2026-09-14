"""Generate the Avyro Protocol Open Graph card (1200x630).

Usage:  python scripts/make_og.py    (requires Pillow)
Output: public/assets/og-image.jpg, referenced by src/lib/site.ts
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/assets/og-image.jpg"
MARK = ROOT / "public/assets/avyro-mark-white.png"

font_candidates = [
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"),
]
regular_candidates = [
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"),
]
bold_path = next((p for p in font_candidates if p.exists()), None)
regular_path = next((p for p in regular_candidates if p.exists()), bold_path)

card = Image.new("RGB", (W, H), "#050505")
mark = Image.open(MARK).convert("RGBA").resize((260, 260), Image.Resampling.LANCZOS)
card.paste(mark, (90, 185), mark)

d = ImageDraw.Draw(card)
word = ImageFont.truetype(str(bold_path), 78) if bold_path else ImageFont.load_default()
sub = ImageFont.truetype(str(regular_path), 30) if regular_path else ImageFont.load_default()
d.text((400, 210), "Avyro Protocol", font=word, fill="#ffffff")
d.text((405, 320), "Private payments. Non-custodial.", font=sub, fill="#c8c8c8")
d.text((405, 370), "2-of-3 threshold custody on Robinhood Chain.", font=sub, fill="#8f8f8f")

card.save(OUT, "JPEG", quality=94, optimize=True, progressive=True)
print("wrote", OUT, card.size)
