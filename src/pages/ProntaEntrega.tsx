/** Página de variações disponíveis para pronta entrega */
import { useState, useEffect } from 'react'
import CategoryHero from '../components/CategoryHero'
import ReadyToShipCard from '../components/ReadyToShipCard'
import { fetchReadyToShipVariations } from '../lib/products'
import type { ReadyToShipItem } from '../types/product'

export default function ProntaEntrega() {
  const [items, setItems] = useState<ReadyToShipItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReadyToShipVariations().then(data => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <CategoryHero title="Pronta Entrega" />

      <section className="py-12 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="font-sans text-muted text-center py-20">
              Nenhuma peça disponível para pronta entrega no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => (
                <ReadyToShipCard key={`${item.productId}-${i}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
