---
tags:
  - component
  - button
  - whatsapp
  - floating
  - cta
related:
  - "[[ProductCard|ProductCard]]"
  - "[[../Brand/README|Brand]]"
---

# WhatsAppButton

**Arquivo:** `src/components/WhatsAppButton.tsx`  
**Tipo:** Componente Funcional  
**Responsabilidade:** Botão flutuante verde (primary CTA)

## 📋 Descrição

Botão flutuante fixo no canto da tela que abre WhatsApp. Principal meio de contato com Sônia.

## 🎯 Funcionalidades

- Botão circular/pill com ícone WhatsApp
- Posição fixa (fixed positioning)
- Link direto para WhatsApp
- Possível label "Encomendar"

## 💻 Props

```tsx
interface Props {
  // Nenhum prop - componente estático
  // Link é hardcoded com número da Sônia
}
```

## 🎨 Design

- **Cor:** Verde (#22c55e) - WhatsApp oficial
- **Posição:** Bottom-right fixo
- **Tamanho:** Grande e visível
- **Ícone:** Lucide React WhatsApp icon
- **Shadow:** Sombra suave para destaque

## 📱 Responsividade

- **Mobile:** Tamanho grande, sempre visível
- **Desktop:** Pode ter tamanho reduzido ou estar escondido (usuários desktops usam ProductCard)

## 🔗 Relações

- **Pai:** [[../App|App.tsx (Layout raiz)]]
- **Irmãos:** [[Header|Header]], [[Footer|Footer]]
- **Liga para:** WhatsApp API

---

_Componente • EmCantoArtesanato_
