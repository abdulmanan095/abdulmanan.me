/* =========================================================
   ADM PORTFOLIO - FULL-PAGE BACKGROUND HI-FI ENGINE
   ========================================================= */
(function () {
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------
  // 1. SEAMLESS SPA PAGE CURTAIN WIPE (FAST MOBILE + DESKTOP)
  // ---------------------------------------------------------
  const curtain = document.createElement('div');
  curtain.className = 'adm-page-curtain';
  curtain.innerHTML = '<div class="adm-curtain-pulse"></div>';
  document.body.prepend(curtain);

  requestAnimationFrame(() => {
    curtain.classList.add('curtain-open');
  });

  // Back button (bfcache) par curtain wapis open karne ke liye
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      curtain.classList.remove('curtain-closing');
      curtain.classList.add('curtain-open');
    }
  });

  if (!prefersReduced && !isTouchDevice) {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('http') ||
        link.target === '_blank'
      ) {
        return;
      }

      link.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        e.preventDefault();
        curtain.classList.remove('curtain-open');
        curtain.classList.add('curtain-closing');
        setTimeout(() => {
          window.location.href = href;
        }, 180);
      });
    });
  }

  // ---------------------------------------------------------
  // 2. TOP NEON SCROLL PROGRESS BAR
  // ---------------------------------------------------------
  let progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scrollProgressBar';
    progressBar.className = 'scroll-progress-bar';
    document.body.prepend(progressBar);
  }

  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;

  function updateScrollProgress() {
    const currentY = window.scrollY;
    scrollVelocity = (currentY - lastScrollY) * 0.14;
    lastScrollY = currentY;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (currentY / docHeight) * 100 : 0;
    progressBar.style.width = `${pct.toFixed(1)}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ---------------------------------------------------------
  // 3. LERP DUAL-LAYER CURSOR + AMBIENT SPOTLIGHT AURA
  // ---------------------------------------------------------
  let mouseX = -9999;
  let mouseY = -9999;

  if (!isTouchDevice && !prefersReduced) {
    const spotlight = document.createElement('div');
    spotlight.className = 'adm-ambient-spotlight';

    const dot = document.createElement('div');
    dot.className = 'adm-cursor-dot';

    const ring = document.createElement('div');
    ring.className = 'adm-cursor-ring';

    document.body.append(spotlight, dot, ring);

    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let spotX = ringX;
    let spotY = ringY;

    window.addEventListener(
      'mousemove',
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      },
      { passive: true }
    );

    window.addEventListener('mousedown', () => {
      ring.classList.add('cursor-click');
      setTimeout(() => ring.classList.remove('cursor-click'), 220);
    });

    function animateCursorAndAura() {
      if (mouseX > -9000) {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        spotX += (mouseX - spotX) * 0.08;
        spotY += (mouseY - spotY) * 0.08;

        ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
        spotlight.style.transform = `translate3d(${spotX.toFixed(1)}px, ${spotY.toFixed(1)}px, 0)`;
      }
      requestAnimationFrame(animateCursorAndAura);
    }
    requestAnimationFrame(animateCursorAndAura);

    document.querySelectorAll('a, button, .filter-tab, .theme-toggle').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('cursor-link');
        ring.textContent = '';
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('cursor-link');
      });
    });

    document.querySelectorAll('.hifi-project-card, .case-study-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        ring.classList.add('cursor-card');
        ring.textContent = 'VIEW';
      });
      card.addEventListener('mouseleave', () => {
        ring.classList.remove('cursor-card');
        ring.textContent = '';
      });
    });
  }

  // ---------------------------------------------------------
  // 4. FULL-PAGE MICRO NEURAL PARTICLE CANVAS (STRICTLY IN BG)
  // ---------------------------------------------------------
  if (!prefersReduced) {
    const canvas = document.createElement('canvas');
    canvas.className = 'adm-particle-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    window.addEventListener(
      'resize',
      () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      },
      { passive: true }
    );

    const pointer = { x: -9999, y: -9999 };
    window.addEventListener(
      'mousemove',
      (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      },
      { passive: true }
    );

    document.addEventListener('mouseleave', () => {
      pointer.x = -9999;
      pointer.y = -9999;
    });

    const shockwaves = [];
    window.addEventListener('click', (e) => {
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius: 190,
        alpha: 0.45
      });
    });

    // Small, delicate micro-particles across the full viewport
    const count = isTouchDevice ? 32 : 68;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.0 + 0.85,
      isPurple: i % 2 === 0
    }));

    function drawFullPageParticles() {
      ctx.clearRect(0, 0, w, h);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      scrollVelocity *= 0.9;

      // Subtle click wave rings
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 6.5;
        sw.alpha *= 0.93;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isLight
          ? `rgba(129, 35, 207, ${sw.alpha.toFixed(3)})`
          : `rgba(109, 255, 74, ${sw.alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (sw.radius >= sw.maxRadius || sw.alpha < 0.02) {
          shockwaves.splice(s, 1);
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy - scrollVelocity * (p.r * 0.22);

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        for (let s = 0; s < shockwaves.length; s++) {
          const sw = shockwaves[s];
          const dx = p.x - sw.x;
          const dy = p.y - sw.y;
          const dist = Math.hypot(dx, dy);
          if (Math.abs(dist - sw.radius) < 24 && dist > 1) {
            p.x += (dx / dist) * 1.8;
            p.y += (dy / dist) * 1.8;
          }
        }

        // Crisp micro-dot (no bloated halo)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (isLight) {
          ctx.fillStyle = p.isPurple ? 'rgba(129, 35, 207, 0.5)' : 'rgba(5, 150, 105, 0.5)';
        } else {
          ctx.fillStyle = p.isPurple ? 'rgba(129, 35, 207, 0.72)' : 'rgba(109, 255, 74, 0.62)';
        }
        ctx.fill();

        // Fine connecting lines between nearby dots
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isLight
              ? `rgba(129, 35, 207, ${(1 - dist / 120) * 0.14})`
              : `rgba(129, 35, 207, ${(1 - dist / 120) * 0.20})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }

        // Fine interactive lines to cursor dot
        const mdx = pointer.x - p.x;
        const mdy = pointer.y - p.y;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 155) {
          p.x += mdx * 0.01;
          p.y += mdy * 0.01;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = isLight
            ? `rgba(5, 150, 105, ${(1 - mDist / 155) * 0.28})`
            : `rgba(109, 255, 74, ${(1 - mDist / 155) * 0.34})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }

      requestAnimationFrame(drawFullPageParticles);
    }
    requestAnimationFrame(drawFullPageParticles);
  }

  // ---------------------------------------------------------
  // 5. CYBER TEXT-SCRAMBLE DECODE EFFECT
  // ---------------------------------------------------------
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#%&$';

  function scrambleText(el) {
    if (el.dataset.scrambling === '1' || el.children.length > 0) return;
    const original = el.textContent;
    if (!original || original.trim().length < 2) return;
    el.dataset.scrambling = '1';

    let iteration = 0;
    const maxLen = original.length;
    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((char, idx) => {
          if (char === ' ' || char === '\n') return char;
          if (idx < iteration) return original[idx];
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join('');

      iteration += Math.max(0.45, maxLen / 22);
      if (iteration >= maxLen) {
        clearInterval(interval);
        el.textContent = original;
        el.dataset.scrambling = '0';
      }
    }, 26);
  }

  if (!prefersReduced) {
    const scrambleTargets = document.querySelectorAll(
      '.status-badge span:last-child, .live-pill span:last-child, .section-kicker, .hifi-eyebrow, .hero-eyebrow'
    );
    const scrambleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => scrambleText(entry.target), 160);
            scrambleObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    scrambleTargets.forEach((el) => scrambleObserver.observe(el));
  }

  // ---------------------------------------------------------
  // 6. CINEMA HERO ENTRANCE + CLIP-PATH SCROLL REVEAL
  // ---------------------------------------------------------
  document
    .querySelectorAll('.hero-content, .hifi-banner > .container, .about-intro-col')
    .forEach((el) => {
      if (!el.closest('.contact-hero-anim')) {
        el.classList.add('adm-hero-seq');
      }
    });

  const revealSelectors = [
    '.bento-card',
    '.srv-card',
    '.pkg-card',
    '.hifi-project-card',
    '.case-study-card',
    '.stack-col',
    '.d-stat-card',
    '.gf-region-card',
    '.timeline-item',
    '.next-card',
    '.channel-card',
    '.contact-box',
    '.about-cta-banner',
    '.pipeline-box',
    '.home-about-strip'
  ].join(',');

  const revealItems = Array.from(document.querySelectorAll(revealSelectors));

  revealItems.forEach((item) => {
    const parent = item.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter((child) =>
        child.matches(revealSelectors)
      );
      const idx = siblings.indexOf(item);
      if (idx > 0) {
        item.style.setProperty('--stagger-delay', `${Math.min(idx * 95, 380)}ms`);
      }
    }
    item.classList.add('adm-hifi-reveal');
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('adm-in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -25px 0px' }
  );

  revealItems.forEach((el) => revealObserver.observe(el));

  // ---------------------------------------------------------
  // 7. 3D PHYSICS CARD TILT + HOLOGRAPHIC GLARE + MAGNETIC NAV
  // ---------------------------------------------------------
  if (!isTouchDevice && !prefersReduced) {
    const tiltSelectors = [
      '.bento-card',
      '.srv-card',
      '.pkg-card',
      '.hifi-project-card',
      '.case-study-card',
      '.stack-col',
      '.d-stat-card',
      '.gf-region-card',
      '.next-card',
      '.channel-card'
    ].join(',');

    document.querySelectorAll(tiltSelectors).forEach((card) => {
      card.classList.add('adm-tilt-card');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5.5;
        const rotateY = ((x - centerX) / centerX) * 5.5;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        card.style.setProperty('--glare-x', `${x}px`);
        card.style.setProperty('--glare-y', `${y}px`);
        card.style.setProperty('--glare-opacity', '1');
        card.style.transition = 'transform 0.08s ease-out, border-color 0.3s ease, box-shadow 0.3s ease';
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--glare-opacity', '0');
        card.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });

    document
      .querySelectorAll('.liquid-btn:not(.magnetic-btn), .outline-btn:not(.magnetic-btn), .pkg-btn, header nav a')
      .forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translate3d(0, 0, 0)';
        });
      });
  }

  // ---------------------------------------------------------
  // 8. CLICK SHOCKWAVE RIPPLES ON ALL BUTTONS
  // ---------------------------------------------------------
  document.querySelectorAll('.liquid-btn, .outline-btn, .pkg-btn, .filter-tab').forEach((btn) => {
    btn.classList.add('adm-ripple-host');
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'adm-click-ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // ---------------------------------------------------------
  // 9. ANIMATED TELEMETRY STAT COUNTERS
  // ---------------------------------------------------------
  const statElements = document.querySelectorAll(
    '.d-stat-card strong, .a-metric-box strong, .metric-item strong'
  );

  function animateStatValue(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\D*)(\d+)(.*)$/);
    if (!match) return;

    const prefix = match[1];
    const target = parseInt(match[2], 10);
    const suffix = match[3];
    const padZero = match[2].length > 1 && match[2].startsWith('0');
    const duration = 1250;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);
      const formatted = padZero && current < 10 ? `0${current}` : `${current}`;
      el.textContent = `${prefix}${formatted}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = raw;
      }
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStatValue(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  statElements.forEach((el) => counterObserver.observe(el));

  // ---------------------------------------------------------
  // 10. PROJECTS PAGE 3D FLIP FILTER TRANSITION
  // ---------------------------------------------------------
  const filterTabs = document.querySelectorAll('#projectFilters .filter-tab');
  if (filterTabs.length) {
    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#projectsGrid .hifi-project-card').forEach((card) => {
          if (card.style.display !== 'none') {
            card.classList.remove('filter-pop');
            void card.offsetWidth;
            card.classList.add('filter-pop');
          }
        });
      });
    });
  }
})();