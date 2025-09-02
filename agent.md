# Agent Documentation - SkillQuest Frontend

## 🎯 General Purpose

**SkillQuest** est une application web de gamification de l'apprentissage qui permet aux utilisateurs de créer et suivre leurs parcours d'apprentissage sous forme d'arbres de compétences interactifs et de quêtes connectées.

### Objectifs principaux :
- **Gamification de l'apprentissage** : Transformer l'apprentissage en expérience ludique avec XP, niveaux et progression
- **Visualisation interactive** : Représenter les compétences et quêtes sous forme de graphes visuels navigables
- **Génération IA** : Créer automatiquement des quêtes d'apprentissage personnalisées via OpenAI/Gemini
- **Suivi de progression** : Tracker les statistiques, sessions de travail et évolution des compétences

## 🛠 Technologies Stack

### Core Framework
- **React 19.1.0** avec **TypeScript** (strict mode)
- **Vite 6.3.5** comme build tool et dev server
- **React Router DOM 7.6.2** pour le routing

### UI & Styling
- **TailwindCSS 4.1.10** pour le styling (avec plugin Vite)
- **Radix UI** pour les composants primitifs (dialog, select, checkbox, etc.)
- **Lucide React** pour les icônes
- **GSAP 3.13.0** pour les animations avancées
- **Class Variance Authority** + **clsx** pour la gestion conditionnelle des classes

### State Management & Data
- **Zustand 5.0.6** pour le state management global
- **TanStack React Query 5.81.5** pour la gestion des données serveur
- **React Hook Form 7.61.1** + **Zod 3.25.76** pour les formulaires et validation

### Visualisation & Canvas
- **@xyflow/react 12.7.0** pour les graphes interactifs (skill trees, quest canvas)
- **ECharts 5.6.0** + **echarts-for-react** pour les statistiques et graphiques

### IA & Services
- **OpenAI 5.12.1** pour la génération de quêtes
- **@google/genai 1.10.0** pour l'intégration Gemini
- **Clerk** pour l'authentification et gestion utilisateur

### Calendar & Sessions
- **FullCalendar 6.1.18** pour la gestion des sessions de travail

### Development Tools
- **ESLint** avec TypeScript, React Hooks rules
- **Prettier** pour le formatage de code
- **Husky** pour les git hooks
- **Commitlint** pour les conventions de commit

## 📁 Folder Structure

```
src/
├── component/           # Composants réutilisables globaux
│   ├── avatar-hud/     # HUD utilisateur avec XP et progression
│   ├── header/         # En-têtes dashboard
│   ├── sidebar/        # Navigation latérale
│   └── notification/   # Système de notifications toast
│
├── modules/            # Modules fonctionnels principaux
│   ├── canvas/         # Éditeur visuel de quêtes et compétences
│   │   ├── components/ # Composants canvas (nodes, modals, toolbox)
│   │   ├── hooks/      # Logique métier canvas
│   │   └── generate-quests-from-ai.ts
│   │
│   ├── skill-tree/     # Visualisation arbre de compétences circulaire
│   │   ├── circular-skill-tree-logic/ # Algorithmes de positionnement
│   │   └── component/  # Composants de rendu SVG
│   │
│   ├── skills/         # Gestion et affichage des compétences
│   ├── sessions/       # Planning et sessions de travail
│   └── stats/          # Statistiques et graphiques de progression
│
├── pages/              # Pages de l'application
│   ├── dashboard/      # Pages dashboard utilisateur
│   └── canvas/         # Page éditeur canvas
│
├── shared/             # Code partagé entre modules
│   ├── components/ui/  # Composants UI réutilisables (shadcn/ui style)
│   ├── services/       # API calls et logique métier
│   ├── types/          # Types TypeScript globaux
│   ├── config/         # Configuration (auth, AI providers)
│   └── utils/          # Utilitaires et helpers
│
├── stores/             # Stores Zustand globaux
└── styles/             # CSS spécifiques aux modules
```

## 🎨 Code Style & Conventions

### TypeScript
- **Strict mode** activé avec configuration rigoureuse
- **Path mapping** : `@/*` → `./src/*` pour les imports absolus
- Types explicites pour tous les props et fonctions publiques
- Interfaces préférées aux types pour les objets complexes

### React Patterns
- **Functional components** exclusivement avec hooks
- **Custom hooks** pour la logique métier réutilisable
- **Compound components** pour les composants complexes (ex: Sidebar)
- **Render props** et **children as function** quand approprié

### Naming Conventions
- **PascalCase** : Composants, types, interfaces
- **camelCase** : Variables, fonctions, hooks
- **kebab-case** : Fichiers CSS, assets
- **SCREAMING_SNAKE_CASE** : Constantes globales

