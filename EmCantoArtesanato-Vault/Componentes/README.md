# 🎯 Componentes UI

Documentação dos componentes React reutilizáveis do projeto.

---

## 📊 Visão Geral

| Componente | Localização | Função | Reutilizável |
|------------|------------|--------|--------------|
| **Header** | `src/components/` | Navegação principal | ✅ Sim |
| **Footer** | `src/components/` | Rodapé + contato | ✅ Sim |
| **Hero** | `src/components/` | Banner herói | ✅ Sim |
| **CategoryHero** | `src/components/` | Hero por categoria | ✅ Sim |
| **ProductCard** | `src/components/` | Card de produto | ✅ Sim |
| **ProductGrid** | `src/components/` | Grid de produtos | ✅ Sim |
| **CategoryStrip** | `src/components/` | Strip de categoria | ✅ Sim |
| **About** | `src/components/` | Seção sobre | ✅ Sim |
| **WhatsAppButton** | `src/components/` | Botão flutuante | ✅ Sim |
| **ScrollToTop** | `src/components/` | Voltar ao topo | ✅ Sim |
| **ReadyToShipCard** | `src/components/` | Card pronto entrega | ✅ Sim |

**Total:** 11 componentes reutilizáveis

---

## 🎨 Estrutura de Layout

### Layout Raiz (App.tsx)

Todos as páginas usam este layout:

```tsx
function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />  {/* Página ativa aqui */}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
```

---

## 🧩 Componentes Principais

### Header
**Arquivo:** `src/components/Header.tsx`  
**Responsabilidade:** Navegação principal

```tsx
export default function Header() {
  // Logo + menu com links para:
  // - Home
  // - Bolsas
  // - Colares
  // - Mesa Posta
  // - Pronta Entrega
}
```

**Props:** Nenhum  
**Estado:** Pode ter menu mobile (hamburger)  
**Classe:** Tailwind para responsividade

---

### Footer
**Arquivo:** `src/components/Footer.tsx`  
**Responsabilidade:** Rodapé com contato

**Conteúdo:**
- Links úteis
- Informações de contato
- WhatsApp link
- Copyright

**Props:** Nenhum  
**Classe:** `border-t border-border` (divisor)

---

### Hero
**Arquivo:** `src/components/Hero.tsx`  
**Responsabilidade:** Banner principal da home

```tsx
// Logo EmCanto
// Imagem de destaque (produto)
// Título + descrição
// CTA (Call-to-Action)
```

**Características:**
- Logo full-width no mobile
- Imagem responsiva
- CTA visível

**Props:** Nenhum

---

### CategoryHero
**Arquivo:** `src/components/CategoryHero.tsx`  
**Responsabilidade:** Hero específico por categoria

```tsx
interface Props {
  category: 'bolsas' | 'colares' | 'centros-de-mesa'
  title: string
  description: string
}
```

**Exemplo de uso:**
```tsx
<CategoryHero 
  category="bolsas"
  title="Bolsas Artesanais"
  description="Feitas à mão com qualidade..."
/>
```

---

### CategoryStrip
**Arquivo:** `src/components/CategoryStrip.tsx`  
**Responsabilidade:** Card com descrição + CTA

```tsx
interface Props {
  category: string
  title: string
  description: string
  ctaLink: string          // Rota para clicar
  ctaLabel: string         // Texto do botão
}
```

**Exemplo:**
```tsx
<CategoryStrip
  category="bolsas"
  title="Bolsas Artesanais"
  description="Bolsas em crochê..."
  ctaLink="/bolsas"
  ctaLabel="Ver todas as bolsas"
/>
```

**Localização:** Home page (3x CategoryStrip para 3 categorias)

---

### ProductCard
**Arquivo:** `src/components/ProductCard.tsx`  
**Responsabilidade:** Exibe um produto individual

```tsx
interface Props {
  product: Product
}
```

**Renderiza:**
- Imagem principal
- Nome do produto
- Descrição curta
- Preço
- Botão "Encomendar via WhatsApp"

