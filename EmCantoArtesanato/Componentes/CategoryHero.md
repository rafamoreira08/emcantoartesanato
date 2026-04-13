---
tags:
  - component
  - hero
  - category
  - banner
related:
  - "[[Hero|Hero]]"
  - "[[ProductGrid|ProductGrid]]"
  - "[[../Páginas/Bolsas|Bolsas Page]]"
---

# CategoryHero

**Arquivo:** `src/components/CategoryHero.tsx`  
**Tipo:** Componente de Conteúdo  
**Responsabilidade:** Hero específico por categoria

## 📋 Descrição

Componente que funciona como um hero customizável para cada página de categoria. Exibe título, descrição e imagem relacionada à categoria.

## 💻 Props

```tsx
interface Props {
  category: 'bolsas' | 'colares' | 'centros-de-mesa' | 'pronta-entrega'
  title: string
  description: string
}
```

## 📝 Exemplo de Uso

```tsx
<CategoryHero 
  category="bolsas"
  title="Bolsas Artesanais"
  description="Feitas à mão em crochê e tricô com acabamento único..."
/>
```

## 🎯 Funcionalidades

- Título da categoria
- Descrição textual
- Imagem/background relacionado
- Responsivo a diferentes tamanhos de tela

## 🎨 Design

- **Background:** Pode ter imagem de fundo ou cor sólida
- **Tipografia:** Titulo em serif grande, descrição em sans
- **Espaçamento:** Padding generoso (`py-12`)

## 🔗 Relações

- **Pais:** [[../Páginas/Bolsas|Bolsas.tsx]], [[../Páginas/Colares|Colares.tsx]], [[../Páginas/MesaPosta|MesaPosta.tsx]]
- **Irmãos:** [[ProductGrid|ProductGrid]]

## 📍 Hierarquia

```
Bolsas.tsx
  └─ CategoryHero ← TU
  └─ ProductGrid
```

---

_Componente • EmCantoArtesanato_
