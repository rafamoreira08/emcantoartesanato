---
tags:
  - component
  - product
  - card
  - whatsapp
related:
  - "[[ProductGrid|ProductGrid]]"
  - "[[../Produtos/README|Produtos]]"
  - "[[WhatsAppButton|WhatsAppButton]]"
---

# ProductCard

**Arquivo:** `src/components/ProductCard.tsx`  
**Tipo:** Componente Reutilizável  
**Responsabilidade:** Exibe um produto individual com opção de encomendar

## 📋 Descrição

Componente que renderiza um único produto com imagem, informações e botão de ação. Focal point para conversão de vendas.

## 💻 Props

```tsx
interface Props {
  product: Product
}
```

## 🎯 Renderiza

- Imagem principal do produto
- Nome do produto
- Descrição curta
- Preço base
- Badge (se pronto para entrega)
- Botão "Encomendar via WhatsApp"

## 🎨 Design

- **Layout:** Card com sombra suave
- **Imagem:** Responsiva, aspect-ratio consistente
- **Botão:** Verde (#22c55e) - cor WhatsApp
- **Typography:** Nome em serif, descrição em sans

## 🔄 Interações

- **Click no botão:** Abre WhatsApp com mensagem pré-preenchida
- **Hover:** Possível efeito visual (sombra aumenta, botão se destaca)

## 🔗 Relações

- **Pai:** [[ProductGrid|ProductGrid]]
- **Usa:** [[../Produtos/README|Modelo Product]]
- **Liga para:** WhatsApp API

## 📍 Hierarquia

```
ProductGrid.tsx
  └─ map() ProductCard[] ← TU (múltiplas instâncias)
```

---

_Componente • EmCantoArtesanato_
