"""
inject_jsonld.py — Gera os dados estruturados Schema.org (@graph) e injeta em index.html.

Entidades criadas:
1. Dentist / LocalBusiness (NAP, geo, maps, sameAs, areaServed, CRO)
2. Person (Dr. Flávio Saraiva, CRO-MG 75116, Una)
3. WebSite
4. FAQPage (12 perguntas e respostas)
5. VideoObject x 3 (Ana Luiza, Diego, Fael com transcript e duração ISO 8601)
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML_PATH = ROOT / "index.html"

DOMAIN = "https://www.SEU-DOMINIO.com.br"

faq_data = [
    (
        "O procedimento de facetas em resina composta dói ou desgasta o dente?",
        "Não. A técnica do Dr. Flávio é estritamente aditiva e conservadora: a resina é aplicada e esculpida diretamente sobre o esmalte íntegro, sem desgastes invasivos na estrutura saudável do dente. O procedimento é confortável, seguro e realizado sob anestesia delicada quando necessário."
    ),
    (
        "Qual a diferença entre facetas em resina composta e lentes de porcelana?",
        "As facetas em resina composta são esculpidas artesanalmente pelo Dr. Flávio diretamente no consultório, geralmente em poucas sessões e sem a necessidade de desgastes irreversíveis no dente natural. Além disso, possuem manutenção simples e custos mais acessíveis, entregando altíssimo padrão de brilho e translucidez através das resinas ópticas modernas."
    ),
    (
        "O resultado das facetas em resina fica com aspecto natural?",
        "Sim! O Dr. Flávio possui certificação especializada em resinas compostas e trabalha com técnica de estratificação em múltiplas camadas. Isso reproduz com precisão a translucidez da borda incisal, os halos ópticos e a textura de um dente jovem natural, evitando totalmente a aparência artificial ou opaca de 'chiclete'."
    ),
    (
        "Já fiz facetas com outro profissional e não gostei. É possível refazer?",
        "Com certeza. Muitos pacientes chegam ao consultório insatisfeitos com facetas antigas que perderam o brilho, mancharam ou ficaram desproporcionais ao rosto. Realizamos a remoção criteriosa do material antigo preservando a estrutura dental e confeccionamos novas lentes com design harmônico e natural."
    ),
    (
        "Quanto tempo leva para fazer as facetas e qual é a durabilidade?",
        "Após a consulta de avaliação e planejamento (e clareamento prévio, quando indicado), a escultura das facetas costuma ser finalizada em 1 a 3 sessões clínicas com resultado imediato. Com boa higiene bucal e visitas periódicas para manutenção do polimento espelhado, as facetas mantêm beleza e funcionalidade por muitos anos."
    ),
    (
        "Onde fica localizado o consultório e em quais cidades há atendimento?",
        "O consultório principal está localizado no coração de Bom Despacho - MG, na Avenida Vigário Nicolau, 223 - Centro (CEP 35630-072), em espaço moderno, climatizado e de fácil acesso. O Dr. Flávio também realiza atendimentos em Nova Serrana - MG."
    ),
    (
        "Quanto custa fazer facetas em resina?",
        "O valor varia conforme o número de dentes, a complexidade do caso e a necessidade de etapas como clareamento prévio ou gengivoplastia. Por isso o orçamento é definido após a avaliação, com planejamento individual. Chame o Dr. Flávio pelo WhatsApp para agendar."
    ),
    (
        "Preciso clarear os dentes antes das facetas?",
        "Quando o objetivo é um tom mais claro, o clareamento prévio é indicado para definir a cor-base antes da escultura da resina. A necessidade é definida na avaliação."
    ),
    (
        "Facetas em resina fecham espaços entre os dentes (diastemas)?",
        "Sim. O fechamento de diastemas é uma das indicações das facetas e lentes em resina: a anatomia dos dentes vizinhos é esculpida para harmonizar o sorriso. A viabilidade é confirmada na avaliação."
    ),
    (
        "Facetas em resina servem para dentes manchados, curtos ou desgastados?",
        "Podem corrigir cor, formato e bordas desgastadas, reconstruindo a anatomia com resina. Manchas profundas e dentes curtos são avaliados caso a caso, às vezes com clareamento ou gengivoplastia."
    ),
    (
        "O que é lente de contato dental e como se compara à faceta em resina?",
        "\"Lente de contato dental\" é como muitos pacientes chamam as facetas ultrafinas. No consultório, o Dr. Flávio trabalha com lentes e facetas em resina composta, esculpidas diretamente no dente, em técnica aditiva e conservadora."
    ),
    (
        "Como cuidar das facetas em resina? Elas mancham?",
        "Com boa higiene e manutenção periódica do polimento, as facetas mantêm o brilho. Café, vinho, tabaco e hábitos como roer unhas podem comprometer cor e superfície, por isso o acompanhamento é recomendado."
    )
]

videos_data = [
    {
        "name": "Depoimento de Ana Luiza — facetas em resina sem dor",
        "description": "A paciente Ana Luiza relata sua transformação do sorriso com facetas em resina composta no consultório do Dr. Flávio Saraiva em Bom Despacho - MG: resultado natural e sem dor.",
        "thumbnailUrl": f"{DOMAIN}/assets/images/poster-ana-luiza.webp",
        "contentUrl": f"{DOMAIN}/assets/videos/video-ana-luiza-web.mp4",
        "uploadDate": "2026-10-26T12:00:00-03:00",
        "duration": "PT38S",
        "transcript": "Ficou do jeito que eu imaginava! Dr. Flávio finalizando o sorriso... Atingiu suas expectativas? 'Nossa, gostei demais, até mudou meu olhar, meu rosto!' Esperava que ficasse assim? 'Esperava já, presente de aniversário!' Com certeza. Não senti dor nenhuma, foi super tranquilo, maravilhoso! Agora acabou a vergonha de sorrir nas fotos, ficou do jeito que eu imaginava!"
    },
    {
        "name": "Depoimento de Diego — troca de facetas antigas",
        "description": "O paciente Diego compartilha a experiência de refazer facetas realizadas anteriormente com outro profissional e a segurança transmitida pelo Dr. Flávio Saraiva em Bom Despacho - MG.",
        "thumbnailUrl": f"{DOMAIN}/assets/images/poster-diego.webp",
        "contentUrl": f"{DOMAIN}/assets/videos/video-diego-web.mp4",
        "uploadDate": "2026-10-26T12:00:00-03:00",
        "duration": "PT49S",
        "transcript": "Quem me acompanha sabe que sempre direciono o tratamento de forma conservadora e responsável. O Diego chegou com um resultado anterior insatisfatório: 'Tive uma experiência não muito agradável com outro profissional antes e fiquei inseguro em fazer novas facetas. Mas cheguei aqui com o Dr. Flávio, ele me passou total segurança, fiz e estou muito satisfeito. Ficou melhor do que eu esperava!'"
    },
    {
        "name": "Depoimento de Fael (@faelzueira) — lentes em resina em 3 etapas sem desgaste",
        "description": "Fael (@faelzueira) compartilha sua jornada de transformação em 3 etapas com o Dr. Flávio Saraiva em Bom Despacho: gengivoplastia e lentes em resina superiores e inferiores sem desgaste.",
        "thumbnailUrl": f"{DOMAIN}/assets/images/poster-fael.webp",
        "contentUrl": f"{DOMAIN}/assets/videos/video-fael-web.mp4",
        "uploadDate": "2026-10-26T12:00:00-03:00",
        "duration": "PT2M32S",
        "transcript": "Quero compartilhar um sonho que realizei. Sempre quis colocar lentes nos dentes, mas achava que não teria condição. Até que conheci o trabalho do Dr. Flávio Saraiva em Bom Despacho. Dividimos em 3 etapas: gengivoplastia, lentes superiores e lentes inferiores. Não tem aquele desgaste agressivo no dente que falam na internet; com resina é super tranquilo e o Dr. Flávio tem um atendimento nota mil!"
    }
]

schema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": ["Dentist", "LocalBusiness"],
            "@id": f"{DOMAIN}/#clinica",
            "name": "Flavio Saraiva Odontologia",
            "alternateName": [
                "Dr. Flávio Saraiva Odontologia",
                "Dr. Flávio Saraiva - Facetas em Resina",
                "Flavio Saraiva Odontologia LTDA"
            ],
            "url": f"{DOMAIN}/",
            "logo": f"{DOMAIN}/assets/images/favicon-512.png",
            "image": [
                f"{DOMAIN}/assets/images/favicon-512.png",
                f"{DOMAIN}/assets/images/consultorio-fachada.webp",
                f"{DOMAIN}/assets/images/consultorio-1.webp",
                f"{DOMAIN}/assets/images/consultorio-3.webp"
            ],
            "telephone": "+55-37-99100-6747",
            "taxID": "61.149.160/0001-91",
            "medicalSpecialty": "Dentistry",
            "priceRange": "$$",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Avenida Vigário Nicolau, 223 - Centro",
                "addressLocality": "Bom Despacho",
                "addressRegion": "MG",
                "postalCode": "35630-072",
                "addressCountry": "BR"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": -19.735623747376586,
                "longitude": -45.25216065736388
            },
            "hasMap": "https://maps.app.goo.gl/4mFaj2JRkjur3DdQ6",
            "areaServed": [
                {
                    "@type": "City",
                    "name": "Bom Despacho",
                    "sameAs": "https://pt.wikipedia.org/wiki/Bom_Despacho"
                },
                {
                    "@type": "City",
                    "name": "Nova Serrana",
                    "sameAs": "https://pt.wikipedia.org/wiki/Nova_Serrana"
                }
            ],
            "sameAs": [
                "https://www.instagram.com/dr.flaviosaraiva_/",
                "https://www.facebook.com/p/Dr-Fl%C3%A1vio-Saraiva-61576905215067/",
                "https://maps.app.goo.gl/4mFaj2JRkjur3DdQ6",
                "https://share.google/dO7jzpJcTaOSFRw2I"
            ],
            "founder": {
                "@id": f"{DOMAIN}/#flavio"
            }
        },
        {
            "@type": ["Person", "Dentist"],
            "@id": f"{DOMAIN}/#flavio",
            "name": "Flávio Lucas Saraiva Silva",
            "alternateName": "Dr. Flávio Saraiva",
            "jobTitle": "Cirurgião-Dentista",
            "identifier": "CRO-MG 75116",
            "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Universidade Una de Bom Despacho"
            },
            "worksFor": {
                "@id": f"{DOMAIN}/#clinica"
            },
            "image": f"{DOMAIN}/assets/images/flavio-hero-cutout-1200.webp",
            "sameAs": [
                "https://www.instagram.com/dr.flaviosaraiva_/",
                "https://www.facebook.com/p/Dr-Fl%C3%A1vio-Saraiva-61576905215067/"
            ]
        },
        {
            "@type": "WebSite",
            "@id": f"{DOMAIN}/#website",
            "url": f"{DOMAIN}/",
            "name": "Dr. Flávio Saraiva Odontologia",
            "description": "Facetas e lentes em resina composta em Bom Despacho e Nova Serrana - MG.",
            "inLanguage": "pt-BR",
            "publisher": {
                "@id": f"{DOMAIN}/#clinica"
            }
        },
        {
            "@type": "FAQPage",
            "@id": f"{DOMAIN}/#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": q,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": a
                    }
                }
                for q, a in faq_data
            ]
        }
    ]
}

# Adicionar VideoObjects ao @graph
for v in videos_data:
    schema["@graph"].append({
        "@type": "VideoObject",
        "name": v["name"],
        "description": v["description"],
        "thumbnailUrl": v["thumbnailUrl"],
        "contentUrl": v["contentUrl"],
        "uploadDate": v["uploadDate"],
        "duration": v["duration"],
        "transcript": v["transcript"],
        "publisher": {
            "@id": f"{DOMAIN}/#clinica"
        }
    })

json_str = json.dumps(schema, ensure_ascii=False, indent=2)

html = HTML_PATH.read_text(encoding="utf-8")
pattern = r"<!-- JSON-LD:INICIO.*?-->.*?<!-- JSON-LD:FIM -->"
replacement = f"<!-- JSON-LD:INICIO (gerado por scripts/inject_jsonld.py) -->\n  <script type=\"application/ld+json\">\n{json_str}\n  </script>\n  <!-- JSON-LD:FIM -->"

new_html, count = re.subn(pattern, replacement, html, flags=re.DOTALL)
assert count == 1, f"Falha ao substituir marcadores JSON-LD (encontradas {count} ocorrências)"

HTML_PATH.write_text(new_html, encoding="utf-8")
print(f"JSON-LD injetado com sucesso! {len(schema['@graph'])} entidades no @graph.")

