/* ==============================
   EM CANTO ARTESANATO — JS
   ============================== */

/* --- UTILITÁRIOS --- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ==============================
   HEADER — scroll + nav mobile
   ============================== */
(function initHeader() {
  const header    = $('#header');
  const navToggle = $('#navToggle');
  const navList   = $('#navList');

  // Shadow ao rolar
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
    toggleBackToTop();
  }, { passive: true });

  // Menu mobile
  navToggle?.addEventListener('click', () => {
    const open = navToggle.classList.toggle('open');
    navList.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  // Fecha menu ao clicar num link
  $$('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navList.classList.remove('open');
    });
  });

  // Highlight do link ativo conforme seção visível
  function updateActiveLink() {
    const sections = $$('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    $$('.nav__link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  updateActiveLink();
})();

/* ==============================
   LOGO — fallback se não carregar
   ============================== */
(function initLogo() {
  const img = $('#logoImg');
  if (!img) return;
  img.addEventListener('error', () => img.classList.add('hidden'));
})();

/* ==============================
   FILTRO DE CATEGORIAS
   ============================== */
(function initCategorias() {
  const btns    = $$('.categoria-card');
  const cards   = $$('.produto-card[data-categoria]');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('categoria-card--active'));
      btn.classList.add('categoria-card--active');

      const cat = btn.dataset.cat;
      cards.forEach(card => {
        const match = cat === 'todos' || card.dataset.categoria === cat;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();

/* ==============================
   FORMULÁRIO DE CONTATO
   ============================== */
(function initForm() {
  const form = $('#contatoForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nome      = form.querySelector('[name="nome"]').value.trim();
    const produto   = form.querySelector('[name="produto"]').value;
    const mensagem  = form.querySelector('[name="mensagem"]').value.trim();
    const telefone  = form.querySelector('[name="telefone"]')?.value.trim() || '';

    if (!nome || !produto || !mensagem) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    // Monta mensagem para WhatsApp
    const texto = [
      `Olá, Sônia! 😊`,
      ``,
      `Meu nome é *${nome}*.`,
      produto !== 'outro' ? `Tenho interesse em: *${produto}*` : '',
      telefone ? `Telefone: ${telefone}` : '',
      ``,
      mensagem,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    showToast('Redirecionando para o WhatsApp… 🎉', 'success');
    form.reset();
  });
})();

/* ==============================
   TOAST DE FEEDBACK
   ============================== */
function showToast(msg, type = 'success') {
  const existing = $('.toast-msg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-msg toast-msg--${type}`;
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%) translateY(20px);
    background:${type === 'success' ? '#1A2D5E' : '#c0392b'};
    color:#fff; padding:.75rem 1.5rem; border-radius:50px;
    font-size:.9rem; font-weight:600; box-shadow:0 8px 32px rgba(0,0,0,.2);
    z-index:9999; opacity:0; transition:all .35s ease; white-space:nowrap;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ==============================
   BACK TO TOP
   ============================== */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

function toggleBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

/* ==============================
   REVEAL ON SCROLL
   ============================== */
(function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach(el => observer.observe(el));
})();

/* ==============================
   ESTATÍSTICAS — contador animado
   ============================== */
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const end   = parseInt(el.dataset.count, 10);
      const dur   = 1800;
      const step  = 16;
      const inc   = end / (dur / step);
      let cur = 0;
      const suffix = el.dataset.suffix || '';
      const timer = setInterval(() => {
        cur += inc;
        if (cur >= end) { cur = end; clearInterval(timer); }
        el.textContent = Math.floor(cur) + suffix;
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ==============================
   SMOOTH SCROLL para âncoras
   ============================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
