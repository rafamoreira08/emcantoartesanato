/* ==============================
   CHECKOUT — Em Canto Artesanato
   ============================== */
import { initCart, getCart, getCartTotal, clearCart, fmt } from './cart.js';
import { db } from './firebase-config.js';
import { doc, setDoc, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const FRETE_WORKER_URL = 'https://frete-emcanto.rafamoreira08.workers.dev';

// IDs preferidos: PAC(1), SEDEX(2), Jadlog Package(7), Jadlog.com(6), Azul(9)
const PREFERRED_IDS = [1, 2, 7, 6, 9, 3, 4, 17];

let freteEscolhido = null;

// ---- Código do pedido: EC26-XXXX ----
function generateOrderCode() {
  const year  = new Date().getFullYear().toString().slice(-2);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix  = '';
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `EC${year}-${suffix}`;
}

// ---- Resumo do pedido ----
function renderSummary() {
  const list  = document.getElementById('checkoutItems');
  const total = document.getElementById('checkoutTotal');
  const cart  = getCart();

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `<p class="checkout-empty">Seu carrinho está vazio. <a href="index.html">Voltar ao início</a></p>`;
    document.getElementById('checkoutForm')?.setAttribute('hidden', '');
    return;
  }

  list.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <img src="${item.image || ''}" alt="${item.name}"
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

// ---- CEP → preenchimento automático ----
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

    freteEscolhido = null;
    const res2 = document.getElementById('freteResult');
    if (res2) res2.innerHTML = '';

  } catch {
    if (statusEl) { statusEl.textContent = 'Erro ao buscar CEP.'; statusEl.className = 'cep-status cep-status--error'; }
  }
}

// ---- Renderizar opções de frete (máx 3) ----
function renderOpcoesFrete(opcoes, el) {
  // Filtrar válidas → ordenar por preferência e preço → pegar 3
  const validas = opcoes.filter(o => !o.error && o.price != null);

  const sorted = validas.sort((a, b) => {
    const ai = PREFERRED_IDS.indexOf(a.id);
    const bi = PREFERRED_IDS.indexOf(b.id);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return parseFloat(a.price) - parseFloat(b.price);
  }).slice(0, 3);

  if (sorted.length === 0) {
    el.innerHTML = `<p class="frete-msg frete-msg--error">Nenhuma opção de frete disponível para este CEP. Combine por WhatsApp.</p>`;
    return;
  }

  el.innerHTML = `
    <p class="frete-label"><i class="fas fa-truck"></i> Escolha o envio:</p>
    <div class="frete-opcoes">
      ${sorted.map((o, i) => `
        <label class="frete-opcao">
          <input type="radio" name="freteOpcao" value="${i}"
            data-price="${o.price}" data-name="${o.name}" data-prazo="${o.delivery_time}" />
          <span class="frete-opcao__info">
            <span class="frete-opcao__nome">${o.name}</span>
            <span class="frete-opcao__prazo">${o.delivery_time} dias úteis</span>
          </span>
          <strong class="frete-opcao__preco">${fmt(parseFloat(o.price))}</strong>
        </label>`).join('')}
    </div>`;

  el.querySelectorAll('input[name="freteOpcao"]').forEach(radio => {
    radio.addEventListener('change', () => {
      freteEscolhido = {
        nome:  radio.dataset.name,
        preco: parseFloat(radio.dataset.price),
        prazo: radio.dataset.prazo,
      };
      updateTotais();
    });
  });
}

function updateTotais() {
  const freteEl = document.getElementById('checkoutFreteVal');
  const totalEl = document.getElementById('checkoutTotal');
  if (!freteEl || !totalEl) return;
  if (freteEscolhido) {
    freteEl.textContent = fmt(freteEscolhido.preco);
    totalEl.textContent = fmt(getCartTotal() + freteEscolhido.preco);
  }
}

