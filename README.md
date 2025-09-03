Voici un **README** clair et complet que tu peux coller dans ton projet.
Il décrit l’arborescence, chaque fichier important, et les fonctions clés (avec leur rôle et leurs entrées/sorties).

---

# Keiken – Next.js + shadcn/ui + Decap (Headless CMS)

Site Next.js piloté par du **contenu Markdown/JSON** via **Decap CMS** (Netlify/Decap).
Architecture “headless” : **le style vit dans les composants**, **le contenu vit dans `content/`**, et la page d’accueil est **orchestrée par des blocs** déclarés dans `content/pages/home.md`.

---

## Stack & scripts

* **Next.js (App Router)**, **TypeScript**
* **Tailwind** + **shadcn/ui**
* **Decap CMS** (UI d’admin sur `/admin`)
* **gray-matter** (lecture du front-matter YAML dans les `.md`)

Scripts utiles :

```bash
npm run dev         # démarre le site
npx decap-server    # (en local) proxy Decap si local_backend: true
```

---

## Arborescence

```
.
├─ .github/workflows/
│  └─ ci.yml                     # CI: build / lint / type-check / tests
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx                 # layout racine
│  └─ page.tsx                   # page d'accueil (rend <HomeBlocks/>)
│
├─ components/
│  ├─ home/
│  │  ├─ hero-section.tsx        # (optionnel) section héro si utilisée
│  │  ├─ home-blocks.tsx         # RENDERER: mappe les "blocks" -> composants
│  │  └─ site-header.tsx         # header piloté par site.meta
│  └─ ui/
│     ├─ scrolling-banner.tsx    # bandeau défilant (style)
│     ├─ Stat-item.tsx           # carte de statistique (style)
│     └─ value-item.tsx          # item de "values" (style)
│
├─ content/
│  └─ pages/
│     └─ home.md                 # contenu + blocks 
│
├─ lib/
│  ├─ page-types.ts              # types TypeScript des blocks/pages
│  ├─ page.ts                    # getPage()/getHomePage() + parsers (narrowers)
│  └─ utils.ts                   # helpers génériques (cn, etc.)
│
├─ public/
│  ├─ admin/
│  │  ├─ config.yml              # configuration Decap CMS
│  │  └─ index.html              # UI Decap (SPA)
│  ├─ Impact-of-work.png
│  ├─ trait.png
│  └─ ...                        # autres assets
│
├─ next.config.ts                # rewrite /admin -> /admin/index.html
├─ package.json
└─ tsconfig.json

```
---


## Dossiers & fichiers clés

### `content/pages/home.md`

Fichier **maître**. Contient :

* métadonnées optionnelles (`site: { name, nav… }` si tu veux que le header soit piloté ici),
* données brutes (`items` pour les stats, `values` pour les valeurs),
* surtout **`blocks:`** (liste ordonnée de sections à rendre).

Exemple :

```yaml
site:
  name: "Keiken"
  nav:
    - { label: "Home", href: "/" }
    - { label: "About", href: "/about" }

blocks:
  - type: "header"
  - type: "heading"
    heading: "Keiken Digital Solutions"
    subheading: "Building Trust"
    align: "center"
  - type: "stats"
    items:
      - { value: 25, title: "Customer challenges solved", description: "…" }
      - { value: 50, title: "Contributors", description: "…" }
  - type: "banner"
    src: "/uploads/impact.png"
    itemWidth: 420
    height: 92
    gapPx: 80
    speedSeconds: 24
  - type: "values"
    values:
      - { title: "Build", description: "…" }
      - { title: "Collaborate", description: "…" }
```

### `public/admin/config.yml`

Configuration de **Decap CMS** : backend Git, dossiers média, et **collections** (quels fichiers/ champs sont éditables dans l’UI).

---

## Composants UI

> Ces composants **ne contiennent pas de contenu**, seulement **style + props**.

* `components/layout/site-header.tsx`
  Header sticky avec blur. **Reçoit** `site?: { name?: string; nav?: {label, href}[] }`.
  Affiche le **dernier item** de nav sous forme de bouton ghost.

* `components/ui/stat-item.tsx`
  Affiche une **stat** : `value`, `title`, `description`.

* `components/ui/value-item.tsx`
  Affiche une **valeur** (titre + description) avec un index “01., 02., …” et un trait décoratif (image `trait.png` si utilisé).

* `components/ui/scrolling-banner.tsx`
  Bandeau défilant **infini et fluide**. Props :

  * `src` (string ou StaticImageData),
  * `itemWidth` (**obligatoire** si `src` est une string),
  * `height`, `count`, `gapPx`, `speedSeconds`.
    Le calcul de la piste est fait en px pour éviter les “sauts”.

---

## Lib (fonctions de lecture)

