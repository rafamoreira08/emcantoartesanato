---
tags:
  - architecture
  - technical
  - stack
  - firebase
  - react
  - vite
related:
  - "[[Páginas/README|Páginas]]"
  - "[[Componentes/README|Componentes]]"
  - "[[Funções/README|Funções]]"
  - "[[Produtos/README|Modelo de Dados]]"
---

# 🏗️ Arquitetura do Projeto

Visão geral técnica e fluxos de dados do EmCantoArtesanato.

**Links Relacionados:** [[Arquitetura/DIAGRAMAS|Diagramas Mermaid]] · [[MAPA_VISUAL|Mapa Visual]] · [[Páginas/README|Rotas de Dados]]

---

## 📊 Stack Tecnológico

### Frontend
```
React 18.3.1          ← UI Components
  ↓
TypeScript 5.7.3      ← Type Safety
  ↓
Vite 6.0.7            ← Build/Dev Server
  ↓
React Router 7.1.1    ← Client-side Routing
  ↓
Tailwind CSS 3.4.17   ← Styling
  ↓
Lucide React 0.469    ← Icons
```

### Backend
```
Firebase 10.14.1
  ├─ Realtime Database (dados produtos/pedidos)
  ├─ Authentication (admin login)
  └─ Storage (fotos produtos)
```

### Hospedagem
```
GitHub Pages          ← Deploy estático
  ↓
HashRouter            ← SPA sem servidor
```

---

## 📁 Estrutura de Pastas

```
EmCantoArtesanato/
│
├── src/
│   ├── components/           # 11 componentes reutilizáveis
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CategoryHero.tsx
│   │   ├── CategoryStrip.tsx
│   │   ├── About.tsx
│   │   ├── WhatsAppButton.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── ReadyToShipCard.tsx
│   │
│   ├── pages/                # 7 rotas principais
│   │   ├── Home.tsx          # /
│   │   ├── Bolsas.tsx        # /bolsas
│   │   ├── Colares.tsx       # /colares
│   │   ├── MesaPosta.tsx     # /mesa-posta
│   │   ├── ProntaEntrega.tsx # /pronta-entrega
│   │   ├── Rastreio.tsx      # /rastreio
│   │   └── Admin.tsx         # /admin
│   │
│   ├── lib/
│   │   ├── firebase.ts       # Configuração Firebase
│   │   └── products.ts       # Funções de produto
│   │
│   ├── types/
│   │   └── product.ts        # Interfaces
│   │
│   ├── App.tsx               # Roteador principal
│   └── main.tsx              # Entry point
│
├── public/
│   └── images/
│       ├── logo*.png         # 3 variações logo
│       ├── sonia.jpg         # Foto artesã
│       ├── bolsas*.jpg       # Fotos produtos
│       ├── colares*.jpg
│       └── sousplats.jpg
│
├── css/                      # Estilos globais
├── js/                       # Scripts auxiliares
├── admin/                    # Build admin separado?
├── catalogo/                 # Catálogo estático?
├── cloudflare-worker/        # Edge functions
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

---

## 🔄 Fluxos Principais

### 1️⃣ Fluxo de Visualização (Catálogo)

```
Usuário acessa /bolsas
    ↓
Bolsas.tsx monta
    ↓
useEffect dispara
    ↓
loadProducts('bolsas')
    ↓
Firebase API (read)
    ↓
Products[] carregados
    ↓
setProducts(data)
    ↓
ProductGrid re-renderiza
    ↓
map() → ProductCard para cada produto
    ↓
Usuário vê galeria
```

### 2️⃣ Fluxo de Pedido (WhatsApp)

```
Usuário clica em ProductCard
    ↓
onClick abre WhatsApp link
    ↓
Link: https://wa.me/55...?text=Olá%20Sônia
    ↓
WhatsApp abre (web ou mobile)
    ↓
Mensagem pré-preenchida
    ↓
Sônia recebe pedido
    ↓
Responde com proposta
    ↓
Negocia customização
    ↓
Cliente paga + Sônia envia
```

### 3️⃣ Fluxo Admin (Criar Produto)

```
Admin acessa /admin
    ↓
Admin.tsx carrega
    ↓
useEffect → loadProducts()
    ↓
Lista de produtos exibida
    ↓
Admin clica "Novo Produto"
    ↓
ProductForm abre
    ↓
Admin preenche:
  - Nome, descrição
  - Preço base
  - Fotos
  - Variações (cores/tamanhos)
  ↓
Clica "Salvar"
    ↓
saveProduct(data)
    ↓
Firebase API (write)
    ↓
Produto criado no DB
    ↓
loadProducts() recarrega
    ↓
Produto aparece na lista
    ↓
Próxima vez que abrir /bolsas, produto aparece
```

### 4️⃣ Fluxo de Rastreamento

```
Cliente acessa /rastreio
    ↓
