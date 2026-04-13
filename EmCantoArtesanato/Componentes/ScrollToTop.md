---
tags:
  - component
  - utility
  - scroll
  - navigation
related:
  - "[[Header|Header]]"
  - "[[../Páginas/README|Páginas]]"
---

# ScrollToTop

**Arquivo:** `src/components/ScrollToTop.tsx`  
**Tipo:** Componente Utilitário  
**Responsabilidade:** Volta ao topo ao mudar de página

## 📋 Descrição

Componente "invisível" que garante que o scroll volte ao topo quando o usuário navega para uma página diferente. Melhora UX em SPAs.

## 🎯 Funcionalidades

- Detecta mudança de rota via `useLocation()`
- Executa `window.scrollTo(0, 0)` ao mudar
- Sem renderização visual

## 💻 Props

```tsx
interface Props {
  // Nenhum prop
}
```

## 💻 Implementação

```tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null  // Sem renderização visual
}
```

## 🔗 Relações

- **Pai:** [[../App|App.tsx (Layout raiz)]]
- **Irmãos:** [[Header|Header]], [[Footer|Footer]]

---

_Componente • EmCantoArtesanato_
