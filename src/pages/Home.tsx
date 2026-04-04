import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import About from '../components/About'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="border-t border-border" />
      <ProductGrid
        category="bolsas"
        title="Bolsas Artesanais"
        subtitle="Cada peça, única. Confeccionadas à mão com fios selecionados — crochê que vira moda."
      />
      <div className="border-t border-border" />
      <About />
    </>
  )
}
