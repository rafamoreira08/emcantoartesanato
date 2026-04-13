---
tags:
  - component
  - grid
  - layout
  - product
related:
  - "[[ProductCard|ProductCard]]"
  - "[[../Páginas/Bolsas|Páginas de Categoria]]"
  - "[[../Produtos/README|Produtos]]"
---

# ProductGrid

**Arquivo:** `src/components/ProductGrid.tsx`  
**Tipo:** Componente de Layout  
**Responsabilidade:** Grid responsivo de produtos

## 📋 Descrição

Componente que renderiza uma coleção de produtos em um grid responsivo. Adapta o número de colunas conforme o tamanho da tela.

## 💻 Props

```tsx
interface Props {
  products: Product[]
  category?: 'bolsas' | 'colares' | 'centros-de-mesa'
}
```

## 🎯 Funcionalidades

- Renderiza múltiplos [[ProductCard|ProductCard]]
- Grid responsivo automático
- Espaçamento consistente entre itens

## 📱 Responsividade

- **Mobile:** 1 coluna
- **Tablet (md):** 2 colunas
- **Desktop (lg):** 3+ colunas
- Usa Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## 🎨 Design

- **Gap:** `gap-6` (24px entre itens)
- **Padding:** `px-6 py-12` (margens ao redor)
- **Max-width:** Possível limitação em desktops muito largos

## 🔗 Relações

- **Pais:** [[../Páginas/Bolsas|Bolsas.tsx]], [[../Páginas/Colares|Colares.tsx]], etc
- **Filhos:** [[ProductCard|ProductCard]] (múltiplas instâncias via map())
- **Usa:** [[../Produtos/README|Product[]]]

## 📍 Hierarquia

```
Bolsas.tsx
  └─ CategoryHero
  └─ ProductGrid ← TU
      └─ ProductCard[]
```

---

_Componente • EmCantoArtesanato_
