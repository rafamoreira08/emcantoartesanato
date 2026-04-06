export interface ProductPhoto {
  url: string
  color?: string
  thread?: string
}

export interface ProductVariation {
  name: string
  options: { label: string; priceAdjust: number }[]
}

export interface Product {
  id: string
  name: string
  category: 'bolsas' | 'colares' | 'centros-de-mesa'
  description: string
  basePrice: number
  image: string
  photos?: ProductPhoto[]
  variations?: ProductVariation[]
  active: boolean
  isReadyToShip: boolean
  isFeatured?: boolean
  order?: number
}
