---
tags:
  - page
  - products
  - ready-to-ship
  - special
related:
  - "[[Bolsas|Bolsas]]"
  - "[[../Componentes/ReadyToShipCard|ReadyToShipCard]]"
  - "[[../Produtos/README|Produtos]]"
---

# ProntaEntrega

**Arquivo:** `src/pages/ProntaEntrega.tsx`  
**Rota:** `/pronta-entrega`  
**Responsabilidade:** Mostra itens prontos para envio imediato

## 📋 Descrição

Página especial que exibe apenas produtos com `isReadyToShip: true`. Sem customização, envio garantido.

## 🎯 Estrutura

```tsx
const [readyItems, setReadyItems] = useState<ReadyToShipItem[]>([])

useEffect(() => {
  loadReadyItems()
}, [])

return (
  <>
    <CategoryHero 
      title="Pronta Entrega"
      description="Itens prontos para envio imediato!"
    />
    {readyItems.map(item => (
      <ReadyToShipCard key={item.productId} item={item} />
    ))}
  </>
)
```

## 🧩 Componentes Usados

- [[../Componentes/CategoryHero|CategoryHero]]
- [[../Componentes/ReadyToShipCard|ReadyToShipCard]]

## 📊 Dados

- Usa [[../Funções/README#loadreadyitems|loadReadyItems()]]
- Filtra produtos com `isReadyToShip: true`
- Preço final já definido

## 🔗 Relações

- Relacionada: [[Bolsas|Catálogos]]
- Usa: [[../Funções/README|Funções]]

---

_Página • EmCantoArtesanato_
