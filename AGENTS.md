# Diretrizes e Regras para Agentes de IA (`AGENTS.md`)

Este documento define as regras obrigatórias de funcionamento, arquitetura, design e documentação para qualquer agente de IA que atue neste projeto (**Site / Landing Page — Dr. Flávio Saraiva Odontologia**).

---

## 1. Uso Obrigatório das Skills Instaladas (Design, UI/UX e Motion)

Antes de criar, alterar, estilizar ou revisar qualquer seção, componente ou layout da página, o agente **deve** consultar e aplicar as diretrizes das skills instaladas no projeto (`.agents/skills/`):

- **Direção de Arte, Layout e Estética Anti-Slop:**
  - `design-taste-frontend`: Direção de arte, composição, tipografia, paleta de cores e prevenção de layouts genéricos ("AI slop").
  - `impeccable`: Hierarquia visual, UX copy, acessibilidade, polimento de interface e consistência de sistema de design.
  - `emil-design-eng`: Refinamento de componentes, detalhes invisíveis de UI e polimento de interação.
  - `apple-design`: Fluidez visual, tipografia óptica, materiais translúcidos, profundidade e consistência espacial.
- **Animações e Performance:**
  - `animate` / `find-animation-opportunities` / `improve-animations`: Decisões de movimento com propósito, curvas de transição e micro-interações.
  - `animation-performance`: Garantia de animações a 60fps focadas em propriedades compostas (`transform`, `opacity`).
- **Responsividade, Mobile e Robustez:**
  - `mobile-native`: Experiência impecável em dispositivos móveis (áreas de toque, viewport, scroll, prevenção de bugs mobile).
  - `break-ui`: Testes de estresse visual para garantir que textos longos, telas menores ou conteúdos variáveis não quebrem o layout.

---

## 2. Fonte de Verdade do Projeto (Pasta `docs/`)

Todas as informações oficiais do cliente, ativos visuais e referências criativas encontram-se na pasta [`docs/`](./docs):

- **[`docs/info.md`](./docs/info.md):** Dados oficiais do **Dr. Flávio Saraiva** (CRO-MG 75116, CNPJ, endereço em Bom Despacho - MG, atuação também em Nova Serrana - MG, WhatsApp, Instagram, Facebook, descrição institucional e links de referência).
- **[`docs/images/`](./docs/images):**
  - Fotos profissionais do Dr. Flávio (`flavio_foto.jpg`, `flavio_foto2.jpg`, `flavio_foto_3.jpg`) e logotipos (`logo_flavio_branca_fundo_transparente.png`, `logo_baner_facebook_flavio.jpg`).
  - [`docs/images/clientes/`](./docs/images/clientes): Casos reais de Antes e Depois dos pacientes.
  - [`docs/images/consultório/`](./docs/images/consultório): Fotos reais da estrutura física e ambiente da clínica em formato `.webp`.
  - [`docs/images/Design/`](./docs/images/Design): Guias e inspirações visuais de referência para a Landing Page (conceito visual, hero, tipografia e PDFs de referência).

> **Regra:** Nunca invente dados de contato, credenciais, endereços ou depoimentos fictícios sem antes verificar [`docs/info.md`](./docs/info.md) e os materiais em [`docs/`](./docs).

---

## 3. Regra Mandatória de Documentação Contínua (`docs/acompanhamento.md`)

O arquivo **[`docs/acompanhamento.md`](./docs/acompanhamento.md)** centraliza toda a memória viva do projeto, contendo:
1. Visão geral e status atual do projeto.
2. Estrutura atualizada de pastas e arquivos.
3. Resumo das etapas concluídas, decisões de arquitetura/design e histórico de atualizações (Changelog).
4. Próximos passos pendentes.

### ⚠️ REGRA MANDATÓRIA DE FINALIZAÇÃO DE TAREFA
> **Nenhuma tarefa é considerada finalizada até que o arquivo [`docs/acompanhamento.md`](./docs/acompanhamento.md) seja atualizado.**
>
> Ao concluir **qualquer** tarefa solicitada pelo usuário (criação de componente, ajuste de estilo, refatoração, configuração ou correção de bug), o agente **deve obrigatoriamente**:
> 1. Atualizar a estrutura do projeto em [`docs/acompanhamento.md`](./docs/acompanhamento.md) caso arquivos/pastas tenham sido criados, movidos ou removidos.
> 2. Adicionar um registro detalhado na seção de **Histórico de Atualizações / Etapas Realizadas**, informando a data, o que foi feito, os arquivos criados/modificados e as skills utilizadas.

