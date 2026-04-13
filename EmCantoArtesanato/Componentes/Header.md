---
tags:
  - component
  - navigation
  - layout
  - header
related:
  - "[[Footer|Footer]]"
  - "[[../Páginas/README|Páginas]]"
  - "[[../Brand/README|Brand]]"
---

# Header

**Arquivo:** `src/components/Header.tsx`  
**Tipo:** Componente de Layout  
**Responsabilidade:** Navegação principal

## 📋 Descrição

Componente de navegação principal que aparece no topo de todas as páginas. Contém o logo da marca e links para as principais rotas.

## 🎯 Funcionalidades

- Logo EmCanto (link para home)
- Menu de navegação com links para:
  - Home (`/`)
  - Bolsas (`/bolsas`)
  - Colares (`/colares`)
  - Mesa Posta (`/mesa-posta`)
  - Pronta Entrega (`/pronta-entrega`)
- Responsivo (menu mobile com hamburger em telas pequenas)

## 💻 Props

```tsx
interface Props {
  // Nenhum prop - componente estático
}
```

## 🔧 Características Técnicas

- **Estado:** Pode ter estado para menu mobile (aberto/fechado)
- **Hooks:** `useState` (se mobile menu)
- **Estilos:** Tailwind CSS com classes responsivas
- **Classe raiz:** `border-b border-border` (divisor inferior)

## 🎨 Design

- Background: Branco ou cream (dependendo do design)
- Divisor inferior: Cor `border` (#e5e7eb)
- Logo: [[../Brand/Logo|Logo EmCanto]]
- Tipografia: Helvetica/Sans para links

## 📱 Responsividade

- **Mobile:** Menu hambúrguer colapsável
- **Tablet:** Menu visível, ajustar padding
- **Desktop:** Menu horizontal completo

## 🔗 Relações

- **Pai:** [[../App|App.tsx (Layout raiz)]]
- **Irmãos:** [[Footer|Footer]], [[ScrollToTop|ScrollToTop]]
- **Filhos:** Links de navegação

## 📍 Localização no Layout

```
┌─────────────────┐
│    HEADER ← TU  │
├─────────────────┤
│  main (Outlet)  │
├─────────────────┤
│    FOOTER       │
└─────────────────┘
```

---

_Componente • EmCantoArtesanato_
