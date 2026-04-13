---
tags:
  - brand
  - design-system
  - colors
  - typography
  - spacing
related:
  - "[[Sonia|Sônia Lima]]"
  - "[[../Componentes/README|Componentes]]"
---

# Design System

Guia unificado de design para toda a plataforma.

## 🎨 Cores Brand

| Cor | Uso | Tailwind | Hex | Exemplo |
|-----|-----|---------|-----|---------|
| **Verde** | WhatsApp, CTA, primária | `green` | `#22c55e` | Botão "Encomendar" |
| **Creme** | Backgrounds suaves | `cream` | `#fffdd0` | Seções de conteúdo |
| **Preto** | Texto principal | `ink` | `#000000` | Títulos, corpo |
| **Cinza Claro** | Bordas, divisores | `border` | `#e5e7eb` | Linhas separadoras |
| **Cinza Médio** | Texto secundário | `muted` | `#6b7280` | Labels, hints |

## 🔤 Tipografia

### Títulos
- **Font:** Serif (elegant, luxe)
- **Tamanho:** Generoso
- **Peso:** Bold
- **Uso:** H1, H2, H3 em páginas

### Corpo
- **Font:** Sans (legível, moderno)
- **Tamanho:** 14-16px base
- **Peso:** Regular/normal
- **Uso:** Parágrafos, descrições

## 📏 Espaçamento

### Padding
```css
px-6         /* Horizontal (lateral) - 24px */
py-12        /* Vertical (topo/base) - 48px */
```

### Gaps
```css
gap-3        /* 12px entre items */
gap-6        /* 24px entre items */
```

### Margins
```css
mb-6         /* Margin-bottom */
mt-4         /* Margin-top */
```

## 📐 Responsividade

Mobile-first com Tailwind breakpoints:

```css
/* Base */     /* Mobile */
sm:           /* 640px+ */
md:           /* 768px+ Tablets */
lg:           /* 1024px+ Desktops */
xl:           /* 1280px+ Large screens */

/* Exemplo */
text-sm md:text-base lg:text-lg
```

## 🎨 Bordas & Sombras

```css
border-t              /* Borda superior */
border-border         /* Cor padrão */
rounded-full          /* Completely rounded (pills) */
```

---

_Brand • EmCantoArtesanato_
