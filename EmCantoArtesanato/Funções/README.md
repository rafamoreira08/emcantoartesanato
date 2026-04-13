---
tags:
  - functions
  - api
  - firebase
  - typescript
  - backend
related:
  - "[[Páginas/README|Páginas (usam funções)]]"
  - "[[Produtos/README|Modelo de Dados]]"
  - "[[Arquitetura/README|Arquitetura Firebase]]"
---

# ⚙️ Funções Principais

Documentação das funções críticas do projeto (principalmente Admin).

**Links Relacionados:** [[Páginas/README#⚙️-admin-panel|Admin Panel]] · [[Arquitetura/README#-modelo-de-dados-firebase|Modelo Firebase]] · [[Páginas/README#📍-rastreio|Rastreamento]]

---

## 📍 Localização
```
src/lib/products.ts  ← Funções principais
src/pages/Admin.tsx  ← UI que usa as funções
src/lib/firebase.ts  ← Config do Firebase
```

---

## 📦 Funções de Produto

### loadProducts(category?)

**Propósito:** Buscar produtos do Firebase

```typescript
async function loadProducts(category?: string): Promise<Product[]>
```

**Parâmetros:**
- `category` (opcional) - Filtrar por categoria

**Retorna:**
- `Product[]` - Array de produtos

**Exemplo:**
```tsx
// Buscar todas
const allProducts = await loadProducts()

// Buscar por categoria
const bags = await loadProducts('bolsas')
```

**Implementação:**
```tsx
async function loadProducts(category?: string) {
  const productsRef = ref(db, 'products')
  const snapshot = await get(productsRef)
  
  let products = snapshot.val() || {}
  
  if (category) {
    products = Object.values(products).filter(
      p => p.category === category
    )
  }
  
  return Object.values(products)
}
```

---

### saveProduct(product)

**Propósito:** Salvar novo produto ou atualizar existente

```typescript
async function saveProduct(product: Product): Promise<void>
```

**Parâmetros:**
- `product` - Objeto Product completo

**Exemplo:**
```tsx
const newProduct: Product = {
  id: 'bolsa-nova-001',
  name: 'Bolsa Verde',
  category: 'bolsas',
  description: 'Bolsa em crochê verde...',
  basePrice: 180,
  image: 'https://...',
  photos: [...],
  variations: [...],
  active: true,
  isReadyToShip: false
}

await saveProduct(newProduct)
```

**Fluxo:**
```
Firebase: products/{id} = product
  └─ Cria ou atualiza documento
```

---

### deleteProduct(id)

**Propósito:** Deletar produto do Firebase

```typescript
async function deleteProduct(id: string): Promise<void>
```

**Parâmetros:**
- `id` - ID do produto a deletar

**Exemplo:**
```tsx
await deleteProduct('bolsa-001')
// Produto removido da lista
// Próxima busca não retorna este produto
```

**Fluxo:**
```
Firebase: products/{id} deletado
  └─ Documento removido completamente
```

---

### loadReadyItems()

**Propósito:** Buscar itens prontos para entrega imediata

```typescript
async function loadReadyItems(): Promise<ReadyToShipItem[]>
```

**Retorna:**
- `ReadyToShipItem[]` - Itens com isReadyToShip: true

**Exemplo:**
```tsx
const readyItems = await loadReadyItems()
// Retorna apenas produtos prontos
// Array com preço final já definido
```

---

### fetchOrder(orderId)

**Propósito:** Buscar pedido para rastreamento

```typescript
async function fetchOrder(orderId: string): Promise<Order | null>
```

**Parâmetros:**
- `orderId` - ID do pedido

**Retorna:**
- `Order` - Dados do pedido
- `null` - Se não encontrar

**Exemplo:**
```tsx
const order = await fetchOrder('pedido-2026-001')
if (order) {
  console.log(order.status)  // 'em-producao'
  console.log(order.estimatedDelivery)  // '2026-05-13'
}
```

---

## 🎯 Funções do Admin Panel

### saveOrder(order)

**Propósito:** Criar novo pedido (após cliente encomendar)

```typescript
async function saveOrder(order: Order): Promise<void>
```

**Parâmetros:**
```typescript
{
  id: string              // ID único do pedido
  productId: string       // Qual produto
  productName: string     // Nome do produto
  customerName: string    // Nome cliente
  customerPhone: string   // Telefone cliente
  status: string          // 'em-producao' | 'enviado' | 'entregue'
  createdAt: Date         // Data criação
  estimatedDelivery: Date // Data estimada entrega
  notes: string           // Observações (customizações)
}
```

**Exemplo:**
```tsx
const order: Order = {
  id: 'pedido-2026-001',
  productId: 'bolsa-001',
  productName: 'Bolsa Rosa',
  customerName: 'João Silva',
  customerPhone: '11 9 8765-4321',
  status: 'em-producao',
  createdAt: new Date(),
  estimatedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
  notes: 'Cliente pediu rosa mais claro'
}

await saveOrder(order)
```

---

### updateOrderStatus(orderId, status)

**Propósito:** Atualizar status de um pedido

```typescript
async function updateOrderStatus(
  orderId: string,
  status: 'em-producao' | 'enviado' | 'entregue'
): Promise<void>
```

**Parâmetros:**
- `orderId` - ID do pedido
- `status` - Novo status

**Exemplo:**
```tsx
await updateOrderStatus('pedido-2026-001', 'enviado')
// Cliente vê no rastreio: "Seu pedido foi enviado!"
```

---

### deleteOrder(orderId)

**Propósito:** Remover pedido (raramente usado)

```typescript
async function deleteOrder(orderId: string): Promise<void>
```

---

## 🔒 Funções de Autenticação

### loginAdmin(email, password)

**Propósito:** Fazer login do admin

```typescript
async function loginAdmin(email: string, password: string): Promise<User | null>
```

**Parâmetros:**
- `email` - Email admin
- `password` - Senha

**Retorna:**
- `User` - Dados do usuário autenticado
- `null` - Se falhar

**Exemplo:**
```tsx
const user = await loginAdmin('sonia@emcanto.com', 'senha123')
if (user) {
  // Redirecionar para /admin
}
```

---

### logoutAdmin()

**Propósito:** Fazer logout

```typescript
async function logoutAdmin(): Promise<void>
```

**Exemplo:**
```tsx
await logoutAdmin()
// Redirecionar para home
```

---

### isAdminLoggedIn()

**Propósito:** Verificar se admin está logado

```typescript
function isAdminLoggedIn(): boolean
```

**Exemplo:**
```tsx
if (!isAdminLoggedIn()) {
  // Redirecionar para login
}
```

---

## 📸 Funções de Upload

### uploadImage(file)

**Propósito:** Upload de foto para Firebase Storage

```typescript
async function uploadImage(file: File): Promise<string>
```

**Parâmetros:**
- `file` - Arquivo de imagem

**Retorna:**
- `string` - URL da imagem no storage

**Exemplo:**
```tsx
const input = document.querySelector('input[type="file"]')
const file = input.files[0]

const imageUrl = await uploadImage(file)
// Usar imageUrl no produto
```

---

## 🚀 Fluxos de Uso

### Criar Novo Produto (Admin)

```
Admin.tsx (Admin page)
  ├─ ProductForm abre
  │   ├─ Preenche: nome, descrição, preço
  │   ├─ Upload foto: uploadImage(file)
  │   └─ Define variações
  │
  ├─ Clica "Salvar"
  │   └─ saveProduct(product)
  │       └─ Firebase: products/{id} = product
  │
  └─ loadProducts() recarrega
      └─ Nova produto na lista
```

### Rastrear Pedido (Cliente)

```
Rastreio.tsx (Tracking page)
  ├─ Cliente digita ID do pedido
  ├─ Clica "Rastrear"
  │   └─ fetchOrder(orderId)
  │       └─ Firebase: orders/{id}
  │
  └─ Status exibido
      └─ "Em produção"
      └─ "Enviado"
      └─ "Entregue"
```

### Atualizar Pedido (Admin)

```
Admin.tsx
  ├─ Lista de pedidos exibida
  ├─ Admin clica "Enviado"
  │   └─ updateOrderStatus(orderId, 'enviado')
  │       └─ Firebase: orders/{id}.status = 'enviado'
  │
  └─ Cliente vê no /rastreio
      └─ "Seu pedido foi enviado!"
```

---

## 📝 Estrutura de Tipos

### Product

```typescript
interface Product {
  id: string
  name: string
  category: 'bolsas' | 'colares' | 'centros-de-mesa'
  description: string
  basePrice: number
  image: string
  photos?: ProductPhoto[]
  variations?: ProductVariation[]
  active: boolean
  isReadyToShip: boolean
  isFeatured?: boolean
  order?: number
}
```

### ProductPhoto

```typescript
interface ProductPhoto {
  url: string
  color?: string
  thread?: string
  isReadyToShip?: boolean
  priceAdjust?: number
}
```

### ProductVariation

```typescript
interface ProductVariation {
  name: string
  options: {
    label: string
    priceAdjust: number
  }[]
}
```

### Order

```typescript
interface Order {
  id: string
  productId: string
  productName: string
  customerName: string
  customerPhone: string
  status: 'em-producao' | 'enviado' | 'entregue'
  createdAt: Date
  estimatedDelivery: Date
  notes: string
}
```

### ReadyToShipItem

```typescript
interface ReadyToShipItem {
  productId: string
  name: string
  description: string
  photo: ProductPhoto
  basePrice: number
  finalPrice: number
}
```

---

## 🧪 Testes Unitários (Recomendado)

### Exemplo com Vitest

```typescript
import { describe, it, expect } from 'vitest'
import { loadProducts, saveProduct } from '../lib/products'

describe('Products', () => {
  it('loadProducts returns array', async () => {
    const products = await loadProducts()
    expect(Array.isArray(products)).toBe(true)
  })
  
  it('saveProduct creates new product', async () => {
    const newProduct = { id: 'test-001', ... }
    await saveProduct(newProduct)
    
    const saved = await loadProducts()
    expect(saved.find(p => p.id === 'test-001')).toBeDefined()
  })
})
```

---

## ⚠️ Error Handling

### Tratamento de Erros

```typescript
async function loadProducts(category?: string) {
  try {
    // ... fetch
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    return []  // Retorna vazio em caso de erro
  }
}
```

### No Componente

```tsx
try {
  await saveProduct(product)
  // Sucesso
  loadProducts()
} catch (error) {
  alert('Erro ao salvar produto')
}
```

---

## 🔄 Refactoring Futuro

- [ ] Implementar cache (Redux, Zustand)
- [ ] Adicionar Suspense para loading
- [ ] Error boundaries
- [ ] Retry logic para falhas
- [ ] Optimistic updates
- [ ] Real-time listeners (onSnapshot)

---

_Documentação de Funções • EmCantoArtesanato_
