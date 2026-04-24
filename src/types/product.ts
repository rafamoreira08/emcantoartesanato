export interface ProductPhoto {
  url: string
  color?: string
  thread?: string
  description?: string
  isReadyToShip?: boolean
  priceAdjust?: number
}

export interface ProductVariation {
  name: string
  options: { label: string; priceAdjust: number }[]
}

export interface ReadyToShipItem {
  productId: string
  name: string
  description: string
  photo: ProductPhoto
  basePrice: number
  finalPrice: number
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
