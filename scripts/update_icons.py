import re
from pathlib import Path

p = Path("index.html")
html = p.read_text(encoding="utf-8").replace("\r\n", "\n")

new_icons = """  <!-- Ícones Oficiais, Favicon e Miniatura para Pesquisa Google -->
  <link rel="icon" type="image/x-icon" href="favicon.ico" />
  <link rel="icon" type="image/png" sizes="48x48" href="assets/images/favicon-48.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="assets/images/favicon-96.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="assets/images/favicon-192.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="assets/images/apple-touch-icon.png" />
  <link rel="manifest" href="site.webmanifest" />"""

# Localizar bloco de ícones antes do comentário da Fonte Onest
pattern = r"<!--\s*Ícones e manifesto\s*-->.*?<link rel=\"manifest\" href=\"site\.webmanifest\" />"
m = re.search(pattern, html, flags=re.DOTALL)
if not m:
    # Tenta padrão mais flexível
    pattern = r"<link rel=\"icon\"[^\n]+\n(?:  <link[^\n]+\n){2,4}"
    m = re.search(pattern, html)

assert m, "Bloco de ícones não localizado!"
print("Substituindo:", m.group(0))

new_html = html[:m.start()] + new_icons + html[m.end():]
p.write_text(new_html.replace("\n", "\r\n"), encoding="utf-8")
print("index.html atualizado com sucesso!")

