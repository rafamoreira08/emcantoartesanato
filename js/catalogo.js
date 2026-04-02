/* ==============================
   CATÁLOGO — Em Canto Artesanato
   ============================== */
import { db }                                    from './firebase-config.js';
import { collection, query, where, getDocs }     from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { initCart, addToCart, fmt }              from './cart.js';

const category  = document.body.dataset.category;
const grid      = document.getElementById('produtosGrid');
const loading   = document.getElementById('catalogLoading');
const empty     = document.getElementById('catalogEmpty');
const urlParams = new URLSearchParams(window.location.search);
const catFilter = urlParams.get('cat'); // usado na página pronta-entrega

// ---- Nav: mobile menu + dropdown (para páginas de categoria) ----
(function initNav() {
  const header  = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const toggle = document.getElementById('navToggle');
  const list   = document.getElementById('navList');
  toggle?.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    list?.classList.toggle('open', open);
  });

  list?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      toggle?.classList.remove('open');
      list?.classList.remove('open');
    })
  );

  // Dropdown Pronta Entrega
  document.querySelectorAll('.nav__item--has-dropdown').forEach(item => {
    const btn = item.querySelector('.nav__dropdown-toggle');
    btn?.addEventListener('click', e => {
      e.stopPropagation();
      item.classList.toggle('open');
    });
  });
  document.addEventListener('click', () =>
    document.querySelectorAll('.nav__item--has-dropdown.open')
      .forEach(i => i.classList.remove('open'))
  );
})();

// ---- Filtros da página pronta-entrega ----
function initProntaEntregaFilters() {
  const filterBar = document.getElementById('peFilterBar');
  if (!filterBar) return;

  filterBar.querySelectorAll('.pe-filter-btn').forEach(btn => {
    const active = btn.dataset.cat === (catFilter || 'todos');
    btn.classList.toggle('pe-filter-btn--active', active);

    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      const base = window.location.pathname;
      window.location.href = cat === 'todos' ? base : `${base}?cat=${cat}`;
    });
  });
}

// ---- Carregar produtos do Firestore ----
async function loadProducts() {
  try {
    let snap;

    if (category === 'pronta-entrega') {
      snap = await getDocs(
        query(collection(db, 'products'), where('isReadyToShip', '==', true))
      );
    } else {
      snap = await getDocs(
        query(collection(db, 'products'), where('category', '==', category))
      );
    }

    let products = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.active)
      .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

    // filtro de sub-categoria na pronta-entrega
    if (category === 'pronta-entrega' && catFilter) {
      products = products.filter(p => p.category === catFilter);
    }

    loading?.remove();

    if (products.length === 0) {
      empty?.classList.remove('hidden');
      return;
    }

    grid.innerHTML = products.map(p => renderCard(p)).join('');
    bindCardEvents();

  } catch (err) {
    console.error('Erro ao carregar produtos:', err);
    loading?.remove();
    empty?.classList.remove('hidden');
  }
}

