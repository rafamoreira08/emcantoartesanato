# 🎨 EmCantoArtesanato - Knowledge Base

Bem-vindo! Este é o vault documentado e pronto para usar.

**Status:** ✅ Documentação Completa • **Última atualização:** 2026-04-13

---

## 📚 Seções do Vault (Clique para navegar)

### 📦 [Produtos](Produtos/README.md)
- 3 linhas de produtos (Bolsas, Colares, Mesa Posta)
- Estrutura de dados (Product interface)
- Preços, variações, fotos
- **Comece aqui se:** Quer entender o catálogo

### 🎯 [Componentes](Componentes/README.md)  
- 11 componentes React reutilizáveis
- Header, Footer, ProductCard, ProductGrid, etc
- Design patterns e Tailwind usage
- **Comece aqui se:** Vai modificar a UI

### 📄 [Páginas](Páginas/README.md)
- 7 rotas principais (Home, Bolsas, Admin, etc)
- Fluxos de dados, props, Firebase integration
- **Comece aqui se:** Quer adicionar novas páginas

### 👤 [Brand](Brand/README.md)
- Sobre Sônia Lima (artesã criadora)
- 3 variações do logo
- Design system (cores, tipografia, tone)
- **Comece aqui se:** Vai fazer mudanças visuais

### 🏗️ [Arquitetura](Arquitetura/README.md)
- Stack tecnológico completo (React, Firebase, Vite)
- Estrutura de pastas
- Fluxos de dados (visualizar, pedir, admin)
- Modelo de dados, build & deploy
- **Comece aqui se:** Precisa entender a arquitetura geral

### ⚙️ [Funções](Funções/README.md)
- loadProducts(), saveProduct(), deleteProduct()
- loadReadyItems(), fetchOrder()
- Admin functions, upload, auth
- Exemplos de uso e error handling
- **Comece aqui se:** Vai trabalhar com backend/Firebase

---

## 🚀 Começar em 15 Minutos

### 1️⃣ Entender (5 min)
- Leia [Arquitetura - Stack Tecnológico](Arquitetura/README.md#-stack-tecnológico)
- Veja [Estrutura de Pastas](Arquitetura/README.md#-estrutura-de-pastas)

### 2️⃣ Explorar Código (5 min)
- Abra `src/` no editor
- Procure por um componente que interesse você
- Volte aqui e leia a documentação correspondente

### 3️⃣ Entender Dados (5 min)
- Leia [Produtos - Visão Geral](Produtos/README.md#-visão-geral)
- Entenda [Product Interface](Produtos/README.md#-estrutura-de-fotos-productphoto)
- Veja [Fluxo do Produto](Produtos/README.md#-fluxo-do-produto)

---

## 📊 Projeto em Números

| Aspecto | Detalhes |
|---------|----------|
| Tipo | E-commerce de artesanato |
| Frontend | React 18 + TypeScript + Vite |
| Backend | Firebase |
| Hosting | GitHub Pages |
| Rotas | 7 principais |
| Componentes | 11 reutilizáveis |
| Linhas de Código | ~1,843 (TypeScript/TSX) |
| Documentação | 6 READMEs + INDEX |

---

## 🎯 Roteiros por Objetivo

### Adicionar novo produto
1. Leia [Produtos](Produtos/README.md)
2. Consulte [saveProduct()](Funções/README.md#saveproduct)
3. Acesse o [Admin Panel](Páginas/README.md#⚙️-admin-panel)

### Modificar um componente
1. Leia [Componentes](Componentes/README.md)
2. Veja [Padrões de Props](Componentes/README.md#padrões-de-props)
3. Consulte [Design System](Brand/README.md#-design-system)

### Adicionar nova página
1. Leia [Páginas](Páginas/README.md)
2. Veja [Padrão de Página](Páginas/README.md#-padrão-de-página-catálogo)
3. Use [Funções Principais](Funções/README.md)

### Trabalhar com Firebase
1. Leia [Modelo de Dados](Arquitetura/README.md#-modelo-de-dados-firebase)
2. Consulte [Funções Principais](Funções/README.md)
3. Verifique [Firebase Rules](Arquitetura/README.md#-segurança-firebase-rules)

### Entender fluxo de pedidos
1. Leia [Fluxo de Pedido](Arquitetura/README.md#fluxo-de-pedido-whatsapp)
2. Veja [saveOrder()](Funções/README.md#saveorder)
3. Entenda [updateOrderStatus()](Funções/README.md#updateorderstatus)

---

## 📖 Estrutura do Vault

```
EmCantoArtesanato-Vault/
├── INDEX.md                    ← Você está aqui
├── Produtos/
│   └── README.md              # 3 linhas de produtos
├── Componentes/
│   └── README.md              # 11 componentes React
├── Páginas/
│   └── README.md              # 7 rotas principais
├── Brand/
│   └── README.md              # Identidade visual
├── Arquitetura/
│   └── README.md              # Arquitetura técnica
└── Funções/
    └── README.md              # Funções principais
```

---

## 🔍 Buscar Informação Rápido

Use a busca do Obsidian (Cmd/Ctrl + P):
- **Componente:** "ProductCard"
- **Função:** "saveProduct"
- **Página:** "Admin"
- **Conceito:** "variações", "preço"

---

## ✅ Checklist para Novo Dev

- [ ] Leu [Arquitetura](Arquitetura/README.md)
- [ ] Entendeu o layout de pastas
- [ ] Familiarizou com [Componentes](Componentes/README.md)
- [ ] Conhece as 7 [Rotas](Páginas/README.md)
- [ ] Entendeu [Produtos](Produtos/README.md)
- [ ] Pode usar [Funções](Funções/README.md)
- [ ] Conhece [Design System](Brand/README.md)
- [ ] Testou localmente: `npm run dev`

---

## 🌐 Links Úteis

**Docs Externas:**
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs/
- Firebase: https://firebase.google.com/docs
- Tailwind: https://tailwindcss.com/docs
- Vite: https://vitejs.dev

**Código:**
- Componentes: `/src/components/`
- Páginas: `/src/pages/`
- Funções: `/src/lib/`
- Tipos: `/src/types/`

---

**Vault criado em:** 2026-04-13  
**Branch:** claude-improvements  
**Pronto para usar:** ✅

Aproveite! 🚀
