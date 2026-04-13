---
tags:
  - pages
  - routes
  - index
  - navigation
related:
  - "[[../Componentes/README|Componentes]]"
  - "[[../Produtos/README|Produtos]]"
  - "[[../Funções/README|Funções]]"
  - "[[../Arquitetura/README|Arquitetura]]"
---

# 📄 Páginas & Rotas - Índice

Documentação das 7 rotas principais do projeto.

**Ver também:** [[../Arquitetura/DIAGRAMAS#-mapa-de-rotas|Diagrama de Rotas]] · [[../Arquitetura/README|App.tsx Router]] · [[../Componentes/README|Componentes]]

---

## 🗺️ Mapa Completo de Rotas

```
/ (root)
├─ /              → Home (landing)
├─ /bolsas        → Catálogo Bolsas
├─ /colares       → Catálogo Colares
├─ /mesa-posta    → Catálogo Mesa Posta
├─ /pronta-entrega → Itens Prontos
├─ /rastreio      → Rastreamento
└─ /admin         → Painel Admin
```

---

## 📊 Visão Geral das Rotas

| Rota | Página | Tipo | Arquivo | Status |
|------|--------|------|---------|--------|
| `/` | [[Home|🏠 Home]] | Landing | `src/pages/Home.tsx` | ✅ |
| `/bolsas` | [[Bolsas|🎒 Bolsas]] | Catálogo | `src/pages/Bolsas.tsx` | ✅ |
| `/colares` | [[Colares|💎 Colares]] | Catálogo | `src/pages/Colares.tsx` | ✅ |
| `/mesa-posta` | [[MesaPosta|🪣 Mesa Posta]] | Catálogo | `src/pages/MesaPosta.tsx` | ⏳ |
| `/pronta-entrega` | [[ProntaEntrega|📦 Pronta Entrega]] | Especial | `src/pages/ProntaEntrega.tsx` | ✅ |
| `/rastreio` | [[Rastreio|📍 Rastreio]] | Serviço | `src/pages/Rastreio.tsx` | ✅ |
| `/admin` | [[Admin|⚙️ Admin]] | Painel | `src/pages/Admin.tsx` | ✅ |

---

## 🎯 Páginas por Tipo

### 🏪 Páginas de Catálogo

Exibem produtos e permitem encomendar via WhatsApp.

- [[Home|🏠 Home]] - Landing page principal
- [[Bolsas|🎒 Bolsas]] - Catálogo de bolsas
- [[Colares|💎 Colares]] - Catálogo de colares
- [[MesaPosta|🪣 Mesa Posta]] - Catálogo de centros de mesa
- [[ProntaEntrega|📦 Pronta Entrega]] - Itens prontos para envio

### 🛠️ Páginas de Serviço

- [[Rastreio|📍 Rastreio]] - Rastreamento de pedidos
- [[Admin|⚙️ Admin]] - Gerenciamento de produtos

---

## 🏗️ Padrão de Página de Catálogo

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
    </>
  )
}
```

---

## 📍 Hierarquia de Componentes

Cada página usa diferentes componentes:

### Home
```
Home
├── Hero
├── CategoryStrip (Bolsas)
├── CategoryStrip (Colares)
└── CategoryStrip (Mesa Posta)
```

### Catálogos (Bolsas, Colares, MesaPosta)
```
Bolsas/Colares/MesaPosta
├── CategoryHero
└── ProductGrid
    └── ProductCard[]
```

### ProntaEntrega
```
ProntaEntrega
├── CategoryHero
└── ReadyToShipCard[]
```

### Rastreio
```
Rastreio
├── Input (ID do pedido)
├── Button (Rastrear)
└── Order Status (exibido)
```

### Admin
```
Admin
├── ProductForm (criar/editar)
├── ProductList (exibir)
├── OrderList (opcional)
└── Update Status (opcional)
```

---

## 🔄 Fluxos de Dados Principais

### Fluxo: Visualizar Catálogo
```
Usuário → clica em /bolsas
       → Bolsas.tsx monta
       → useEffect dispara
       → loadProducts('bolsas')
       → Firebase API
       → setProducts(data)
       → ProductGrid re-renderiza
       → map() → ProductCard x N
       → Galeria exibida
```

### Fluxo: Rastrear Pedido
```
Cliente → digita ID
       → clica "Rastrear"
       → fetchOrder(id)
       → Firebase busca Order{id}
       → Status exibido
```

### Fluxo: Admin - Criar Produto
```
Sônia → acessa /admin
     → clica "Novo Produto"
     → ProductForm abre
     → preenche dados
     → clica "Salvar"
     → saveProduct(data)
     → Firebase API (write)
     → loadProducts() recarrega
     → Produto na lista
```

---

## 🔗 Relações Entre Páginas

```
Home
├─ links para → Bolsas
├─ links para → Colares
├─ links para → MesaPosta
└─ links para → ProntaEntrega

Bolsas/Colares/MesaPosta
├─ cliques em ProductCard → WhatsApp
└─ cliques em → Admin (se Sônia)

Admin
└─ gerencia dados mostrados em Bolsas/Colares/etc

Rastreio
├─ mostra dados criados em Admin
└─ independente dos catálogos
```

---

## 📝 Checklist para Nova Página

- [ ] Arquivo em `src/pages/`
- [ ] Rota adicionada em `App.tsx`
- [ ] Interface clara
- [ ] useEffect para dados (se necessário)
- [ ] Loading state (se aplicável)
- [ ] Erro handling
- [ ] Responsivo (mobile-first)
- [ ] Usa componentes reutilizáveis
- [ ] Documentado em arquivo `.md` individual

---

## 🚀 Como Navegar

**Quer adicionar nova página?**
1. Veja padrão em [[../Arquitetura/README|Arquitetura]]
2. Siga [[Bolsas|padrão de catálogo]]
3. Documente em arquivo individual

**Quer entender fluxo?**
1. Vá para [[../Arquitetura/DIAGRAMAS|Diagramas Mermaid]]
2. Veja fluxos específicos lá

**Quer entender dados?**
1. Vá para [[../Produtos/README|Produtos]]
2. Consulte [[../Funções/README|Funções]]

---

_Índice de Páginas • EmCantoArtesanato_
