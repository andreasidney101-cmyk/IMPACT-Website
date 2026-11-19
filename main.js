// Bilingual language switch (English / French), remembered across pages
const langButton = document.getElementById('language');
let lang = 'en';
try { lang = localStorage.getItem('impact-lang') || 'en'; } catch (e) {}

function applyLanguage() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en][data-fr]').forEach((element) => {
    element.innerHTML = element.getAttribute('data-' + lang);
  });
  langButton.textContent = lang === 'en' ? 'FR' : 'EN';
}

langButton.addEventListener('click', () => {
  lang = lang === 'en' ? 'fr' : 'en';
  try { localStorage.setItem('impact-lang', lang); } catch (e) {}
  applyLanguage();
});

if (lang !== 'en') applyLanguage();

// Highlight the current page in the menu
const page = document.body.getAttribute('data-page');
document.querySelectorAll('nav a[data-page]').forEach((a) => {
  if (a.getAttribute('data-page') === page) a.classList.add('active');
});

// Touch screens: first tap on "About" opens the menu, second tap follows the link
document.querySelectorAll('.dropdown > a').forEach((link) => {
  link.addEventListener('click', (e) => {
    const dd = link.parentElement;
    if (window.matchMedia('(hover: none)').matches && !dd.classList.contains('open')) {
      e.preventDefault();
      dd.classList.add('open');
    }
  });
});

// Automatically display the current year in the footer
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Story pages: reveal elements when they scroll into view =====
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add('visible'));
}

// ===== Story pages: the welcome text gently shrinks and fades as you scroll =====
const heroInner = document.querySelector('.story-hero-inner');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroInner && !reduceMotion) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const hero = heroInner.parentElement;
      const progress = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
      heroInner.style.transform = 'scale(' + (1 - progress * 0.12) + ') translateY(' + (progress * -40) + 'px)';
      heroInner.style.opacity = String(1 - progress * 1.1);
      ticking = false;
    });
  }, { passive: true });
}

// ===== Copy buttons (e.g. server addresses) =====
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      ta.remove();
    }
    const original = btn.textContent;
    btn.textContent = (document.documentElement.lang === 'fr') ? 'Copié ✓' : 'Copied ✓';
    btn.classList.add('done');
    setTimeout(() => { btn.textContent = original; btn.classList.remove('done'); }, 1600);
  });
});

// ===== Guide: side dots show which section you are reading =====
const sideDots = document.querySelector('.side-dots');
if (sideDots && 'IntersectionObserver' in window) {
  const links = sideDots.querySelectorAll('a');
  const targets = [...links].map((a) => document.getElementById(a.dataset.target)).filter(Boolean);
  const contents = document.getElementById('sommaire');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((a) => a.classList.toggle('active', a.dataset.target === entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach((el) => sectionObserver.observe(el));
  // show the dots only after the contents block
  window.addEventListener('scroll', () => {
    const past = contents && contents.getBoundingClientRect().bottom < window.innerHeight * 0.5;
    sideDots.classList.toggle('show', !!past);
  }, { passive: true });
}

// Smooth scrolling for links inside the page
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ===== Tabs (contact directory) =====
document.querySelectorAll('.tabs-wrap').forEach((wrap) => {
  wrap.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      wrap.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b === tab));
      wrap.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('active', p.id === tab.dataset.tab));
    });
  });
});

// ===== Team: researcher cards open a detail window =====
document.querySelectorAll('[data-open]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const d = document.getElementById(btn.dataset.open);
    if (d && d.showModal) d.showModal();
  });
});
document.querySelectorAll('.pi-dialog').forEach((d) => {
  d.querySelector('.pi-close').addEventListener('click', () => d.close());
  d.addEventListener('click', (e) => { if (e.target === d) d.close(); });   // click outside to close
});
