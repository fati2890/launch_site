Parfait — voilà un **README mis à jour** avec la partie **routing** telle qu’on l’a mise en place (une page = un fichier Markdown `content/pages/<slug>.md` + une route Next `app/<slug>/page.tsx` qui rend les *blocks* via `PageBlocks`). J’ai aussi remplacé les mentions de `home-blocks.tsx` par `components/blocks/page-blocks.tsx` et noté le rewrite `/admin → /admin/index.html`.

---

# Keiken – Next.js + shadcn/ui + Decap (Headless CMS)

Site Next.js piloté par du **contenu Markdown** via **Decap CMS**.
Architecture “headless” : **le style vit dans les composants**, **le contenu vit dans `content/`**, et chaque page est **orchestrée par des “blocks”** (déclarés dans le front-matter YAML des fichiers `.md`).

---

## Stack & scripts

* **Next.js (App Router)** + **TypeScript**
* **Tailwind** + **shadcn/ui**
* **Decap CMS** (UI d’admin sur `/admin`)
* **gray-matter** (lecture du front-matter YAML)

```bash
npm run dev         # démarre le site
npx decap-server    # (local) proxy Decap si local_backend: true
```

---

## Arborescence

```
.
├─ .github/workflows/
│  └─ ci.yml                       # CI: build / lint / type-check / tests
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx                   # layout racine (header/footer globaux)
│  └─ page.tsx                     # page d'accueil (rend <PageBlocks/>)
│  # Exemple d’autre page :
│  # └─ about/
│  #    └─ page.tsx                # rend <PageBlocks/> avec getPage("about")
│
├─ components/
│  ├─ blocks/
│  │  └─ page-blocks.tsx           # RENDERER: mappe les "blocks" -> composants UI
│  ├─ layout/
│  │  ├─ site-header.tsx           # header (piloté par site.meta)
│  │  └─ site-footer.tsx           # footer (optionnel)
│  └─ ui/
│     ├─ scrolling-banner.tsx      # bandeau défilant (style)
│     ├─ Stat-item.tsx             # carte de statistique (style)
│     └─ value-item.tsx            # item de “values” (style)
│
├─ content/
│  └─ pages/
│     └─ home.md                   # contenu + blocks (page d’accueil)
│     # (une page = un fichier .md : about.md, services.md, etc.)
│
├─ lib/
│  ├─ page-types.ts                # types TypeScript des blocks/pages
│  ├─ page.ts                      # getPage()/getHomePage() + parsers (narrowers)
│  └─ utils.ts
│
├─ public/
│  ├─ admin/
│  │  ├─ config.yml                # configuration Decap CMS
│  │  └─ index.html                # SPA Decap
│  ├─ Impact-of-work.png
│  ├─ trait.png
│  └─ ...
│
├─ next.config.ts                  # rewrite /admin -> /admin/index.html
├─ package.json
└─ tsconfig.json
```

---

## Routing (pages multiples) — **ce qu’on utilise**

Nous utilisons le **routing par système de fichiers** de Next (Option A) :

* **Une URL `/slug` = un fichier `content/pages/slug.md` + un fichier `app/slug/page.tsx`.**
* Le composant `app/<slug>/page.tsx` lit le Markdown via `getPage(slug)` et **rend la page avec `PageBlocks`**, qui transforme chaque *block* du front-matter en composant UI.

### Accueil (`/`)

```tsx
// app/page.tsx
import PageBlocks from "@/components/blocks/page-blocks";
import { getHomePage } from "@/lib/page";

export default async function Home() {
  const page = await getHomePage();  // alias de getPage("home")
  return <PageBlocks page={page} />;
}
```

### Exemple d’une nouvelle page `/about`

1. **Contenu** : crée `content/pages/about.md`
   (même structure que `home.md`, avec un tableau `blocks:`)

```md
---
title: "About"
description: "About page managed by Decap CMS"

site:
  name: "Keiken"
  nav:
    - { label: "Home", href: "/" }
    - { label: "About", href: "/about" }

blocks:
  - type: "heading"
    heading: "About Keiken"
    subheading: "Who we are and what we do."
    align: "center"

  - type: "values"
    values:
      - { title: "Integrity", description: "We work with honesty and transparency." }
      - { title: "Innovation", description: "Always improving, always iterating." }
---
```

2. **Route Next** : crée `app/about/page.tsx`

```tsx
import PageBlocks from "@/components/blocks/page-blocks";
import { getPage } from "@/lib/page";

export default async function AboutPage() {
  const page = await getPage("about");   // lit content/pages/about.md
  return <PageBlocks page={page} />;
}
```

