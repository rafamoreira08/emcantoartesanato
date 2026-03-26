/* ==============================
   CHECKOUT — Em Canto Artesanato
   ============================== */
import { initCart, getCart, getCartTotal, clearCart, fmt } from './cart.js';

// ---- Renderizar resumo do pedido ----
function renderSummary() {
  const list    = document.getElementById('checkoutItems');
  const total   = document.getElementById('checkoutTotal');
  const cart    = getCart();

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `<p class="checkout-empty">Seu carrinho está vazio. <a href="index.html">Voltar ao catálogo</a></p>`;
    document.getElementById('checkoutForm')?.setAttribute('hidden', '');
    return;
  }

  list.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <img src="${item.image}" alt="${item.name}"
           onerror="this.src='https://via.placeholder.com/56x56?text=Foto'" />
      <div class="checkout-item__info">
        <p>${item.name}</p>
        ${item.variation ? `<span>${item.variation}</span>` : ''}
        <span class="checkout-item__qty">Qtd: ${item.qty}</span>
      </div>
      <strong>${fmt(item.price * item.qty)}</strong>
    </div>`).join('');

  if (total) total.textContent = fmt(getCartTotal());
}

// ---- CEP → preenchimento automático via ViaCEP ----
async function lookupCep(cep) {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return;

  const statusEl = document.getElementById('cepStatus');
  if (statusEl) { statusEl.textContent = 'Buscando...'; statusEl.className = 'cep-status'; }

  try {
    const res  = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    const data = await res.json();

    if (data.erro) {
      if (statusEl) { statusEl.textContent = 'CEP não encontrado.'; statusEl.className = 'cep-status cep-status--error'; }
      return;
    }

    document.getElementById('endereco').value = data.logradouro || '';
    document.getElementById('bairro').value   = data.bairro     || '';
    document.getElementById('cidade').value   = data.localidade || '';
    document.getElementById('estado').value   = data.uf         || '';

    if (statusEl) { statusEl.textContent = ''; }
    document.getElementById('numero')?.focus();

  } catch {
    if (statusEl) { statusEl.textContent = 'Erro ao buscar CEP.'; statusEl.className = 'cep-status cep-status--error'; }
  }
}

// ---- Calcular frete (placeholder — Melhor Envio em breve) ----
function bindFreteBtn() {
  const btn = document.getElementById('calcularFreteBtn');
  const res = document.getElementById('freteResult');
  if (!btn || !res) return;

  btn.addEventListener('click', () => {
    const cep = document.getElementById('cep')?.value.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
      res.innerHTML = `<p class="frete-msg frete-msg--error">Preencha o CEP para calcular o frete.</p>`;
      return;
    }
    res.innerHTML = `
      <div class="frete-placeholder">
        <i class="fas fa-truck"></i>
        <div>
          <strong>Cálculo de frete em breve</strong>
          <span>A integração com Melhor Envio será ativada em breve. O frete será combinado por WhatsApp.</span>
        </div>
      </div>`;
  });
}

// ---- Montar mensagem WhatsApp ----
function buildWhatsAppMsg(form) {
  const cart  = getCart();
  const total = getCartTotal();

  const itens = cart.map(i =>
    `• ${i.qty}x ${i.name}${i.variation ? ` (${i.variation})` : ''} — ${fmt(i.price * i.qty)}`
  ).join('\n');

  const nome       = form.querySelector('[name="nome"]').value.trim();
  const telefone   = form.querySelector('[name="telefone"]').value.trim();
  const email      = form.querySelector('[name="email"]').value.trim();
  const cep        = form.querySelector('[name="cep"]').value.trim();
  const endereco   = form.querySelector('[name="endereco"]').value.trim();
  const numero     = form.querySelector('[name="numero"]').value.trim();
  const complemento = form.querySelector('[name="complemento"]').value.trim();
  const bairro     = form.querySelector('[name="bairro"]').value.trim();
  const cidade     = form.querySelector('[name="cidade"]').value.trim();
  const estado     = form.querySelector('[name="estado"]').value.trim();

  const enderecoFull = [
    `${endereco}, ${numero}`,
    complemento,
    `${bairro} — ${cidade} / ${estado}`,
    `CEP: ${cep}`
  ].filter(Boolean).join('\n');

  return [
    `*Novo Pedido — Em Canto Artesanato*`,
    ``,
    `👤 *Cliente:* ${nome}`,
    `📱 *WhatsApp:* ${telefone}`,
    email ? `📧 *E-mail:* ${email}` : '',
    ``,
    `📦 *Itens do Pedido:*`,
    itens,
    ``,
    `📍 *Endereço de Entrega:*`,
    enderecoFull,
    ``,
    `💰 *Subtotal:* ${fmt(total)}`,
    `🚚 *Frete:* A combinar`,
    ``,
    `_(Pedido feito pelo site emcantoartesanato.com.br)_`
  ].filter(s => s !== null && s !== undefined).join('\n');
}

// ---- Submit ----
function bindForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = buildWhatsAppMsg(form);
    const url = `https://wa.me/5531991236334?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    clearCart();
    renderSummary();
  });
}

// ---- CEP mask + lookup ----
function bindCep() {
  const input = document.getElementById('cep');
  if (!input) return;

  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
    input.value = v;
  });

  input.addEventListener('blur', () => lookupCep(input.value));
}

// ---- Boot ----
initCart();
renderSummary();
bindCep();
bindFreteBtn();
bindForm();
