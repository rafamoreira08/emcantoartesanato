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
      .filter(p => p.active);

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

// ---- Renderizar card de produto ----
function renderCard(p) {
  const hasVariations = p.variations?.length > 0;

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

  const prontaBadge = p.isReadyToShip
    ? `<span class="produto-card__badge-pe"><i class="fas fa-box-open"></i> Pronta Entrega</span>`
    : '';

  const imgSrc = cloudinaryOriginal(p.image) || 'https://via.placeholder.com/400x600?text=Em+breve';

  return `
    <article class="produto-card" data-id="${p.id}" data-base="${p.basePrice || 0}">
      <div class="produto-card__img-wrap">
        <div class="produto-card__img">
          <img src="${imgSrc}"
               alt="${p.name}"
               onerror="this.src='https://via.placeholder.com/400x600?text=Foto'" />
        </div>
        <span class="produto-card__badge">${categoryLabel(category === 'pronta-entrega' ? p.category : category)}</span>
        ${prontaBadge}
      </div>
      <div class="produto-card__body">
        <h3 class="produto-card__name">${p.name}</h3>
        <p class="produto-card__desc">${p.description || ''}</p>
        ${variationsHtml}
        <div class="produto-card__footer">
          <p class="produto-card__price">
            <span class="prod-price-display">${fmt(p.basePrice || 0)}</span>
          </p>
          <button class="btn btn--primary btn--full btn-add-cart"
                  data-id="${p.id}"
                  data-name="${p.name}"
                  data-image="${p.image || ''}"
                  data-price="${p.basePrice || 0}">
            <i class="fas fa-shopping-bag"></i> Adicionar ao Carrinho
          </button>
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
