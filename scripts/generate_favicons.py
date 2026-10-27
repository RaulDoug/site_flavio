"""
generate_favicons.py — Processa assets/images/logo_flavio_miniatura.jpg e gera
o pacote completo de favicons e ícones para Google Search, navegadores e mobile.

Gera:
- favicon.ico (na raiz do site, com camadas 16x16, 32x32 e 48x48)
- assets/images/favicon-48.png (48x48 - Google Search SERP Favicon)
- assets/images/favicon-96.png (96x96 - Telas retina desktop)
- assets/images/favicon-192.png (192x192 - Google Discover / Android PWA)
- assets/images/favicon-512.png (512x512 - Alta resolução PWA Splash)
- assets/images/apple-touch-icon.png (180x180 - iOS Home Screen)
- assets/images/logo-flavio-simbolo-transparente.png (512x512 - Canal alfa 100% transparente)
"""
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "assets" / "images"
SRC_JPG = IMG_DIR / "logo_flavio_miniatura.jpg"

def main():
    if not SRC_JPG.exists():
        raise FileNotFoundError(f"Arquivo de origem não encontrado: {SRC_JPG}")

    print(f"Lendo {SRC_JPG.name}...")
    im = Image.open(SRC_JPG).convert("RGB")
    arr = np.array(im, dtype=np.float32)

    # 1. Extração do símbolo com antialiasing cirúrgico (remoção da malha xadrez)
    gray = arr.mean(axis=2)
    alpha = np.clip((gray - 90) / (205 - 90), 0, 1) * 255
    alpha = alpha.astype(np.uint8)

    white_rgb = np.ones_like(arr, dtype=np.uint8) * 255
    rgba = np.dstack([white_rgb, alpha])
    sym_clean = Image.fromarray(rgba, mode="RGBA")

    # Bounding box do traço
    bbox = sym_clean.split()[-1].getbbox()
    sym_cropped = sym_clean.crop(bbox)
    print(f"Traço branco puro extraído com sucesso! Dimensões do recorte: {sym_cropped.size}")

    # Salvar versão 512 com fundo 100% transparente
    canvas_trans = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    tw_trans = int(512 * 0.72)
    th_trans = int(tw_trans * (sym_cropped.height / sym_cropped.width))
    sym_resized_trans = sym_cropped.resize((tw_trans, th_trans), Image.LANCZOS)
    canvas_trans.paste(sym_resized_trans, ((512 - tw_trans) // 2, (512 - th_trans) // 2), sym_resized_trans)
    trans_path = IMG_DIR / "logo-flavio-simbolo-transparente.png"
    canvas_trans.save(trans_path, "PNG", optimize=True)
    print(f"  ✓ {trans_path.name} gerado")

    # 2. Criação da base master de alta definição (512x512) com o Azul Marinho da marca (#0C1133)
    master_size = 512
    bg_color = (12, 17, 51, 255) # #0C1133
    master = Image.new("RGBA", (master_size, master_size), bg_color)

    # Enquadramento harmônico do monograma (64% da área para respiro equilibrado)
    tw = int(master_size * 0.64)
    th = int(tw * (sym_cropped.height / sym_cropped.width))
    if th > int(master_size * 0.64):
        th = int(master_size * 0.64)
        tw = int(th * (sym_cropped.width / sym_cropped.height))

    sym_resized = sym_cropped.resize((tw, th), Image.LANCZOS)
    x_pos = (master_size - tw) // 2
    y_pos = (master_size - th) // 2
    master.paste(sym_resized, (x_pos, y_pos), sym_resized)

    # Cantos arredondados suaves (squircle 22% de raio)
    mask = Image.new("L", (master_size, master_size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, master_size, master_size], radius=int(master_size * 0.22), fill=255)
    master.putalpha(mask)

    # 3. Geração dos arquivos nos tamanhos padrão
    sizes_to_generate = [
        (IMG_DIR / "favicon-512.png", 512),
        (IMG_DIR / "favicon-192.png", 192),
        (IMG_DIR / "apple-touch-icon.png", 180),
        (IMG_DIR / "favicon-96.png", 96),
        (IMG_DIR / "favicon-48.png", 48),
    ]

    for path, sz in sizes_to_generate:
        resized = master.resize((sz, sz), Image.LANCZOS)
        resized.save(path, "PNG", optimize=True)
        print(f"  ✓ {path.name} ({sz}x{sz}) gerado — {path.stat().st_size/1024:.1f} KB")

    # 4. Geração do favicon.ico na raiz do projeto (multi-tamanhos: 16x16, 32x32, 48x48)
    ico_path = ROOT / "favicon.ico"
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    master.save(ico_path, format="ICO", sizes=ico_sizes)
    print(f"  ✓ {ico_path.name} gerado na raiz com tamanhos [16, 32, 48] — {ico_path.stat().st_size/1024:.1f} KB")

    print("\n🎉 Todos os ícones e favicons oficiais foram gerados com sucesso!")

if __name__ == "__main__":
    main()
