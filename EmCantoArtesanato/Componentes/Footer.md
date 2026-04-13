---
tags:
  - component
  - layout
  - footer
  - contact
related:
  - "[[Header|Header]]"
  - "[[../Brand/README|Brand]]"
---

# Footer

**Arquivo:** `src/components/Footer.tsx`  
**Tipo:** Componente de Layout  
**Responsabilidade:** Rodapé com informações de contato

## 📋 Descrição

Componente de rodapé que aparece na base de todas as páginas. Contém links úteis, informações de contato e copyright.

## 🎯 Conteúdo

- Links úteis (Home, Catálogos, Rastreio)
- Informações de contato
- Link WhatsApp
- Copyright e ano
- Créditos (desenvolvido por...)

## 💻 Props

```tsx
interface Props {
  // Nenhum prop - componente estático
}
```

## 🎨 Design

- **Background:** Cream (#fffdd0) ou branco
- **Divisor superior:** Cor `border` (#e5e7eb)
- **Tipografia:** Sans (cor muted #6b7280)
- **Ícones:** Lucide React

## 🔗 Links

- WhatsApp: https://wa.me/55...
- Links internos via React Router

## 📍 Localização no Layout

```
┌─────────────────┐
│     HEADER      │
├─────────────────┤
│  main (Outlet)  │
├─────────────────┤
│    FOOTER ← TU  │
└─────────────────┘
```

## 🔗 Relações

- **Pai:** [[../App|App.tsx (Layout raiz)]]
- **Irmãos:** [[Header|Header]], [[WhatsAppButton|WhatsAppButton]]

---

_Componente • EmCantoArtesanato_
