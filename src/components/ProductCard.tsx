import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '../types/product'
import { cloudinaryUrl } from '../lib/products'

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const photos = (product.photos || []).filter(p => p.url)
  const images = photos.length > 0 ? photos.map(p => p.url) : [product.image]
  const [idx, setIdx] = useState(0)

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const whatsappMsg = encodeURIComponent(
    `Olá Sônia! Vim pelo site e tenho interesse na peça: ${product.name}. Poderia me dar mais informações?`
  )

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-border hover:border-green/30 hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={cloudinaryUrl(images[idx], 600, 600)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = '/images/logo_fundo_transparente.png' }}
        />

        {/* Pronta entrega badge */}
        {product.isReadyToShip && (
          <span className="absolute top-3 left-3 bg-green text-white font-sans text-xs font-600 px-3 py-1 rounded-full">
            Pronta Entrega
          </span>
        )}

        {/* Thumbnail strip for multiple photos */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white scale-125' : 'bg-white/60'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-serif text-lg font-600 text-ink leading-snug">{product.name}</h3>
          {product.description && (
            <p className="font-sans text-sm text-muted leading-relaxed mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="font-sans text-xs text-muted uppercase tracking-wider">A partir de</p>
            <p className="font-serif text-xl font-700 text-ink">{fmt(product.basePrice)}</p>
          </div>
          <a
            href={`https://wa.me/5531991236334?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-ink text-white px-4 py-2.5 rounded-full font-sans text-xs font-600 hover:bg-green transition-colors duration-200"
          >
            <ShoppingBag size={14} />
            Tenho interesse
          </a>
        </div>
      </div>
    </article>
  )
}
