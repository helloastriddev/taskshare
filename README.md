# TaskShare — Todo List Collaborative & PWA

Une app de listes de tâches **gratuite**, **sans compte**, **installable sur mobile/desktop** et **partageable** avec n'importe qui via un simple lien.

---

## Fonctionnalités

- Créer, modifier et supprimer des listes de tâches
- Partager une liste en **lecture seule** ou en **édition collaborative**
- Synchronisation en temps réel entre onglets (localStorage)
- Installable sur écran d'accueil (PWA — iPhone, Android, PC)
- Fonctionne **100% hors ligne**
- Dark mode
- Aucun compte, aucun backend, aucune donnée envoyée

---

## Stack technique

- React 19 + TypeScript
- Vite + vite-plugin-pwa
- Tailwind CSS v3
- localStorage (pas de base de données)
- Lucide React (icônes)

---

## Lancer le projet en local

### Prérequis

- Node.js 18+ installé — vérifier avec `node -v`
- npm installé — vérifier avec `npm -v`

### Étape 1 — Cloner le projet

```bash
git clone https://github.com/TON-PSEUDO/taskshare.git
cd taskshare
```

### Étape 2 — Installer les dépendances

```bash
npm install
```

### Étape 3 — Lancer en développement

```bash
npm run dev
```

L'app est accessible sur **http://localhost:5173**

---

## Build pour la production

```bash
npm run build
```

Les fichiers générés sont dans le dossier `dist/`. Le service worker PWA est automatiquement inclus.

### Prévisualiser le build

```bash
npm run preview
```

---

## Déployer sur Vercel

### Option 1 — Via l'interface (recommandé)

1. Aller sur [vercel.com](https://vercel.com) et se connecter avec GitHub
2. Cliquer **"Add New Project"**
3. Sélectionner le repo `taskshare`
4. Laisser les paramètres par défaut (Vercel détecte Vite automatiquement)
5. Cliquer **"Deploy"**

L'app est en ligne sur `taskshare.vercel.app` en moins de 2 minutes.

### Option 2 — Via la CLI

```bash
npm install -g vercel
vercel
```

---

## Intégrer Google AdSense

Les emplacements sont déjà prêts dans le code. Il suffit de remplacer les valeurs dans `src/components/AdSense.tsx` :

```tsx
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"   // ton Publisher ID
data-ad-slot="XXXXXXXXXX"                   // ton Ad Slot ID
```

---

## Structure du projet

```
src/
├── components/
│   ├── Header.tsx          # Header sticky + bouton installer PWA
│   ├── Sidebar.tsx         # Navigation + liste des listes
│   ├── ListEditor.tsx      # Éditeur de liste + ajout tâches
│   ├── TaskItem.tsx        # Tâche individuelle (checkbox, edit, delete)
│   ├── SharePanel.tsx      # Génération et gestion des liens de partage
│   ├── SharedListView.tsx  # Vue pour les liens partagés
│   └── AdSense.tsx         # Composant publicité
├── hooks/
│   └── useTodoLists.ts     # Toute la logique métier + localStorage
├── types/
│   └── todo.ts             # Types TypeScript
└── utils/
    ├── storage.ts          # Lecture/écriture localStorage
    └── shareLink.ts        # Génération des URLs de partage
```

---

## Partage de listes

Deux modes disponibles :

| Mode | Ce que voit le destinataire |
|---|---|
| Lecture seule | Voit la liste, peut la dupliquer, ne peut pas modifier |
| Édition collaborative | Peut ajouter, cocher et supprimer des tâches |

Le propriétaire peut **révoquer** un lien d'édition à tout moment en régénérant la clé.

---

## Licence

MIT — libre d'utilisation, modification et distribution.
