---
tags:
  - component
  - card
  - product
  - ready-to-ship
related:
  - "[[ProductCard|ProductCard]]"
  - "[[../Páginas/ProntaEntrega|Pronta Entrega Page]]"
  - "[[../Produtos/README|Produtos]]"
---

# ReadyToShipCard

**Arquivo:** `src/components/ReadyToShipCard.tsx`  
**Tipo:** Componente Reutilizável  
**Responsabilidade:** Card especial para itens prontos para entrega imediata

## 📋 Descrição

Variação do [[ProductCard|ProductCard]] otimizada para produtos já prontos. Destaca disponibilidade imediata e sem customização.

## 💻 Props

```tsx
interface Props {
  item: ReadyToShipItem
}
```

## 🎯 Diferenças vs ProductCard

- Badge "Pronto para Entrega" destacado
- Preço final visível (não apenas base + ajustes)
- Sem seção de variações
- Prioridade visual (possível destaque especial)
- Envio rápido garantido

## 🎨 Design

- **Badge:** "⚡ Pronta Entrega" em cor destaque
- **Preço:** Bem visível, grande font-size
- **Button:** Mesmo verde (#22c55e)
- **Espaçamento:** Similar ao ProductCard

## 🔗 Relações

- **Pai:** [[../Páginas/ProntaEntrega|ProntaEntrega.tsx]]
- **Usa:** [[../Produtos/README|ReadyToShipItem]]
- **Comparável:** [[ProductCard|ProductCard]]

## 📍 Hierarquia

```
ProntaEntrega.tsx
  └─ map() ReadyToShipCard[] ← TU (múltiplas instâncias)
```

---

_Componente • EmCantoArtesanato_
