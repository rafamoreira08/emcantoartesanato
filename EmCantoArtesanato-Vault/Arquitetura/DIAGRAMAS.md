# 📊 Diagramas & Visualizações

Representações visuais da arquitetura, fluxos e estruturas do projeto.

---

## 🏗️ Arquitetura Geral

```mermaid
graph TB
    User["👤 Usuário"]
    
    subgraph Frontend["🎨 Frontend (React + TypeScript)"]
        Router["🔀 React Router<br/>(HashRouter)"]
        Pages["📄 Pages<br/>(7 rotas)"]
        Components["🎯 Components<br/>(11 reutilizáveis)"]
        Lib["📚 Lib<br/>(products.ts,<br/>firebase.ts)"]
    end
    
    subgraph Backend["🔥 Backend"]
        Firebase["Firebase<br/>Realtime DB"]
        Storage["📸 Storage<br/>(imagens)"]
        Auth["🔐 Auth"]
    end
    
    subgraph Hosting["🌐 Hosting"]
        GHPages["GitHub Pages<br/>(Deploy estático)"]
    end
    
    User -->|Acessa site| GHPages
    GHPages -->|Serve| Frontend
    Router -->|Renderiza| Pages
    Pages -->|Usa| Components
    Components -->|Chama| Lib
    Lib -->|Lê/Escreve| Firebase
    Lib -->|Autentica| Auth
    Lib -->|Faz upload| Storage
    
    style Frontend fill:#e1f5ff
    style Backend fill:#fff3e0
    style Hosting fill:#f3e5f5
```

---

## 🛣️ Mapa de Rotas

```mermaid
graph TD
    Root["/"]
    
    Root -->|Home| Home["/"]
    Root -->|Catálogos| Bolsas["/bolsas"]
    Root -->|Catálogos| Colares["/colares"]
    Root -->|Catálogos| Mesa["/mesa-posta"]
    Root -->|Especial| Pronta["/pronta-entrega"]
    Root -->|Pedidos| Rastreio["/rastreio"]
    Root -->|Admin| Admin["/admin"]
    
    Home -->|CategoryStrip| Bolsas
    Home -->|CategoryStrip| Colares
    Home -->|CategoryStrip| Mesa
    
    Bolsas -->|ProductCard| WhatsApp["💬 WhatsApp"]
    Colares -->|ProductCard| WhatsApp
    Mesa -->|ProductCard| WhatsApp
    Pronta -->|ReadyToShipCard| WhatsApp
    
    Admin -->|CRUD| Firebase["🔥 Firebase"]
    Rastreio -->|Fetch| Firebase
    
    style Home fill:#fff9c4
    style Bolsas fill:#c8e6c9
    style Colares fill:#c8e6c9
    style Mesa fill:#c8e6c9
    style Pronta fill:#ffccbc
    style Rastreio fill:#b3e5fc
    style Admin fill:#f8bbd0
    style WhatsApp fill:#a5d6a7
    style Firebase fill:#ffb74d
```

---

## 🎯 Estrutura de Componentes (Hierarquia)

```mermaid
graph TD
    App["<b>App.tsx</b><br/>HashRouter"]
    
    App -->|Layout| Layout["<b>Layout</b><br/>Flex Column"]
    
    Layout -->|1| ScrollToTop["ScrollToTop<br/>(Hook)"]
    Layout -->|2| Header["Header<br/>Navegação"]
    Layout -->|3| Main["main<br/>Outlet"]
    Layout -->|4| Footer["Footer<br/>Contato"]
    Layout -->|5| WhatsAppBtn["WhatsAppButton<br/>Flutuante"]
    
    Main -->|Home| Home["Home.tsx"]
    Main -->|Bolsas| Bolsas["Bolsas.tsx"]
    Main -->|Colares| Colares["Colares.tsx"]
    Main -->|Admin| Admin["Admin.tsx"]
    
    Home -->|Componentes| Hero["Hero"]
    Home -->|Componentes| CategoryStrip["CategoryStrip x3"]
    
    Bolsas -->|Componentes| CategoryHero["CategoryHero"]
    Bolsas -->|Componentes| ProductGrid["ProductGrid"]
    
    ProductGrid -->|Map| ProductCard["ProductCard x N"]
    
    Admin -->|Componentes| ProductForm["ProductForm"]
    Admin -->|Componentes| ProductList["ProductList"]
    
    style App fill:#ffeb3b
    style Layout fill:#fff9c4
    style Hero fill:#c8e6c9
    style ProductCard fill:#a5d6a7
    style CategoryHero fill:#a5d6a7
    style Header fill:#b3e5fc
    style Footer fill:#b3e5fc
    style WhatsAppBtn fill:#ffccbc
    style Admin fill:#f8bbd0
```