Digita ID do pedido
    ↓
Clica "Rastrear"
    ↓
fetchOrder(id)
    ↓
Firebase busca Order{id}
    ↓
Status exibido ao cliente
    ↓
Cliente vê:
  - Data do pedido
  - Status (em produção, enviado, entregue)
  - Detalhes de envio
```

---

## 💾 Modelo de Dados (Firebase)

### Coleção: products/

```json
{
  "bolsa-001": {
    "id": "bolsa-001",
    "name": "Bolsa Rosa Média",
    "category": "bolsas",
    "description": "Bolsa em crochê...",
    "basePrice": 150,
    "image": "https://storage.../bolsa1.jpg",
    "photos": [
      {
        "url": "https://...",
        "color": "Rosa",
        "thread": "Viscose",
        "isReadyToShip": true,
        "priceAdjust": 0
      }
    ],
    "variations": [
      {
        "name": "Tamanho",
        "options": [
          { "label": "P", "priceAdjust": -30 },
          { "label": "M", "priceAdjust": 0 },
          { "label": "G", "priceAdjust": 50 }
        ]
      },
      {
        "name": "Cor",
        "options": [
          { "label": "Rosa", "priceAdjust": 0 },
          { "label": "Azul", "priceAdjust": 0 }
        ]
      }
    ],
    "active": true,
    "isReadyToShip": true,
    "isFeatured": false,
    "order": 1
  }
}
```

### Coleção: orders/

```json
{
  "pedido-2026-001": {
    "id": "pedido-2026-001",
    "productId": "bolsa-001",
    "productName": "Bolsa Rosa",
    "customerName": "João Silva",
    "customerPhone": "11 9 8765-4321",
    "status": "em-producao",
    "createdAt": "2026-04-13T10:00:00Z",
    "estimatedDelivery": "2026-05-13",
    "notes": "Cliente quer rosa mais clara"
  }
}
```

---

## 🎯 Componentes Críticos

### App.tsx (Roteador)
```tsx
// Cria layout padrão com Header, Footer, WhatsApp
// Define todas as 7 rotas
// Usa HashRouter para GitHub Pages
```

### products.ts (Lib)
```tsx
// loadProducts(category)  → busca Firebase
// loadReadyItems()        → itens prontos
// saveProduct(data)       → salva novo
// deleteProduct(id)       → deleta
// fetchOrder(id)          → rastreia
```

### firebase.ts (Config)
```tsx
// Configuração do Firebase
// Inicializa App
// Exports: db, auth, storage
```

---

## 🔐 Segurança (Firebase Rules)

### Read Rules
```
Públicos:
  - products (ler todos)
  - orders (ler por ID)
```

### Write Rules
```
Protegidos:
  - products (apenas admin)
  - orders (apenas admin)
  
Uso de:
  - Custom claims (isAdmin)
  - UID verification
```

---

## 🚀 Build & Deploy

### Build Local
```bash
npm run build  # TypeScript + Vite bundle
```

### Output
```
dist/
├── index.html
├── assets/
│   ├── index-HASH.js
│   └── index-HASH.css
└── images/ (copiadas de public/)
```

### Deploy (GitHub Pages)
```bash
git push origin claude-improvements
  ↓
GitHub Actions dispara
  ↓
npm run build
  ↓
Deploy para gh-pages
  ↓
Site ao vivo em: https://...
```

---

## 🎨 Build Optimization

### Code Splitting
- Vite automaticamente
- Route-based splitting (páginas como chunks separados)

### Image Optimization
- JPG comprimido para fotos
- PNG para logos
- Webp fallback

### CSS Purging
- Tailwind remove CSS não usado
- Build final: ~50KB CSS

---

## 🧪 Padrões de Código

### Componentes Reutilizáveis

```tsx
interface Props {
  data?: T
  onAction?: (param: any) => void
  className?: string
}

export default function MyComponent({ data, onAction, className }: Props) {
  return <div className={className}>...</div>
}
```

### Hooks Customizados

```tsx
function useProducts(category: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadProducts(category).then(setProducts).finally(() => setLoading(false))
  }, [category])
  
  return { products, loading }
}
```

---

## 📈 Métricas de Performance

### Lighthouse Target
- Lighthouse ≥ 90
- Core Web Vitals: Green

### Bundle Size Target
- JS: < 150KB (minified)
- CSS: < 50KB (minified)

### Carregamento
- First Contentful Paint: < 2s
- Interaction to Next Paint: < 100ms

---

## 🛣️ Roadmap Técnico

- [ ] Implementar service worker (PWA)
- [ ] Adicionar dark mode
- [ ] Lazy load de imagens
- [ ] Caching de produtos (localStorage)
- [ ] Offline support
- [ ] Analytics (Google Analytics)
- [ ] Error logging (Sentry)

---

_Documentação de Arquitetura • EmCantoArtesanato_
