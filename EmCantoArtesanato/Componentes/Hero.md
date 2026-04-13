---
tags:
  - component
  - hero
  - banner
  - home
related:
  - "[[CategoryHero|CategoryHero]]"
  - "[[../Páginas/Home|Home Page]]"
  - "[[../Brand/Logo|Logo]]"
---

# Hero

**Arquivo:** `src/components/Hero.tsx`  
**Tipo:** Componente de Conteúdo  
**Responsabilidade:** Banner principal da home

## 📋 Descrição

Componente hero que aparece no topo da página Home. Exibe o logo da marca e uma imagem de destaque.

## 🎯 Conteúdo

- Logo EmCanto (sem fundo)
- Imagem de destaque/hero
- Possível CTA (Call-to-Action)

## 💻 Props

```tsx
interface Props {
  // Nenhum prop - componente estático
}
```

## 🎨 Design

- **Logo:** [[../Brand/Logo|logo_sem_fundo.png]]
- **Tamanho:** Full-width, altura responsiva
- **Mobile:** Logo full-width com margens consistentes
- **Desktop:** Logo destacado, centralizado

## 📱 Responsividade

- Mobile: Logo ocupa toda a largura
- Tablet: Logo centrado com margens
- Desktop: Logo pode ter max-width

## 🔗 Relações

- **Pai:** [[../Páginas/Home|Home.tsx]]
- **Usa:** [[../Brand/Logo|Logo da marca]]

## 📍 Hierarquia

```
Home.tsx
  └─ Hero ← TU
  └─ CategoryStrip[]
  └─ CTA
```

---

_Componente • EmCantoArtesanato_
