/**
 * ============================================================================
 * DR. FLÁVIO SARAIVA ODONTOLOGIA — MAIN INTERACTION & MOTION ENGINE
 * Stack: Vanilla JS + GSAP + ScrollTrigger + Lenis Smooth Scroll
 * Seguindo diretrizes das skills: animate, animation-performance, apple-design,
 * emil-design-eng e mobile-native.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 1. Inicializar Lenis Smooth Scroll + Sincronia com GSAP ScrollTrigger
  initSmoothScroll(prefersReducedMotion);

  // 2. Menu Mobile (Drawer)
  initMobileNavigation();

  // 2.1. Links de navegação do Header (foco azul no cursor + expansão circular no clique)
  initNavLinksAnimation(prefersReducedMotion, hasFinePointer);

  // 2.2. Botões interativos "Agendar" (Header e Footer) com efeito de clique
  initInteractiveButtons();

  // 2.3. Efeito Spotlight + Borda Luminosa que acompanha o cursor (Hero CTA, Pílulas, Etapas e Depoimentos)
  initSpotlightElements(hasFinePointer);

  // 3. Hero Section: Entrada, Contadores e Movimento "O Foco e as Órbitas" (Parallax Oposto)
  initHeroAnimations(prefersReducedMotion, hasFinePointer);

  // 4. Seção 02: Carrossel em Leque (Fan Carousel) com suporte a botões, clique, swipe e afastamento no hover
  initFanCarousel(prefersReducedMotion, hasFinePointer);

  // 5. Seção 03: Animação e Parallax nos Pontos Flutuantes + Arcada 3D
  initTechArchHotspots(prefersReducedMotion, hasFinePointer);

  // 6. Seção 06: Alternador "Detalhe do Sorriso" vs "Rosto Completo" + Morphing Dialog Image nos Casos Reais
  initCasesViewToggle();
  initCasesMorphDialog(prefersReducedMotion);

  // 6.1. Subseção de Depoimentos: Vídeos Reais 9:16 com Click-to-Stream e Áudio Exclusivo
  initVideoTestimonials();

  // 6.2. Seção 08: Modal Lightbox para visualização ampliada das fotos da clínica
  initClinicLightbox(prefersReducedMotion);

  // 6.3. Carrosséis Móveis: Suporte a arrasto lateral contínuo com mouse e touch (Drag-to-Scroll)
  initMobileCarouselsDrag();

  // 7. Seção 07: Acordeão de Perguntas Frequentes (FAQ)
  initFaqAccordion();

  // 8. Animação de Scroll: Card seguinte cobrindo o card anterior (Stacking Cards)
  initStackingCardsScroll(prefersReducedMotion);

  // 9. Revelações de Seção no Scroll via GSAP
  initScrollReveals(prefersReducedMotion);
});

/**
 * 1. NAVEGAÇÃO SUAVE E SINCRONIA COM GSAP SCROLLTRIGGER
 * Mantém o scroll nativo no compositor thread (60/120fps) e calcula posição real mesmo com cards sticky.
 */
function initSmoothScroll(prefersReducedMotion) {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Rolagem suave para links de âncora internos (compatível com position: sticky dos cards)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (targetId === '#topo') {
          window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
          });
          return;
        }

        // Obtém a posição real no fluxo do documento desativando sticky sincronamente no cálculo
        const stickyCards = document.querySelectorAll('.hero-wrapper, .section-block');
        stickyCards.forEach((c) => {
          c.style.position = 'relative';
          c.style.top = '0px';
        });
        const targetY = targetEl.getBoundingClientRect().top + window.scrollY;
        stickyCards.forEach((c) => {
          c.style.position = '';
        });
        window.dispatchEvent(new Event('updateStickyCards'));

        window.scrollTo({
          top: Math.max(0, targetY - 12),
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    });
  });
}

/**
 * 2. MENU MOBILE — CARD EXPANDÍVEL DE NAVEGAÇÃO
 */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  if (!menuBtn || !drawer) return;

  const navLinks = drawer.querySelectorAll('.mobile-nav-link');

  const toggleMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', isOpen);
    menuBtn.classList.toggle('is-active', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    drawer.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen && typeof gsap !== 'undefined') {
      gsap.fromTo(
        navLinks,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.36,
          stagger: 0.035,
          ease: 'power3.out',
          overwrite: 'auto',
        }
      );
    }
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        toggleMenu(true);
      }, 220);
    });
  });

  document.addEventListener('click', (e) => {
    if (
      drawer.classList.contains('is-open') &&
      !drawer.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      toggleMenu(true);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      toggleMenu(true);
    }
  });
}

/**
 * 3. HERO: "O FOCO E AS ÓRBITAS" + PARALLAX OPOSTO NO CURSOR + CONTADORES
 */
