/* ==============================
   ADMIN — Em Canto Artesanato
   ============================== */
import { db, auth }                        from './firebase-config.js';
import { signInWithEmailAndPassword,
         signOut, onAuthStateChanged }     from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { collection, getDocs, addDoc,
         updateDoc, deleteDoc, doc,
         serverTimestamp }                 from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const fmt = val => val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '';

const STATUS_INFO = {
  'pedido-realizado':     { label: 'Pedido Realizado',     icon: 'fa-shopping-cart',  color: '#3A85C7' },
  'pagamento-confirmado': { label: 'Pagamento Confirmado', icon: 'fa-check-circle',   color: '#27ae60' },
  'em-producao':          { label: 'Em Produção',          icon: 'fa-cut',            color: '#f39c12' },
  'despachado':           { label: 'Despachado',           icon: 'fa-truck',          color: '#9b59b6' },
  'entregue':             { label: 'Entregue',             icon: 'fa-gift',           color: '#27ae60' },
};
const STATUS_FLOW = {
  'pronta-entrega': ['pedido-realizado', 'pagamento-confirmado', 'despachado', 'entregue'],
  'encomenda':      ['pedido-realizado', 'pagamento-confirmado', 'em-producao', 'despachado', 'entregue'],
};

const CLOUDINARY_CLOUD  = 'dmd3guxrq';
const CLOUDINARY_PRESET = 'emcanto_produtos';

// ---- Elementos ----
const loginView    = document.getElementById('loginView');
const adminView    = document.getElementById('adminView');
const loginForm    = document.getElementById('loginForm');
const loginError   = document.getElementById('loginError');
const logoutBtn    = document.getElementById('logoutBtn');
const prodList     = document.getElementById('prodList');
const formSection  = document.getElementById('formSection');
const prodForm     = document.getElementById('prodForm');
const newProdBtn   = document.getElementById('newProdBtn');
const cancelBtn    = document.getElementById('cancelFormBtn');
const formTitle    = document.getElementById('formTitle');
const varContainer  = document.getElementById('varContainer');
const addVarBtn     = document.getElementById('addVarBtn');
const photoGallery  = document.getElementById('photoGallery');
const addPhotoBtn   = document.getElementById('addPhotoBtn');
const imagePreview = document.getElementById('imagePreview');
const imageInput   = document.getElementById('imageInput');
const uploadProgress = document.getElementById('uploadProgress');

let editingId  = null;
let products   = [];
let uploadedUrl = '';

// ---- Auth ----
onAuthStateChanged(auth, user => {
  if (user) {
    loginView.style.display  = 'none';
    adminView.style.display  = 'flex';
    loadProducts();
    loadOrders();
    initTabs();
  } else {
    loginView.style.display  = 'flex';
    adminView.style.display  = 'none';
  }
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email    = loginForm.querySelector('[name="email"]').value.trim();
  const password = loginForm.querySelector('[name="password"]').value;
  const btn      = loginForm.querySelector('[type="submit"]');

  loginError.textContent = '';
  btn.disabled   = true;
  btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Entrando...';

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    const msgs = {
      'auth/user-not-found':        'Usuário não encontrado. Crie-o em Firebase → Authentication → Usuários.',
      'auth/wrong-password':        'Senha incorreta.',
      'auth/invalid-email':         'E-mail inválido.',
      'auth/invalid-credential':    'E-mail ou senha incorretos.',
      'auth/too-many-requests':     'Muitas tentativas. Aguarde alguns minutos.',
      'auth/unauthorized-domain':   'Domínio não autorizado. Adicione-o em Firebase → Authentication → Settings → Domínios autorizados.',
      'auth/network-request-failed':'Erro de rede. Verifique sua conexão.',
    };
    loginError.textContent = msgs[err.code] || `Erro (${err.code}): ${err.message}`;
  } finally {
    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
  }
});

logoutBtn?.addEventListener('click', () => signOut(auth));

// ---- Carregar produtos ----
async function loadProducts() {
  prodList.innerHTML = `<div class="admin-loading"><i class="fas fa-spinner fa-spin"></i> Carregando...</div>`;
  try {
    const snap = await getDocs(collection(db, 'products'));
    products   = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderList();
  } catch (err) {
    prodList.innerHTML = `<p class="admin-error">Erro ao carregar: ${err.message}</p>`;
  }
}