**Interação:** Click → abre WhatsApp

---

### ProductGrid
**Arquivo:** `src/components/ProductGrid.tsx`  
**Responsabilidade:** Grid responsivo de produtos

```tsx
interface Props {
  products: Product[]
  category: 'bolsas' | 'colares' | 'centros-de-mesa'
}
```

**Renderiza:**
- `products.map(p => <ProductCard product={p} />)`
- Grid responsivo (1 col mobile, 2-3 cols desktop)
- Espaçamento automático

---

### About
**Arquivo:** `src/components/About.tsx`  
**Responsabilidade:** Seção "Sobre Sônia"

**Conteúdo:**
- Foto de Sônia
- História da artesã
- Filosofia
- Por que comprar

**Props:** Nenhum

---

### WhatsAppButton
**Arquivo:** `src/components/WhatsAppButton.tsx`  
**Responsabilidade:** Botão flutuante verde (mobile)

```tsx
// Botão fixo no canto
// Link WhatsApp: https://wa.me/55...
// Ícone verde + "Encomendar"
```

**Características:**
- Posição fixa (bottom-right)
- Sempre visível
- Responsivo (esconde em desktop?)

---

### ScrollToTop
**Arquivo:** `src/components/ScrollToTop.tsx`  
**Responsabilidade:** Volta ao topo ao mudar de página

```tsx
// useEffect ao trocar rota
// window.scrollTo(0, 0)
```

**Props:** Nenhum  
**Sem renderização visual**

---

### ReadyToShipCard
**Arquivo:** `src/components/ReadyToShipCard.tsx`  
**Responsabilidade:** Card especial para itens prontos

```tsx
interface Props {
  item: ReadyToShipItem
}
```

**Diferenças do ProductCard:**
- Destacado (badge "Pronto para Entrega")
- Preço final visível
- Sem variações
- Prioridade visual

---

## 🎨 Design System (Tailwind)

### Cores Globais
```css
green       → #22c55e (WhatsApp, CTA)
cream       → #fffdd0 (backgrounds suaves)
ink         → #000000 (texto principal)
border      → #e5e7eb (divisores)
muted       → #6b7280 (texto secundário)
```

### Tipografia
```css
serif       → Títulos (elegant)
sans        → Corpo (legível)
```

### Espaçamento
```css
px-6        → Padding horizontal padrão
py-12       → Padding vertical generoso
gap-3       → Espaço entre flex items
```

### Responsividade
```css
md:          → Tablets e maiores
lg:          → Desktops
mobile-first → Tailwind default
```

---

## 🔄 Padrões de Props

### Props Comuns

**Para componentes com dados:**
```tsx
interface Props {
  data: T
  onAction?: (param: any) => void
  className?: string
}
```

**Para componentes de layout:**
```tsx
interface Props {
  children?: ReactNode
  className?: string
}
```

---

## 🚀 Fluxo de Renderização

```
Home.tsx
  └─ Hero
  └─ CategoryStrip (Bolsas)
  └─ CategoryStrip (Colares)
  └─ CategoryStrip (Mesa Posta)
  └─ WhatsApp CTA

Bolsas.tsx
  └─ CategoryHero (bolsas)
  └─ ProductGrid
      └─ ProductCard[]
  └─ WhatsApp CTA

App.tsx (Layout raiz)
  └─ ScrollToTop
  └─ Header
  └─ Outlet (página ativa)
  └─ Footer
  └─ WhatsAppButton
```

---

## 📋 Checklist para Novo Componente

- [ ] Arquivo em `src/components/`
- [ ] Interface de Props clara
- [ ] JSDoc comments (nome, responsabilidade)
- [ ] Tailwind classes (sem CSS separado)
- [ ] Responsivo (mobile-first)
- [ ] Reutilizável (props parametrizadas)
- [ ] Sem estado complexo (se possível)
- [ ] Importado e usado em alguma página

---

_Documentação de Componentes • EmCantoArtesanato_
