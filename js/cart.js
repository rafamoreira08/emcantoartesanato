/* ==============================
   CARRINHO — Em Canto Artesanato
   ============================== */

const CART_KEY = 'emcanto_cart';

// ---- Helpers de formatação ----
export const fmt = val =>
  val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ---- Estado ----
export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  _updateBadge();
  _renderItems();
}

export function addToCart(item) {
  // item: { productId, name, image, price, variation }
  const cart = getCart();
  const key  = `${item.productId}__${item.variation || 'default'}`;
  const hit  = cart.find(i => i.id === key);

  if (hit) {
    hit.qty += 1;
  } else {
    cart.push({ ...item, id: key, qty: 1 });
  }

  saveCart(cart);
  openCart();
}

export function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

export function updateQty(id, qty) {
  if (qty < 1) return removeFromCart(id);
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) { item.qty = qty; saveCart(cart); }
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  _updateBadge();
  _renderItems();
}

export function getCartTotal() {
  return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}

export function getCartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

// ---- Badge ----
function _updateBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ---- Drawer: abrir / fechar ----
export function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function _closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ---- Renderização dos itens ----
function _renderItems() {
  const body   = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body) return;

  const cart = getCart();

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Seu carrinho está vazio</p>
        <span>Explore o catálogo e adicione peças que você amou!</span>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'flex';

  body.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item__img"
           onerror="this.src='https://via.placeholder.com/72x72?text=Foto'" />
      <div class="cart-item__info">
        <p class="cart-item__name">${item.name}</p>
        ${item.variation ? `<span class="cart-item__var">${item.variation}</span>` : ''}
        <span class="cart-item__price">${fmt(item.price)}</span>
        <div class="cart-item__qty">
          <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="plus"  data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="cart-item__remove" data-id="${item.id}" aria-label="Remover">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>`).join('');

  const subtotalEl = document.getElementById('cartSubtotal');
  if (subtotalEl) subtotalEl.textContent = fmt(getCartTotal());

  body.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = getCart().find(i => i.id === btn.dataset.id);
      if (item) updateQty(btn.dataset.id, item.qty + (btn.dataset.action === 'plus' ? 1 : -1));
    });
  });

  body.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });
}

// ---- Injeção do drawer no DOM ----
function _injectDrawer() {
  if (document.getElementById('cartDrawer')) return;

  const depth = window.location.pathname
    .split('/').filter(p => p && p !== 'index.html').length;
  const base  = depth > 0 ? '../'.repeat(depth) : '';

  document.body.insertAdjacentHTML('beforeend', `
    <div class="cart-overlay" id="cartOverlay"></div>
    <aside class="cart-drawer" id="cartDrawer" aria-label="Carrinho">
      <div class="cart-drawer__header">
        <h3><i class="fas fa-shopping-bag"></i> Meu Carrinho</h3>
        <button class="cart-drawer__close" id="cartClose" aria-label="Fechar carrinho">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="cart-drawer__body" id="cartBody"></div>
      <div class="cart-drawer__footer" id="cartFooter" style="display:none">
        <div class="cart-drawer__subtotal">
          <span>Subtotal</span>
          <strong id="cartSubtotal">R$ 0,00</strong>
        </div>
        <a href="${base}checkout.html" class="btn btn--primary btn--full">
          <i class="fas fa-arrow-right"></i> Finalizar Pedido
        </a>
      </div>
    </aside>`);
}

// ---- Inicialização ----
export function initCart() {
  _injectDrawer();
  _updateBadge();
  _renderItems();

  document.getElementById('cartOverlay')?.addEventListener('click', _closeCart);
  document.getElementById('cartClose')?.addEventListener('click', _closeCart);
  document.querySelectorAll('.cart-toggle').forEach(btn =>
    btn.addEventListener('click', openCart)
  );
}
