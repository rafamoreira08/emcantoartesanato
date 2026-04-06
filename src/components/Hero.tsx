import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16 bg-cream overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center py-20">

          {/* Left — text */}
          <div className="flex flex-col gap-8">
            {/* Brand name — prominent */}
            <div className="flex flex-col gap-2">
              <h1 className="font-serif text-6xl lg:text-7xl text-ink leading-[1.1] font-700">
                <em className="text-green not-italic">em canto</em><br />
                artesanato
              </h1>
              <p className="font-sans text-sm font-500 text-green tracking-[0.2em] uppercase">by Sônia Lima</p>
              <p className="font-sans text-sm text-muted tracking-widest uppercase">Artesanato de Luxo</p>
            </div>

            {/* Tagline — less prominent */}
            <div className="flex flex-col gap-2">
              <p className="font-serif text-lg text-ink leading-relaxed">
                A Arte de <em className="text-green not-italic script text-2xl">Moldar Fios</em> em Peças de Design.
              </p>
            </div>

            <p className="font-sans text-lg text-muted leading-relaxed max-w-md">
              Bolsas e acessórios em crochê feitos à mão, unindo o cuidado artesanal
              à sofisticação contemporânea. <span className="text-ink font-500">Exclusividade em cada ponto.</span>
            </p>

            <Link
              to="/bolsas"
              className="inline-flex items-center justify-center gap-3 bg-ink text-white px-8 py-4 rounded-full font-sans text-sm font-600 tracking-wide hover:bg-ink/80 transition-all duration-300 group w-fit"
            >
              Ver Coleção Exclusiva
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

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

          {/* Right — image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-full">
              {/* Decorative background circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-green/8 to-sand/8 rounded-3xl scale-105 -z-10" />

              {/* Main image */}
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-border/30">
                <img
                  src="https://res.cloudinary.com/dmd3guxrq/image/upload/c_fill,w_800,h_1000,q_auto,f_auto/v1775147461/i3sz6wcyzpogzlfhwhza.jpg"
                  alt="Bolsa Caprese — Em Canto Artesanato"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating tag */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-3 shadow-lg border border-border">
                <p className="font-sans text-xs text-muted">Nova coleção</p>
                <p className="font-serif text-sm font-600 text-ink">Bolsa Caprese</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
