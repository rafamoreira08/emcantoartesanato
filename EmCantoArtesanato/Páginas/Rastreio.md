---
tags:
  - page
  - tracking
  - orders
  - customer-service
related:
  - "[[Admin|Admin]]"
  - "[[../Funções/README|Funções]]"
  - "[[../Produtos/README|Produtos]]"
---

# Rastreio

**Arquivo:** `src/pages/Rastreio.tsx`  
**Rota:** `/rastreio`  
**Responsabilidade:** Permite cliente rastrear seu pedido

## 📋 Descrição

Página que permite ao cliente digitar o ID do pedido e ver o status em tempo real.

## 🎯 Estrutura

```tsx
const [trackingId, setTrackingId] = useState('')
const [orderStatus, setOrderStatus] = useState<Order | null>(null)

const handleSearch = async () => {
  const order = await fetchOrder(trackingId)
  setOrderStatus(order)
}

return (
  <>
    <input 
      placeholder="Digite o ID do pedido"
      value={trackingId}
      onChange={(e) => setTrackingId(e.target.value)}
    />
    <button onClick={handleSearch}>Rastrear</button>
    
    {orderStatus && (
      <div>
        Status: {orderStatus.status}
        Data: {orderStatus.createdAt}
      </div>
    )}
  </>
)
```

## 📊 Fluxos

```
Cliente digita ID
  ↓
Clica "Rastrear"
  ↓
fetchOrder(id)
  ↓
Firebase busca
  ↓
Exibe status
```

## 🔗 Relações

- **Usa:** [[../Funções/README#fetchorder|fetchOrder()]]
- **Relacionada:** [[Admin|Admin]] (que atualiza status)

---

_Página • EmCantoArtesanato_
