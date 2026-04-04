import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'

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
    </>
  )
}
