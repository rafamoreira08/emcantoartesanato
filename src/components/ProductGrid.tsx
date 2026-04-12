/** Grade de produtos filtrada por categoria do Firestore */
import { useEffect, useState } from 'react'
import { fetchProducts } from '../lib/products'
import ProductCard from './ProductCard'
import type { Product } from '../types/product'

interface Props {
  category?: string
  title: string
  subtitle?: string
}

export default function ProductGrid({ category, title, subtitle }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts(category)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [category])

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <h2 className="font-serif text-4xl lg:text-5xl text-ink font-700">{title}</h2>
        {subtitle && <p className="font-sans text-muted mt-3 max-w-lg leading-relaxed">{subtitle}</p>}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-border/50 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-serif text-2xl text-muted">Em breve novas peças</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  )
}
