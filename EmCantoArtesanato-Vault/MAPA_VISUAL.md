---
tags:
  - visual-map
  - navigation
  - architecture
  - overview
related:
  - "[[INDEX|Hub Central]]"
  - "[[Arquitetura/DIAGRAMAS|Diagramas Mermaid]]"
  - "[[Arquitetura/README|Arquitetura Técnica]]"
---

# 🗺️ Mapa Visual - EmCantoArtesanato

Visualização em mapa de como todos os componentes, páginas e funções estão conectados.

---

## 🎯 Estrutura em Camadas

```
┌─────────────────────────────────────────────────────────────────┐
│                        👤 USUÁRIO FINAL                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Acessa via navegador
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              🌐 GITHUB PAGES (Deploy Estático)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Serve o Frontend
                             │
                             ▼
┌───────────────────────────────────────────────────────────────────┐
│                 🎨 REACT APP (Frontend)                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🔀 React Router (HashRouter)                            │   │
│  │  └─ 7 Rotas principais                                   │   │
│  └─────────────────────┬──────────────────────────────────┘   │
│                        │                                        │
│  ┌─────────────────────┴──────────────────────────────────┐   │
│  │                                                          │   │
│  ▼                                                          ▼   │
│ ┌──────────────┐                                  ┌────────────┐│
│ │ 🏠 PÁGINAS   │                                  │ 🎯 LAYOUT  ││
│ │ (7 rotas)    │                                  │ (Header,   ││
│ │              │                                  │  Footer,   ││
│ │ • Home       │                                  │  WhatsApp) ││
│ │ • Bolsas     │                                  └────────────┘│
│ │ • Colares    │                                        ▲       │
│ │ • Mesa Posta │                                        │       │
│ │ • P. Entrega │                        Usa componentes │       │
│ │ • Rastreio   │                                        │       │
│ │ • Admin      │                                        │       │
│ └──────┬───────┘                                        │       │
│        │                                               │       │
│        └───────────────┬──────────────────────────────┘       │
│                        │                                        │
│  ┌─────────────────────┴──────────────────────────────────┐   │
│  │                                                          │   │
│  ▼                                                          ▼   │
│ ┌──────────────────────┐                      ┌──────────────┐ │
│ │ 🎯 COMPONENTES       │                      │ 📚 LIB       │ │
│ │ (11 reutilizáveis)   │                      │ (Business    │ │
│ │                      │                      │  Logic)      │ │
│ │ • Hero               │                      │              │ │
│ │ • ProductCard        │──────Usam────────────│ • products   │ │
│ │ • ProductGrid        │                      │   .ts        │ │
│ │ • CategoryStrip      │                      │ • firebase   │ │
│ │ • CategoryHero       │                      │   .ts        │ │
│ │ • ReadyToShipCard    │                      │              │ │
│ │ • Header/Footer      │                      └──────┬───────┘ │
│ │ • WhatsAppButton     │                             │         │
│ │ • About              │                             │         │
│ │ • ScrollToTop        │                             │         │
│ └──────────────────────┘                             │         │
│                                                      │         │
│  ┌───────────────────────────────────────────────────┴─────┐  │
│  │                                                           │  │
│  ▼                                                           ▼  │
│ ┌──────────────┐                                  ┌────────────┐│
│ │ 📊 STYLE     │                                  │ 🎨 DESIGN  ││
│ │              │                                  │ SYSTEM     ││
│ │ • Tailwind   │                                  │            ││
│ │ • Colors     │                                  │ • Cores    ││
│ │ • Layout     │                                  │ • Tipos    ││
│ │              │                                  │ • Spacing  ││
│ └──────────────┘                                  └────────────┘│
│                                                                 │
└─────────────────────────────┬─────────────────────────────────┘
                              │
                   Conecta com Firebase
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  🔥 FIREBASE (Backend)                          │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐      │
│  │ 📦 Realtime  │   │ 🔐 Auth      │   │ 📸 Storage   │      │
│  │ Database     │   │              │   │              │      │
│  │              │   │ • Login      │   │ • Imagens    │      │
│  │ • products   │   │ • Sessions   │   │   produtos   │      │
│  │ • orders     │   │              │   │              │      │
│  └──────────────┘   └──────────────┘   └──────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxos de Dados Principais

### 1️⃣ Fluxo de Visualização (Catálogo)

```
👤 Usuário
    │
    └──> Clica em "Bolsas"
            │
            ▼
        🔀 Router
            │
            └──> Bolsas.tsx
                    │
                    ▼
                useEffect
                    │
                    └──> loadProducts('bolsas')
                            │
                            ▼
                        🔥 Firebase
                            │
                            └──> products[]
                                    │
                                    ▼
                                setProducts()
                                    │
                                    ▼
                            ProductGrid
                                    │
                                    └──> map() → ProductCard x N
                                            │
                                            ▼
                                        📸 Galeria exibida
```

**Componentes Envolvidos:**
- [[Páginas/README#🎒-bolsas-catálogo|Bolsas.tsx]] (Página)
- [[Componentes/README#-estrutura|ProductGrid]] (Componente)
- [[Componentes/README#-estrutura|ProductCard]] (Componente)
- [[Funções/README#loadproducts|loadProducts()]] (Função)
- [[Produtos/README|Modelo Product]]

---

### 2️⃣ Fluxo de Pedido (WhatsApp)

```
👤 Cliente
    │
    └──> Vê produto interessante
            │
            ▼
        ProductCard
            │
            └──> Clica "Encomendar"
                    │
                    ▼
            Abre WhatsApp
                    │
                    ▼
            👨‍🎨 Sônia
                    │
                    └──> Recebe pedido
                        │
                        ▼
                    Responde proposta
                        │
                        ▼
                    Negocia customizações
                        │
                        ▼
                    👨‍🎨 Produz peça
                        │
                        ▼
                    📦 Envia produto
