---
tags:
  - page
  - home
  - landing
  - route
related:
  - "[[Bolsas|Bolsas Catálogo]]"
  - "[[Colares|Colares Catálogo]]"
  - "[[../Componentes/Hero|Hero Component]]"
---

# Home

**Arquivo:** `src/pages/Home.tsx`  
**Rota:** `/`  
**Responsabilidade:** Página inicial e apresentação do projeto

## 📋 Descrição

Landing page que apresenta a marca EmCanto e direciona usuários para os diferentes catálogos.

## 🎯 Estrutura de Conteúdo

```tsx
<>
  <Hero />
  
  <CategoryStrip
    category="bolsas"
    title="Bolsas Artesanais"
    description="Bolsas feitas à mão..."
    ctaLink="/bolsas"
  />
  
  <CategoryStrip
    category="colares"
    title="Colares e Chokers"
    ctaLink="/colares"
  />
  
  <CategoryStrip
    category="centros-de-mesa"
    title="Mesa Posta"
    ctaLink="/mesa-posta"
  />
</>
```

## 🧩 Componentes Usados

- [[../Componentes/Hero|Hero]] - Banner principal
- [[../Componentes/CategoryStrip|CategoryStrip]] (x3) - Para cada categoria

## 📊 Dados

Nenhum - apenas componentes estáticos com CTAs

---

_Página • EmCantoArtesanato_
