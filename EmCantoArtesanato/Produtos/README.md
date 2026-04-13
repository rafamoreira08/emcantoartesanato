---
tags:
  - products
  - index
  - data-model
  - catalog
related:
  - "[[../Páginas/README|Páginas]]"
  - "[[../Componentes/README|Componentes]]"
  - "[[../Funções/README|Funções]]"
---

# 🛍️ Produtos - Índice

Documentação das 3 linhas de produtos de [[../Brand/README|Sônia Lima]].

**Ver também:** [[../Páginas/README|Páginas de Catálogo]] · [[../Componentes/ProductCard|ProductCard]] · [[../Funções/README|Funções de Produto]]

---

## 📊 Visão Geral das Linhas

| Linha | Status | Rota | Descrição |
|-------|--------|------|-----------|
| [[Bolsas|🎒 Bolsas Artesanais]] | ✅ Ativa | `/bolsas` | Crochê/tricô em fios variados |
| [[Colares|💎 Colares Artesanais]] | ✅ Ativa | `/colares` | Cordões + pedras/resinas/metais |
| [[MesaPosta|🪣 Centros de Mesa]] | ⏳ Expandindo | `/mesa-posta` | Sousplats em crochê |

---

## 🎯 Linhas de Produtos

### [[Bolsas|🎒 Bolsas Artesanais]]

Bolsas handmade em crochê ou tricô com acabamento único.

- **Materiais:** Fios sintéticos, malha, viscose, ráfia
- **Variações:** Cores, tamanhos (P/M/G), estilos (tote, crossbody, clutch)
- **Página:** [[../Páginas/Bolsas|/bolsas]]

### [[Colares|💎 Colares Artesanais]]

Peças com cordões em crochê combinados a resinas, pedras e metais.

- **Componentes:** Crochê, resinas, pedras, metais
- **Variações:** Tamanhos, cores, estilos
- **Página:** [[../Páginas/Colares|/colares]]

### [[MesaPosta|🪣 Centros de Mesa]]

Centros de mesa (sousplats) em crochê - área em expansão.

- **Tipo:** Sousplats, trilhos, centros
- **Status:** Em desenvolvimento
- **Página:** [[../Páginas/MesaPosta|/mesa-posta]]

---

## 💾 Modelo de Dados

### Product Interface

```typescript
interface Product {
  id: string                         // ID único
  name: string                       // Nome
  category: 'bolsas' | 'colares' | 'centros-de-mesa'
  description: string                // Descrição
  basePrice: number                  // Preço base
  image: string                      // Foto principal (URL)
  photos?: ProductPhoto[]            // Galeria
  variations?: ProductVariation[]    // Opções (cor, tamanho)
  active: boolean                    // Listado?
  isReadyToShip: boolean            // Pronto para entrega?
  isFeatured?: boolean              // Destacado?
  order?: number                     // Ordem de exibição
}
```

### ProductPhoto Interface

```typescript
interface ProductPhoto {
  url: string                        // URL da imagem
  color?: string                     // Cor (se aplicável)
  thread?: string                    // Tipo de fio/material
  isReadyToShip?: boolean           // Pronto?
  priceAdjust?: number              // Ajuste de preço
}
```

### ProductVariation Interface

```typescript
interface ProductVariation {
  name: string                       // "Tamanho", "Cor", etc
  options: {
    label: string                    // "P", "Vermelho", etc
    priceAdjust: number             // Ajuste de preço
  }[]
}
```

---

## 💰 Estrutura de Preços

**Base:** `basePrice` - preço padrão do produto

**Ajustes:** 
- Por variação (tamanho, cor): `priceAdjust` positivo/negativo
- Por foto específica: `ProductPhoto.priceAdjust`
- Exemplo: Bolsa G (+R$50), Cor premium (+R$30)

**Final:** `basePrice + variationAdjust + photoAdjust`

---

## 🔗 Relações

### Produtos → Páginas

- [[Bolsas|Bolsas]] → [[../Páginas/Bolsas|/bolsas]]
- [[Colares|Colares]] → [[../Páginas/Colares|/colares]]
- [[MesaPosta|Mesa Posta]] → [[../Páginas/MesaPosta|/mesa-posta]]

### Produtos → Componentes

- Exibidos via [[../Componentes/ProductCard|ProductCard]]
- Em grids via [[../Componentes/ProductGrid|ProductGrid]]
- Itens prontos via [[../Componentes/ReadyToShipCard|ReadyToShipCard]]

### Produtos → Funções

- Carregados por [[../Funções/README|loadProducts()]]
- Salvos por [[../Funções/README|saveProduct()]]
- Deletados por [[../Funções/README|deleteProduct()]]

---

## 📊 Estatísticas

- **Total de linhas:** 3
- **Total de produtos:** ~20+ (crescente)
- **Categorias:** 3
- **Status ativo:** 2 (Bolsas, Colares)
- **Em desenvolvimento:** 1 (Mesa Posta)

---

_Índice de Produtos • EmCantoArtesanato_