// ---- Renderizar lista ----
function renderList() {
  if (products.length === 0) {
    prodList.innerHTML = `
      <div class="admin-empty">
        <i class="fas fa-box-open"></i>
        <p>Nenhum produto cadastrado ainda.</p>
        <p>Clique em <strong>Novo Produto</strong> para começar.</p>
      </div>`;
    return;
  }

  prodList.innerHTML = products.map(p => `
    <div class="prod-admin-card ${p.active ? '' : 'prod-admin-card--inactive'}">
      <img src="${p.image || 'https://via.placeholder.com/80x80?text=Foto'}" alt="${p.name}"
           onerror="this.src='https://via.placeholder.com/80x80?text=Foto'" />
      <div class="prod-admin-card__info">
        <strong>${p.name}</strong>
        <span class="prod-admin-cat">${categoryLabel(p.category)}</span>
        <span class="prod-admin-price">${fmt(p.basePrice || 0)}</span>
        <span class="prod-admin-status ${p.active ? 'status--active' : 'status--inactive'}">
          ${p.active ? 'Ativo' : 'Inativo'}
          ${p.isReadyToShip ? ' · <span style="color:#27ae60">Pronta Entrega</span>' : ''}
        </span>
      </div>
      <div class="prod-admin-card__actions">
        <button class="btn-edit"   data-id="${p.id}" title="Editar"><i class="fas fa-edit"></i></button>
        <button class="btn-delete" data-id="${p.id}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>`).join('');

  prodList.querySelectorAll('.btn-edit').forEach(btn =>
    btn.addEventListener('click', () => openForm(btn.dataset.id))
  );
  prodList.querySelectorAll('.btn-delete').forEach(btn =>
    btn.addEventListener('click', () => deleteProduct(btn.dataset.id))
  );
}

function categoryLabel(cat) {
  const map = { colares: 'Colares e Chokers', bolsas: 'Bolsas', 'centros-de-mesa': 'Centros de Mesa' };
  return map[cat] || cat;
}

// ---- Formulário ----
newProdBtn?.addEventListener('click', () => openForm(null));
cancelBtn?.addEventListener('click', closeForm);

function openForm(id) {
  editingId    = id;
  uploadedUrl  = '';
  prodForm.reset();
  varContainer.innerHTML  = '';
  if (photoGallery) photoGallery.innerHTML = '';
  imagePreview.src        = '';
  imagePreview.hidden     = true;

  if (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    formTitle.textContent = 'Editar Produto';
    prodForm.querySelector('[name="name"]').value        = p.name || '';
    prodForm.querySelector('[name="category"]').value    = p.category || '';
    prodForm.querySelector('[name="description"]').value = p.description || '';
    prodForm.querySelector('[name="basePrice"]').value   = p.basePrice || '';
    prodForm.querySelector('[name="active"]').checked        = p.active !== false;
    prodForm.querySelector('[name="isReadyToShip"]').checked = p.isReadyToShip === true;
    uploadedUrl = p.image || '';
    if (p.image) { imagePreview.src = p.image; imagePreview.hidden = false; }
    (p.variations || []).forEach(v => addVariationGroup(v));
    (p.photos     || []).forEach(ph => addPhotoEntry(ph));
  } else {
    formTitle.textContent = 'Novo Produto';
    prodForm.querySelector('[name="active"]').checked = true;
  }

  formSection.hidden = false;
  formSection.scrollIntoView({ behavior: 'smooth' });
}

function closeForm() {
  formSection.hidden = true;
  editingId   = null;
  uploadedUrl = '';
}

// ---- Upload Cloudinary ----
imageInput?.addEventListener('change', async () => {
  const file = imageInput.files[0];
  if (!file) return;

  uploadProgress.textContent = 'Enviando imagem...';
  uploadProgress.className   = 'upload-progress';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  try {
    const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
      method: 'POST', body: formData
    });
    const data = await res.json();

    if (data.secure_url) {
      uploadedUrl            = data.secure_url;
      imagePreview.src       = uploadedUrl;
      imagePreview.hidden    = false;
      uploadProgress.textContent = 'Imagem enviada com sucesso!';
      uploadProgress.className   = 'upload-progress upload-progress--ok';
    } else {
      throw new Error(data.error?.message || 'Erro no upload');
    }
  } catch (err) {
    uploadProgress.textContent = `Erro: ${err.message}`;
    uploadProgress.className   = 'upload-progress upload-progress--error';
  }
});

// ---- Fotos de Variação ----
addPhotoBtn?.addEventListener('click', () => addPhotoEntry());

