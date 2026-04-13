# 👤 Brand & Identidade Visual

Documentação da marca EmCanto e sua criadora Sônia Lima.

---

## 🎨 EmCanto Brand

**O que é:** Marca de artesanato online focada em produtos handmade de qualidade.

**Criadora:** Sônia Lima (artesã experiente)

**Segmento:** E-commerce de artesanato (bolsas, colares, centros de mesa)

**Posicionamento:** Premium artesanal, único, personalizado

---

## 👨‍🎨 Sônia Lima

### Perfil
- **Profissão:** Artesã
- **Especialidade:** Crochê e tricô artesanal
- **Marca:** EmCanto (criação própria)
- **Missão:** Transformar fios em peças únicas

### Produtos Criados
1. **Bolsas Artesanais** - Crochê/tricô em diversos fios
2. **Colares Artesanais** - Cordões em crochê + pedras/resinas/metais
3. **Centros de Mesa** - Sousplats em crochê

### Filosofia
- Handmade (feito à mão)
- Qualidade premium
- Acabamento refinado
- Personalização disponível
- Cada peça é única

### Contato
- WhatsApp: Integrado no site
- Canal principal de vendas: WhatsApp

---

## 🎯 Logo EmCanto

### Variações Oficiais

O logo existe em **3 variações**:

#### 1️⃣ Logo Principal
**Arquivo:** `public/images/logo.png`  
**Uso:** Padrão em backgrounds variados  
**Cores:** Completo com fundo

#### 2️⃣ Logo Transparente
**Arquivo:** `public/images/logo_fundo_transparente.png`  
**Uso:** Backgrounds claros  
**Características:** Fundo transparente

#### 3️⃣ Logo Sem Fundo
**Arquivo:** `public/images/logo_sem_fundo.png`  
**Uso:** Destaque (hero, cabeçalho)  
**Características:** Apenas a marca, sem elemento adicional

### Sistema de Logo Atual

```
Hero.tsx
  └─ Usa: logo_sem_fundo.png
      └─ Full-width no mobile
      └─ Centralizado no desktop
      └─ Altura responsive
```

### Guia de Uso

| Situação | Logo | Arquivo |
|----------|------|---------|
| Hero/Banner | Sem Fundo | `logo_sem_fundo.png` |
| Header/Menu | Principal | `logo.png` |
| Backgrounds claros | Transparente | `logo_fundo_transparente.png` |
| Printables | Sem Fundo | `logo_sem_fundo.png` |

---

## 🎨 Identidade Visual

### Cores Brand

| Cor | Uso | Tailwind | Hex |
|-----|-----|---------|-----|
| Verde | WhatsApp, CTA, primária | `green` | `#22c55e` |
| Creme | Backgrounds suaves | `cream` | `#fffdd0` |
| Preto | Texto principal | `ink` | `#000000` |
| Cinza Claro | Bordas, divisores | `border` | `#e5e7eb` |
| Cinza Médio | Texto secundário | `muted` | `#6b7280` |

### Tipografia

#### Títulos
- **Font:** Serif (elegant, luxe)
- **Tamanho:** Generoso
- **Peso:** Bold
- **Uso:** H1, H2, H3 em páginas

#### Corpo
- **Font:** Sans (legível, moderno)
- **Tamanho:** 14-16px base
- **Peso:** Regular/normal
- **Uso:** Parágrafos, descrições

### Ícones
- **Biblioteca:** Lucide React
- **Tamanho:** 20-24px (padrão)
- **Cor:** Herdada do contexto

---

## 📐 Design System

### Espaçamento

```css
/* Padding padrão */
px-6      /* Horizontal (lateral) */
py-12     /* Vertical (topo/base) */

/* Gaps entre elementos */
gap-3     /* 12px entre items */
gap-6     /* 24px entre items */

/* Margins (uso raro) */
mb-6      /* Margin-bottom */
mt-4      /* Margin-top */
```

### Bordas & Sombras

```css
border-t          /* Borda superior (divisor) */
border-border     /* Cor de borda padrão */
rounded-full      /* Completely rounded (pills) */
```

### Responsividade

```css
/* Mobile first approach */
md:       /* Tablets e maiores (768px+) */
lg:       /* Desktops (1024px+) */
xl:       /* TVs/monitores grandes */

/* Exemplo */
text-sm md:text-base lg:text-lg
```

---

## 🖼️ Imagens de Produto

### Localização
```
public/
└─ images/
    ├─ sonia.jpg                         (foto da artesã)
    ├─ bolsas_artesanais.jpg            (foto bolsas)
    ├─ colares_artesanais.jpg           (foto colares)
    ├─ sousplats.jpg                    (foto centros de mesa)
    ├─ logo.png                         (logo principal)
    ├─ logo_fundo_transparente.png      (logo transparente)
    └─ logo_sem_fundo.png               (logo sem fundo)
```

### Qualidade
- **Formato:** JPG (fotos), PNG (logos)
- **Resolução:** Full-size para retina (2x)
- **Otimização:** Comprimido para web

---

## 📱 Responsividade Brand

### Mobile (até 640px)
- Logo full-width em heroes
- Titles: serif grandes
- Buttons: full-width ou centered

### Tablet (640px - 1024px)
- Logo no topo ou lado
- Grid de 2 colunas
- Margins aumentados

### Desktop (1024px+)
- Logo destacado
- Grid de 3 colunas
- Espaçamento generoso

---

## 🌍 Brand Voice

### Tom de Comunicação
- **Elegante** - Premium artesanal
- **Pessoal** - Feito à mão por Sônia
- **Autêntico** - Genuíno, não corporativo
- **Acessível** - Fácil de entender

### Exemplos de Copy

"Bolsas artesanais feitas à mão em crochê ou tricô, com acabamento único e cheio de personalidade."

"Peças confeccionadas com cordões tecidos em crochê, elaborados com fios especiais, combinados a resinas, pedras e metais cuidadosamente selecionados."

"Cada criação é única — marcada por personalidade, autenticidade e identidade própria."

---

## 🚀 Evolução Futura

- [ ] Expandir paleta de cores
- [ ] Criar guidelines completos
- [ ] Adicionar mais imagens de lifestyle
- [ ] Desenvolver padrões/texturas
- [ ] Criar sistema de tipografia avançado
- [ ] Brand photography profissional

---

_Documentação de Brand • EmCantoArtesanato_
