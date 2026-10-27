"""
set_domain.py — Configura o domínio oficial de produção em todos os arquivos de SEO.

Uso:
    python scripts/set_domain.py https://www.novodominio.com.br

Arquivos atualizados:
- index.html (canonical, og:url, og:image, twitter:image, JSON-LD)
- robots.txt (Sitemap URL)
- sitemap.xml (<loc>, <image:loc>, <video:thumbnail_loc>, <video:content_loc>)
- llms.txt (links de páginas e seções)
- site.webmanifest (start_url se necessário)
- scripts/inject_jsonld.py (DOMAIN constant)
"""
import sys
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLACEHOLDER = "https://www.SEU-DOMINIO.com.br"

FILES = [
    ROOT / "index.html",
    ROOT / "robots.txt",
    ROOT / "sitemap.xml",
    ROOT / "llms.txt",
    ROOT / "scripts" / "inject_jsonld.py",
]

def main():
    if len(sys.argv) < 2:
        print("Erro: informe a URL do domínio oficial.")
        print("Exemplo: python scripts/set_domain.py https://www.drflaviosaraiva.com.br")
        sys.exit(1)

    domain = sys.argv[1].strip().rstrip("/")
    if not (domain.startswith("https://") or domain.startswith("http://")):
        domain = "https://" + domain

    print(f"Substituindo '{PLACEHOLDER}' por '{domain}'...")

    total_changes = 0
    for path in FILES:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        count = text.count(PLACEHOLDER)
        if count > 0:
            new_text = text.replace(PLACEHOLDER, domain)
            path.write_text(new_text, encoding="utf-8")
            print(f"  ✓ {path.name}: {count} ocorrências substituídas")
            total_changes += count
        else:
            print(f"  - {path.name}: nenhuma ocorrência encontrada")

    # Re-executar inject_jsonld.py para garantir integridade do JSON-LD
    inject_script = ROOT / "scripts" / "inject_jsonld.py"
    if inject_script.exists():
        print("\nRegenerando dados estruturados JSON-LD...")
        res = subprocess.run([sys.executable, str(inject_script)], capture_output=True, text=True)
        print(" ", res.stdout.strip() if res.stdout else res.stderr.strip())

    # Verificação final
    remaining = 0
    for path in FILES:
        if path.exists() and PLACEHOLDER in path.read_text(encoding="utf-8"):
            print(f"  ⚠️ Atenção: ainda restou placeholder em {path.name}")
            remaining += 1

    if remaining == 0:
        print(f"\n🎉 Sucesso! Domínio '{domain}' configurado em todo o projeto ({total_changes} substituições).")
    else:
        print(f"\n⚠️ Verificação incompleta: {remaining} arquivo(s) ainda contêm '{PLACEHOLDER}'.")

if __name__ == "__main__":
    main()

