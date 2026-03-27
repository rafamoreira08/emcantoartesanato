/* ==============================
   RASTREAR PEDIDO — Em Canto Artesanato
   ============================== */
import { db } from './firebase-config.js';
import { doc, getDoc }
  from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '';

const STATUS_INFO = {
  'pedido-realizado':     { label: 'Pedido Realizado',     icon: 'fa-shopping-cart' },
  'pagamento-confirmado': { label: 'Pagamento Confirmado', icon: 'fa-check-circle'  },
  'em-producao':          { label: 'Em Produção',          icon: 'fa-cut'           },
  'despachado':           { label: 'Despachado',           icon: 'fa-truck'         },
  'entregue':             { label: 'Entregue',             icon: 'fa-gift'          },
};

const STATUS_FLOW = {
  'pronta-entrega': ['pedido-realizado', 'pagamento-confirmado', 'despachado', 'entregue'],
  'encomenda':      ['pedido-realizado', 'pagamento-confirmado', 'em-producao', 'despachado', 'entregue'],
};

function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function renderTimeline(order) {
  const flow    = STATUS_FLOW[order.type] || STATUS_FLOW['encomenda'];
  const current = order.status;
  const curIdx  = flow.indexOf(current);

  // Mapeia status → timeline entry (pode ter nota/data)
  const timelineMap = {};
  (order.timeline || []).forEach(t => { timelineMap[t.status] = t; });

  return flow.map((status, i) => {
    const info  = STATUS_INFO[status] || { label: status, icon: 'fa-circle' };
    const entry = timelineMap[status];
    const state = i < curIdx ? 'done' : i === curIdx ? 'current' : 'pending';

    return `
      <div class="tl-step ${state}">
        <div class="tl-dot"><i class="fas ${info.icon}"></i></div>
        <div class="tl-body">
          <div class="tl-label">${info.label}</div>
          ${entry?.ts ? `<div class="tl-date">${formatDate(entry.ts)}</div>` : ''}
          ${entry?.note ? `<div class="tl-note">${entry.note}</div>` : ''}
        </div>
      </div>`;
  }).join('');
}

async function lookupOrder(rawCode) {
  const code = rawCode.trim().toUpperCase();
  const errEl = document.getElementById('trackError');
  const resEl = document.getElementById('trackResult');
  errEl.textContent = '';
  resEl.style.display = 'none';

  if (!code || code.length < 7) {
    errEl.textContent = 'Digite um código válido (ex: EC26-K3BN).';
    return;
  }

  const btn = document.getElementById('trackBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';

  try {
    const snap = await getDoc(doc(db, 'orders', code));

    if (!snap.exists()) {
      errEl.textContent = 'Pedido não encontrado. Verifique o código e tente novamente.';
      return;
    }

    const order = snap.data();

    // Preencher header
    document.getElementById('resCode').textContent = order.code;

    const badge = document.getElementById('resBadge');
    if (order.type === 'pronta-entrega') {
      badge.textContent = '⚡ Pronta Entrega';
      badge.className   = 'order-badge order-badge--pe';
    } else {
      badge.textContent = '✂️ Encomenda';
      badge.className   = 'order-badge order-badge--enc';
    }

    // Itens
    const itemsEl = document.getElementById('resItems');
    itemsEl.innerHTML = (order.items || []).map(i =>
      `<li>• ${i.qty}x ${i.name}${i.variation ? ` (${i.variation})` : ''} — ${fmt(i.price * i.qty)}</li>`
    ).join('');

    // Código de rastreio dos Correios
    const tcBox = document.getElementById('resTrackingCode');
    if (order.trackingCode) {
      document.getElementById('resTrackingCodeVal').textContent = order.trackingCode;
      tcBox.style.display = 'flex';
    } else {
      tcBox.style.display = 'none';
    }

    // Timeline
    document.getElementById('resTimeline').innerHTML = renderTimeline(order);

    resEl.style.display = 'block';
    resEl.scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    errEl.textContent = 'Erro ao buscar o pedido. Tente novamente.';
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-search"></i> Buscar';
  }
}

// ---- Boot ----
document.getElementById('trackBtn')?.addEventListener('click', () => {
  lookupOrder(document.getElementById('trackInput').value);
});

document.getElementById('trackInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') lookupOrder(e.target.value);
});

// Nav mobile
const toggle = document.getElementById('navToggle');
const list   = document.getElementById('navList');
toggle?.addEventListener('click', () => {
  toggle.classList.toggle('open');
  list?.classList.toggle('open');
});

// Auto-busca se código vier na URL (?codigo=EC26-XXXX)
const urlCode = new URLSearchParams(window.location.search).get('codigo');
if (urlCode) {
  document.getElementById('trackInput').value = urlCode;
  lookupOrder(urlCode);
}
