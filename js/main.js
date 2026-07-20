document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initContactForm();
});

function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const mobile = document.querySelector('.nav__mobile');
  const hero = document.querySelector('.hero, .page-hero');
  if (!nav) return;

  const update = () => {
    const onHero = hero ? hero.getBoundingClientRect().bottom > 70 : window.scrollY < 100;
    nav.classList.toggle('nav--dark', onHero);
    nav.classList.toggle('nav--light', !onHero);
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

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

  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 0.08}s`;
    observer.observe(el);
  });
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
    const body = encodeURIComponent(`Nimi: ${name}\nYhteystieto: ${contact}\n\nViesti:\n${message}`);
    window.location.href = `mailto:khs@khs.fi?subject=${subject}&body=${body}`;
  });
}
