---
tags:
  - components
  - index
  - react
  - ui
related:
  - "[[../Páginas/README|Páginas]]"
  - "[[../Brand/README|Design System]]"
  - "[[../Produtos/README|Produtos]]"
---

# 🎯 Componentes UI - Índice

Documentação dos 11 componentes React reutilizáveis do projeto.

**Ver também:** [[../Arquitetura/DIAGRAMAS#-estrutura-de-componentes-hierarquia|Hierarquia de Componentes]] · [[../Brand/README|Design System]] · [[../Páginas/README|Como usar em Páginas]]

---

## 📊 Visão Geral

| Componente | Tipo | Arquivo | Responsabilidade |
|----------|------|---------|------------------|
| [[Header|Header]] | Layout | `src/components/Header.tsx` | Navegação principal |
| [[Footer|Footer]] | Layout | `src/components/Footer.tsx` | Rodapé + contato |
| [[Hero|Hero]] | Conteúdo | `src/components/Hero.tsx` | Banner principal home |
| [[CategoryHero|CategoryHero]] | Conteúdo | `src/components/CategoryHero.tsx` | Hero por categoria |
| [[ProductCard|ProductCard]] | Reutilizável | `src/components/ProductCard.tsx` | Card de produto |
| [[ProductGrid|ProductGrid]] | Layout | `src/components/ProductGrid.tsx` | Grid responsivo |
| [[CategoryStrip|CategoryStrip]] | Conteúdo | `src/components/CategoryStrip.tsx` | Faixa de categoria |
| [[About|About]] | Conteúdo | `src/components/About.tsx` | Seção sobre Sônia |
| [[WhatsAppButton|WhatsAppButton]] | Funcional | `src/components/WhatsAppButton.tsx` | Botão flutuante |
| [[ScrollToTop|ScrollToTop]] | Utilitário | `src/components/ScrollToTop.tsx` | Scroll ao topo |
| [[ReadyToShipCard|ReadyToShipCard]] | Reutilizável | `src/components/ReadyToShipCard.tsx` | Card pronto entrega |

---

## 🏗️ Componentes de Layout

Formam a estrutura base de todas as páginas.

- [[Header|🔀 Header]] - Navegação
- [[Footer|📄 Footer]] - Rodapé
- [[ScrollToTop|⬆️ ScrollToTop]] - Utilidade de scroll
- [[WhatsAppButton|💬 WhatsAppButton]] - Botão flutuante

---

## 🎨 Componentes de Conteúdo

Exibem informações específicas em diferentes contextos.

- [[Hero|🎬 Hero]] - Banner principal
- [[CategoryHero|🎬 CategoryHero]] - Hero de categoria
- [[CategoryStrip|📺 CategoryStrip]] - Faixa de categoria
- [[About|👤 About]] - Sobre Sônia

---

## 🛍️ Componentes de Produto

Relacionados à exibição e interação com produtos.

- [[ProductCard|🎴 ProductCard]] - Card individual
- [[ProductGrid|🏙️ ProductGrid]] - Grid de produtos
- [[ReadyToShipCard|⚡ ReadyToShipCard]] - Card pronto

---

## 📐 Arquitetura de Componentes

```
App.tsx (Layout raiz)
├── ScrollToTop (hook)
├── Header
├── main (Outlet - página ativa)
├── Footer
└── WhatsAppButton

Home.tsx
├── Hero
├── CategoryStrip (Bolsas)
├── CategoryStrip (Colares)
└── CategoryStrip (Mesa Posta)

Bolsas.tsx (e outras páginas de catálogo)
├── CategoryHero
└── ProductGrid
    └── ProductCard[] (múltiplas instâncias)

ProntaEntrega.tsx
└── ReadyToShipCard[] (múltiplas instâncias)
```

---

## 🎨 Design System

Todos os componentes usam [[../Brand/README|Design System]] consistente:

### Cores
- **Primary CTA:** Verde #22c55e (WhatsApp, botões)
- **Background:** Cream #fffdd0 (seções suaves)
- **Text:** Ink #000000 (principal)
- **Border:** #e5e7eb (divisores)
- **Secondary Text:** Muted #6b7280

### Tipografia
- **Títulos:** Serif (elegant, luxe)
- **Corpo:** Sans (legível, moderno)
- **Tamanho base:** 14-16px

### Espaçamento
- **Padding horizontal:** `px-6` (24px)
- **Padding vertical:** `py-12` (48px)
- **Gaps:** `gap-3` (12px) ou `gap-6` (24px)

### Responsividade (Mobile-First)
- **Mobile:** Base (até 640px)
- **sm:** 640px+
- **md:** 768px+ (Tablets)
- **lg:** 1024px+ (Desktops)
- **xl:** 1280px+ (TVs/Monitores)

---

## 🔄 Padrões Comuns

### Props Pattern

Componentes com dados:
```tsx
interface Props {
  data: T
  onAction?: (param: any) => void
  className?: string
}
```

Componentes de layout:
```tsx
interface Props {
  children?: ReactNode
  className?: string
}
```

---

## 🚀 Checklist para Novo Componente

- [ ] Arquivo em `src/components/`
- [ ] Interface de Props clara
- [ ] JSDoc comments
- [ ] Tailwind classes (sem CSS separado)
- [ ] Responsivo (mobile-first)
- [ ] Reutilizável (props parametrizadas)
- [ ] Sem estado complexo
- [ ] Importado e usado em alguma página
- [ ] Documentado em arquivo `.md` individual

---

## 📖 Como Navegar

**Quer modificar um componente?**
1. Procure na tabela acima
2. Clique no link para ver documentação detalhada
3. Procure pelo arquivo em `src/components/`

**Quer entender fluxos?**
1. Vá para [[../Arquitetura/DIAGRAMAS|Diagramas]]
2. Veja [[../Arquitetura/DIAGRAMAS#-estrutura-de-componentes-hierarquia|Hierarquia de Componentes]]

**Quer seguir design system?**
1. Vá para [[../Brand/README|Brand]]
2. Consulte [[../Brand/README#-design-system|Design System]]

---

_Índice de Componentes • EmCantoArtesanato_