function initHeroAnimations(prefersReducedMotion, hasFinePointer) {
  const heroArea = document.getElementById('heroInteractiveArea');
  const heroDisc = document.getElementById('heroDisc');
  const heroDoctor = document.getElementById('heroDoctor');
  const heroOrbits = document.getElementById('heroOrbits');
  const heroPillTop = document.getElementById('heroPillTop');
  const heroPillBottom = document.getElementById('heroPillBottom');

  // Entrada escalonada dos elementos do Hero
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    gsap.fromTo(
      '.hero-anim-item',
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.1,
      }
    );

    gsap.fromTo(
      [heroDisc, heroDoctor, heroPillTop, heroPillBottom],
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.15,
      }
    );
  }

  // Animação numérica dos contadores do Hero
  const counters = document.querySelectorAll('.counter-value');
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.target || '0', 10);
      const state = { val: 0 };
      gsap.to(state, {
        val: target,
        duration: 1.6,
        ease: 'power2.out',
        delay: 0.25,
        onUpdate: () => {
          counter.textContent = String(Math.round(state.val));
        },
      });
    });
  }

  // Movimento ao passar o mouse: aplica-se ao disco, órbitas e pílulas (Dr. Flávio permanece fixo)
  if (!prefersReducedMotion && hasFinePointer && typeof gsap !== 'undefined' && heroArea) {
    const discX = gsap.quickTo(heroDisc, 'x', { duration: 0.65, ease: 'power3.out' });
    const discY = gsap.quickTo(heroDisc, 'y', { duration: 0.65, ease: 'power3.out' });

    const orbitX = gsap.quickTo(heroOrbits, 'x', { duration: 0.9, ease: 'power3.out' });
    const orbitY = gsap.quickTo(heroOrbits, 'y', { duration: 0.9, ease: 'power3.out' });

    const pillTopX = gsap.quickTo(heroPillTop, 'x', { duration: 0.55, ease: 'power3.out' });
    const pillTopY = gsap.quickTo(heroPillTop, 'y', { duration: 0.55, ease: 'power3.out' });

    const pillBotX = gsap.quickTo(heroPillBottom, 'x', { duration: 0.6, ease: 'power3.out' });
    const pillBotY = gsap.quickTo(heroPillBottom, 'y', { duration: 0.6, ease: 'power3.out' });

    heroArea.addEventListener('pointermove', (e) => {
      const rect = heroArea.getBoundingClientRect();
      // Normalizado de -0.5 a +0.5
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      // O disco, as órbitas e as pílulas reagem ao cursor; a foto do Dr. Flávio permanece estática
      discX(nx * 28);
      discY(ny * 22);

      orbitX(nx * 14);
      orbitY(ny * 14);

      pillTopX(-nx * 30);
      pillTopY(-ny * 20);

      pillBotX(nx * 24);
      pillBotY(-ny * 18);
    });

    heroArea.addEventListener('pointerleave', () => {
      discX(0);
      discY(0);
      orbitX(0);
      orbitY(0);
      pillTopX(0);
      pillTopY(0);
      pillBotX(0);
      pillBotY(0);
    });
  }
}

/**
 * 4. CARROSSEL EM LEQUE (FAN CAROUSEL — MÓDULO 07)
 * "Um carrossel em leque apresenta os problemas tratados"
 * Suporta setas, clique lateral, arraste (drag) e afastamento dos cards vizinhos no hover.
 */