Toutes les fonctions lisent le disque via `fs/promises` + `gray-matter` (parse du front-matter).

### `lib/page.ts`

* **Types exposés** :

  * `PageBlock` (union de blocs `header`, `heading`, `stats`, `values`, `banner`)
  * `SiteMeta` (`name`, `description`, `nav`)
  * `PageData` (`title`, `blocks`, `site?`)

* **Fonctions de narrowing** :
  `asHeader`, `asHeading`, `asStats`, `asValues`, `asBanner`
  → sécurisent & normalisent chaque bloc lu depuis YAML.

* **`getHomePage(): Promise<PageData>`**

  * **Entrée** : aucune (lit `content/pages/home.md`)
  * **Sortie** :

    ```ts
    {
      title: string;
      blocks: PageBlock[]; // ordre = celui de home.md
      site?: { name?: string; description?: string; nav?: { label; href }[] };
    }
    ```
  * **Rôle** :

    1. lire `home.md`,
    2. convertir `blocks` bruts en objets typés,
    3. exposer `site` si présent (pour le header piloté par CMS).

### `lib/stats.ts`

* **Types** :
  `type Stat = { value: string | number; title: string; description?: string }`
* **`getStats(): Promise<Stat[]>`**

  * Lit `content/stats/stats.md` et renvoie la liste `items` (ou `[]` si absent).
  * Utilisé si tu veux faire des **sections Stats basées sur un fichier dédié**.

### `lib/values.ts`

* **Types** :
  `type Value = { title: string; description: string }`
* **`getValues(): Promise<Value[]>`**

  * Lit `content/values/valuesection.md` et renvoie la liste `values`.

> Remarque : dans l’architecture “blocks”, tu peux **soit** déclarer `items`/`values` **inline** dans `home.md`, **soit** garder `getStats()` / `getValues()` si tu préfères une source séparée. Les deux approches coexistent.

---

## Blocs (`home.md` → rendu dynamique)

Rendu assuré par `components/layout/home-blocks.tsx`.

* **Header**
  `{ type: "header" }`
  → rend `<SiteHeader site={page.site} />`

* **Heading**
  `{ type: "heading", heading, subheading?, align? }`
  → rend un grand titre (centré, droit, gauche)

* **Stats**
  `{ type: "stats", items?: [...], source?: "lib" }`
  → *items inline* ou récupération via `getStats()` (si `source: "lib"` et que tu ajoutes la logique correspondante)

* **Values**
  `{ type: "values", values?: [...], source?: "lib" }`
  → *values inline* ou récupération via `getValues()`

* **Banner**
  `{ type: "banner", src, itemWidth, height?, gapPx?, speedSeconds?, count? }`
  → rend `ScrollingBanner` (défilement fluide)

> **Ajouter un nouveau type de bloc** =
>
> 1. ajouter un `asMonBloc` dans `lib/page.ts`,
> 2. une `case "monBloc"` dans `home-blocks.tsx`,
> 3. (optionnel) champs dans `public/admin/config.yml` si on veut éditer depuis Decap.

---

## Ajouter un nouveau composant (nouveau “block”)



### 0) Choisir un nom et les champs

Exemple : un block **CTA** (call-to-action) avec :

* `title` (string), `text` (string),
* `buttonLabel` (string), `buttonHref` (string),
* `align` optionnel (`left | center | right`).

---

### 1) Créer le composant UI (style uniquement)

`components/ui/cta.tsx` :

```tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type CtaProps = {
  title: string;
  text?: string;
  buttonLabel?: string;
  buttonHref?: string;
  align?: "left" | "center" | "right";
  className?: string;
};

export default function Cta({
  title,
  text,
  buttonLabel,
  buttonHref = "#",
  align = "left",
  className,
}: CtaProps) {
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  return (
    <section className={cn("py-12", alignClass, className)}>
      <div className="max-w-3xl mx-auto px-4">
        <h3 className="text-3xl md:text-4xl font-semibold text-sky-700">{title}</h3>
        {text ? <p className="mt-3 text-muted-foreground">{text}</p> : null}
        {buttonLabel ? (
          <div className="mt-6">
            <Button asChild>
              <Link href={buttonHref}>{buttonLabel}</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
```

---

### 2) Déclarer le type + le parser dans `lib/page.ts`

* **a.** Ajouter le **type** au dessus :

```ts
export type CtaBlock = {
  type: "cta";
  title: string;
  text?: string;
  buttonLabel?: string;
  buttonHref?: string;
  align?: "left" | "center" | "right";
};
```

* **b.** L’ajouter à l’union `PageBlock` :

```ts
export type PageBlock =
  | HeadingBlock
  | StatsBlock
  | ValuesBlock
  | BannerBlock
  | HeaderBlock
  | CtaBlock;          //...
```

