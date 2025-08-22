# README.md — Next.js (App Router) + shadcn/ui + Decap CMS

---

## Aperçu

* **Next.js App Router + shadcn/ui** pour l’UI.
* **Decap CMS** (ex Netlify CMS) pour éditer le contenu **stocké dans Git**.
* **Trois emplacements clés** :

  * `content/` → **vos contenus** (Markdown/JSON) **à la racine** du repo.
  * `public/admin/` → **l’interface Decap** accessible sur **`/admin`**.

---

## Arborescence

```

├─ app/                              # App Router (layouts, pages)
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
│
├─ components/                       # UI partagée
│  ├─ layout/
│  │  ├─ hero-section.tsx
│  │  ├─ site-header.tsx
│  │  ├─ stats-section.tsx
│  │  └─ values-section.tsx
│  └─ ui/
│     ├─ button.tsx
│     ├─ scrolling-banner.tsx
│     ├─ separator.tsx
│     ├─ stat-item.tsx              
│     └─ value-item.tsx
│
├─ content/                          # Contenu géré par Decap (dans Git)
│  ├─ pages/
│  │  └─ home.md
│  ├─ setting/                       
│  │  └─ site.json
│  ├─ stats/
│  │  └─ stats.md
│  └─ values/
│     └─ valuesection.md
│
├─ lib/                              # Accès aux contenus (fs + gray-matter)
│  ├─ page.ts                        # getHomePage()
│  ├─ stats.ts                       # getStats()
│  ├─ utils.ts
│  └─ values.ts                      # getValues()
│
├─ public/
│  ├─ admin/                         # SPA Decap CMS (panneau d’admin)
│  │  ├─ index.html
│  │  └─ config.yml
│  ├─ impact-of-work.png             
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ trait.png
│  └─ vercel.svg
│
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ package-lock.json
├─ postcss.config.mjs
├─ README.md
├─ tailwind.config.ts                
└─ tsconfig.json

```

---

## `content/` — où et pourquoi

* **Emplacement** : **racine du repo** (obligatoire pour la config incluse).
 

* **Sous-dossiers par défaut** :

  * `content/pages/` → pages statiques (`home.md`).
  * `content/settings/` → configuration éditoriale (`site.json` : nom, tagline, nav).

---

## `public/admin/` — rôle de l’admin Decap

* **`public/admin/index.html`** : charge l’app **Decap CMS** depuis un CDN → **`/admin`**.
* **`public/admin/config.yml`** : configuration du backend Git, des **collections** et **champs**, des **dossiers de médias**.
* **Pourquo i `public/` ?** Tout ce qui est dans `public/` est servi tel quel par Next ; on obtient une **admin statique** sans code serveur.

---


## Démarrer en local

```bash
npm run dev
npx decap-server
# Ouvrir ensuite :
# - Site   : http://localhost:3000/
# - Admin  : http://localhost:3000/admin
```


---

## Collections par défaut

* **Pages** (`content/pages/*.md`) : `home.md`, `about.md`.
* **Posts** (`content/posts/*.md`) : `title`, `date`, `description?`, `draft`, `body`.
* **Settings** (`content/settings/site.json`) : `name`, `description?`, `nav[]`.

Vous pouvez étendre `config.yml` (ex. `projects`, `team`).

---

## Composants & organisation

* **Global partagé** → `src/component/` : primitives shadcn/ui (`Button`, `Input`), layout (`site-header`, `site-footer`), thème.
* **Par domaine** → `src/features/<feature>/components/` : UI liée à un contexte précis (`settings-nav`, `sign-in-form`).
* **Global navbar** : `src/component/layout/site-header.tsx`.
  **Sous-nav de section** (ex. dashboard/settings) : `src/features/<feature>/components/`.

---


## Exemple : modifier la section **Stats**

La section **Stats** de ton site est composée de **deux niveaux de composants** :

1. **`StatItem.tsx`** : représente une seule “case” de statistique (valeur + titre + description).
2. **`StatsSection.tsx`** : lit les données depuis le fichier Markdown (`content/stats/stats.md`) et affiche plusieurs `StatItem` dans une grille.

---

### 1. Modifier un **StatItem** (style d’une case)

Le composant `StatItem` ressemble à ceci (simplifié) :

```tsx
export function StatItem({ value, title, description }: Stat) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-sky-500">{value}</div>
      <h4 className="mt-2 text-lg font-medium">{title}</h4>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
```

* **Changer la couleur du nombre** : remplacer `text-sky-500` par une autre couleur Tailwind (`text-red-600`, `text-emerald-500`, etc.).
* **Changer la taille du nombre** : modifier `text-4xl` (`text-2xl`, `text-5xl`, …).
* **Changer le style du titre** : modifier `text-lg font-medium` (par exemple `text-xl font-bold`).
* **Centrage** : la classe `text-center` centre le contenu → enlever si on veut aligner à gauche.

 Exemple : un nombre plus grand et en rouge :

```tsx
<div className="text-5xl font-extrabold text-red-600">{value}</div>
```

---

### 2. Modifier la **StatsSection** (organisation des cases)

Le composant `StatsSection` lit les données et affiche plusieurs `StatItem` :

```tsx
export default async function StatsSection() {
  const items = await getStats();

  return (
    <section className="py-12 max-w-3xl mx-auto">
      <div className="grid gap-8 sm:grid-cols-2">
        {items.slice(0, 4).map((s, i) => (
          <StatItem
            key={i}
            value={s.value}
            title={s.title}
            description={s.description}
          />
        ))}
      </div>
    </section>
  );
}
```

* **Nombre de cases affichées** :

  * `.slice(0, 4)` → prend les 4 premiers items du fichier Markdown.
  * Supprimer `slice` → afficher toutes les stats.
  * Modifier en `.slice(0, 6)` → afficher 6 items.

* **Largeur du container** :

  * `max-w-3xl` → limite la largeur à 768px.





