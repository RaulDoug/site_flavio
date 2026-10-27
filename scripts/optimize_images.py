"""
optimize_images.py — Converte imagens do site para WebP (SEO / LCP / peso mobile).

Uso (na raiz do projeto):
    python scripts/optimize_images.py

- Lê os originais em assets/images/ (ou em assets/_originais/ se já foram movidos).
- Gera .webp ao lado dos originais, sem alterar o visual (mesma proporção).
- Preserva canal alfa (hero, render 3D e logo).
- Não apaga nem move nada: a movimentação dos originais é feita à parte.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "images"
ORIG = ROOT / "assets" / "_originais"


def find_source(name: str) -> Path:
    for base in (IMG, ORIG):
        p = base / name
        if p.exists():
            return p
    raise FileNotFoundError(name)


def save(src_name: str, out_name: str, width: int, quality: int, lossless_alpha=False):
    src = find_source(src_name)
    im = Image.open(src)
    has_alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
    im = im.convert("RGBA" if has_alpha else "RGB")
    if im.width > width:
        h = round(im.height * width / im.width)
        im = im.resize((width, h), Image.LANCZOS)
    out = IMG / out_name
    im.save(out, "WEBP", quality=quality, method=6, alpha_quality=90 if has_alpha else 100)
    print(f"{out_name:42s} {im.width}x{im.height}  {out.stat().st_size/1024:6.1f} KB  (origem {src.stat().st_size/1024:6.1f} KB)")


JOBS = [
    # (origem, destino, largura máx., qualidade)
    ("flavio-hero-cutout.png", "flavio-hero-cutout-600.webp", 600, 82),
    ("flavio-hero-cutout.png", "flavio-hero-cutout-1200.webp", 1200, 82),
    ("faceta-lente-3d.png", "faceta-lente-3d.webp", 1175, 82),
    ("flavio-retrato-pb.jpg", "flavio-retrato-pb.webp", 900, 78),
    ("logo-flavio-branca-crop.png", "logo-flavio-branca-crop.webp", 480, 90),
]
for n in range(1, 5):
    for lado in ("antes", "depois"):
        JOBS.append((f"caso-{n}-{lado}-sorriso.jpg", f"caso-{n}-{lado}-sorriso.webp", 960, 78))
        JOBS.append((f"caso-{n}-{lado}.jpg", f"caso-{n}-{lado}.webp", 900, 75))

if __name__ == "__main__":
    for job in JOBS:
        save(*job)

