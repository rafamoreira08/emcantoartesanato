---
tags:
  - products
  - data-model
  - catalog
  - bolsas
  - colares
  - mesa-posta
related:
  - "[[Páginas/README|Páginas]]"
  - "[[Componentes/README|Componentes de Produto]]"
  - "[[Funções/README|Funções de Produto]]"
  - "[[Brand/README|Brand]]"
---

# 🛍️ Produtos - Catálogo

Documentação das 3 linhas de produtos de [[Brand/README|Sonia Lima]].

**Links Relacionados:** [[Páginas/README#🎒-bolsas-catálogo|Página Bolsas]] · [[Páginas/README#💎-colares-catálogo|Página Colares]] · [[Funções/README#loadproducts|loadProducts()]]

---

## 📊 Visão Geral

| Linha | Descrição | Status | Rota |
|-------|-----------|--------|------|
| **Bolsas Artesanais** | Crochê/tricô em fios variados | ✅ Ativa | `/bolsas` |
| **Colares Artesanais** | Cordões em crochê + pedras/resinas | ✅ Ativa | `/colares` |
| **Centros de Mesa** | Sousplats em crochê | ⏳ Expandindo | `/mesa-posta` |

---

## 🎒 Bolsas Artesanais

**Categoria:** `bolsas`

### Descrição
Bolsas artesanais feitas à mão em crochê ou tricô, com acabamento único e cheio de personalidade. 

### Materiais
- Fios sintéticos
- Malha
- Viscose
- Ráfia

### Características
- Handmade (feito à mão)
- Cores variadas
- Acabamento exclusivo
- Personalização disponível

### Dados da Interface
```typescript
{
  id: string                    // ID único
  name: string                  // Nome da bolsa
  category: 'bolsas'
  description: string           // Descrição detalhada
  basePrice: number            // Preço base
  image: string                // Foto principal
  photos: ProductPhoto[]       // Galeria de fotos
  variations: ProductVariation[] // Opções de cor/tamanho
  isReadyToShip: boolean      // Pronto para envio?
}
```

### Variações Comuns
- **Cores:** Rosa, azul, verde, preto, branco, multicolor
- **Tamanhos:** P, M, G
- **Estilos:** Tote, crossbody, clutch, mochila

---

## 💎 Colares Artesanais

**Categoria:** `colares`

### Descrição
Peças confeccionadas com cordões tecidos em crochê, elaborados com fios especiais, combinados a resinas, pedras e metais cuidadosamente selecionados.

### Componentes
- **Base:** Cordão em crochê
- **Detalhes:** Resinas, pedras, metais
- **Fechos:** Metálicos (qualidade)
- **Acabamento:** Refinado

### Características
- Únicos (cada um é diferente)
- Identidade própria
- Autenticidade garantida
- Personalização possível

### Tipos de Colares
- **Colares longos** - Comprimento total
- **Chokers** - Colarinho curto
- **Colares curtos** - Médio comprimento

### Variações
- **Estilos:** Minimalista, boho, clássico, moderno
- **Cores:** Todas as cores disponíveis
- **Materiais:** Crochê + resina, crochê + pedras, crochê + metais

---

## 🪣 Centros de Mesa (Sousplats)

**Categoria:** `centros-de-mesa`

### Descrição
Peças decorativas em crochê para a mesa, também conhecidas como **sousplats** (apoios para prato).

### Uso
- Decoração de mesa
- Proteção de superfícies
- Acabamento elegante
- Personalizável

### Materiais
- Crochê artesanal
- Fios de qualidade
- Acabamento refinado

### Variações
- **Tamanhos:** Pequeno (prato), médio, grande
- **Cores:** Todas as opções disponíveis
- **Formatos:** Redondo, quadrado, hexagonal

---

## 📸 Estrutura de Fotos (ProductPhoto)

Cada produto pode ter múltiplas fotos:

```typescript
{
  url: string              // URL da imagem
  color?: string           // Cor desta foto ("rosa", "azul")
  thread?: string          // Tipo de fio usado
  isReadyToShip?: boolean  // Pronto para enviar?
  priceAdjust?: number     // Ajuste de preço (+/- valor)
}
```

### Exemplo
```json
{
  "url": "https://..../bolsa-rosa-m.jpg",
  "color": "Rosa",
  "thread": "Viscose",
  "isReadyToShip": true,
  "priceAdjust": 0
}
```

---

## 💰 Preço & Variações

### Preço Base
Cada produto tem um `basePrice` que é o preço mínimo.

### Ajustes de Preço
Variações podem ter `priceAdjust` (incremento/decremento):

```typescript
{
  label: "M (Médio)",        // Rótulo da opção
  priceAdjust: 0             // Sem ajuste
}
{
  label: "G (Grande)",
  priceAdjust: 50            // +R$50
}
{
  label: "Rosa",
  priceAdjust: 0             // Sem ajuste adicional
}
```

### Preço Final
```
Preço Final = basePrice + priceAdjust1 + priceAdjust2 + ...
```

---

## 🚀 Pronto para Entrega (Ready to Ship)

Alguns produtos têm versão **pronta para envio imediato**.

```typescript
{
  productId: string          // Referência ao produto
  name: string              // Nome do item
  description: string        // Descrição
  photo: ProductPhoto        // Foto
  basePrice: number         // Preço
  finalPrice: number        // Preço final (com ajustes)
}
```

### Quando usar
- Cliente quer receber logo
- Sem customização
- Pronto no estoque

---

## 🔄 Fluxo do Produto

```
Produto criado no Admin
    ↓
Firebase Database armazena
    ↓
products.ts busca dados
    ↓
ProductGrid renderiza
    ↓
ProductCard mostra ao cliente
    ↓
Cliente clica → WhatsApp
    ↓
Sonia recebe pedido + foto
    ↓
Customiza se necessário
    ↓
Envia para cliente
```

---

## 📋 Checklist para Novo Produto

- [ ] Nome e descrição
- [ ] Categoria (bolsas/colares/centros-de-mesa)
- [ ] Preço base
- [ ] Foto principal
- [ ] Galeria de fotos (mínimo 3)
- [ ] Variações (cores/tamanhos)
- [ ] Pronto para entrega? (sim/não)
- [ ] Ativo? (sim/não)
- [ ] Destaque na home? (opcional)

---

_Documentação de Produtos • EmCantoArtesanato_