---

## 🔄 Fluxo: Visualizar Catálogo

```mermaid
sequenceDiagram
    participant User as 👤 Usuário
    participant Browser as 🌐 Navegador
    participant Bolsas as 📄 Bolsas.tsx
    participant Firebase as 🔥 Firebase
    participant UI as 🎨 UI
    
    User->>Browser: Clica em /bolsas
    Browser->>Bolsas: Renderiza página
    Bolsas->>Bolsas: useEffect dispara
    Bolsas->>Firebase: loadProducts('bolsas')
    Firebase-->>Bolsas: products[]
    Bolsas->>Bolsas: setProducts(data)
    Bolsas->>UI: ProductGrid re-renderiza
    UI->>UI: map() → ProductCard x N
    UI-->>User: Galeria exibida ✅
```

---

## 🛍️ Fluxo: Fazer Pedido (WhatsApp)

```mermaid
sequenceDiagram
    participant User as 👤 Cliente
    participant ProductCard as ProductCard
    participant WhatsApp as 💬 WhatsApp
    participant Sonia as 👨‍🎨 Sônia
    
    User->>ProductCard: Clica "Encomendar"
    ProductCard->>ProductCard: Gera URL WhatsApp
    ProductCard->>WhatsApp: Abre link
    WhatsApp->>WhatsApp: Pré-preenche mensagem
    WhatsApp-->>User: Chat aberto
    User->>Sonia: Envia pedido
    Sonia->>Sonia: Recebe no celular
    Sonia-->>User: Responde com proposta
    User->>Sonia: Negocia cores/tamanhos
    Sonia->>Sonia: Produz peça
    Sonia-->>User: Envia produto ✅
```

---

## 📊 Fluxo: Admin (CRUD de Produtos)

```mermaid
graph LR
    Admin["Admin.tsx"]
    
    Admin -->|Carrega| Load["loadProducts()"]
    Admin -->|Cria| Create["saveProduct()"]
    Admin -->|Edita| Update["saveProduct()"]
    Admin -->|Deleta| Delete["deleteProduct()"]
    
    Load -->|Firebase| DB["Database"]
    Create -->|Firebase| DB
    Update -->|Firebase| DB
    Delete -->|Firebase| DB
    
    DB -->|Retorna| AdminUI["ProductList<br/>atualizado"]
    
    AdminUI -->|Map| AdminItem["Admin vê<br/>lista atual"]
    
    style Admin fill:#f8bbd0
    style DB fill:#ffb74d
    style Load fill:#a5d6a7
    style Create fill:#a5d6a7
    style Update fill:#a5d6a7
    style Delete fill:#ffccbc
```

---

## 🧬 Modelo de Dados: Product