// ---- Normaliza URL do Cloudinary: remove transformações que possam cortar ----
function cloudinaryOriginal(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  // Remove qualquer bloco de transformação já inserido anteriormente
  return url.replace(/\/upload\/[^/]+\//, '/upload/');
}

// ---- Carrossel de fotos por variação ----
function renderCarousel(photos, p) {
  const prontaBadge = p.isReadyToShip
    ? `<span class="produto-card__badge-pe"><i class="fas fa-box-open"></i> Pronta Entrega</span>` : '';

  const slides = photos.map((ph, i) => {
    const captionParts = [ph.color ? `Cor: ${ph.color}` : '', ph.thread ? `Fio: ${ph.thread}` : ''].filter(Boolean);
    const caption = captionParts.join('\n');
    return `
      <div class="pcarousel__slide${i === 0 ? ' pcarousel__slide--active' : ''}">
        <img src="${cloudinaryOriginal(ph.url)}"
             alt="${caption || p.name}"
             loading="${i === 0 ? 'eager' : 'lazy'}"
             onerror="this.src='https://via.placeholder.com/400x400?text=Foto'" />
        ${caption ? `<div class="pcarousel__caption">${caption}</div>` : ''}
      </div>`;
  }).join('');

  const dots = photos.map((_, i) =>
    `<button class="pcarousel__dot${i === 0 ? ' pcarousel__dot--active' : ''}" data-goto="${i}" aria-label="Foto ${i+1}"></button>`
  ).join('');

  return `
    <div class="produto-card__img-wrap">
      <div class="pcarousel" data-idx="0">
        <div class="pcarousel__track">${slides}</div>
        <button class="pcarousel__btn pcarousel__btn--prev" aria-label="Anterior">&#8249;</button>
        <button class="pcarousel__btn pcarousel__btn--next" aria-label="Próxima">&#8250;</button>
        <div class="pcarousel__dots">${dots}</div>
      </div>
      ${prontaBadge}
    </div>`;
}

// ---- Renderizar card de produto ----
function renderCard(p) {
  const photos        = (p.photos || []).filter(ph => ph.url);
  const hasCarousel   = photos.length > 1;
  const hasVariations = p.variations?.length > 0;
  const catLabel      = categoryLabel(category === 'pronta-entrega' ? p.category : category);

  const prontaBadge = p.isReadyToShip
    ? `<span class="produto-card__badge-pe"><i class="fas fa-box-open"></i> Pronta Entrega</span>` : '';

  const variationsHtml = hasVariations
    ? p.variations.map((v, vi) => `
        <div class="prod-variations">
          <label class="prod-variations__label">${v.name}:</label>
          <div class="prod-variations__opts">
            ${v.options.map((opt, oi) => `
              <button class="var-btn ${oi === 0 ? 'var-btn--active' : ''}"
                      data-vi="${vi}" data-oi="${oi}"
                      data-adjust="${opt.priceAdjust || 0}">
                ${opt.label}
              </button>`).join('')}
          </div>
        </div>`).join('')
    : '';

  const imgSection = hasCarousel
    ? renderCarousel(photos, p)
    : `<div class="produto-card__img-wrap">
        <div class="produto-card__img">
          <img src="${cloudinaryOriginal(photos[0]?.url || p.image) || 'https://via.placeholder.com/400x400?text=Em+breve'}"
               alt="${p.name}"
               onerror="this.src='https://via.placeholder.com/400x400?text=Foto'" />
        </div>
        ${prontaBadge}
       </div>`;

  return `
    <article class="produto-card" data-id="${p.id}" data-base="${p.basePrice || 0}">
      ${imgSection}
      <div class="produto-card__body">
        <h3 class="produto-card__name">${p.name}</h3>
        <p class="produto-card__desc">${p.description || ''}</p>
        ${variationsHtml}
        <div class="produto-card__footer">
          <p class="produto-card__price">
            <span class="prod-price-display">${fmt(p.basePrice || 0)}</span>
          </p>
          ${category === 'pronta-entrega'
            ? `<button class="btn btn--primary btn--full btn-add-cart"
                       data-id="${p.id}"
                       data-name="${p.name}"
                       data-image="${photos[0]?.url || p.image || ''}"
                       data-price="${p.basePrice || 0}">
                 <i class="fas fa-shopping-bag"></i> Adicionar ao Carrinho
               </button>`
            : `<a href="https://wa.me/5531991236334?text=Olá%20Sônia!%20Tenho%20interesse%20em%20${encodeURIComponent(p.name)}."
                  target="_blank"
                  class="btn btn--whatsapp btn--full">
                 <i class="fab fa-whatsapp"></i> Faça sua Encomenda
               </a>`
          }
        </div>
      </div>
    </article>`;
}

function categoryLabel(cat) {
  const map = {
    'colares':          'Colares e Chokers',
    'bolsas':           'Bolsas',
    'centros-de-mesa':  'Centros de Mesa',
    'pronta-entrega':   'Pronta Entrega'
  };
  return map[cat] || cat;
}

// ---- Eventos dos cards ----
function bindCardEvents() {

  // Carrossel
  grid.querySelectorAll('.pcarousel').forEach(car => {
    const slides = car.querySelectorAll('.pcarousel__slide');
    const dots   = car.querySelectorAll('.pcarousel__dot');
    if (slides.length < 2) return;

    function goTo(idx) {
      const cur = parseInt(car.dataset.idx) || 0;
      slides[cur].classList.remove('pcarousel__slide--active');
      dots[cur]?.classList.remove('pcarousel__dot--active');
      const next = (idx + slides.length) % slides.length;
      slides[next].classList.add('pcarousel__slide--active');
      dots[next]?.classList.add('pcarousel__dot--active');
      car.dataset.idx = next;
    }

    let autoTimer = setInterval(() => goTo((parseInt(car.dataset.idx)||0) + 1), 4000);
    const stopAuto  = () => clearInterval(autoTimer);
    const startAuto = () => { stopAuto(); autoTimer = setInterval(() => goTo((parseInt(car.dataset.idx)||0) + 1), 4000); };

    car.addEventListener('mouseenter', stopAuto);
    car.addEventListener('mouseleave', startAuto);

    car.querySelector('.pcarousel__btn--prev')?.addEventListener('click', e => { e.preventDefault(); startAuto(); goTo((parseInt(car.dataset.idx)||0) - 1); });
    car.querySelector('.pcarousel__btn--next')?.addEventListener('click', e => { e.preventDefault(); startAuto(); goTo((parseInt(car.dataset.idx)||0) + 1); });
    dots.forEach((dot, i) => dot.addEventListener('click', e => { e.preventDefault(); startAuto(); goTo(i); }));
  });

  grid.querySelectorAll('.var-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.produto-card');
      const vi   = btn.dataset.vi;

      card.querySelectorAll(`.var-btn[data-vi="${vi}"]`).forEach(b =>
        b.classList.remove('var-btn--active')
      );
      btn.classList.add('var-btn--active');

      const base   = parseFloat(card.dataset.base) || 0;
      const adjust = Array.from(card.querySelectorAll('.var-btn--active'))
        .reduce((s, b) => s + parseFloat(b.dataset.adjust || 0), 0);

      card.querySelector('.prod-price-display').textContent = fmt(base + adjust);
    });
  });

  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.produto-card');

      const selectedVars = Array.from(card.querySelectorAll('.var-btn--active'))
        .map((b, i) => {
          const label = card.querySelectorAll('.prod-variations__label')[parseInt(b.dataset.vi)];
          return `${label?.textContent?.replace(':', '') || 'Opção'}: ${b.textContent.trim()}`;
        });

      const priceAdjust = Array.from(card.querySelectorAll('.var-btn--active'))
        .reduce((s, b) => s + parseFloat(b.dataset.adjust || 0), 0);

      addToCart({
        productId: btn.dataset.id,
        name:      btn.dataset.name,
        image:     btn.dataset.image,
        price:     parseFloat(btn.dataset.price) + priceAdjust,
        variation: selectedVars.join(' | ')
      });
    });
  });
}

// ---- Boot ----
initCart();
initProntaEntregaFilters();
loadProducts();
