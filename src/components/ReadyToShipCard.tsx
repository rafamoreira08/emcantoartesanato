import { ShoppingBag } from 'lucide-react'
import type { ReadyToShipItem } from '../types/product'
import { cloudinaryUrl, WHATSAPP } from '../lib/products'

interface Props { item: ReadyToShipItem }

export default function ReadyToShipCard({ item }: Props) {
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const msg = encodeURIComponent(
    `Olá Sônia! Vim pelo site e tenho interesse na peça em pronta entrega: ${item.name}` +
    (item.photo.color  ? `, Cor: ${item.photo.color}`   : '') +
    (item.photo.thread ? `, Fio: ${item.photo.thread}`  : '') +
    `. Poderia me dar mais informações?`
  )

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-border hover:border-green/30 hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={cloudinaryUrl(item.photo.url, 600, 600)}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          onError={e => { (e.target as HTMLImageElement).src = '/images/logo_fundo_transparente.png' }}
        />

        {/* Gradient + specs overlay */}
        {(item.photo.color || item.photo.thread) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        )}
        {(item.photo.color || item.photo.thread) && (
          <div className="absolute bottom-3 left-4 text-white font-sans text-sm leading-snug">
            {item.photo.color  && <div className="font-500">Cor: {item.photo.color}</div>}
            {item.photo.thread && <div className="font-500">Fio: {item.photo.thread}</div>}
          </div>
        )}

        <span className="absolute top-3 left-3 bg-green text-white font-sans text-xs font-600 px-3 py-1 rounded-full">
          Pronta Entrega
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-serif text-lg font-600 text-ink leading-snug">{item.name}</h3>
          {item.description && (
            <p className="font-sans text-sm text-muted leading-relaxed mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="font-sans text-xs text-muted uppercase tracking-wider">Preço</p>
            <p className="font-serif text-xl font-700 text-ink">{fmt(item.finalPrice)}</p>
            {(item.photo.priceAdjust ?? 0) !== 0 && (
              <p className="font-sans text-xs text-muted">Base: {fmt(item.basePrice)}</p>
            )}
          </div>
          <a
            href={`${WHATSAPP}?text=${msg}`}
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