* **c.** Écrire le **narrower** (helper) :

```ts
const asCta = (b: any): CtaBlock | null =>
  b?.type === "cta"
    ? {
        type: "cta",
        title: String(b.title ?? ""),
        text: b?.text ? String(b.text) : undefined,
        buttonLabel: b?.buttonLabel ? String(b.buttonLabel) : undefined,
        buttonHref: b?.buttonHref ? String(b.buttonHref) : undefined,
        align: (["left", "center", "right"] as const).includes(b?.align) ? b.align : "left",
      }
    : null;
```

* **d.** Brancher le helper dans `getHomePage()` :

```ts
const blocks = blocksRaw
  .map(
    (b: unknown) =>
      asHeader(b as any) ||
      asHeading(b as any) ||
      asStats(b as any) ||
      asValues(b as any) ||
      asBanner(b as any) ||
      asCta(b as any)        // 👈 ajouté
  )
  .filter(Boolean) as PageBlock[];
```

---

### 3) Rendre le nouveau block dans `home-blocks.tsx`

* **a.** Importer le composant :

```tsx
import Cta from "@/components/ui/cta";
```

* **b.** Ajouter un `case` dans le **renderer** :

```tsx
function renderBlock(block: PageBlock, index: number, site?: any) {
  switch (block.type) {
    // ... autres cases
    case "cta":
      return (
        <Cta
          key={`cta-${index}`}
          title={block.title}
          text={block.text}
          buttonLabel={block.buttonLabel}
          buttonHref={block.buttonHref}
          align={block.align}
        />
      );
  }
}
```

> Le renderer **mappe** `type` → composant UI, en passant les props.

---

### 4) Déclarer le block dans `home.md`

Dans `content/pages/home.md`, ajoute dans `blocks:` :

```yaml
blocks:
 
  - type: "cta"
    title: "Ready to start?"
    text: "Let’s talk about your project and build something great."
    buttonLabel: "Contact us"
    buttonHref: "/contact"
    align: "center"
```


**comment ajouter une nouvelle page (exemple : `about`)** :

---

## Ajouter une nouvelle page (exemple : About)

Le site est **multi-page** et chaque page est décrite via un fichier **Markdown** dans `content/pages/`.
Les blocs (`blocks`) définis dans le frontmatter YAML contrôlent quels composants apparaissent et dans quel ordre.

### 1. Créer le fichier de contenu

Créer `content/pages/about.md` :

```md
---
title: "About"
description: "About page managed by Decap CMS"

site:
  name: "Keiken"
  description: "Editable settings via Decap."
  nav:
    - { label: "Home", href: "/" }
    - { label: "About", href: "/about" }
    - { label: "Blog", href: "/blog" }
    - { label: "Contact us", href: "/admin" }

blocks:
  - type: "header"

  - type: "heading"
    heading: "About Keiken"
    subheading: "Who we are and what we do."
    align: "center"

  - type: "values"
    values:
      - { title: "Integrity", description: "We work with honesty and transparency." }
      - { title: "Innovation", description: "Always improving, always iterating." }
      - { title: "Collaboration", description: "Together we go further." }

  - type: "banner"
    src: "/Impact-of-work.png"
    itemWidth: 420
    height: 92
    speedSeconds: 20
    gapPx: 60
    count: 6
---
```

---

### 2. Créer la route Next.js

Dans `src/app/about/page.tsx` :

```tsx
import HomeBlocks from "@/components/home-blocks";
import { getPage } from "@/lib/page";

export default async function AboutPage() {
  const page = await getPage("about"); // <- lit content/pages/about.md
  return <HomeBlocks page={page} />;
}
```

---

### 3. Vérifier les composants disponibles

Chaque bloc (`type: "..."`) correspond à un composant dans `components/` :

* `header` → `SiteHeader`
* `heading` → `HeadingView`
* `stats` → `StatsViewSmart`
* `values` → `ValuesViewSmart`
* `banner` → `ScrollingBanner`

Pour ajouter un **nouveau type de bloc**, tu devras :

1. Ajouter son **type** dans `src/lib/page-types.ts`
2. Écrire son **helper** (`asTonBloc`) dans `src/lib/page.ts`
3. Étendre le `switch` de `renderBlock` dans `home-blocks.tsx`

---

### 4. Gestion avec Decap CMS

Dans `public/admin/config.yml`, ajouter une entrée pour la nouvelle page :

```yaml
collections:
  - label: "Pages"
    name: "pages"
    files:
      - label: "Home"
        name: "home"
        file: "content/pages/home.md"
        fields: [...]
      - label: "About"
        name: "about"
        file: "content/pages/about.md"
        fields: [...]
```

---

 Après ça, la page `/about` sera disponible et éditable via **Decap CMS** (`/admin`).

---

