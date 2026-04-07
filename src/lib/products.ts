import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from './firebase'
import type { Product } from '../types/product'

export async function fetchProducts(category?: string): Promise<Product[]> {
  let q
  if (category === 'pronta-entrega') {
    q = query(collection(db, 'products'), where('isReadyToShip', '==', true))
  } else if (category) {
    q = query(collection(db, 'products'), where('category', '==', category))
  } else {
    q = query(collection(db, 'products'))
  }

  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Product))
    .filter(p => p.active)
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
}

export async function fetchReadyToShipVariations(): Promise<import('../types/product').ReadyToShipItem[]> {
  const products = await fetchProducts('pronta-entrega')
  const items: import('../types/product').ReadyToShipItem[] = []
  for (const p of products) {
    const readyPhotos = (p.photos ?? []).filter(ph => ph.url && ph.isReadyToShip)
    for (const photo of readyPhotos) {
      items.push({
        productId: p.id!,
        name: p.name,
        description: p.description,
        photo,
        basePrice: p.basePrice,
        finalPrice: p.basePrice + (photo.priceAdjust ?? 0),
      })
    }
  }
  return items
}

export async function fetchFeaturedProduct(): Promise<Product | null> {
  const q = query(collection(db, 'products'), where('isFeatured', '==', true), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product
}

export function cloudinaryUrl(url: string, w = 800, h = 800) {
  if (!url?.includes('cloudinary')) return url
  return url.replace('/upload/', `/upload/c_fill,w_${w},h_${h},q_auto,f_auto/`)
}

export const WHATSAPP = 'https://wa.me/5531991236334'
export const WHATSAPP_MSG = encodeURIComponent('Olá Sônia! Vim pelo site e gostaria de fazer uma encomenda.')