### File Organization
- **co-location** : Logique métier proche des composants qui l'utilisent
- **index.ts** pour les exports groupés
- **`.types.ts`** pour les types spécifiques à un module
- **`.const.ts`** pour les constantes

### ESLint Rules Spécifiques
```javascript
{
  "quotes": ["error", "double"],           // Guillemets doubles obligatoires
  "comma-dangle": ["error", "always-multiline"], // Trailing commas
  "no-console": "warn",                    // Console.log en warning
  "@typescript-eslint/no-explicit-any": "off", // any autorisé
  "react-hooks/exhaustive-deps": "error"   // Dépendances hooks strictes
}
```

## 🏗 Architecture Patterns

### State Management
- **Zustand stores** pour l'état global par domaine métier
- **React Query** pour le cache serveur et synchronisation
- **Local state** (useState) pour l'UI temporaire uniquement

### Component Architecture
- **Smart/Dumb components** : Séparation logique métier / présentation
- **Hooks personnalisés** pour la logique réutilisable
- **Higher-Order Components** évités au profit des hooks

### Data Flow
```
API → React Query → Zustand Store → Components
                 ↘ Local Cache    ↗ UI Updates
```

### Module Communication
- **Services layer** pour les appels API
- **Shared types** pour la communication inter-modules
- **Event-driven** via hooks pour les interactions complexes

## 🔧 Key Features & Modules

### 1. Canvas Editor (`modules/canvas/`)
- **Éditeur visuel** de quêtes avec drag & drop
- **Connexions** entre quêtes pour créer des prérequis
- **Génération IA** de quêtes contextualisées
- **Auto-save** avec debounce
- **Modes d'interaction** : sélection, connexion, création

### 2. Skill Tree (`modules/skill-tree/`)
- **Visualisation circulaire** des compétences et quêtes
- **Algorithme de positionnement** automatique par niveaux
- **Système de prérequis** avec verrouillage visuel
- **Animations** fluides entre les états

### 3. AI Quest Generation
- **Multi-provider** : OpenAI GPT + Google Gemini
- **Contexte personnalisé** : niveau, objectifs, style d'apprentissage
- **Validation** automatique des quêtes générées
- **Intégration** seamless dans le canvas

### 4. Session Management (`modules/sessions/`)
- **Calendrier** interactif pour planifier l'apprentissage
- **Tracking** du temps passé par compétence/quête
- **Statistiques** de progression et performance

### 5. Authentication & User Management
- **Clerk integration** pour auth complète
- **Profile management** avec avatar et progression
- **User sync** automatique entre frontend/backend

## 🎯 Development Guidelines

### Performance
- **Lazy loading** des modules non critiques
- **Memoization** des calculs coûteux (skill tree positioning)
- **Virtualization** pour les listes longues
- **Debounced saves** pour éviter les appels API excessifs

### Accessibility
- **Semantic HTML** avec rôles ARIA appropriés
- **Keyboard navigation** pour tous les composants interactifs
- **Screen reader** support via aria-labels
- **Color contrast** respectant WCAG 2.1

### Error Handling
- **Error boundaries** React pour les erreurs UI
- **Toast notifications** pour les erreurs utilisateur
- **Fallback components** pour les états de chargement/erreur
- **Validation** côté client avec Zod schemas

### Testing Strategy
- **Unit tests** pour la logique métier (hooks, utils)
- **Integration tests** pour les flows utilisateur critiques
- **E2E tests** pour les parcours complets
- **Visual regression** pour les composants UI

## 🚀 Getting Started

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Linting & formatting
npm run lint
npm run prettier:fix

# Pre-commit checks
npm run pre-commit
```

## 📝 Notes pour l'Agent IA

### Points d'attention
- **Canvas state** complexe avec nodes/edges - utiliser les hooks dédiés
- **AI context** building nécessite une compréhension fine du domaine d'apprentissage
- **Skill tree algorithms** sont mathématiquement complexes - ne pas modifier sans tests
- **Authentication** gérée par Clerk - suivre leurs patterns

### Patterns à respecter
- Toujours utiliser les **custom hooks** existants avant d'en créer de nouveaux
- **Types first** : définir les types avant l'implémentation
- **Error handling** systématique avec fallbacks UI
- **Performance** : mémoriser les calculs coûteux et les renders

### Extensions recommandées
- Privilégier l'extension des **stores Zustand** existants
- Utiliser les **services layers** pour les nouvelles intégrations API  
- Suivre les **patterns de validation** Zod établis
- Respecter la **structure modulaire** pour la maintenabilité
