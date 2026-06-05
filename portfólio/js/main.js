/* ═══════════════════════════════════════════════════
   MAIN.JS — Portfolio Rafael Sanguini
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Lucide icons ── */
  if (window.lucide) lucide.createIcons();

  /* ══════════════════════════════════════
     CUSTOM CURSOR
  ══════════════════════════════════════ */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverEls = document.querySelectorAll('a, button, .project-card, .skill-item, .about-photo-wrap');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ══════════════════════════════════════
     NAVBAR — scroll state & active link
  ══════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    const sections = ['home', 'sobre', 'projetos', 'habilidades', 'contato'];
    let current = 'home';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ══════════════════════════════════════
     HAMBURGER MENU
  ══════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      const open = navLinksEl.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // Fechar ao clicar em um link
    navLinksEl.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  /* ══════════════════════════════════════
     INTERSECTION OBSERVER — reveal & skills
  ══════════════════════════════════════ */
  // Reveal sections
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

  // Add reveal-up to elements
  const addRevealTo = (selector, delay = 0) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal-up');
      el.style.transitionDelay = (delay + i * 80) + 'ms';
      revealObserver.observe(el);
    });
  };

  addRevealTo('.project-card', 0);
  addRevealTo('.skill-item', 0);
  addRevealTo('.contact-item', 0);
  addRevealTo('.highlight-item', 0);
  addRevealTo('.soft-item', 0);
  addRevealTo('.about-text', 0);
  addRevealTo('.stat', 0);

  // Skill bars animation
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
          setTimeout(() => bar.classList.add('animated'), i * 100);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skills-category').forEach(cat => skillObserver.observe(cat));

  /* ══════════════════════════════════════
     COPY EMAIL
  ══════════════════════════════════════ */
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyToast = document.getElementById('copyToast');

  if (copyBtn && copyToast) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('rafaelcolagrossi@gmail.com');
        copyToast.classList.add('show');
        if (window.lucide) lucide.createIcons();
        setTimeout(() => copyToast.classList.remove('show'), 2500);
      } catch {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = 'rafaelcolagrossi@gmail.com';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyToast.classList.add('show');
        setTimeout(() => copyToast.classList.remove('show'), 2500);
      }
    });
  }

  /* ══════════════════════════════════════
     PROFILE MODAL
  ══════════════════════════════════════ */
  const overlay   = document.getElementById('profileModalOverlay');
  const openBtn   = document.getElementById('openProfileModal');
  const closeBtn  = document.getElementById('profileModalClose');
  const contactModalBtn = document.getElementById('pmodalContactBtn');

  const openModal = () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
  };

  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openBtn)  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay)  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  if (contactModalBtn) {
    contactModalBtn.addEventListener('click', closeModal);
  }

  /* ══════════════════════════════════════
     SMOOTH SCROLL for anchor links
  ══════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ══════════════════════════════════════
     PARALLAX on hero orbs (subtle)
  ══════════════════════════════════════ */
  const orbs = document.querySelectorAll('.orb');

  if (orbs.length && window.matchMedia('(min-width: 769px)').matches) {
    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 12;
        orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });
    });
  }

  /* ══════════════════════════════════════
     STAGGERED PROJECT CARDS hover glow
  ══════════════════════════════════════ */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
      card.style.background = `
        radial-gradient(circle at ${x}% ${y}%, rgba(124,58,237,0.1) 0%, transparent 60%),
        var(--card)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = 'var(--card)';
    });
  });

  /* ══════════════════════════════════════
     COUNTER ANIMATION on hero stats
  ══════════════════════════════════════ */
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(10px)';
          setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 200);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ══════════════════════════════════════
     RE-INIT LUCIDE after DOM mutations
  ══════════════════════════════════════ */
  if (window.lucide) {
    setTimeout(() => lucide.createIcons(), 100);
  }

});

/* ═══════════════════════════════════════════════════
   PATCH v2 — ver mais projetos + tilted card
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── VER MAIS projetos ── */
  const btnVerMais  = document.getElementById('btnVerMais');
  const hiddenCards = document.querySelectorAll('.project-hidden');
  let expanded = false;

  if (btnVerMais && hiddenCards.length) {
    btnVerMais.addEventListener('click', () => {
      expanded = !expanded;
      btnVerMais.classList.toggle('open', expanded);

      // Atualiza texto/ícone do botão
      const label = btnVerMais.querySelector('span');
      label.textContent = expanded ? 'Ver menos' : 'Ver mais projetos';

      hiddenCards.forEach((card, i) => {
        if (expanded) {
          card.classList.add('visible');
          // Pequeno delay para animar um por um
          setTimeout(() => card.classList.add('animated'), 50 + i * 120);
        } else {
          card.classList.remove('animated');
          setTimeout(() => card.classList.remove('visible'), 350);
        }
      });

      // Scroll suave para o novo conteúdo
      if (expanded) {
        setTimeout(() => {
          hiddenCards[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 200);
      }
    });
  }

  /* ── TILTED CARD: parar animação no hover já é feito via CSS ──
     Mas garantimos que os ícones Lucide dentro do card estejam ok */
  const tiltedCard = document.getElementById('tiltedCard');
  if (tiltedCard && window.lucide) {
    lucide.createIcons({ nodes: [tiltedCard] });
  }
});
