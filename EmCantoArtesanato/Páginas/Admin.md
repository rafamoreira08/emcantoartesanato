---
tags:
  - page
  - admin
  - crud
  - products
  - orders
related:
  - "[[Rastreio|Rastreio]]"
  - "[[../Funções/README|Funções]]"
  - "[[../Produtos/README|Produtos]]"
---

# Admin

**Arquivo:** `src/pages/Admin.tsx`  
**Rota:** `/admin`  
**Responsabilidade:** Painel administrativo para gerenciar produtos e pedidos

## 📋 Descrição

Painel exclusivo para Sônia gerenciar todo o catálogo e rastreamento de pedidos.

## 🎯 Responsabilidades

- ✅ Criar novo produto
- ✅ Editar produto existente
- ✅ Deletar produto
- ✅ Upload de fotos
- ✅ Definir preços e variações
- ✅ Visualizar pedidos
- ✅ Atualizar status de pedidos

## 🎯 Estrutura

```tsx
export default function Admin() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()  // Carrega todos
  }, [])

  const handleSaveProduct = async (product: Product) => {
    await saveProduct(product)
    loadProducts()
  }

  return (
    <>
      <h1>Painel Administrativo</h1>
      <ProductForm onSave={handleSaveProduct} />
      <ProductList 
        products={products}
        onDelete={handleDeleteProduct}
      />
    </>
  )
}
```

## 🔧 Funções Principais

- [[../Funções/README#saveproduct|saveProduct()]]
- [[../Funções/README#deleteproduct|deleteProduct()]]
- [[../Funções/README#loadproducts|loadProducts()]]
- [[../Funções/README#uploadimage|uploadImage()]]
- [[../Funções/README#updateorderstatus|updateOrderStatus()]]

## 🔐 Segurança

- ⚠️ Requer autenticação
- ⚠️ Apenas admin (Sônia) tem acesso
- ⚠️ Usa Firebase Rules

## 🔗 Relações

- **Usa:** Todas as [[../Funções/README|Funções]] principais
- **Trabalha com:** [[../Produtos/README|Produtos]]
- **Conectada:** [[Rastreio|Rastreio]]

---

_Página • EmCantoArtesanato_