function initFanCarousel(prefersReducedMotion, hasFinePointer) {
  const cards = Array.from(document.querySelectorAll('.fan-card'));
  const prevBtn = document.getElementById('fanPrevBtn');
  const nextBtn = document.getElementById('fanNextBtn');
  const stage = document.getElementById('fanCarouselStage');

  if (!cards.length) return;

  const total = cards.length;
  let activeIndex = 2; // Começa no card central (índice 2 de 0..4)
  let hoveredIndex = null; // Índice do card sob o cursor para afastar os vizinhos

  // Posições do leque para offsets [-2, -1, 0, +1, +2]
  const getFanConfig = (offset, isMobile) => {
    const spreadX = isMobile ? 74 : 92;
    const dropY = isMobile ? 22 : 34;
    const rotDeg = isMobile ? 8 : 11.5;

    if (offset === 0) {
      return { xPercent: 0, y: 0, rotation: 0, scale: 1, opacity: 1, zIndex: 10 };
    }
    if (offset === -1) {
      return { xPercent: -spreadX, y: dropY, rotation: -rotDeg, scale: 0.91, opacity: 0.95, zIndex: 8 };
    }
    if (offset === 1) {
      return { xPercent: spreadX, y: dropY, rotation: rotDeg, scale: 0.91, opacity: 0.95, zIndex: 8 };
    }
    if (offset === -2) {
      return { xPercent: -spreadX * 1.82, y: dropY * 2.7, rotation: -rotDeg * 1.9, scale: 0.82, opacity: isMobile ? 0 : 0.65, zIndex: 5 };
    }
    return { xPercent: spreadX * 1.82, y: dropY * 2.7, rotation: rotDeg * 1.9, scale: 0.82, opacity: isMobile ? 0 : 0.65, zIndex: 5 };
  };

  const getCircularDiff = (i) => {
    let diff = (i - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const renderFan = (animate = true, dragOffsetPx = 0) => {
    const isMobile = window.innerWidth < 768;
    const dragPercentShift = (dragOffsetPx / 320) * 28;
    const dragRotShift = (dragOffsetPx / 320) * 3.5;
    const hoveredDiff = hoveredIndex !== null ? getCircularDiff(hoveredIndex) : null;

    cards.forEach((card, i) => {
      const diff = getCircularDiff(i);
      const cfg = getFanConfig(diff, isMobile);
      card.style.zIndex = String(cfg.zIndex);
      card.classList.toggle('is-active-fan', diff === 0);

      // Ao passar o mouse sobre um card, as imagens em volta dele se afastam lateralmente
      let neighborPushX = 0;
      let neighborPushRot = 0;
      if (!isMobile && hoveredDiff !== null && dragOffsetPx === 0) {
        if (diff < hoveredDiff) {
          neighborPushX = -18;
          neighborPushRot = -2.6;
        } else if (diff > hoveredDiff) {
          neighborPushX = 18;
          neighborPushRot = 2.6;
        }
      }

      const targetXPercent = cfg.xPercent + dragPercentShift + neighborPushX;
      const targetRot = cfg.rotation + dragRotShift + neighborPushRot;

      if (typeof gsap !== 'undefined' && animate && !prefersReducedMotion) {
        gsap.to(card, {
          xPercent: targetXPercent,
          y: cfg.y,
          rotation: targetRot,
          scale: cfg.scale,
          opacity: cfg.opacity,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else if (typeof gsap !== 'undefined') {
        gsap.set(card, {
          xPercent: targetXPercent,
          y: cfg.y,
          rotation: targetRot,
          scale: cfg.scale,
          opacity: cfg.opacity,
        });
      }
    });
  };

  // Inicializa posições sem animação no primeiro frame
  renderFan(false);

  // Eventos de hover para afastar os cards ao redor do card sob o cursor
  if (hasFinePointer) {
    cards.forEach((card, index) => {
      card.addEventListener('pointerenter', () => {
        if (isDragging) return;
        hoveredIndex = index;
        renderFan(true);
      });
      card.addEventListener('pointerleave', () => {
        if (hoveredIndex === index) {
          hoveredIndex = null;
          renderFan(true);
        }
      });
    });
  }

  const goNext = () => {
    activeIndex = (activeIndex + 1) % total;
    renderFan(true);
  };

  const goPrev = () => {
    activeIndex = (activeIndex - 1 + total) % total;
    renderFan(true);
  };

  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  let isDragging = false;
  let hasDragged = false;
  let startX = 0;
  let currentDeltaX = 0;

  // Clicar em qualquer card lateral traz ele para o centro do leque (se não foi um arraste)
  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (hasDragged) {
        e.preventDefault();
        return;
      }
      if (e.target.closest('a')) return;
      if (activeIndex !== index) {
        activeIndex = index;
        renderFan(true);
      }
    });
  });

  // Suporte completo a arrastar (drag) com mouse ou toque (direct manipulation)
  if (stage) {
    stage.addEventListener('pointerdown', (e) => {
      // Ignora se clicou no botão de seta de link externo (WhatsApp)
      if (e.target.closest('a')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      isDragging = true;
      hasDragged = false;
      startX = e.clientX;
      currentDeltaX = 0;
      stage.classList.add('is-dragging');
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      currentDeltaX = e.clientX - startX;

      if (Math.abs(currentDeltaX) > 6) {
        hasDragged = true;
      }

      if (hasDragged && !prefersReducedMotion) {
        const clampedDelta = Math.max(-140, Math.min(140, currentDeltaX));
        renderFan(false, clampedDelta);
      }
    }, { passive: true });

    const finishDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove('is-dragging');

      const threshold = 35;
      if (Math.abs(currentDeltaX) > threshold) {
        if (currentDeltaX < 0) {
          goNext();
        } else {
          goPrev();
        }
      } else if (hasDragged) {
        renderFan(true, 0);
      }

      // Libera a flag de drag após o ciclo do evento de click
      setTimeout(() => {
        hasDragged = false;
      }, 40);
    };

    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
  }

  window.addEventListener('resize', () => renderFan(false));
}

/**
 * 5. SEÇÃO 03: ANIMAÇÃO E PARALLAX NOS 4 PONTOS FLUTUANTES + ARCADA 3D
 * Os 4 pontos flutuantes de informação, os anéis orbitais e a arcada 3D
 * reagem ao movimento do mouse em camadas de profundidade diferentes.
 */
function initTechArchHotspots(prefersReducedMotion, hasFinePointer) {
  const showcase = document.querySelector('.orbital-tech-showcase');
  const cards = Array.from(document.querySelectorAll('.tech-point-card'));
  const archImg = document.querySelector('.arch-3d-img');
  const archGlow = document.querySelector('.arch-glow');
  const orbitRings = document.querySelector('.tech-orbit-rings');

  if (!cards.length || !archImg) return;

  const rotations = { '1': -4, '2': 4, '3': -2.5, '4': 2.5 };

  cards.forEach((card) => {
    card.addEventListener('pointerenter', () => {
      cards.forEach((c) => c.classList.remove('is-highlighted'));
      card.classList.add('is-highlighted');
      const deg = rotations[card.dataset.tech] || 0;
      archImg.style.transform = `rotate(${deg}deg) scale(1.03)`;
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-highlighted');
      archImg.style.transform = 'rotate(0deg) scale(1)';
    });
  });

  // Movimento orbital interativo nos 4 pontos flutuantes ao mover o mouse na seção
  if (!prefersReducedMotion && hasFinePointer && typeof gsap !== 'undefined' && showcase) {
    const pointFactors = [
      { x: -24, y: -16, dur: 0.55 }, // Card 1 (Topo Esquerda)
      { x: 26, y: -18, dur: 0.62 },  // Card 2 (Topo Direita)
      { x: -22, y: 18, dur: 0.68 },  // Card 3 (Base Esquerda)
      { x: 24, y: 16, dur: 0.58 },   // Card 4 (Base Direita)
    ];

    const pointSetters = cards.map((card, i) => {
      const f = pointFactors[i] || { x: 18, y: 14, dur: 0.6 };
      return {
        x: gsap.quickTo(card, 'x', { duration: f.dur, ease: 'power3.out' }),
        y: gsap.quickTo(card, 'y', { duration: f.dur, ease: 'power3.out' }),
        fx: f.x,
        fy: f.y,
      };
    });

    const glowX = archGlow ? gsap.quickTo(archGlow, 'x', { duration: 0.7, ease: 'power3.out' }) : null;
    const glowY = archGlow ? gsap.quickTo(archGlow, 'y', { duration: 0.7, ease: 'power3.out' }) : null;
    const ringsX = orbitRings ? gsap.quickTo(orbitRings, 'x', { duration: 0.85, ease: 'power3.out' }) : null;
    const ringsY = orbitRings ? gsap.quickTo(orbitRings, 'y', { duration: 0.85, ease: 'power3.out' }) : null;

    showcase.addEventListener('pointermove', (e) => {
      const rect = showcase.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      pointSetters.forEach((setter) => {
        setter.x(nx * setter.fx);
        setter.y(ny * setter.fy);
      });

      if (glowX && glowY) {
        glowX(nx * 28);
        glowY(ny * 22);
      }
      if (ringsX && ringsY) {
        ringsX(-nx * 14);
        ringsY(-ny * 14);
      }
    });

    showcase.addEventListener('pointerleave', () => {
      pointSetters.forEach((setter) => {
        setter.x(0);
        setter.y(0);
      });
      if (glowX && glowY) {
        glowX(0);
        glowY(0);
      }
      if (ringsX && ringsY) {
        ringsX(0);
        ringsY(0);
      }
    });
  }
}

/**
 * 6. SEÇÃO 06: TOGGLE "DETALHE DO SORRISO" VS "ROSTO COMPLETO" NOS CASOS REAIS
 * Com pílula deslizante suave (.toggle-pill-indicator) e transição fluida nos cards.
 */
function initCasesViewToggle() {
  const toggleBtns = document.querySelectorAll('.toggle-pill-btn');
  const indicator = document.getElementById('casesToggleIndicator');
  const casesGrid = document.getElementById('casesGrid');
  const caseCards = document.querySelectorAll('.cases-grid .case-card');
  const caseImgs = document.querySelectorAll('.cases-grid .case-img');

  if (!toggleBtns.length || !casesGrid) return;

  const updateIndicator = (activeBtn) => {
    if (!indicator || !activeBtn) return;
    indicator.style.width = `${activeBtn.offsetWidth}px`;
    indicator.style.transform = `translate3d(${activeBtn.offsetLeft}px, 0, 0)`;
  };

  // Inicializa posição da pílula azul deslizante
  const initialActive = document.querySelector('.toggle-pill-btn.active') || toggleBtns[0];
  updateIndicator(initialActive);
  window.addEventListener('load', () => updateIndicator(document.querySelector('.toggle-pill-btn.active')));
  window.addEventListener('resize', () => updateIndicator(document.querySelector('.toggle-pill-btn.active')));

  let currentMode = initialActive?.dataset.viewMode || 'smile';

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.viewMode; // 'smile' | 'full'
      if (mode === currentMode) return;
      currentMode = mode;

      toggleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      updateIndicator(btn);

      const isFull = mode === 'full';

      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(caseCards);
        gsap.to(caseCards, {
          opacity: 0,
          y: 10,
          scale: 0.985,
          duration: 0.18,
          ease: 'power2.in',
          onComplete: () => {
            casesGrid.classList.toggle('is-full-face', isFull);
            caseImgs.forEach((img) => {
              const nextSrc = isFull ? img.dataset.fullSrc : img.dataset.smileSrc;
              if (nextSrc) {
                img.setAttribute('src', nextSrc);
              }
            });

            gsap.fromTo(
              caseCards,
              { opacity: 0, y: 12, scale: 0.985 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.44,
                stagger: 0.045,
                ease: 'power3.out',
                clearProps: 'transform',
              }
            );

            setTimeout(() => {
              window.dispatchEvent(new Event('updateStickyCards'));
            }, 260);
          },
        });
      } else {
        casesGrid.classList.toggle('is-full-face', isFull);
        caseImgs.forEach((img) => {
          const nextSrc = isFull ? img.dataset.fullSrc : img.dataset.smileSrc;
          if (nextSrc) {
            img.setAttribute('src', nextSrc);
          }
        });
        setTimeout(() => {
          window.dispatchEvent(new Event('updateStickyCards'));
        }, 320);
      }
    });
  });
}