```mermaid
graph TD
    Product["<b>Product</b><br/>Interface TypeScript"]
    
    Product -->|string| id["id"]
    Product -->|string| name["name"]
    Product -->|enum| category["category<br/>bolsas | colares<br/>centros-de-mesa"]
    Product -->|string| description["description"]
    Product -->|number| basePrice["basePrice"]
    Product -->|string| image["image<br/>URL da foto principal"]
    Product -->|array| photos["photos?<br/>ProductPhoto[]"]
    Product -->|array| variations["variations?<br/>ProductVariation[]"]
    Product -->|boolean| active["active"]
    Product -->|boolean| isReadyToShip["isReadyToShip"]
    Product -->|boolean| isFeatured["isFeatured?"]
    Product -->|number| order["order?"]
    
    photos -->|object| Photo["ProductPhoto<br/>url, color,<br/>thread,<br/>priceAdjust"]
    
    variations -->|object| Variation["ProductVariation<br/>name,<br/>options[]"]
    
    style Product fill:#ffeb3b
    style Photo fill:#c8e6c9
    style Variation fill:#c8e6c9
```

---

## 📦 Modelo de Dados: Order

```mermaid
graph TD
    Order["<b>Order</b><br/>Interface TypeScript"]
    
    Order -->|string| id["id"]
    Order -->|string| productId["productId"]
    Order -->|string| productName["productName"]
    Order -->|string| customerName["customerName"]
    Order -->|string| customerPhone["customerPhone"]
    Order -->|enum| status["status<br/>em-producao<br/>enviado<br/>entregue"]
    Order -->|Date| createdAt["createdAt"]
    Order -->|Date| estimatedDelivery["estimatedDelivery"]
    Order -->|string| notes["notes<br/>customizações"]
    
    style Order fill:#b3e5fc
    style status fill:#ffccbc
```

---

## 🎨 Design System (Cores)

```mermaid
graph LR
    Colors["Design System"]
    
    Colors -->|Primary CTA| Green["green<br/>#22c55e<br/>WhatsApp, Botões"]
    Colors -->|Background| Cream["cream<br/>#fffdd0<br/>Seções suaves"]
    Colors -->|Text| Ink["ink<br/>#000000<br/>Texto principal"]
    Colors -->|Divisor| Border["border<br/>#e5e7eb<br/>Linhas"]
    Colors -->|Secondary| Muted["muted<br/>#6b7280<br/>Texto 2º plano"]
    
    style Green fill:#22c55e,color:#fff
    style Cream fill:#fffdd0,color:#000
    style Ink fill:#000,color:#fff
    style Border fill:#e5e7eb,color:#000
    style Muted fill:#6b7280,color:#fff
```

---

## 🔗 Dependências de Componentes

```mermaid
graph TB
    subgraph App["App Layout"]
        A["Header"]
        B["ScrollToTop"]
        C["Outlet<br/>Página Ativa"]
        D["Footer"]
        E["WhatsAppButton"]
    end
    
    subgraph Pages["Páginas"]
        Home["Home.tsx"]
        Bolsas["Bolsas.tsx"]
        Colares["Colares.tsx"]
        Admin["Admin.tsx"]
    end
    
    subgraph Components["Componentes"]
        Hero["Hero"]
        CategoryHero["CategoryHero"]
        CategoryStrip["CategoryStrip"]
        ProductCard["ProductCard"]
        ProductGrid["ProductGrid"]
        ProductForm["ProductForm"]
    end
    
    subgraph Lib["Bibliotecas"]
        Products["products.ts<br/>loadProducts()"]
        Firebase["firebase.ts<br/>config"]
    end
    
    C --> Home
    C --> Bolsas
    C --> Colares
    C --> Admin
    
    Home --> Hero
    Home --> CategoryStrip
    Bolsas --> CategoryHero
    Bolsas --> ProductGrid
    Admin --> ProductForm
    
    ProductGrid --> ProductCard
    ProductCard --> Products
    Bolsas --> Products
    
    ProductForm --> Firebase
    Products --> Firebase
    
    style App fill:#fff9c4
    style Pages fill:#c8e6c9
    style Components fill:#b3e5fc
    style Lib fill:#ffb74d
```

---

## 📈 Fluxo de Dados Completo

