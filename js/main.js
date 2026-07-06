/* KHS LVI-Palvelu — Main interactions */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNav();
  initHeroCanvas();
  initReveal();
  initCounters();
  initContactForm();
});

function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  document.body.classList.add('loading');

  const minTime = 2200;
  const start = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minTime - elapsed);

    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      animateHeroWords();
    }, remaining);
  });

  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      animateHeroWords();
    }
  }, 4000);
}

function animateHeroWords() {
  document.querySelectorAll('.hero__title .word').forEach((word, i) => {
    word.style.animationDelay = `${2 + i * 0.12}s`;
  });
}

function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const mobile = document.querySelector('.nav__mobile');
  const hero = document.querySelector('.hero, .page-hero');
  if (!nav) return;

  const updateNav = () => {
    const scrollY = window.scrollY;
    let onHero = false;

    if (hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      onHero = heroBottom > 70;
    } else {
      onHero = scrollY < 120;
    }

    nav.classList.toggle('nav--on-hero', onHero);
    nav.classList.toggle('nav--solid', !onHero);
    nav.classList.toggle('nav--at-top', scrollY < 8);
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();

  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    canvas.style.width = canvas.offsetWidth + 'px';
    canvas.style.height = canvas.offsetHeight + 'px';
    initParticles();
  }

  function initParticles() {
    const count = Math.min(80, Math.floor(canvas.offsetWidth / 15));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4 - 0.2,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p, i) => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(77, 208, 225, ${p.opacity})`;
      ctx.fill();

      particles.slice(i + 1).forEach(p2 => {
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 180, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    resize();
    draw();
  });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    observer.observe(el);
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const contact = form.querySelector('[name="contact"]').value;
    const message = form.querySelector('[name="message"]').value;

    const subject = encodeURIComponent(`Yhteydenotto: ${name}`);
    const body = encodeURIComponent(
      `Nimi: ${name}\nYhteystieto: ${contact}\n\nViesti:\n${message}`
    );

    window.location.href = `mailto:khs@khs.fi?subject=${subject}&body=${body}`;
  });
}
