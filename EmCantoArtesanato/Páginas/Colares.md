---
tags:
  - page
  - catalog
  - category
  - products
related:
  - "[[Bolsas|Bolsas]]"
  - "[[MesaPosta|Mesa Posta]]"
  - "[[../Componentes/ProductGrid|ProductGrid]]"
---

# Colares

**Arquivo:** `src/pages/Colares.tsx`  
**Rota:** `/colares`  
**Responsabilidade:** Catálogo de colares artesanais

## 📋 Descrição

Página que exibe galeria de todos os colares artesanais. Busca produtos do Firebase filtrados por `category: 'colares'`.

## 🎯 Estrutura

Idêntica a [[Bolsas|Bolsas.tsx]], mas com `category: 'colares'`

```tsx
<CategoryHero
  category="colares"
  title="Colares e Chokers"
/>
<ProductGrid products={products} />
```

## 🔗 Relações

- **Irmã:** [[Bolsas|Bolsas]], [[MesaPosta|Mesa Posta]]
- **Usa:** [[../Funções/README#loadproducts|loadProducts('colares')]]

---

_Página • EmCantoArtesanato_