/**
 * 7. SEÇÃO 07: ACORDEÃO DE PERGUNTAS FREQUENTES (FAQ)
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Fecha os demais itens para manter leitura limpa
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        const otherBtn = other.querySelector('.faq-trigger');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Alterna o item clicado
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }

      setTimeout(() => {
        window.dispatchEvent(new Event('updateStickyCards'));
      }, 260);
    });
  });
}

/**
 * 8. ANIMAÇÃO DE SCROLL: CARD SEGUINTE COBRINDO O CARD ANTERIOR (STACKING CARDS)
 * Cada seção trava ao final de sua leitura (com trecho de pausa visível via margin-bottom)
 * e permanece 100% full-width (sem scale que gere borda lateral) enquanto o próximo card sobe por cima.
 * No mobile, evita recalcular durante a variação da barra de endereço e oculta da GPU cards já 100% cobertos.
 */
function initStackingCardsScroll() {
  const stackCards = [
    document.querySelector('.hero-wrapper'),
    ...Array.from(document.querySelectorAll('.section-block')),
    document.querySelector('.footer-wrapper'),
  ].filter(Boolean);

  if (stackCards.length < 2) return;

  let lastWindowWidth = window.innerWidth;

  const updateStickyOffsets = () => {
    const vh = document.documentElement.clientHeight || window.innerHeight;
    stackCards.forEach((card, idx) => {
      if (idx === stackCards.length - 1) return;
      const cardHeight = card.offsetHeight;
      const stickyTop = Math.min(0, vh - cardHeight);
      card.style.top = `${stickyTop}px`;
    });

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    cullCoveredCards();
  };

  // Libera memória de textura da GPU para seções anteriores que já foram 100% cobertas pela seção seguinte
  let rafPending = false;
  const cullCoveredCards = () => {
    rafPending = false;
    for (let i = 0; i < stackCards.length - 1; i++) {
      const nextCard = stackCards[i + 1];
      const nextRect = nextCard.getBoundingClientRect();
      // Quando o próximo card já subiu até o topo da tela (<= 2px), o card anterior está 100% coberto por baixo
      const isCompletelyCovered = nextRect.top <= 2;
      stackCards[i].classList.toggle('is-covered-card', isCompletelyCovered);
    }
  };

  const onScrollCull = () => {
    if (!rafPending) {
      rafPending = true;
      window.requestAnimationFrame(cullCoveredCards);
    }
  };

  updateStickyOffsets();
  window.addEventListener('load', updateStickyOffsets);
  window.addEventListener('orientationchange', () => {
    setTimeout(updateStickyOffsets, 180);
  });
  window.addEventListener('resize', () => {
    // No mobile, ignora o resize disparado apenas pela barra de endereço escondendo/aparecendo no scroll
    const currentWidth = window.innerWidth;
    if (Math.abs(currentWidth - lastWindowWidth) > 2) {
      lastWindowWidth = currentWidth;
      updateStickyOffsets();
    }
  });
  window.addEventListener('updateStickyCards', updateStickyOffsets);
  window.addEventListener('scroll', onScrollCull, { passive: true });
}

