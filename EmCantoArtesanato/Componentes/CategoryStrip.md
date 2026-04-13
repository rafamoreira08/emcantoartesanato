---
tags:
  - component
  - category
  - card
  - cta
related:
  - "[[ProductCard|ProductCard]]"
  - "[[../Páginas/Home|Home]]"
---

# CategoryStrip

**Arquivo:** `src/components/CategoryStrip.tsx`  
**Tipo:** Componente de Conteúdo  
**Responsabilidade:** Card com descrição de categoria + CTA

## 📋 Descrição

Componente que funciona como uma "faixa" ou strip de categoria na home. Exibe uma descrição da categoria e um botão que leva para o catálogo completo.

## 💻 Props

```tsx
interface Props {
  category: string
  title: string
  description: string
  ctaLink: string              // Rota (ex: "/bolsas")
  ctaLabel: string             // Texto do botão (ex: "Ver todas")
}
```

## 📝 Exemplo de Uso

```tsx
<CategoryStrip
  category="bolsas"
  title="Bolsas Artesanais"
  description="Bolsas em crochê com acabamento único..."
  ctaLink="/bolsas"
  ctaLabel="Ver todas as bolsas"
/>
```

## 🎯 Funcionalidades

- Título da categoria
- Descrição textual
- Possível imagem/ícone
- Botão CTA que leva para catálogo

## 🎨 Design

- **Background:** Cream (#fffdd0) ou branco
- **Button:** Verde (#22c55e) com hover effect
- **Padding:** Generoso (`py-12 px-6`)
- **Typography:** Título serif, descrição sans

## 🔗 Relações

- **Pai:** [[../Páginas/Home|Home.tsx]]
- **Usa:** [[../Páginas/README|Rotas]] via `ctaLink`

## 📍 Hierarquia

```
Home.tsx
  └─ Hero
  └─ CategoryStrip (bolsas) ← TU (instância 1)
  └─ CategoryStrip (colares) ← TU (instância 2)
  └─ CategoryStrip (mesa-posta) ← TU (instância 3)
```

---

_Componente • EmCantoArtesanato_