// ---- Calcular frete ----
function bindFreteBtn() {
  const btn = document.getElementById('calcularFreteBtn');
  const el  = document.getElementById('freteResult');
  if (!btn || !el) return;

  btn.addEventListener('click', async () => {
    const cep = document.getElementById('cep')?.value.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
      el.innerHTML = `<p class="frete-msg frete-msg--error">Preencha o CEP primeiro.</p>`;
      return;
    }

    const cart        = getCart();
    const totalItens  = cart.reduce((s, i) => s + i.qty, 0);
    const valorDecl   = getCartTotal();

    el.innerHTML = `<p class="frete-msg"><i class="fas fa-spinner fa-spin"></i> Calculando...</p>`;
    btn.disabled = true;

    try {
      const resp = await fetch(FRETE_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep, totalItens, valorDeclarado: valorDecl }),
      });
      const data = await resp.json();
      if (!Array.isArray(data)) throw new Error(data.error || 'Resposta inválida');
      renderOpcoesFrete(data, el);
    } catch (err) {
      el.innerHTML = `<p class="frete-msg frete-msg--error">Não foi possível calcular o frete. Combine por WhatsApp.</p>`;
      console.error('Frete:', err);
    } finally {
      btn.disabled = false;
    }
  });
}

// ---- Salvar pedido no Firestore ----
async function saveOrder(form, code) {
  const cart = getCart();
  const allReady = cart.every(i => i.isReadyToShip === true);

  const order = {
    code,
    type:   allReady ? 'pronta-entrega' : 'encomenda',
    status: 'pedido-realizado',
    customer: {
      name:  form.querySelector('[name="nome"]').value.trim(),
      phone: form.querySelector('[name="telefone"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
    },
    items: cart.map(i => ({
      id:        i.id   || '',
      name:      i.name,
      variation: i.variation || '',
      price:     i.price,
      qty:       i.qty,
      image:     i.image || '',
    })),
    address: {
      cep:         form.querySelector('[name="cep"]').value.trim(),
      endereco:    form.querySelector('[name="endereco"]').value.trim(),
      numero:      form.querySelector('[name="numero"]').value.trim(),
      complemento: form.querySelector('[name="complemento"]').value.trim(),
      bairro:      form.querySelector('[name="bairro"]').value.trim(),
      cidade:      form.querySelector('[name="cidade"]').value.trim(),
      estado:      form.querySelector('[name="estado"]').value.trim(),
    },
    freight:  freteEscolhido,
    subtotal: getCartTotal(),
    total:    getCartTotal() + (freteEscolhido?.preco || 0),
    trackingCode: '',
    timeline: [{
      status: 'pedido-realizado',
      label:  'Pedido Realizado',
      note:   '',
      ts:     new Date().toISOString(),
    }],
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'orders', code), order);
}

// ---- Mensagem WhatsApp ----
function buildWhatsAppMsg(form, code) {
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

  const endFull = [`${endereco}, ${numero}`, complemento,
    `${bairro} — ${cidade}/${estado}`, `CEP: ${cep}`].filter(Boolean).join('\n');

  const freteInfo = freteEscolhido
    ? `🚚 *Frete (${freteEscolhido.nome}, ${freteEscolhido.prazo} dias úteis):* ${fmt(freteEscolhido.preco)}\n💳 *Total com frete:* ${fmt(total + freteEscolhido.preco)}`
    : `🚚 *Frete:* A combinar\n💰 *Subtotal:* ${fmt(total)}`;

  return [
    `*Novo Pedido — Em Canto Artesanato*`,
    `🔖 *Código:* ${code}`,
    ``,
    `👤 *Cliente:* ${nome}`,
    `📱 *WhatsApp:* ${telefone}`,
    email ? `📧 *E-mail:* ${email}` : '',
    ``,
    `📦 *Itens:*`,
    itens,
    ``,
    `📍 *Endereço:*`,
    endFull,
    ``,
    freteInfo,
    ``,
    `_(Pedido feito pelo site emcantoartesanato.com.br)_`,
  ].filter(s => s !== null && s !== undefined).join('\n');
}

// ---- Submit ----
function bindForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando pedido...';

    const code = generateOrderCode();

    // Salvar no Firestore (silencioso se falhar)
    try { await saveOrder(form, code); } catch (err) { console.warn('Firestore:', err); }

    const msg = buildWhatsAppMsg(form, code);
    clearCart();
    renderSummary();

    // Mostrar confirmação
    const conf = document.getElementById('orderConfirmation');
    if (conf) {
      document.getElementById('orderCodeDisplay').textContent = code;
      form.style.display = 'none';
      conf.style.display = 'block';
    }

    // Abrir WhatsApp após 2s
    setTimeout(() => {
      window.open(`https://wa.me/5531991236334?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    }, 2000);
  });
}

// ---- CEP mask ----
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