```mermaid
graph LR
    subgraph Data["💾 Data Layer"]
        FB["Firebase<br/>Realtime DB"]
        Storage["Storage<br/>Imagens"]
    end
    
    subgraph Lib["📚 Business Logic"]
        Prod["products.ts<br/>loadProducts()"]
        Upload["uploadImage()"]
    end
    
    subgraph State["🎯 Component State"]
        Products["useState<br/>products[]"]
        Loading["useState<br/>loading"]
    end
    
    subgraph UI["🎨 UI"]
        Grid["ProductGrid"]
        Card["ProductCard"]
    end
    
    subgraph User["👤"]
        UX["Usuário vê<br/>galeria"]
    end
    
    FB -->|Dados| Prod
    Storage -->|URLs| Upload
    
    Prod -->|setProducts| Products
    Prod -->|setLoading| Loading
    
    Products -->|props| Grid
    Loading -->|props| Grid
    
    Grid -->|map| Card
    Card -->|click| Upload
    Upload -->|Firebase| Storage
    
    Grid --> UI
    UI --> UX
    
    style Data fill:#fff3e0
    style Lib fill:#f3e5f5
    style State fill:#e1f5ff
    style UI fill:#f1f8e9
    style User fill:#ffe0b2
```

---

## 🎯 Jornada do Usuário

```mermaid
journey
    title Jornada do Cliente no EmCanto
    section Descoberta
      Homepage: 5: Cliente acessa site
      Galeria: 4: Vê catálogo de produtos
    section Interesse
      ProductCard: 5: Vê foto do produto
      Descrição: 4: Lê descrição
    section Ação
      WhatsApp: 5: Clica "Encomendar via WhatsApp"
      Conversa: 4: Negocia com Sônia
    section Entrega
      Produção: 4: Sônia produz a peça
      Rastreio: 5: Cliente rastreia pedido
      Entrega: 5: Recebe produto ✅
```

---

## 📱 Responsividade (Mobile-First)

```mermaid
graph TD
    TW["Tailwind CSS<br/>Mobile-First"]
    
    TW -->|Base| Mobile["📱 Mobile<br/>1 coluna<br/>Full-width"]
    TW -->|sm:| SM["Tablet Pequeno"]
    TW -->|md:| MD["Tablet<br/>2 colunas"]
    TW -->|lg:| LG["Desktop<br/>3+ colunas"]
    TW -->|xl:| XL["TV/Monitor<br/>Max-width"]
    
    style Mobile fill:#ffccbc
    style SM fill:#ffb74d
    style MD fill:#fff9c4
    style LG fill:#c8e6c9
    style XL fill:#b3e5fc
```

---

## 🚀 Pipeline de Deploy

```mermaid
graph LR
    Code["Código<br/>TypeScript"]
    Build["npm run build<br/>Vite"]
    Bundle["📦 dist/<br/>index.html<br/>assets/"]
    GH["GitHub Repo"]
    Actions["GitHub Actions"]
    Pages["GitHub Pages"]
    Live["🌐 Site Live"]
    
    Code -->|git push| GH
    GH -->|Trigger| Actions
    Code -->|Compila| Build
    Build -->|Output| Bundle
    Actions -->|Deploy| Pages
    Pages -->|Serve| Live
    
    style Code fill:#e1f5ff
    style Build fill:#fff9c4
    style Bundle fill:#f3e5f5
    style GH fill:#c8e6c9
    style Actions fill:#b3e5fc
    style Pages fill:#ffccbc
    style Live fill:#a5d6a7
```

---

## 🎓 Como Usar Estes Diagramas

### No Obsidian
1. Abra qualquer arquivo deste vault
2. Procure por blocos `mermaid`
3. Clique na aba "Preview" para ver renderizado
4. Clique em ícone "expand" para ver em tela cheia

### No Código
- Copie o código mermaid
- Cole em ferramentas como [mermaid.live](https://mermaid.live)
- Exporte como PNG/SVG

### Para Onboarding
- Mostre aos novos devs esses diagramas
- Ajudam a entender arquitetura rapidamente
- Melhor que mil palavras!

---

_Diagramas gerados com Mermaid • EmCantoArtesanato_