/**
 * 9. REVELAÇÕES NO SCROLL (GSAP + INTERSECTION OBSERVER)
 * Segue a diretriz de "Exponential ease-out from an already-visible default"
 * para garantir que nenhuma seção fique oculta em saltos rápidos de scroll.
 */
function initScrollReveals(prefersReducedMotion) {
  if (prefersReducedMotion || typeof gsap === 'undefined') {
    return;
  }

  const revealElements = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const isMobile = window.innerWidth < 768;
          const isHorizontalSnapItem =
            isMobile &&
            entry.target.matches('.indication-card, .step-card, .case-card, .video-story-card, .testimonial-card');

          if (isHorizontalSnapItem) {
            observer.unobserve(entry.target);
            return;
          }

          gsap.fromTo(
            entry.target,
            { y: 20, opacity: 0.82 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              overwrite: 'auto',
              clearProps: 'transform,opacity',
            }
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => observer.observe(el));

  const stepsGrid = document.querySelector('.steps-grid');
  const stepCards = document.querySelectorAll('.reveal-step');
  if (stepsGrid && stepCards.length) {
    const stepsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              stepCards,
              { y: 26, opacity: 0.7 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.07,
                ease: 'power3.out',
                overwrite: 'auto',
              }
            );
            stepsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    stepsObserver.observe(stepsGrid);
  }
}

/**
 * 10. ANIMAÇÃO DOS LINKS DE NAVEGAÇÃO DO HEADER (.nav-link) E TELEFONE DO FOOTER (.contact-phone-link)
 * - Hover: ilumina em azul apenas a região da escrita ao redor do ponteiro do mouse.
 * - Click: transição de cor azul que cresce do centro da palavra em formato de círculo até cobrir a palavra toda.
 */
function initNavLinksAnimation(prefersReducedMotion, hasFinePointer) {
  const navLinks = document.querySelectorAll('.nav-link, .contact-phone-link');
  if (!navLinks.length) return;

  navLinks.forEach((link) => {
    if (hasFinePointer) {
      link.addEventListener('pointerenter', (e) => {
        const rect = link.getBoundingClientRect();
        link.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        link.style.setProperty('--my', `${e.clientY - rect.top}px`);
        link.style.setProperty('--hover-r', '34px');
      });

      link.addEventListener('pointermove', (e) => {
        const rect = link.getBoundingClientRect();
        link.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        link.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });

      link.addEventListener('pointerleave', () => {
        link.style.setProperty('--hover-r', '0px');
      });
    }

    link.addEventListener('click', () => {
      if (prefersReducedMotion || typeof gsap === 'undefined') return;
      const state = { r: 0 };
      gsap.killTweensOf(state);
      gsap.to(state, {
        r: 120,
        duration: 0.42,
        ease: 'power2.out',
        onUpdate: () => {
          link.style.setProperty('--click-r', `${state.r}px`);
        },
        onComplete: () => {
          gsap.to(state, {
            r: 0,
            duration: 0.3,
            delay: 0.12,
            ease: 'power2.in',
            onUpdate: () => {
              link.style.setProperty('--click-r', `${state.r}px`);
            },
          });
        },
      });
    });
  });
}

/**
 * 11. EFEITO DE CLIQUE E TOQUE MOBILE NOS BOTÕES DA PÁGINA
 * No mobile/touch, aplica ao clicar os mesmos efeitos de expansão e brilho que o desktop exibe no hover.
 */
function initInteractiveButtons() {
  const buttons = document.querySelectorAll(
    '.btn-outline-pill, .btn-white-pill, .map-directions-pill, .btn-primary-pill, .social-icon-btn, .btn-nav-circle, .mobile-nav-link'
  );

  buttons.forEach((btn) => {
    let touchTimer = null;

    btn.addEventListener('pointerdown', (e) => {
      const rect = btn.getBoundingClientRect();
      const localX = `${e.clientX - rect.left}px`;
      const localY = `${e.clientY - rect.top}px`;

      btn.style.setProperty('--click-x', localX);
      btn.style.setProperty('--click-y', localY);
      btn.style.setProperty('--mx', localX);
      btn.style.setProperty('--my', localY);

      btn.classList.remove('is-rippling');
      void btn.offsetWidth;
      btn.classList.add('is-rippling');

      btn.classList.add('is-touch-active');
      if (touchTimer) clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        btn.classList.remove('is-touch-active');
      }, 650);
    });
  });
}

