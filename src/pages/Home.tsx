import Hero from '../components/Hero'
import CategoryStrip from '../components/CategoryStrip'
import About from '../components/About'

export default function Home() {
  return (
    <>
      <Hero />

      {/* Category strips */}
      <div className="border-t border-border" />
      <CategoryStrip
        category="bolsas"
        title="Bolsas Artesanais"
        ctaLink="/bolsas"
        ctaLabel="Ver todas as bolsas"
      />

      <div className="border-t border-border" />
      <CategoryStrip
        category="colares"
        title="Colares e Chokers"
        ctaLink="/colares"
        ctaLabel="Ver todos os colares"
      />

      <div className="border-t border-border" />
      <CategoryStrip
        category="centros-de-mesa"
        title="Mesa Posta"
        ctaLink="/mesa-posta"
        ctaLabel="Ver mesa posta completa"
      />

      <div className="border-t border-border" />
      <About />
    </>
  )
}