function addPhotoEntry(data = null) {
  const entry = document.createElement('div');
  entry.className = 'photo-entry';
  const uid = `pf_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  entry.innerHTML = `
    <div class="photo-entry__thumb">
      <input type="file" id="${uid}" accept="image/*" class="photo-file-input" />
      <label for="${uid}" class="photo-file-label">
        <i class="fas fa-camera"></i><span>Upload</span>
      </label>
      <img class="photo-preview-img" alt="preview" />
      <span class="photo-status"></span>
    </div>
    <div class="photo-entry__fields">
      <input type="text" class="photo-color"  placeholder="Cor (ex: Rosa Claro)" value="${data?.color  || ''}" />
      <input type="text" class="photo-thread" placeholder="Fio (ex: Algodão)"    value="${data?.thread || ''}" />
    </div>
    <button type="button" class="btn-remove-photo" title="Remover"><i class="fas fa-times"></i></button>`;

  const fileInput  = entry.querySelector('.photo-file-input');
  const previewImg = entry.querySelector('.photo-preview-img');
  const statusEl   = entry.querySelector('.photo-status');
  const fileLabel  = entry.querySelector('.photo-file-label');

  if (data?.url) {
    fileInput.dataset.url   = data.url;
    previewImg.src          = data.url;
    previewImg.style.display = 'block';
    fileLabel.style.display  = 'none';
  }

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    statusEl.textContent = 'Enviando…';
    statusEl.style.color = '#6B7A8D';
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method:'POST', body:fd });
      const json = await res.json();
      if (!json.secure_url) throw new Error(json.error?.message || 'Erro');
      fileInput.dataset.url    = json.secure_url;
      previewImg.src           = json.secure_url;
      previewImg.style.display = 'block';
      fileLabel.style.display  = 'none';
      statusEl.textContent     = '✓ Enviado';
      statusEl.style.color     = '#27ae60';
    } catch (err) {
      statusEl.textContent = `Erro: ${err.message}`;
      statusEl.style.color = '#e74c3c';
    }
  });

  entry.querySelector('.btn-remove-photo').addEventListener('click', () => entry.remove());
  photoGallery.appendChild(entry);
}

function collectPhotos() {
  return Array.from(photoGallery?.querySelectorAll('.photo-entry') || [])
    .map(e => ({
      url:    e.querySelector('.photo-file-input').dataset.url || '',
      color:  e.querySelector('.photo-color').value.trim(),
      thread: e.querySelector('.photo-thread').value.trim(),
    }))
    .filter(ph => ph.url);
}

// ---- Variações de Preço ----
addVarBtn?.addEventListener('click', () => addVariationGroup());

function addVariationGroup(data = null) {
  const div = document.createElement('div');
  div.className = 'var-group';

  div.innerHTML = `
    <div class="var-group__header">
      <input type="text" class="var-name" placeholder="Nome da variação (ex: Cor, Tamanho)"
             value="${data?.name || ''}" />
      <button type="button" class="btn-remove-var" title="Remover variação">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="var-opts"></div>
    <button type="button" class="btn-add-opt">
      <i class="fas fa-plus"></i> Adicionar opção
    </button>`;

  varContainer.appendChild(div);

  const optsEl    = div.querySelector('.var-opts');
  const addOptBtn = div.querySelector('.btn-add-opt');

  div.querySelector('.btn-remove-var').addEventListener('click', () => div.remove());
  addOptBtn.addEventListener('click', () => addOptionRow(optsEl));

  (data?.options || []).forEach(opt => addOptionRow(optsEl, opt));
  if (!data) addOptionRow(optsEl);
}

function addOptionRow(optsEl, data = null) {
  const row = document.createElement('div');
  row.className = 'var-opt-row';
  row.innerHTML = `
    <input type="text"   class="opt-label"  placeholder="Rótulo (ex: Rosa)" value="${data?.label || ''}" />
    <input type="number" class="opt-adjust" placeholder="Ajuste R$" step="0.01" value="${data?.priceAdjust ?? 0}" />
    <button type="button" class="btn-remove-opt" title="Remover"><i class="fas fa-times"></i></button>`;
  row.querySelector('.btn-remove-opt').addEventListener('click', () => row.remove());
  optsEl.appendChild(row);
}

function collectVariations() {
  return Array.from(varContainer.querySelectorAll('.var-group')).map(g => ({
    name:    g.querySelector('.var-name').value.trim(),
    options: Array.from(g.querySelectorAll('.var-opt-row')).map(r => ({
      label:       r.querySelector('.opt-label').value.trim(),
      priceAdjust: parseFloat(r.querySelector('.opt-adjust').value) || 0
    })).filter(o => o.label)
  })).filter(v => v.name);
}

// ---- Salvar produto ----
prodForm?.addEventListener('submit', async e => {
  e.preventDefault();

  const saveBtn = prodForm.querySelector('[type="submit"]');
  saveBtn.disabled    = true;
  saveBtn.textContent = 'Salvando...';

  const data = {
    name:          prodForm.querySelector('[name="name"]').value.trim(),
    category:      prodForm.querySelector('[name="category"]').value,
    description:   prodForm.querySelector('[name="description"]').value.trim(),
    basePrice:     parseFloat(prodForm.querySelector('[name="basePrice"]').value) || 0,
    active:        prodForm.querySelector('[name="active"]').checked,
    isReadyToShip: prodForm.querySelector('[name="isReadyToShip"]').checked,
    image:         uploadedUrl,
    variations:    collectVariations(),
    photos:        collectPhotos(),
    updatedAt:     serverTimestamp()
  };

  try {
    if (editingId) {
      await updateDoc(doc(db, 'products', editingId), data);
    } else {
      data.createdAt = serverTimestamp();
      await addDoc(collection(db, 'products'), data);
    }
    closeForm();
    loadProducts();
  } catch (err) {
    alert(`Erro ao salvar: ${err.message}`);
  } finally {
    saveBtn.disabled    = false;
    saveBtn.textContent = 'Salvar Produto';
  }
});

// ---- Excluir produto ----
async function deleteProduct(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;
  try {
    await deleteDoc(doc(db, 'products', id));
    loadProducts();
  } catch (err) {
    alert(`Erro ao excluir: ${err.message}`);
  }
}

// ============================================================
// ABAS
// ============================================================
function initTabs() {
  document.querySelectorAll('.admin-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.getElementById('tabProdutos').style.display = tab === 'produtos' ? 'block' : 'none';
      document.getElementById('tabPedidos').style.display  = tab === 'pedidos'  ? 'block' : 'none';
    });
  });
  document.getElementById('refreshOrdersBtn')?.addEventListener('click', loadOrders);
}

// ============================================================
// PEDIDOS
// ============================================================
let orders = [];
let currentOrder = null;

async function loadOrders() {
  const listEl = document.getElementById('orderList');
  listEl.innerHTML = `<div class="admin-loading"><i class="fas fa-spinner fa-spin"></i> Carregando...</div>`;

  try {
    const snap = await getDocs(collection(db, 'orders'));
    orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    orders.sort((a, b) => {
      const ta = a.createdAt?.toDate?.() ?? new Date(0);
      const tb = b.createdAt?.toDate?.() ?? new Date(0);
      return tb - ta;
    });
    renderOrders();
  } catch (err) {
    listEl.innerHTML = `<p class="admin-error">Erro ao carregar pedidos: ${err.message}</p>`;
  }
}

const STATUS_LABEL_COLOR = {
  'pedido-realizado':     '#3A85C7',
  'pagamento-confirmado': '#27ae60',
  'em-producao':          '#f39c12',
  'despachado':           '#9b59b6',
  'entregue':             '#27ae60',
};

function renderOrders() {
  const listEl  = document.getElementById('orderList');
  const badgeEl = document.getElementById('ordersBadge');
  const pending = orders.filter(o => o.status !== 'entregue').length;

  if (badgeEl) {
    badgeEl.textContent    = pending;
    badgeEl.style.display  = pending > 0 ? 'inline-flex' : 'none';
  }

  if (orders.length === 0) {
    listEl.innerHTML = `<div class="admin-empty"><i class="fas fa-receipt"></i><p>Nenhum pedido recebido ainda.</p></div>`;
    return;
  }

  listEl.innerHTML = orders.map(o => {
    const info  = STATUS_INFO[o.status] || { label: o.status, icon: 'fa-circle' };
    const color = STATUS_LABEL_COLOR[o.status] || '#6B7A8D';
    const dateStr = o.createdAt?.toDate
      ? o.createdAt.toDate().toLocaleDateString('pt-BR')
      : '';
    const typeBadge = o.type === 'pronta-entrega'
      ? `<span style="background:#E8F5E9;color:#27ae60;padding:.2rem .6rem;border-radius:50px;font-size:.72rem;font-weight:700">⚡ Pronta Entrega</span>`
      : `<span style="background:#EBF5FF;color:#3A85C7;padding:.2rem .6rem;border-radius:50px;font-size:.72rem;font-weight:700">✂️ Encomenda</span>`;
    return `
      <div class="order-admin-card" data-code="${o.code}">
        <div class="order-admin-card__left">
          <strong class="order-code">${o.code}</strong>
          ${typeBadge}
          <span class="order-customer">${o.customer?.name || '—'}</span>
          <span class="order-date">${dateStr}</span>
        </div>
        <div class="order-admin-card__right">
          <span class="order-status-pill" style="background:${color}20;color:${color}">
            <i class="fas ${info.icon}"></i> ${info.label}
          </span>
          <strong class="order-total">${fmt(o.total || 0)}</strong>
          <button class="btn-edit" data-code="${o.code}" title="Ver detalhes">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>`;
  }).join('');

  listEl.querySelectorAll('[data-code]').forEach(el => {
    el.addEventListener('click', () => openOrderDetail(el.dataset.code));
  });
}

function openOrderDetail(code) {
  const order = orders.find(o => o.code === code);
  if (!order) return;
  currentOrder = order;

  document.getElementById('detailCode').textContent = code;

  // Cliente
  const c = order.customer || {};
  document.getElementById('detailCustomer').innerHTML = `
    <p style="font-size:.88rem"><strong>${c.name || '—'}</strong></p>
    <p style="font-size:.82rem;color:var(--text-light)">${c.phone || ''} ${c.email ? '· ' + c.email : ''}</p>`;

  // Itens
  document.getElementById('detailItems').innerHTML = (order.items || []).map(i =>
    `<li style="font-size:.85rem;margin-bottom:.2rem">• ${i.qty}x ${i.name}${i.variation ? ` (${i.variation})` : ''} — ${fmt(i.price * i.qty)}</li>`
  ).join('');

  // Endereço
  const a = order.address || {};
  document.getElementById('detailAddress').innerHTML =
    `<p style="font-size:.85rem;color:var(--text-light);line-height:1.6">${a.endereco}, ${a.numero}${a.complemento ? ', ' + a.complemento : ''}<br>${a.bairro} — ${a.cidade}/${a.estado}<br>CEP: ${a.cep}</p>`;

  // Select de status
  const flow = STATUS_FLOW[order.type] || STATUS_FLOW['encomenda'];
  const sel  = document.getElementById('detailStatusSel');
  sel.innerHTML = flow.map(s => {
    const inf = STATUS_INFO[s] || { label: s };
    return `<option value="${s}" ${s === order.status ? 'selected' : ''}>${inf.label}</option>`;
  }).join('');

  // Código de rastreio atual
  document.getElementById('detailTrackingCode').value = order.trackingCode || '';
  document.getElementById('detailNote').value = '';

  // Mostrar campo rastreio se status for despachado
  const showTracking = () => {
    document.getElementById('trackingCodeGroup').style.display =
      sel.value === 'despachado' || sel.value === 'entregue' ? 'block' : 'none';
  };
  sel.onchange = showTracking;
  showTracking();

  document.getElementById('orderDetail').style.display = 'block';
  document.getElementById('orderDetail').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('closeOrderBtn')?.addEventListener('click', () => {
  document.getElementById('orderDetail').style.display = 'none';
  currentOrder = null;
});

document.getElementById('saveOrderStatusBtn')?.addEventListener('click', async () => {
  if (!currentOrder) return;

  const newStatus     = document.getElementById('detailStatusSel').value;
  const trackingCode  = document.getElementById('detailTrackingCode').value.trim().toUpperCase();
  const note          = document.getElementById('detailNote').value.trim();
  const info          = STATUS_INFO[newStatus] || { label: newStatus };

  const newEntry = {
    status: newStatus,
    label:  info.label,
    note,
    ts: new Date().toISOString(),
  };

  // Mantém timeline existente + adiciona nova entrada
  const existingTimeline = currentOrder.timeline || [];
  const updatedTimeline  = [...existingTimeline, newEntry];

  const btn = document.getElementById('saveOrderStatusBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

  try {
    await updateDoc(doc(db, 'orders', currentOrder.code), {
      status:       newStatus,
      trackingCode: trackingCode || currentOrder.trackingCode || '',
      timeline:     updatedTimeline,
    });

    // Atualizar localmente
    const idx = orders.findIndex(o => o.code === currentOrder.code);
    if (idx !== -1) {
      orders[idx].status       = newStatus;
      orders[idx].trackingCode = trackingCode || orders[idx].trackingCode || '';
      orders[idx].timeline     = updatedTimeline;
      currentOrder = orders[idx];
    }

    renderOrders();
    document.getElementById('orderDetail').style.display = 'none';
    currentOrder = null;
  } catch (err) {
    alert(`Erro ao salvar: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Salvar Status';
  }
});
