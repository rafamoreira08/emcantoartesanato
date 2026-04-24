/** Card de produto com carrossel de fotos e botão de encomenda */
import { useState, useEffect, useRef } from 'react'
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '../types/product'
import { cloudinaryUrl } from '../lib/products'

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const photos = (product.photos || []).filter(p => p.url)
  const images = photos.length > 0 ? photos.map(p => p.url) : [product.image]
  const [idx, setIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()
  const progressRef = useRef<NodeJS.Timeout>()

  const startAutoPlay = () => {
    timerRef.current = setInterval(() => {
      setIdx(current => (current + 1) % images.length)
      setProgress(0)
    }, 5000)
  }

  const stopAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const stopProgress = () => {
    if (progressRef.current) clearInterval(progressRef.current)
  }

  const resetProgress = () => {
    setProgress(0)
    stopProgress()

    progressRef.current = setInterval(() => {
      setProgress(p => Math.min(100, p + (100 / 50))) // 50 ticks for smooth animation (0 to 100)
    }, 100)
  }

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return

    startAutoPlay()
    resetProgress()

    return () => {
      stopAutoPlay()
      stopProgress()
    }
  }, [images.length])

  // Handle hover pause/resume
  useEffect(() => {
    if (isHovered) {
      stopAutoPlay()
      stopProgress()
    } else {
      startAutoPlay()
      resetProgress()
    }
  }, [isHovered])

  // Handle manual navigation
  const goToSlide = (newIdx: number) => {
    setIdx(newIdx)
    resetProgress()
  }

  const prevSlide = () => goToSlide((idx - 1 + images.length) % images.length)
  const nextSlide = () => goToSlide((idx + 1) % images.length)

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const whatsappMsg = encodeURIComponent(
    `Olá Sônia! Vim pelo site e tenho interesse na peça: ${product.name}. Poderia me dar mais informações?`
  )

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-border hover:border-green/30 hover:shadow-md transition-all duration-300">
      {/* Image Carousel */}
      <div
        className="relative aspect-square overflow-hidden bg-cream"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          key={idx}
          src={cloudinaryUrl(images[idx], 600, 600)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 animate-fade-in"
          onError={e => { (e.target as HTMLImageElement).src = '/images/logo_fundo_transparente.png' }}
        />

        {/* Photo specs overlay with gradient */}
        {photos.length > 0 && (photos[idx]?.color || photos[idx]?.thread || photos[idx]?.description) && (
          <div className="absolute inset-0 bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        )}
        {photos.length > 0 && (photos[idx]?.color || photos[idx]?.thread || photos[idx]?.description) && (
          <div className="absolute bottom-12 left-4 text-white font-sans text-sm leading-snug">
            {photos[idx]?.color && <div className="font-500">Cor: {photos[idx].color}</div>}
            {photos[idx]?.thread && <div className="font-500">Fio: {photos[idx].thread}</div>}
            {photos[idx]?.description && <div className="font-400 text-xs mt-1">{photos[idx].description}</div>}
          </div>
        )}

        {/* Pronta entrega badge — by variation */}
        {photos[idx]?.isReadyToShip && (
          <span className="absolute top-3 left-3 bg-green text-white font-sans text-xs font-600 px-3 py-1 rounded-full z-10">
            Pronta Entrega
          </span>
        )}

        {/* Navigation arrows - show on hover or if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? 'bg-white w-6' : 'bg-white/60 w-1.5 hover:bg-white/80'
                }`}
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Progress bar */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-green transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-serif text-lg font-600 text-ink leading-snug">{product.name}</h3>
          {product.description && (
            <p className="font-sans text-sm text-muted leading-relaxed mt-1">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <div>
            {(photos[idx]?.priceAdjust ?? 0) !== 0 ? (
              <>
                <p className="font-sans text-xs text-muted uppercase tracking-wider">Esta variação</p>
                <p className="font-serif text-xl font-700 text-ink">{fmt(product.basePrice + (photos[idx]?.priceAdjust ?? 0))}</p>
                <p className="font-sans text-xs text-muted">Base: {fmt(product.basePrice)}</p>
              </>
            ) : (
              <>
                <p className="font-sans text-xs text-muted uppercase tracking-wider">A partir de</p>
                <p className="font-serif text-xl font-700 text-ink">{fmt(product.basePrice)}</p>
              </>
            )}
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
