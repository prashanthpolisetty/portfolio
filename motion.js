/**
 * motion.js — behaviour patch for app.js
 * Load AFTER app.js:  <script src="motion.js"></script>
 *
 * - initTypingEffect / initProjectFilters REPLACE the versions in app.js.
 *   app.js calls them by name on DOMContentLoaded, and this file re-binds
 *   those global names, so app.js needs no edits.
 * - Adds: navbar scrolled state, scroll-spy (app.js styles `.nav-item.active`
 *   but never sets it), project-card cursor spotlight.
 */
(function () {
  'use strict';

  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealSelectors = [
    '.section-header',
    '.principle',
    '.about-card',
    '.skill-category',
    '.project-card',
    '.timeline-item',
    '.certifications-box',
    '.terminal-window',
    '.contact-card',
    '.contact-form-container',
    '.footer-content'
  ].join(',');

  /* ------------------------------------------------------------------
     1. Typing effect (replaces app.js)
     - starts from the text already in the HTML (no flash-to-empty on load)
     - pauses while the tab is hidden
     - reduced motion: static first role, no loop
     ------------------------------------------------------------------ */
  window.initTypingEffect = function initTypingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const roles = [
      'Autonomous GenAI & RAG Systems',
      'Agentic Commerce with PayPilot-AI',
      'High-Performance FastAPI Backends',
      'Scalable Machine Learning Pipelines'
    ];

    if (reduceMotion()) {
      el.textContent = roles[0];
      return;
    }

    let role = 0;
    let i = roles[0].length;   // HTML already shows the first role in full
    let deleting = true;       // so the first move is to delete it

    function tick() {
      if (reduceMotion()) {
        el.textContent = roles[0];
        return;
      }
      if (document.hidden) { setTimeout(tick, 500); return; }

      const text = roles[role];
      i += deleting ? -1 : 1;
      el.textContent = text.slice(0, i);

      let delay = deleting ? 30 : 60;
      if (!deleting && i === text.length) {
        delay = 1800;          // hold the full phrase
        deleting = true;
      } else if (deleting && i === 0) {
        deleting = false;
        role = (role + 1) % roles.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    }

    setTimeout(tick, 1800);
  };

  /* ------------------------------------------------------------------
     2. Project filters (replaces app.js)
     Uses the View Transitions API so cards fade / slide to their new grid
     positions. Where unsupported (or reduced motion) it is instant, as before.
     ------------------------------------------------------------------ */
  window.initProjectFilters = function initProjectFilters() {
    const buttons = Array.from(document.querySelectorAll('.filter-btn'));
    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (!buttons.length || !cards.length) return;

    buttons.forEach((b) =>
      b.setAttribute('aria-pressed', String(b.classList.contains('active')))
    );

    function applyFilter(filter) {
      cards.forEach((card) => {
        const cats = (card.getAttribute('data-category') || '').split(/\s+/);
        const show = filter === 'all' || cats.includes(filter);
        card.style.display = show ? '' : 'none';   // '' -> stylesheet's flex
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        const filter = btn.getAttribute('data-filter');

        const update = () => {
          buttons.forEach((b) => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          applyFilter(filter);
        };

        if (!document.startViewTransition || reduceMotion()) {
          update();
          return;
        }

        // Names only exist for the duration of the transition.
        cards.forEach((c, n) => { c.style.viewTransitionName = 'proj-' + n; });
        const t = document.startViewTransition(update);
        t.finished.finally(() => {
          cards.forEach((c) => { c.style.viewTransitionName = ''; });
        });
      });
    });
  };

  /* ------------------------------------------------------------------
     3. Navbar: transparent at the top, solid once scrolled
     ------------------------------------------------------------------ */
  function initNavState() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ------------------------------------------------------------------
     4. Scroll-spy: mark the nav link for the section in view
     ------------------------------------------------------------------ */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;

    const links = Array.from(document.querySelectorAll('.nav-item'));
    const byId = new Map();
    links.forEach((a) => {
      const id = (a.getAttribute('href') || '').split('#')[1];
      if (id) byId.set(id, a);
    });

    const targets = ['hero'].concat(Array.from(byId.keys()))
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    // A thin band around the middle of the viewport decides "current".
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove('active'));
        const link = byId.get(entry.target.id);   // undefined for #hero
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    targets.forEach((t) => io.observe(t));
  }

  /* ------------------------------------------------------------------
     5. Project-card spotlight (fine pointers only; CSS reads --mx/--my)
     ------------------------------------------------------------------ */
  function initCardSpotlight() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', e.clientX - r.left + 'px');
        card.style.setProperty('--my', e.clientY - r.top + 'px');
      }, { passive: true });
    });
  }

  function initHeroNetwork() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    canvas.setAttribute('aria-hidden', 'true');

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const particles = [];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let maxDistance = 125;
    let frameId = 0;
    let lastFrame = 0;

    function resize() {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      maxDistance = width < 600 ? 112 : 158;

      const count = Math.min(112, Math.max(width < 600 ? 34 : 48, Math.round(width * height / 11200)));
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const bright = Math.random() > 0.86;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: bright ? 1.6 + Math.random() * 0.9 : 0.8 + Math.random() * 0.7,
          bright,
          violet: Math.random() > 0.58
        });
      }
      draw(0);
    }

    function draw(deltaSeconds) {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.vx * deltaSeconds;
        particle.y += particle.vy * deltaSeconds;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));
      });

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const nearby = particles[j];
          const dx = particle.x - nearby.x;
          const dy = particle.y - nearby.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance >= maxDistance) continue;

          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(nearby.x, nearby.y);
          const opacity = (1 - distance / maxDistance) * 0.17;
          context.strokeStyle = particle.violet && nearby.violet
            ? `rgba(145, 164, 248, ${opacity * 0.72})`
            : `rgba(34, 211, 238, ${opacity})`;
          context.lineWidth = 0.7;
          context.stroke();
        }

        if (particle.bright) {
          const glow = context.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius * 5
          );
          glow.addColorStop(0, particle.violet
            ? 'rgba(165, 180, 252, 0.2)'
            : 'rgba(103, 232, 249, 0.22)');
          glow.addColorStop(1, 'rgba(103, 232, 249, 0)');
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
          context.fillStyle = glow;
          context.fill();
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = particle.violet
          ? `rgba(165, 180, 252, ${particle.bright ? 0.78 : 0.38})`
          : `rgba(103, 232, 249, ${particle.bright ? 0.82 : 0.38})`;
        context.fill();
      }
    }

    function animate(timestamp) {
      frameId = 0;
      if (document.hidden || motionPreference.matches) return;
      if (timestamp - lastFrame < 33) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      const deltaSeconds = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.05) : 0;
      lastFrame = timestamp;
      draw(deltaSeconds);
      frameId = window.requestAnimationFrame(animate);
    }

    function stop() {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrame = 0;
    }

    function start() {
      stop();
      if (motionPreference.matches || document.hidden) {
        draw(0);
        return;
      }
      frameId = window.requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    document.addEventListener('visibilitychange', start);
    if (motionPreference.addEventListener) {
      motionPreference.addEventListener('change', start);
    } else if (motionPreference.addListener) {
      motionPreference.addListener(start);
    }
    start();
  }

  function initScrollReveals() {
    if (!('IntersectionObserver' in window)) return;

    const elements = Array.from(document.querySelectorAll(revealSelectors));
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px 80px 0px', threshold: 0.08 });

    const groupIndexes = new Map();
    elements.forEach((element) => {
      const group = element.parentElement;
      const index = groupIndexes.get(group) || 0;
      groupIndexes.set(group, index + 1);
      element.style.setProperty('--motion-stagger', Math.min(index, 5) * 65 + 'ms');
      element.classList.add('motion-reveal');
      observer.observe(element);
    });

    document.documentElement.classList.add('motion-ready');
  }

  function initTimelineProgress() {
    const timeline = document.querySelector('.timeline-container');
    if (!timeline || reduceMotion()) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = timeline.getBoundingClientRect();
      const travel = rect.height + window.innerHeight * 0.45;
      const progress = Math.max(0, Math.min(1,
        (window.innerHeight * 0.72 - rect.top) / travel
      ));
      timeline.style.setProperty('--timeline-progress', String(progress));
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
  }

  function initAmbientMotion() {
    document.addEventListener('visibilitychange', () => {
      document.documentElement.classList.toggle('page-hidden', document.hidden);
    });
    document.documentElement.classList.toggle('page-hidden', document.hidden);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavState();
    initScrollSpy();
    initCardSpotlight();
    initHeroNetwork();
    initScrollReveals();
    initTimelineProgress();
    initAmbientMotion();
  });
})();
