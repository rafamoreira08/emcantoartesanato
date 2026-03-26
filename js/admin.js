/* ==============================
   ADMIN — Em Canto Artesanato
   ============================== */
import { db, auth }                        from './firebase-config.js';
import { signInWithEmailAndPassword,
         signOut, onAuthStateChanged }     from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { collection, getDocs, addDoc,
         updateDoc, deleteDoc, doc,
         serverTimestamp, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const CLOUDINARY_CLOUD  = 'dmd3guxrq';
const CLOUDINARY_PRESET = 'emcanto_produtos';

const fmt = val => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ---- Elementos ----
const loginView   = document.getElementById('loginView');
const adminView   = document.getElementById('adminView');
const loginForm   = document.getElementById('loginForm');
const loginError  = document.getElementById('loginError');
const logoutBtn   = document.getElementById('logoutBtn');
const prodList    = document.getElementById('prodList');
const formSection = document.getElementById('formSection');
const prodForm    = document.getElementById('prodForm');
const newProdBtn  = document.getElementById('newProdBtn');
const cancelBtn   = document.getElementById('cancelFormBtn');
const formTitle   = document.getElementById('formTitle');
const varContainer = document.getElementById('varContainer');
const addVarBtn   = document.getElementById('addVarBtn');
const imagePreview = document.getElementById('imagePreview');
const imageInput  = document.getElementById('imageInput');
const uploadProgress = document.getElementById('uploadProgress');

let editingId     = null;
let products      = [];
let uploadedUrl   = '';

// ---- Auth ----
onAuthStateChanged(auth, user => {
  if (user) {
    loginView.hidden  = true;
    adminView.hidden  = false;
    loadProducts();
  } else {
    loginView.hidden  = false;
    adminView.hidden  = true;
  }
});

loginForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const email    = loginForm.querySelector('[name="email"]').value.trim();
  const password = loginForm.querySelector('[name="password"]').value;
  const btn      = loginForm.querySelector('[type="submit"]');

  loginError.textContent = '';
  btn.disabled    = true;
  btn.innerHTML   = '<i class="fas fa-spinner fa-spin"></i> Entrando...';

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    const msgs = {
      'auth/user-not-found':     'Usuário não encontrado. Crie-o em Firebase → Authentication → Usuários.',
      'auth/wrong-password':     'Senha incorreta.',
      'auth/invalid-email':      'E-mail inválido.',
      'auth/invalid-credential': 'E-mail ou senha incorretos.',
      'auth/too-many-requests':  'Muitas tentativas. Aguarde alguns minutos.',
      'auth/unauthorized-domain':'Domínio não autorizado no Firebase. Adicione-o em Authentication → Settings → Domínios autorizados.',
      'auth/network-request-failed': 'Erro de rede. Verifique sua conexão.',
    };
    loginError.textContent = msgs[err.code] || `Erro (${err.code}): ${err.message}`;
  } finally {
    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
  }
});
  }
});

logoutBtn?.addEventListener('click', () => signOut(auth));

// ---- Carregar produtos ----
async function loadProducts() {
  prodList.innerHTML = `<div class="admin-loading"><i class="fas fa-spinner fa-spin"></i> Carregando...</div>`;

  try {
    const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
    products   = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderList();
  } catch (err) {
    prodList.innerHTML = `<p class="admin-error">Erro ao carregar produtos: ${err.message}</p>`;
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
        </span>
      </div>
      <div class="prod-admin-card__actions">
        <button class="btn-edit" data-id="${p.id}" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-delete" data-id="${p.id}" title="Excluir">
          <i class="fas fa-trash-alt"></i>
        </button>
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
  const map = { colares: 'Colares', bolsas: 'Bolsas', 'centros-de-mesa': 'Centros de Mesa' };
  return map[cat] || cat;
}

// ---- Abrir formulário ----
newProdBtn?.addEventListener('click', () => openForm(null));
cancelBtn?.addEventListener('click', closeForm);

function openForm(id) {
  editingId    = id;
  uploadedUrl  = '';
  prodForm.reset();
  varContainer.innerHTML = '';
  imagePreview.src       = '';
  imagePreview.hidden    = true;

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
  } else {
    formTitle.textContent = 'Novo Produto';
    prodForm.querySelector('[name="active"]').checked = true;
  }

  formSection.hidden = false;
  formSection.scrollIntoView({ behavior: 'smooth' });
}

function closeForm() {
  formSection.hidden = true;
  editingId = null;
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

// ---- Variações ----
addVarBtn?.addEventListener('click', () => addVariationGroup());

function addVariationGroup(data = null) {
  const idx = varContainer.children.length;
  const div = document.createElement('div');
  div.className   = 'var-group';
  div.dataset.idx = idx;

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
    <input type="text"   class="opt-label"  placeholder="Rótulo (ex: Rosa)"
           value="${data?.label || ''}" />
    <input type="number" class="opt-adjust" placeholder="Ajuste R$" step="0.01"
           value="${data?.priceAdjust ?? 0}" />
    <button type="button" class="btn-remove-opt" title="Remover"><i class="fas fa-times"></i></button>`;
  row.querySelector('.btn-remove-opt').addEventListener('click', () => row.remove());
  optsEl.appendChild(row);
}

function collectVariations() {
  return Array.from(varContainer.querySelectorAll('.var-group')).map(g => ({
    name: g.querySelector('.var-name').value.trim(),
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
    name:        prodForm.querySelector('[name="name"]').value.trim(),
    category:    prodForm.querySelector('[name="category"]').value,
    description: prodForm.querySelector('[name="description"]').value.trim(),
    basePrice:   parseFloat(prodForm.querySelector('[name="basePrice"]').value) || 0,
    active:         prodForm.querySelector('[name="active"]').checked,
    isReadyToShip:  prodForm.querySelector('[name="isReadyToShip"]').checked,
    image:          uploadedUrl,
    variations:  collectVariations(),
    updatedAt:   serverTimestamp()
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