```

**Documentação Relacionada:**
- [[Componentes/README#productcard|ProductCard Component]]
- [[Brand/README|Brand & Contato]]
- [[Produtos/README|Produtos]]

---

### 3️⃣ Fluxo Admin (CRUD de Produtos)

```
👨‍💻 Admin Sônia
    │
    └──> Acessa /admin
            │
            ▼
        Admin.tsx
            │
            ├──> Carrega lista
            │       │
            │       ▼
            │   loadProducts()
            │       │
            │       ▼
            │   🔥 Firebase
            │
            ├──> Edita produto
            │       │
            │       ▼
            │   ProductForm
            │       │
            │       ▼
            │   saveProduct()
            │       │
            │       ▼
            │   🔥 Firebase
            │
            └──> Atualiza lista
                    │
                    ▼
                ProductList
```

**Componentes & Funções:**
- [[Páginas/README#⚙️-admin-panel|Admin.tsx]] (Página)
- [[Funções/README#saveproduct|saveProduct()]] (Função)
- [[Funções/README#deleteproduct|deleteProduct()]] (Função)
- [[Produtos/README|Modelo Product]]

---

### 4️⃣ Fluxo de Rastreamento

```
👤 Cliente
    │
    └──> Acessa /rastreio
            │
            ▼
        Rastreio.tsx
            │
            └──> Digita ID do pedido
                    │
                    ▼
                fetchOrder(id)
                    │
                    ▼
                🔥 Firebase
                    │
                    ▼
                Order encontrada
                    │
                    ▼
            Status exibido
            (em-producao, enviado, entregue)
```

**Documentação Relacionada:**
- [[Páginas/README#📍-rastreio|Rastreio.tsx]]
- [[Funções/README#fetchorder|fetchOrder()]]
- [[Arquitetura/README#-modelo-de-dados-order|Modelo Order]]

---

## 🎯 Matriz de Conectividade

| Origem | Destino | Tipo | Arquivo |
|--------|---------|------|---------|
| [[Páginas/README|Páginas]] | [[Componentes/README|Componentes]] | Composição | `Home.tsx` |
| [[Páginas/README|Páginas]] | [[Funções/README|Funções]] | Chamada | `Bolsas.tsx` |
| [[Componentes/README|Componentes]] | [[Brand/README|Design System]] | Uso de cores/spacing | `ProductCard.tsx` |
| [[Componentes/README|Componentes]] | [[Funções/README|Funções]] | Integração | `ProductGrid.tsx` |
| [[Produtos/README|Produtos]] | [[Páginas/README|Páginas]] | Dados | `categories` |
| [[Brand/README|Brand]] | [[Componentes/README|Componentes]] | Styling | Colors/Fonts |
| [[Funções/README|Funções]] | [[Produtos/README|Produtos]] | Tipos | `Product[]` |
| [[Arquitetura/README|Arquitetura]] | Tudo | Referência | Stack/Stack |

---

## 🔍 Como Navegar Pelo Grafo

### Por Objetivo

**Quero modificar a UI:**
1. [[Componentes/README|🎯 Componentes]]
2. [[Brand/README|🎨 Brand & Design System]]
3. [[Páginas/README|📄 Páginas (usam componentes)]]

**Quero adicionar novo produto:**
1. [[Produtos/README|🛍️ Produtos]]
2. [[Funções/README#saveproduct|⚙️ saveProduct()]]
3. [[Páginas/README#⚙️-admin-panel|👨‍💻 Admin Panel]]

**Quero entender fluxo de dados:**
1. [[Arquitetura/README|🏗️ Arquitetura]]
2. [[Arquitetura/DIAGRAMAS|📊 Diagramas]]
3. [[Funções/README|⚙️ Funções]]

**Quero trabalhar com Firebase:**
1. [[Arquitetura/README#-modelo-de-dados-firebase|💾 Modelo de Dados]]
2. [[Funções/README|⚙️ Funções (API)]]
3. [[Páginas/README|📄 Páginas (usam dados)]]

---

## 📊 Estatísticas de Conexão

- **Total de Documentos:** 8 (INDEX + 6 READMEs + DIAGRAMAS)
- **Total de Tags:** 30+
- **Links Internos:** 50+
- **Diagramas Mermaid:** 10+
- **Componentes Documentados:** 11
- **Rotas Documentadas:** 7
- **Funções Documentadas:** 10+

---

## 🚀 Próximos Passos Recomendados

1. **Novo Dev?** Comece por [[Arquitetura/README|🏗️ Arquitetura]]
2. **Vai Codificar?** Vá para [[Componentes/README|🎯 Componentes]]
3. **Entender Dados?** Leia [[Funções/README|⚙️ Funções]]
4. **Ver Diagramas?** Clique em [[Arquitetura/DIAGRAMAS|📊 Diagramas]]

---

_Mapa Visual • EmCantoArtesanato • 2026-04-13_
