---
tags:
  - page
  - catalog
  - category
  - products
related:
  - "[[Home|Home]]"
  - "[[Colares|Colares]]"
  - "[[../Componentes/ProductGrid|ProductGrid]]"
  - "[[../Produtos/README|Produtos]]"
---

# Bolsas

**Arquivo:** `src/pages/Bolsas.tsx`  
**Rota:** `/bolsas`  
**Responsabilidade:** Catálogo de bolsas artesanais

## 📋 Descrição

Página que exibe galeria de todas as bolsas artesanais. Busca produtos do Firebase filtrados por `category: 'bolsas'`.

## 🎯 Estrutura

```tsx
export default function Bolsas() {
  const [products, setProducts] = useState<Product[]>([])
  
  useEffect(() => {
    loadProducts('bolsas')
  }, [])
  
  return (
    <>
      <CategoryHero
        category="bolsas"
        title="Bolsas Artesanais"
        description="Feitas à mão em crochê..."
      />
      <ProductGrid products={products} />
    </>
  )
}
```

## 🧩 Componentes Usados

- [[../Componentes/CategoryHero|CategoryHero]]
- [[../Componentes/ProductGrid|ProductGrid]]

## 📊 Fluxo de Dados

```
useEffect → loadProducts('bolsas')
  → Firebase API
    → setProducts()
      → ProductGrid renderiza
        → ProductCard[]
```

## 🔗 Relações

- **Irmã:** [[Colares|Colares]], [[MesaPosta|Mesa Posta]]
- **Usa:** [[../Funções/README#loadproducts|loadProducts()]]
- **Mostra:** [[../Produtos/README|Produtos]] categoria bolsas

---

_Página • EmCantoArtesanato_
