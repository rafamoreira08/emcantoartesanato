import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchProducts } from '../lib/products'
import { cloudinaryUrl } from '../lib/products'
import type { Product } from '../types/product'

interface Props {
  category: string
  title: string
  description?: string
  ctaLink: string
  ctaLabel?: string
}

export default function CategoryStrip({ category, title, description, ctaLink, ctaLabel = 'Ver catálogo completo' }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [idx, setIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()
  const progressRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    fetchProducts(category).then(setProducts)
  }, [category])

  const stopAutoPlay = () => { if (timerRef.current) clearInterval(timerRef.current) }
  const stopProgress = () => { if (progressRef.current) clearInterval(progressRef.current) }

  const resetProgress = () => {
    setProgress(0)
    stopProgress()
    progressRef.current = setInterval(() => {
      setProgress(p => Math.min(100, p + 2))
    }, 100)
  }

  const startAutoPlay = () => {
    timerRef.current = setInterval(() => {
      setIdx(current => (current + 1) % products.length)
      setProgress(0)
    }, 5000)
  }

  useEffect(() => {
    if (products.length <= 1) return
    startAutoPlay()
    resetProgress()
    return () => { stopAutoPlay(); stopProgress() }
  }, [products.length])

  useEffect(() => {
    if (products.length <= 1) return
    if (isHovered) { stopAutoPlay(); stopProgress() }
    else { startAutoPlay(); resetProgress() }
  }, [isHovered])

  const goTo = (newIdx: number) => {
    setIdx(newIdx)
    stopAutoPlay()
    startAutoPlay()
    resetProgress()
  }

  if (products.length === 0) return null

  const current = products[idx]
  const thumb = (p: Product) => {
    const photos = (p.photos || []).filter(ph => ph.url)
    return photos.length > 0 ? photos[0].url : p.image
  }

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <p className="font-sans text-xs text-green tracking-[0.2em] uppercase mb-1">Coleção</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-700 text-ink mb-3">{title}</h2>
          {description && (
            <p className="font-sans text-lg text-muted leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex gap-4 overflow-hidden">
            {/* Main large card */}
            <div className="relative flex-shrink-0 w-72 lg:w-80 rounded-2xl overflow-hidden aspect-square bg-border/30 cursor-pointer group"
              onClick={() => goTo((idx + 1) % products.length)}>
              <img
                key={current.id}
                src={cloudinaryUrl(thumb(current), 600, 600)}
                alt={current.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 animate-fade-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Info overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col gap-3">
                <div>
                  <p className="font-serif text-lg font-600 leading-tight">{current.name}</p>
                </div>
                <Link
                  to={ctaLink}
                  className="inline-flex items-center justify-center gap-2 bg-white text-ink px-4 py-2 rounded-lg font-sans text-xs font-600 hover:bg-green hover:text-white transition-colors"
                >
                  {ctaLabel} <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 flex-1 overflow-hidden">
              {products.filter((_, i) => i !== idx).slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => goTo(products.indexOf(p))}
                  className="relative flex-shrink-0 w-32 lg:w-40 rounded-xl overflow-hidden aspect-square bg-border/30 cursor-pointer group opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={cloudinaryUrl(thumb(p), 300, 300)}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => goTo((idx - 1 + products.length) % products.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-ink p-2 rounded-full shadow transition-all opacity-0 group-hover:opacity-100 hover:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => goTo((idx + 1) % products.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-ink p-2 rounded-full shadow transition-all"
            aria-label="Próximo"
          >
            <ChevronRight size={20} />
          </button>

          {/* Progress bar */}
          <div className="mt-4 h-0.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-green transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1 rounded-full transition-all ${i === idx ? 'bg-green w-6' : 'bg-border w-1.5 hover:bg-muted'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
