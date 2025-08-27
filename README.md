Voici un **README** clair et complet que tu peux coller dans ton projet.
Il décrit l’arborescence, chaque fichier important, et les fonctions clés (avec leur rôle et leurs entrées/sorties).

---

# Keiken – Next.js + shadcn/ui + Decap (Headless CMS)

Site Next.js piloté par du **contenu Markdown/JSON** via **Decap CMS** (Netlify/Decap).
Architecture “headless” : **le style vit dans les composants**, **le contenu vit dans `content/`**, et la page d’accueil est **orchestrée par des blocs** déclarés dans `content/pages/home.md`.

---

## Sommaire

* [Stack & scripts](#stack--scripts)
* [Arborescence](#arborescence)
* [Flux de données](#flux-de-données)
* [Dossiers & fichiers clés](#dossiers--fichiers-clés)
* [Composants UI](#composants-ui)
* [Lib (fonctions de lecture)](#lib-fonctions-de-lecture)
* [Blocs (`home.md` → rendu dynamique)](#blocs-homemd--rendu-dynamique)
* [Decap CMS (admin)](#decap-cms-admin)
* [Personnaliser / Étendre](#personnaliser--étendre)
* [Dépannage rapide](#dépannage-rapide)

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
repo-root/
├─ app/                          # App Router (layouts, pages)
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
│
├─ components/                   # UI & sections (style)
│  ├─ layout/
│  │  ├─ home-blocks.tsx         # rend la page à partir des "blocks"
│  │  └─ site-header.tsx         # header (reçoit site via props)
│  └─ ui/
│     ├─ scrolling-banner.tsx    # bandeau défilant (style seulement)
│     ├─ stat-item.tsx           # carte de stat (style)
│     └─ value-item.tsx          # item de “values” (style)
│
├─ content/                      # Contenu éditorial (source de vérité)
│  ├─ pages/
│  │  └─ home.md                 # orchestre les blocs de la page d’accueil
│  ├─ stats/
│  │  └─ stats.md                # source optionnelle de stats (items)
│  ├─ values/
│  │  └─ valuesection.md         # source optionnelle de values
│  └─ setting/
│     └─ site.json               # (optionnel) métadonnées du site si non dans home.md
│
├─ lib/                          # Lecture des contenus
│  ├─ page.ts                    # getHomePage(): lit home.md & parse les blocs
│  ├─ stats.ts                   # getStats(): lit stats.md
│  └─ values.ts                  # getValues(): lit valuesection.md
│
├─ public/
│  ├─ admin/
│  │  ├─ index.html              # SPA de Decap CMS
│  │  └─ config.yml              # config Decap
│  └─ uploads/                   # assets/upload CMS (optionnel)
│
├─ tailwind.config.ts (si présent)
├─ tsconfig.json
└─ package.json
```

---

## Flux de données

1. **Éditeur** modifie `content/pages/home.md` (ou via `/admin`).
2. `lib/page.ts` lit `home.md` (front-matter YAML) → **normalise les blocs**.
3. `components/layout/home-blocks.tsx` **mappe les blocs** → **composants stylés** (`SiteHeader`, `HeadingView`, `StatsView`, `ValuesView`, `ScrollingBanner`…).
4. `app/page.tsx` rend simplement `<HomeBlocks />`.

> Résultat : on change l’ordre/les sections **sans toucher au code**, juste en éditant `home.md`.

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

## Decap CMS (admin)

* **UI** : `public/admin/index.html` (charge `decap-cms`)
* **Config** : `public/admin/config.yml`

  * définit le backend Git (`git-gateway` ou `test-repo` en local),
  * `media_folder`/`public_folder`,
  * `collections` (expose `content/pages/home.md`, `content/stats/stats.md`, etc.)
* **Local** : si `local_backend: true` → lancer `npx decap-server`

---

## Personnaliser / Étendre

* **Ajouter une section “Clients Grid”** :

  * créer `clients-grid.tsx` (style),
  * ajouter un type de bloc `clients` (`asClients` dans `lib/page.ts`),
  * rendre `case "clients"` dans `home-blocks.tsx`,
  * ajouter le schéma dans `config.yml` (list d’items avec logo, nom, lien),
  * remplir `blocks:` dans `home.md`.

* **Déplacer le header globalement** :

  * soit `- type: "header"` dans `blocks`,
  * soit `<SiteHeader site={page.site} />` dans `app/layout.tsx` (et on retire le bloc pour éviter les doublons).

---

## Dépannage rapide

* **Le header affiche “Site”** → `SiteHeader` n’a pas reçu `site` en props
  (passer `page.site` dans `home-blocks.tsx` ou le rendre depuis `layout.tsx`).

* **/admin → 404** → vérifier `public/admin/index.html` et `public/admin/config.yml`.
  Tester directement `http://localhost:3000/admin/index.html` et `.../config.yml`.

* **Décap ne sauvegarde pas en local** → lancer `npx decap-server` (si `local_backend: true`).

* **La bannière défile avec un “saut”** → fournir `itemWidth` exact (px) à `ScrollingBanner` si `src` est une string.

* **Imports qui cassent sur Linux/CI** → respecter la **casse** (ex: `stat-item.tsx`, pas `Stat-item.tsx`).

---

## Licence

Libre à toi d’ajouter la licence de ton choix (MIT, etc.).

---

Besoin d’un exemple **`config.yml`** prêt pour éditer `site`, `blocks`, `items`, `values` depuis Decap ? Dis-le et je te le fournis adapté à ton repo.