/**
 * 12. EFEITO SPOTLIGHT + BORDA LUMINOSA QUE ACOMPANHA O CURSOR
 * Aplicado em:
 * - Botão "Agendar consulta" do Hero (.hero-cta-group .btn-primary-pill)
 * - Cards translúcidos em formato de pílula (.glass-pill)
 * - Cards da seção "Quando a estética em resina é a melhor solução" (.indication-card)
 * - Cards da seção "Do diagnóstico ao novo sorriso, passo a passo" (.step-card)
 * - Cards da seção "O que dizem os pacientes" (.testimonial-card)
 * - Cards de perguntas frequentes (.faq-item)
 * - Imagens da seção "Estrutura preparada para cada etapa do tratamento" (.clinic-photo-large, .clinic-photo-small)
 */
function initSpotlightElements(hasFinePointer) {
  if (!hasFinePointer) return;

  const spotlightTargets = document.querySelectorAll(
    '.hero-cta-group .btn-primary-pill, .glass-pill, .indication-card, .step-card, .video-story-card, .testimonial-card, .faq-item, .clinic-photo-large, .clinic-photo-small'
  );

  spotlightTargets.forEach((el) => {
    el.addEventListener('pointerenter', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      el.style.setProperty('--spot-opacity', '1');
    });

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });

    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--spot-opacity', '0');
    });
  });
}

/**
 * 13. MORPHING DIALOG IMAGE NA SEÇÃO DE RESULTADOS DOS PACIENTES (#casos)
 * Ao clicar em qualquer card de Antes e Depois (.case-comparison-stack),
 * ele se expande suavemente a partir da sua posição na tela para um modal centralizado maior,
 * enquanto a faixa branca de informações (.case-morph-caption) se desdobra/expande com fluidez.
 */
function initCasesMorphDialog(prefersReducedMotion) {
  const dialog = document.getElementById('caseMorphDialog');
  const backdrop = document.getElementById('caseMorphBackdrop');
  const morphCard = document.getElementById('caseMorphCard');
  const morphMedia = document.getElementById('caseMorphMedia');
  const morphCaption = document.getElementById('caseMorphCaption');
  const morphCaptionInner = document.getElementById('caseMorphCaptionInner');
  const morphTitle = document.getElementById('caseMorphTitle');
  const morphDesc = document.getElementById('caseMorphDesc');
  const closeBtn = document.getElementById('caseMorphClose');
  const casesGrid = document.getElementById('casesGrid');

  if (!dialog || !morphCard || !morphMedia || !casesGrid) return;

  let activeSourceStack = null;
  let isAnimating = false;

  const openMorphDialog = (stackEl) => {
    if (isAnimating) return;
    isAnimating = true;
    activeSourceStack = stackEl;

    const cardArticle = stackEl.closest('.case-card');
    const titleText = cardArticle?.querySelector('.case-info h3')?.textContent || '';
    const descText = cardArticle?.querySelector('.case-info p')?.textContent || '';
    const isFullFace = casesGrid.classList.contains('is-full-face');

    morphTitle.textContent = titleText;
    morphDesc.textContent = descText;
    morphMedia.innerHTML = stackEl.innerHTML;
    morphMedia.classList.toggle('is-full-face', isFullFace);

    const fromRect = stackEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetWidth = Math.min(isFullFace ? 820 : 880, vw * 0.92);
    const targetHeight = Math.min(isFullFace ? 760 : 680, vh * 0.88);
    const targetLeft = (vw - targetWidth) / 2;
    const targetTop = (vh - targetHeight) / 2;

    dialog.classList.add('is-open');
    dialog.setAttribute('aria-hidden', 'false');

    // Mede a altura natural da faixa branca de informação na largura final do modal
    morphCard.style.width = `${targetWidth}px`;
    const naturalCaptionHeight = morphCaptionInner ? morphCaptionInner.offsetHeight : 96;

    stackEl.style.visibility = 'hidden';

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(morphCard, {
        left: targetLeft,
        top: targetTop,
        width: targetWidth,
        height: targetHeight,
        borderRadius: 32,
      });
      gsap.set(morphCaption, { height: naturalCaptionHeight, opacity: 1 });
      if (morphCaptionInner) gsap.set(morphCaptionInner, { y: 0, scale: 1, opacity: 1 });
      gsap.set(closeBtn, { opacity: 1, scale: 1 });
      isAnimating = false;
      return;
    }

    // Estado inicial idêntico ao card clicado (sem a barra branca aberta para não dar salto)
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(closeBtn, { opacity: 0, scale: 0.85 });
    gsap.set(morphCaption, { height: 0, opacity: 0 });
    if (morphCaptionInner) {
      gsap.set(morphCaptionInner, { y: 18, scale: 0.96, opacity: 0 });
    }
    gsap.set(morphCard, {
      left: fromRect.left,
      top: fromRect.top,
      width: fromRect.width,
      height: fromRect.height,
      borderRadius: 36,
    });

    gsap.to(backdrop, {
      opacity: 1,
      duration: 0.45,
      ease: 'power2.out',
    });

    // Expansão principal do card
    gsap.to(morphCard, {
      left: targetLeft,
      top: targetTop,
      width: targetWidth,
      height: targetHeight,
      borderRadius: 32,
      duration: 0.62,
      ease: 'expo.out',
      onComplete: () => {
        gsap.set(morphCaption, { height: 'auto' });
        isAnimating = false;
      },
    });

    // Expansão suave da parte branca inferior com a informação do caso
    gsap.to(morphCaption, {
      height: naturalCaptionHeight,
      opacity: 1,
      duration: 0.56,
      delay: 0.08,
      ease: 'expo.out',
    });

    if (morphCaptionInner) {
      gsap.to(morphCaptionInner, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.52,
        delay: 0.14,
        ease: 'power3.out',
      });
    }

    gsap.to(closeBtn, {
      opacity: 1,
      scale: 1,
      duration: 0.34,
      delay: 0.2,
      ease: 'back.out(1.6)',
    });
  };

  const closeMorphDialog = () => {
    if (!dialog.classList.contains('is-open') || isAnimating) return;
    isAnimating = true;

    const toRect = activeSourceStack ? activeSourceStack.getBoundingClientRect() : null;

    if (prefersReducedMotion || typeof gsap === 'undefined' || !toRect) {
      if (activeSourceStack) activeSourceStack.style.visibility = '';
      dialog.classList.remove('is-open');
      dialog.setAttribute('aria-hidden', 'true');
      activeSourceStack = null;
      isAnimating = false;
      return;
    }

    const currentCaptionHeight = morphCaption.offsetHeight;
    gsap.set(morphCaption, { height: currentCaptionHeight });

    gsap.to(closeBtn, {
      opacity: 0,
      scale: 0.85,
      duration: 0.2,
      ease: 'power2.in',
    });

    if (morphCaptionInner) {
      gsap.to(morphCaptionInner, {
        y: 12,
        scale: 0.96,
        opacity: 0,
        duration: 0.26,
        ease: 'power2.in',
      });
    }

    // Recolhe suavemente a faixa branca enquanto o card retorna para a posição original
    gsap.to(morphCaption, {
      height: 0,
      opacity: 0,
      duration: 0.38,
      ease: 'expo.inOut',
    });

    gsap.to(backdrop, {
      opacity: 0,
      duration: 0.42,
      ease: 'power2.inOut',
    });

    gsap.to(morphCard, {
      left: toRect.left,
      top: toRect.top,
      width: toRect.width,
      height: toRect.height,
      borderRadius: 36,
      duration: 0.48,
      ease: 'expo.inOut',
      onComplete: () => {
        if (activeSourceStack) activeSourceStack.style.visibility = '';
        dialog.classList.remove('is-open');
        dialog.setAttribute('aria-hidden', 'true');
        morphMedia.innerHTML = '';
        activeSourceStack = null;
        isAnimating = false;
      },
    });
  };

  casesGrid.querySelectorAll('.case-comparison-stack').forEach((stackEl) => {
    stackEl.addEventListener('click', () => openMorphDialog(stackEl));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMorphDialog);
  if (backdrop) backdrop.addEventListener('click', closeMorphDialog);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMorphDialog();
  });
}

