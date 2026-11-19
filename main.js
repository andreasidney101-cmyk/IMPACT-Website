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
