import { useState, useEffect } from 'react'
import { fetchFeaturedProduct, cloudinaryUrl } from '../lib/products'
import type { Product } from '../types/product'

export default function Hero() {
  const [featured, setFeatured] = useState<Product | null>(null)

  useEffect(() => {
    fetchFeaturedProduct().then(setFeatured)
  }, [])

  const heroImage = featured
    ? cloudinaryUrl((featured.photos?.[0]?.url || featured.image), 640, 800)
    : 'https://res.cloudinary.com/dmd3guxrq/image/upload/c_fill,w_640,h_800,q_auto,f_auto/v1775147461/i3sz6wcyzpogzlfhwhza.jpg'

  const heroName = featured?.name ?? 'Bolsa Caprese'

  return (
    <section className="min-h-screen flex items-center pt-16 bg-cream overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center py-20">

          {/* Left — text */}
          <div className="flex flex-col gap-8">
            {/* Logo + tagline */}
            <div className="flex flex-col gap-2">
              <img
                src="/images/logo_fundo_transparente.png"
                alt="Em Canto Artesanato"
                className="w-72 lg:w-96 object-contain"
              />
              <p className="font-sans text-sm font-500 text-green tracking-[0.2em] uppercase leading-tight">by</p>
              <p className="font-sans text-sm font-500 text-green tracking-[0.2em] uppercase leading-tight">Sônia Lima</p>
              <p className="font-sans text-sm text-muted tracking-widest uppercase">Artesanato de Luxo</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-serif text-lg text-ink leading-relaxed">
                A Arte de <em className="text-green not-italic script text-2xl">Moldar Fios</em> em Peças de Design.
              </p>
            </div>

            <p className="font-sans text-lg text-muted leading-relaxed max-w-md">
              Bolsas e acessórios em crochê feitos à mão, unindo o cuidado artesanal
              à sofisticação contemporânea. <span className="text-ink font-500">Exclusividade em cada ponto.</span>
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4 border-t border-border">
              <div className="text-center">
                <p className="font-serif text-2xl font-700 text-ink">100%</p>
                <p className="font-sans text-xs text-muted uppercase tracking-wider">Feito à mão</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="font-serif text-2xl font-700 text-ink">Única</p>
                <p className="font-sans text-xs text-muted uppercase tracking-wider">Cada peça</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="font-serif text-2xl font-700 text-ink">∞</p>
                <p className="font-sans text-xs text-muted uppercase tracking-wider">Cores e fios</p>
              </div>
            </div>
          </div>

          {/* Right — featured product image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-4/5 max-w-xs lg:max-w-sm">
              {/* Decorative background circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-green/8 to-sand/8 rounded-3xl scale-105 -z-10" />

              {/* Novidade tag — above the photo */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl px-5 py-3 shadow-lg border border-border z-10">
                <p className="font-sans text-xs text-muted">Novidade</p>
                <p className="font-serif text-sm font-600 text-ink">{heroName}</p>
              </div>

              {/* Main image */}
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-border/30">
                <img
                  src={heroImage}
                  alt={heroName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