/**
 * 14. VÍDEOS DE DEPOIMENTOS REAIS (CINEMA GRID 9:16)
 * - Click-to-Stream: nenhum byte de vídeo é baixado no load inicial da página.
 * - Ao clicar, injeta o data-src sob demanda, inicia a reprodução com áudio ativo e pausa os demais vídeos.
 * - Controle de Volume deslizante customizado em cada card com sincronização contínua.
 * - Pausa automática via IntersectionObserver ao rolar para fora da tela (libera decodificador de hardware da GPU).
 * - Oculta a legenda inferior suavemente durante o play para não cobrir as legendas do Reels.
 */
function initVideoTestimonials() {
  const cards = document.querySelectorAll('.video-story-card');
  if (!cards.length) return;

  let sharedVolume = 0.75;

  const pauseAllVideos = (exceptCard = null) => {
    cards.forEach((card) => {
      if (card === exceptCard) return;
      const video = card.querySelector('.video-element');
      if (video && !video.paused) {
        video.pause();
      }
      card.classList.remove('is-playing');
    });
  };

  cards.forEach((card) => {
    const video = card.querySelector('.video-element');
    const playBtn = card.querySelector('.video-play-btn');
    const audioToggle = card.querySelector('.video-audio-toggle');
    const volumeGroup = card.querySelector('.video-volume-group');
    const volumeSlider = card.querySelector('.video-volume-slider');
    const progressFill = card.querySelector('.video-progress-fill');

    if (!video) return;

    // Define volume inicial do elemento de mídia e do controle deslizante
    video.volume = sharedVolume;
    if (volumeSlider) {
      volumeSlider.value = sharedVolume;
    }

    // Impede que cliques na área de volume (botão ou slider) pausem ou reproduzam o vídeo acidentalmente
    if (volumeGroup) {
      volumeGroup.addEventListener('click', (e) => e.stopPropagation());
    }

    // Controle dinâmico de volume pelo slider
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const val = Math.max(0, Math.min(1, parseFloat(volumeSlider.value)));
        sharedVolume = val;
        video.volume = val;

        if (val === 0) {
          video.muted = true;
          card.classList.remove('is-unmuted');
        } else {
          video.muted = false;
          card.classList.add('is-unmuted');
        }

        // Sincroniza o slider e o volume em todos os outros cards de depoimentos
        cards.forEach((otherCard) => {
          if (otherCard === card) return;
          const otherSlider = otherCard.querySelector('.video-volume-slider');
          const otherVideo = otherCard.querySelector('.video-element');
          if (otherSlider) otherSlider.value = val;
          if (otherVideo) otherVideo.volume = val;
          if (val === 0) {
            if (otherVideo) otherVideo.muted = true;
            otherCard.classList.remove('is-unmuted');
          }
        });
      });
    }

    // Toggle de áudio isolado (Mudo / Som)
    if (audioToggle) {
      audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.muted || video.volume === 0) {
          // Desmuta
          if (sharedVolume <= 0) sharedVolume = 0.75;
          video.volume = sharedVolume;
          video.muted = false;
          card.classList.add('is-unmuted');
          if (volumeSlider) volumeSlider.value = sharedVolume;
        } else {
          // Muta
          video.muted = true;
          card.classList.remove('is-unmuted');
        }
      });
    }

    // Ação principal de Play/Pause ao clicar no card ou no botão central
    const togglePlayback = () => {
      // Lazy-load do arquivo .mp4 no primeiro clique (Zero-Byte Initial Load)
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
        video.load();
      }

      if (video.paused) {
        pauseAllVideos(card);

        // Inicia com áudio ativo e volume respeitando a preferência
        if (sharedVolume <= 0) sharedVolume = 0.75;
        video.volume = sharedVolume;
        video.muted = false;
        card.classList.add('is-unmuted');
        if (volumeSlider) volumeSlider.value = sharedVolume;

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              card.classList.add('is-playing');
            })
            .catch(() => {
              // Fallback para reprodução silenciosa caso a política de autoplay do navegador bloqueie áudio
              video.muted = true;
              card.classList.remove('is-unmuted');
              video.play().then(() => card.classList.add('is-playing'));
            });
        }
      } else {
        video.pause();
        card.classList.remove('is-playing');
      }
    };

    card.addEventListener('click', togglePlayback);
    if (playBtn) playBtn.addEventListener('click', togglePlayback);

    // Atualização da barra de progresso durante o vídeo
    video.addEventListener('timeupdate', () => {
      if (video.duration && progressFill) {
        const pct = (video.currentTime / video.duration) * 100;
        progressFill.style.width = `${pct}%`;
      }
    });

    // Ao finalizar o vídeo
    video.addEventListener('ended', () => {
      card.classList.remove('is-playing');
      if (progressFill) progressFill.style.width = '0%';
    });
  });

  // IntersectionObserver: pausa o vídeo automaticamente quando o card sair da tela no scroll
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          const video = entry.target.querySelector('.video-element');
          if (video && !video.paused) {
            video.pause();
            entry.target.classList.remove('is-playing');
          }
        }
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach((c) => videoObserver.observe(c));
}

