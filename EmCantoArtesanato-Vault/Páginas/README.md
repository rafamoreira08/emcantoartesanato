---
tags:
  - pages
  - routes
  - navigation
  - react-router
related:
  - "[[Componentes/README|Componentes]]"
  - "[[Produtos/README|Produtos]]"
  - "[[Funções/README|Funções]]"
  - "[[Arquitetura/README|Arquitetura]]"
---

# 📄 Páginas & Rotas

Documentação das 7 rotas principais do projeto.

**Links Relacionados:** [[Arquitetura/DIAGRAMAS#-mapa-de-rotas|Diagrama de Rotas]] · [[Arquitetura/README|App.tsx Router]] · [[Componentes/README|Componentes usados]]

---

## 🗺️ Mapa de Rotas

```
/ (root)
├─ /              → Home
├─ /bolsas        → Catálogo Bolsas
├─ /colares       → Catálogo Colares
├─ /mesa-posta    → Catálogo Mesa Posta
├─ /pronta-entrega → Itens Prontos
├─ /rastreio      → Rastreamento
└─ /admin         → Painel Admin
```

---

## 🏠 Home

**Arquivo:** `src/pages/Home.tsx`  
**Rota:** `/`

### Propósito
Página inicial que apresenta o projeto e direciona para catálogos.

### Estrutura

```tsx
<>
  <Hero />
  
  {/* Divisor */}
  <CategoryStrip
    category="bolsas"
    title="Bolsas Artesanais"
    description="Bolsas feitas à mão em crochê..."
    ctaLink="/bolsas"
    ctaLabel="Ver todas as bolsas"
  />
  
  <CategoryStrip
    category="colares"
    title="Colares e Chokers"
    description="Peças com cordões, resinas, pedras..."
    ctaLink="/colares"
    ctaLabel="Ver todos os colares"
  />
  
  <CategoryStrip
    category="centros-de-mesa"
    title="Mesa Posta"
    description="Em breve..."
    ctaLink="/mesa-posta"
    ctaLabel="Ver mesa posta completa"
  />
  
  {/* WhatsApp CTA */}
</>
```

### Componentes Usados
- Hero
- CategoryStrip (x3)
- WhatsApp CTA section

### Dados
Nenhum - apenas componentes estáticos com CTAs

---

## 🎒 Bolsas (Catálogo)

**Arquivo:** `src/pages/Bolsas.tsx`  
**Rota:** `/bolsas`

### Propósito
Exibe galeria de bolsas artesanais com filtros opcionais.

### Estrutura

```tsx
export default function Bolsas() {
  const [products, setProducts] = useState<Product[]>([])
  
  useEffect(() => {
    loadProducts('bolsas')  // Busca do Firebase
  }, [])
  
  return (
    <>
      <CategoryHero
        category="bolsas"
        title="Bolsas Artesanais"
        description="Feitas à mão em crochê ou tricô..."
      />
      
      <ProductGrid
        products={products}
        category="bolsas"
      />
      
      {/* WhatsApp CTA */}
    </>
  )
}
```

### Fluxo de Dados

```
useEffect (ao montar)
  └─ loadProducts('bolsas')
      └─ Firebase API
          └─ setProducts()
              └─ ProductGrid renderiza
```

### Dados
Vêm do Firebase (filtrado por `category: 'bolsas'`)

---

## 💎 Colares (Catálogo)

**Arquivo:** `src/pages/Colares.tsx`  
**Rota:** `/colares`

### Propósito
Exibe galeria de colares artesanais.

### Estrutura
Idêntica a `Bolsas.tsx`, mas com `category: 'colares'`

```tsx
<CategoryHero category="colares" title="Colares e Chokers" ... />
<ProductGrid products={products} category="colares" />
```

### Dados
Products filtrados por `category: 'colares'` no Firebase

---

## 🪣 Mesa Posta

**Arquivo:** `src/pages/MesaPosta.tsx`  
**Rota:** `/mesa-posta`

### Propósito
Catálogo de centros de mesa (sousplats) - em desenvolvimento.

### Status
⏳ **Em Expansão** - Descrição a ser adicionada

### Estrutura
```tsx
<CategoryHero 
  category="centros-de-mesa"
  title="Mesa Posta"
  description="Em breve — coleção será expandida"
/>
<ProductGrid products={products} category="centros-de-mesa" />
```

### TODO
- [ ] Adicionar descrição detalhada
- [ ] Criar conteúdo visual
- [ ] Adicionar produtos ao Firebase

---

## 📦 Pronta Entrega

**Arquivo:** `src/pages/ProntaEntrega.tsx`  
**Rota:** `/pronta-entrega`

### Propósito
Mostra itens prontos para envio imediato (sem customização).

### Estrutura

```tsx
const [readyItems, setReadyItems] = useState<ReadyToShipItem[]>([])

useEffect(() => {
  // Busca itens com isReadyToShip: true
  loadReadyItems()
}, [])

return (
  <>
    <CategoryHero 
      category="pronta-entrega"
      title="Pronta Entrega"
      description="Itens prontos para envio imediato!"
    />
    
    {readyItems.map(item => (
      <ReadyToShipCard key={item.productId} item={item} />
    ))}
  </>
)
```

### Diferença
- Usa `ReadyToShipItem[]` (não `Product[]`)
- Preço final já definido
- Sem variações
- Pronta para envio

### Dados
Products com `isReadyToShip: true` do Firebase

---

## 📍 Rastreio

**Arquivo:** `src/pages/Rastreio.tsx`  
**Rota:** `/rastreio`

### Propósito
Permite cliente rastrear seu pedido.

### Estrutura

```tsx
const [trackingId, setTrackingId] = useState('')
const [orderStatus, setOrderStatus] = useState<Order | null>(null)

const handleSearch = async () => {
  // Busca pedido no Firebase
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
        Data: {orderStatus.date}
        Detalhes: {orderStatus.details}
      </div>
    )}
  </>
)
```

### Dados
Busca de `Order` pelo ID no Firebase

---

## ⚙️ Admin Panel

**Arquivo:** `src/pages/Admin.tsx`  
**Rota:** `/admin`

### Propósito
Painel administrativo para gerenciar produtos.

### Responsabilidades
- Criar novo produto
- Editar produto existente
- Deletar produto
- Upload de fotos
- Definir preços

### Estrutura

```tsx
const [products, setProducts] = useState<Product[]>([])
const [editingId, setEditingId] = useState<string | null>(null)

useEffect(() => {
  loadProducts()  // Carrega todos os produtos
}, [])

const handleSaveProduct = async (product: Product) => {
  await saveProduct(product)  // Firebase
  loadProducts()  // Recarrega
}

const handleDeleteProduct = async (id: string) => {
  await deleteProduct(id)     // Firebase
  loadProducts()              // Recarrega
}

return (
  <>
    <h1>Painel Administrativo</h1>
    
    {/* Formulário para novo/editar produto */}
    <ProductForm onSave={handleSaveProduct} />
    
    {/* Lista de produtos */}
    <ProductList 
      products={products}
      onEdit={setEditingId}
      onDelete={handleDeleteProduct}
    />
  </>
)
```

### Funções Principais
- `saveProduct()` - Salvar/atualizar
- `deleteProduct()` - Deletar
- `loadProducts()` - Buscar todos

### Firebase Integration
Lê/escreve em `products/{productId}`

---

## 🔄 Padrão de Página (Catálogo)

Todas as páginas de catálogo seguem este padrão:

```tsx
export default function CatagoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setLoading(true)
    loadProducts('category-name')
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])
  
  return (
    <>
      <CategoryHero category="..." title="..." />
      
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <ProductGrid products={products} />
      )}
      
      {/* WhatsApp CTA */}
    </>
  )
}
```

---

## 📊 Tabela de Rotas Completa

| Rota | Página | Arquivo | Dados | Status |
|------|--------|---------|-------|--------|
| `/` | Home | `Home.tsx` | Estático | ✅ |
| `/bolsas` | Catálogo Bolsas | `Bolsas.tsx` | Firebase | ✅ |
| `/colares` | Catálogo Colares | `Colares.tsx` | Firebase | ✅ |
| `/mesa-posta` | Catálogo Mesa Posta | `MesaPosta.tsx` | Firebase | ⏳ |
| `/pronta-entrega` | Itens Prontos | `ProntaEntrega.tsx` | Firebase | ✅ |
| `/rastreio` | Rastreamento | `Rastreio.tsx` | Firebase | ✅ |
| `/admin` | Admin Panel | `Admin.tsx` | Firebase RW | ✅ |

---

## 🚀 Próximas Melhorias

- [ ] Adicionar filtros em catálogos
- [ ] Paginação em grids grandes
- [ ] Busca de produtos
- [ ] Ordenação (preço, popularidade)
- [ ] Breadcrumbs de navegação
- [ ] Loading skeletons
- [ ] Error boundaries

---

_Documentação de Páginas • EmCantoArtesanato_
