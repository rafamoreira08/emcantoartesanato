/* ==============================
   CHECKOUT — Em Canto Artesanato
   ============================== */
import { initCart, getCart, getCartTotal, clearCart, fmt } from './cart.js';

// URL do Cloudflare Worker (altere após o deploy do worker)
const FRETE_WORKER_URL = 'https://frete-emcanto.rafamoreira08.workers.dev';

// Frete escolhido pelo usuário
let freteEscolhido = null;

// ---- Renderizar resumo do pedido ----
function renderSummary() {
  const list  = document.getElementById('checkoutItems');
  const total = document.getElementById('checkoutTotal');
  const cart  = getCart();

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

    if (statusEl) statusEl.textContent = '';
    document.getElementById('numero')?.focus();

    // Limpa frete anterior ao trocar CEP
    freteEscolhido = null;
    const res2 = document.getElementById('freteResult');
    if (res2) res2.innerHTML = '';

  } catch {
    if (statusEl) { statusEl.textContent = 'Erro ao buscar CEP.'; statusEl.className = 'cep-status cep-status--error'; }
  }
}

// ---- Nome amigável das transportadoras ----
function serviceIcon(id) {
  const icons = { 1: '📦', 2: '⚡', 3: '📦', 17: '📦' }; // PAC, SEDEX...
  return icons[id] || '🚚';
}

// ---- Renderizar opções de frete ----
function renderOpcoesFrete(opcoes, res) {
  const validas = opcoes.filter(o => !o.error && o.price);

  if (validas.length === 0) {
    res.innerHTML = `<p class="frete-msg frete-msg--error">Não foi possível calcular o frete para este CEP. Combine por WhatsApp.</p>`;
    return;
  }

  res.innerHTML = `
    <p class="frete-label">Escolha uma opção de envio:</p>
    <div class="frete-opcoes">
      ${validas.map((o, i) => `
        <label class="frete-opcao">
          <input type="radio" name="freteOpcao" value="${i}" data-price="${o.price}" data-name="${o.name}" data-prazo="${o.delivery_time}" />
          <span class="frete-opcao__info">
            <span class="frete-opcao__nome">${serviceIcon(o.id)} ${o.name}</span>
            <span class="frete-opcao__prazo">${o.delivery_time} dias úteis</span>
          </span>
          <strong class="frete-opcao__preco">${fmt(parseFloat(o.price))}</strong>
        </label>`).join('')}
    </div>`;

  res.querySelectorAll('input[name="freteOpcao"]').forEach(radio => {
    radio.addEventListener('change', () => {
      freteEscolhido = {
        nome:  radio.dataset.name,
        preco: parseFloat(radio.dataset.price),
        prazo: radio.dataset.prazo,
      };
      updateFreteTotal();
    });
  });
}

function updateFreteTotal() {
  const freteEl = document.getElementById('checkoutFrete');
  const totalEl = document.getElementById('checkoutTotal');
  if (!freteEl || !totalEl) return;

  if (freteEscolhido) {
    freteEl.textContent = fmt(freteEscolhido.preco);
    totalEl.textContent = fmt(getCartTotal() + freteEscolhido.preco);
  }
}

// ---- Calcular frete via Cloudflare Worker ----
function bindFreteBtn() {
  const btn = document.getElementById('calcularFreteBtn');
  const res = document.getElementById('freteResult');
  if (!btn || !res) return;

  btn.addEventListener('click', async () => {
    const cep = document.getElementById('cep')?.value.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
      res.innerHTML = `<p class="frete-msg frete-msg--error">Preencha o CEP para calcular o frete.</p>`;
      return;
    }

    const cart          = getCart();
    const totalItens    = cart.reduce((s, i) => s + i.qty, 0);
    const valorDeclarado = getCartTotal();

    res.innerHTML = `<p class="frete-msg"><i class="fas fa-spinner fa-spin"></i> Calculando frete...</p>`;
    btn.disabled = true;

    try {
      const response = await fetch(FRETE_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep, totalItens, valorDeclarado }),
      });

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(data.error || 'Resposta inesperada');
      }

      renderOpcoesFrete(data, res);

    } catch (err) {
      res.innerHTML = `
        <p class="frete-msg frete-msg--error">
          Não foi possível calcular o frete agora. O valor será combinado por WhatsApp.
        </p>`;
      console.error('Frete error:', err);
    } finally {
      btn.disabled = false;
    }
  });
}

// ---- Montar mensagem WhatsApp ----
function buildWhatsAppMsg(form) {
  const cart  = getCart();
  const total = getCartTotal();

  const itens = cart.map(i =>
    `• ${i.qty}x ${i.name}${i.variation ? ` (${i.variation})` : ''} — ${fmt(i.price * i.qty)}`
  ).join('\n');

  const nome        = form.querySelector('[name="nome"]').value.trim();
  const telefone    = form.querySelector('[name="telefone"]').value.trim();
  const email       = form.querySelector('[name="email"]').value.trim();
  const cep         = form.querySelector('[name="cep"]').value.trim();
  const endereco    = form.querySelector('[name="endereco"]').value.trim();
  const numero      = form.querySelector('[name="numero"]').value.trim();
  const complemento = form.querySelector('[name="complemento"]').value.trim();
  const bairro      = form.querySelector('[name="bairro"]').value.trim();
  const cidade      = form.querySelector('[name="cidade"]').value.trim();
  const estado      = form.querySelector('[name="estado"]').value.trim();

  const enderecoFull = [
    `${endereco}, ${numero}`,
    complemento,
    `${bairro} — ${cidade} / ${estado}`,
    `CEP: ${cep}`
  ].filter(Boolean).join('\n');

  const freteInfo = freteEscolhido
    ? `🚚 *Frete (${freteEscolhido.nome}, ${freteEscolhido.prazo} dias úteis):* ${fmt(freteEscolhido.preco)}`
    : `🚚 *Frete:* A combinar`;

  const totalFinal = freteEscolhido
    ? `💳 *Total com frete:* ${fmt(total + freteEscolhido.preco)}`
    : `💰 *Subtotal:* ${fmt(total)}`;

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
    freteInfo,
    totalFinal,
    ``,
    `_(Pedido feito pelo site emcantoartesanato.com.br)_`
  ].filter(s => s !== null && s !== undefined && s !== '').join('\n');
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