/**
 * 15. MODAL LIGHTBOX PARA FOTOS DA ESTRUTURA DA CLÍNICA (#clinica)
 * Permite expandir qualquer foto da clínica para resolução completa em tela cheia com backdrop blur,
 * acessibilidade por teclado (Escape / Enter / Espaço) e foco preservado.
 */
function initClinicLightbox(prefersReducedMotion) {
  const modal = document.getElementById('clinicLightboxModal');
  const backdrop = document.getElementById('clinicLightboxBackdrop');
  const closeBtn = document.getElementById('clinicLightboxClose');
  const img = document.getElementById('clinicLightboxImg');
  const title = document.getElementById('clinicLightboxTitle');
  const card = document.getElementById('clinicLightboxCard');
  const triggers = document.querySelectorAll(
    '.clinic-photo-large[data-lightbox-src], .clinic-photo-small[data-lightbox-src]'
  );

  if (!modal || !backdrop || !closeBtn || !img || !title || !triggers.length) return;

  let lastFocusedTrigger = null;

  const openLightbox = (src, titleText, triggerEl) => {
    lastFocusedTrigger = triggerEl;
    img.src = src;
    img.alt = titleText || 'Estrutura da Clínica Dr. Flávio Saraiva';
    title.textContent = titleText || '';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (!prefersReducedMotion && typeof gsap !== 'undefined' && card) {
      gsap.fromTo(
        card,
        { scale: 0.94, opacity: 0, y: 14 },
        { scale: 1, opacity: 1, y: 0, duration: 0.34, ease: 'expo.out' }
      );
    }

    setTimeout(() => {
      closeBtn.focus();
    }, 50);
  };

  const closeLightbox = () => {
    if (!modal.classList.contains('is-open')) return;

    document.body.style.overflow = '';
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  };

  triggers.forEach((trigger) => {
    const handleTrigger = (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-lightbox-src');
      const titleText = trigger.getAttribute('data-lightbox-title');
      if (src) {
        openLightbox(src, titleText, trigger);
      }
    };

    trigger.addEventListener('click', handleTrigger);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTrigger(e);
      }
    });
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

/**
 * 16. SUPORTE A ARRASTO LATERAL COM MOUSE (DRAG-TO-SCROLL) NOS CARROSSÉIS
 * Permite clicar e arrastar lateralmente nos carrosséis (.indication-cards-grid,
 * .steps-grid, .cases-grid, .video-testimonials-grid) tanto com mouse quanto no touch,
 * com cancelamento seguro de clique acidental nos cards ao arrastar.
 */
function initMobileCarouselsDrag() {
  const selectors = [
    '.indication-cards-grid',
    '.steps-grid',
    '.cases-grid',
    '.video-testimonials-grid',
  ];

  selectors.forEach((selector) => {
    const el = document.querySelector(selector);
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasMoved = false;

    el.addEventListener('mousedown', (e) => {
      // Aceita apenas clique com botão esquerdo
      if (e.button !== 0) return;
      isDown = true;
      hasMoved = false;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.35;
      if (Math.abs(walk) > 4) {
        hasMoved = true;
      }
      el.scrollLeft = scrollLeft - walk;
    });

    const stopDrag = () => {
      if (!isDown) return;
      isDown = false;
      el.classList.remove('is-dragging');

      if (hasMoved) {
        const captureClick = (clickEvt) => {
          clickEvt.stopPropagation();
          clickEvt.preventDefault();
        };
        el.addEventListener('click', captureClick, { capture: true, once: true });
        setTimeout(() => {
          hasMoved = false;
        }, 50);
      }
    };

    window.addEventListener('mouseup', stopDrag);
  });
}

