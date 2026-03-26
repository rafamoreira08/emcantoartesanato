/* ==============================
   CATÁLOGO — Em Canto Artesanato
   ============================== */
import { db }                              from './firebase-config.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { initCart, addToCart, fmt }        from './cart.js';

const category = document.body.dataset.category;
const grid     = document.getElementById('produtosGrid');
const loading  = document.getElementById('catalogLoading');
const empty    = document.getElementById('catalogEmpty');

// ---- Carregar produtos do Firestore ----
async function loadProducts() {
  try {
    const snap = await getDocs(
      query(collection(db, 'products'), where('category', '==', category))
    );

    const products = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.active);

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

  return `
    <article class="produto-card" data-id="${p.id}" data-base="${p.basePrice || 0}">
      <div class="produto-card__img-wrap">
        <div class="produto-card__img">
          <img src="${p.image || 'https://via.placeholder.com/400x300?text=Em+breve'}"
               alt="${p.name}"
               onerror="this.src='https://via.placeholder.com/400x300?text=Foto'" />
        </div>
        <span class="produto-card__badge">${categoryLabel(category)}</span>
      </div>
      <div class="produto-card__body">
        <h3 class="produto-card__name">${p.name}</h3>
        <p class="produto-card__desc">${p.description || ''}</p>
        ${variationsHtml}
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
    </article>`;
}

function categoryLabel(cat) {
  const map = {
    'colares':          'Colares',
    'bolsas':           'Bolsas',
    'centros-de-mesa':  'Centros de Mesa'
  };
  return map[cat] || cat;
}

// ---- Eventos dos cards ----
function bindCardEvents() {
  // Botões de variação: atualiza preço exibido
  grid.querySelectorAll('.var-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card    = btn.closest('.produto-card');
      const vi      = btn.dataset.vi;

      // Marca ativo dentro do mesmo grupo
      card.querySelectorAll(`.var-btn[data-vi="${vi}"]`).forEach(b =>
        b.classList.remove('var-btn--active')
      );
      btn.classList.add('var-btn--active');

      // Recalcula preço
      const base    = parseFloat(card.dataset.base) || 0;
      const adjust  = Array.from(card.querySelectorAll('.var-btn--active'))
        .reduce((s, b) => s + parseFloat(b.dataset.adjust || 0), 0);

      card.querySelector('.prod-price-display').textContent = fmt(base + adjust);
    });
  });

  // Botão adicionar ao carrinho
  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.produto-card');

      // Coleta variações selecionadas
      const selectedVars = Array.from(card.querySelectorAll('.var-btn--active'))
        .map(b => {
          const varGroup = card.querySelector(`.prod-variations:nth-of-type(${parseInt(b.dataset.vi) + 1}) .prod-variations__label`);
          return `${varGroup?.textContent?.replace(':', '') || 'Opção'}: ${b.textContent.trim()}`;
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
loadProducts();
