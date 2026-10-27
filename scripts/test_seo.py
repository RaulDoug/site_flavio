import xml.etree.ElementTree as ET
import urllib.robotparser as urobot
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

root = Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text(encoding='utf-8')

print("=== 1. CHECAGEM DE ASSETS NO INDEX.HTML ===")
srcs = re.findall(r'(?:src|href|poster)=["\']([^"\']+)["\']', html)
missing = []
for s in srcs:
    if s.startswith(('http://', 'https://', '#', 'tel:', 'mailto:', 'data:')):
        continue
    clean_s = s.split('?')[0].split('#')[0]
    local_path = root / clean_s
    if not local_path.exists():
        missing.append(s)

if missing:
    print("❌ Arquivos não encontrados no HTML:", missing)
    exit(1)
else:
    print(f"✓ Todos os {len(srcs)} links e assets locais existem em disco!")

print("\n=== 2. VALIDAÇÃO DE SITEMAP.XML ===")
tree = ET.parse(str(root / 'sitemap.xml'))
print("✓ sitemap.xml é um XML válido e bem-formado!")

print("\n=== 3. VALIDAÇÃO DE ROBOTS.TXT ===")
rp = urobot.RobotFileParser()
rp.parse((root / 'robots.txt').read_text(encoding='utf-8').splitlines())
assert rp.can_fetch('*', 'https://www.SEU-DOMINIO.com.br/'), 'Home deveria ser acessível'
assert rp.can_fetch('*', 'https://www.SEU-DOMINIO.com.br/assets/images/flavio-hero-cutout-1200.webp'), 'Imagens deveriam ser acessíveis'
assert not rp.can_fetch('*', 'https://www.SEU-DOMINIO.com.br/docs/'), 'docs/ deveria ser bloqueado'
assert not rp.can_fetch('*', 'https://www.SEU-DOMINIO.com.br/assets/_originais/'), 'assets/_originais/ deveria ser bloqueado'
print("✓ robots.txt regras de rastreio validadas com sucesso!")

print("\n=== 4. VALIDAÇÃO DE JSON-LD EM INDEX.HTML ===")
m = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
assert m, 'Bloco JSON-LD não encontrado!'
data = json.loads(m.group(1))
assert '@graph' in data, '@graph ausente no JSON-LD'
print(f"✓ JSON-LD válido com {len(data['@graph'])} entidades no @graph!")
for entity in data['@graph']:
    print(f"  - {entity.get('@type')}: {entity.get('name', entity.get('@id'))}")

print("\n=== 5. VALIDAÇÃO DE TAGS E IMAGENS ===")
# Verificar se alguma imagem ficou sem alt ou width/height (exceto vetores/decorativas)
imgs = re.findall(r'<img[^>]+>', html)
for img in imgs:
    assert 'alt=' in img, f"Imagem sem alt: {img}"
print(f"✓ Todas as {len(imgs)} tags <img> possuem atributo alt!")

print("\nTODOS OS TESTES DE VALIDAÇÃO PASSARAM COM SUCESSO!")
