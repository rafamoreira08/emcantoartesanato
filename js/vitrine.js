/* ==============================
   VITRINE DESLIZANTE — Em Canto Artesanato
   Busca imagens dos produtos no Firebase e cria faixa infinita
   ============================== */
import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

function cloudinaryThumb(url) {
  // Insere transformação square 400x400 otimizada para a vitrine
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/c_fill,w_400,h_400,q_auto,f_auto/');
}

async function initVitrine() {
  const track = document.getElementById('vitrineFotos');
  const section = document.querySelector('.vitrine');
  if (!track || !section) return;

  try {
    const snap = await getDocs(collection(db, 'products'));
    const imgs = [];

    snap.forEach(doc => {
      const d = doc.data();
      if (d.imageUrl) imgs.push({ url: cloudinaryThumb(d.imageUrl), name: d.name || 'Peça artesanal' });
    });

    if (imgs.length === 0) {
      section.remove();
      return;
    }

    // Duplica para o loop contínuo ser seamless
    const doubled = [...imgs, ...imgs];
    track.innerHTML = doubled.map(img => `
      <div class="vitrine__foto">
        <img src="${img.url}" alt="${img.name}" loading="lazy" />
      </div>
    `).join('');

    // Ajusta velocidade pelo número de fotos (3s por foto)
    track.style.animationDuration = `${imgs.length * 3}s`;

  } catch (err) {
    console.error('Vitrine: erro ao carregar fotos', err);
    section.remove();
  }
}

initVitrine();