> 💡 **Header/Footer** : pour éviter les doublons, on les rend **dans `app/layout.tsx`** (globaux).
> Si tu avais un block `{ type: "header" }` dans un `.md`, enlève-le ou ignore-le côté renderer.

---

## `home.md` (structure des *blocks*)

Le front-matter YAML liste des blocs dans l’ordre d’affichage :

```yaml
site:
  name: "Keiken"
  nav:
    - { label: "Home", href: "/" }
    - { label: "About", href: "/about" }

blocks:
  - type: "heading"
    heading: "Keiken Digital Solutions"
    subheading: "Building Trust"
    align: "center"

  - type: "stats"
    items:
      - { value: 25, title: "Customer challenges solved", description: "…" }
      - { value: 50, title: "Contributors", description: "…" }

  - type: "banner"
    src: "/Impact-of-work.png"
    itemWidth: 420
    height: 92
    gapPx: 80
    speedSeconds: 24

  - type: "values"
    values:
      - { title: "Build", description: "…" }
      - { title: "Collaborate", description: "…" }
```

Blocs supportés (renderer `components/blocks/page-blocks.tsx`) :

* **`heading`** → grand titre + sous-titre
* **`stats`** → grille de statistiques
* **`values`** → liste de valeurs (title + description)
* **`banner`** → bandeau défilant (image répétée)

> Ajouter un **nouveau type** =
>
> 1. définir son type dans `lib/page-types.ts`,
> 2. écrire son *narrower* (`asMonBloc`) dans `lib/page.ts`,
> 3. ajouter un `case` dans `components/blocks/page-blocks.tsx`,
> 4. (optionnel) déclarer ses champs dans `public/admin/config.yml` pour édition via Decap.

---

## Composants UI (style uniquement)

* `layout/site-header.tsx` : header sticky. **Props** : `site?: { name?: string; nav?: {label, href}[] }`.
* `layout/site-footer.tsx` : footer simple (optionnel).
* `ui/Stat-item.tsx` : une statistique (`value`, `title`, `description?`).
* `ui/value-item.tsx` : un item “value” avec index “01., 02., …”.
* `ui/scrolling-banner.tsx` : bandeau défilant fluide. **Props** : `src`, `itemWidth` (obligatoire si `src` est une string), `height`, `count`, `gapPx`, `speedSeconds`.

---

## Lib (lecture & parse)

### `lib/page-types.ts`

Déclare les **types** :

* `SiteMeta`, `PageBlock` (union), `PageData`, etc.

### `lib/page.ts`

* *Narrowers* : `asHeading`, `asStats`, `asValues`, `asBanner` (parse sécurisée du YAML).
* `getPage(slug)` : lit `content/pages/<slug>.md` → `PageData`.
* `getHomePage()` : alias de `getPage("home")`.

---

## Decap CMS

* UI servie via **`/admin/index.html`**.
  Un rewrite dans `next.config.ts` permet d’ouvrir directement **`/admin`** :

```ts
// next.config.ts
export default {
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
};
```

* **`public/admin/config.yml`** : déclare la collection de pages et **les champs des blocks**.
  Pour rendre *About* éditable, ajoute un item “About” pointant sur `content/pages/about.md` avec les mêmes champs que Home.

Exemple minimal :

```yaml
backend:
  name: git-gateway
  branch: main

local_backend: true

media_folder: "public"
public_folder: "/"

collections:
  - label: "Pages"
    name: "pages"
    files:
      - label: "Home"
        name: "home"
        file: "content/pages/home.md"
        fields: [ ... mêmes champs/blocks ... ]
      - label: "About"
        name: "about"
        file: "content/pages/about.md"
        fields: [ ... mêmes champs/blocks ... ]
```

---

## CI (GitHub Actions)

`.github/workflows/ci.yml` effectue **install → lint → type-check → build → tests** à chaque push/PR sur `main`.

---

## Notes pratiques

* **Pas de doublon de header/footer** : on les garde **dans le layout** (globaux).
* **Thème clair/sombre** : géré via classes `:root` / `.dark` dans `app/globals.css`. Mettre `class="dark"` sur `<html>` ou `<body>` (ou utiliser un ThemeProvider) bascule toutes les couleurs Tailwind CSS variables (`bg-background`, `text-foreground`, `text-primary`, etc.).
* **Couleurs personnalisées** : utilisez `text-primary`, `text-secondary`, etc. → reflètent automatiquement le thème (au lieu de `text-sky-*` en dur).

---
