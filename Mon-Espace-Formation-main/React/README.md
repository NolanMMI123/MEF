# Mon Espace Formation — Front-end (React)

## Description

**Mon Espace Formation** est une application web moderne de type SPA (Single Page Application) développée avec **React** et **Vite**. Elle propose une plateforme complète de gestion de formations en ligne, intégrant :

- Une interface utilisateur intuitive pour la consultation et l'inscription aux formations
- Une interface d'administration complète pour la gestion des formations, sessions, formateurs et attestations
- Une salle 3D interactive immersive utilisant Three.js pour une expérience utilisateur innovante

## Pile Technique

### Framework & Build Tools
- **React** 18+ (v19.2.0)
- **Vite** 7.3.0 (Build tool et serveur de développement)

### Bibliothèques 3D
- **Three.js** 0.182.0 (Moteur 3D)
- **@react-three/fiber** 9.5.0 (Wrapper React pour Three.js)
- **@react-three/drei** 10.7.7 (Utilitaires et helpers pour React Three Fiber)
- **@react-three/rapier** 2.2.0 (Physique 3D)

### UI & Styling
- **Bootstrap** 5.3.8 & **react-bootstrap** 2.10.10 (Framework CSS et composants)
- **CSS3** (Modules et variables CSS personnalisées)
- **framer-motion** 12.23.25 (Animations)

### Icônes
- **Lucide React** 0.562.0
- **react-icons** 5.5.0 (FontAwesome, etc.)

### Routing & Navigation
- **react-router-dom** 7.10.1 (Gestion des routes)

### Utilitaires
- **jspdf** 4.0.0 (Génération de PDF pour les attestations)
- **@emailjs/browser** 4.4.1 (Envoi d'emails)

### Client HTTP
- **fetch API** (natif) pour la communication avec l'API REST backend

## Prérequis

- **Node.js** (version 16 ou supérieure recommandée)
- **npm** ou **yarn** (gestionnaire de paquets)

## Installation

1. **Cloner le dépôt** (si ce n'est pas déjà fait)
   ```bash
   git clone <url-du-repo>
   cd Mon-Espace-Formation-main/React
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

## Lancement

### Mode Développement

```bash
npm run dev
```

L'application sera accessible à l'adresse : **http://localhost:5173**

### Build de Production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Prévisualisation du Build

```bash
npm run preview
```

## Configuration de l'API

L'application front-end communique avec une **API REST Spring Boot** hébergée sur le backend.

### URL de Base de l'API

Par défaut, l'application est configurée pour communiquer avec :
```
http://localhost:8080/api
```

### Endpoints Principaux

- **Formations** : `GET /api/trainings`
- **Sessions** : `GET /api/sessions`
- **Inscriptions** : `POST /api/inscriptions`
- **Authentification** : `POST /api/auth/login`
- **Notifications** : `GET /api/notifications`
- **Attestations** : Génération via `jsPDF` côté client

### Configuration Personnalisée

Si votre backend est hébergé sur un autre port ou domaine, modifiez les URLs dans les composants qui effectuent des appels API (ex: `AdminLayout.jsx`, `Dashboard.jsx`, etc.).

## Structure du Projet

```
React/
├── public/                 # Assets statiques (images, modèles 3D)
│   ├── adminlogo.png
│   ├── vignette_MEF.png
│   └── salle.glb          # Modèle 3D de la salle
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Header.jsx     # Navigation principale
│   │   ├── Footer.jsx     # Pied de page
│   │   ├── AdminLayout.jsx # Layout pour l'interface admin
│   │   ├── Salle.jsx      # Composant 3D de la salle
│   │   └── ...
│   ├── pages/             # Pages de l'application
│   │   ├── Home.jsx       # Page d'accueil
│   │   ├── Catalogue.jsx  # Catalogue des formations
│   │   ├── Dashboard.jsx  # Tableau de bord utilisateur
│   │   ├── AdminDashboard.jsx # Tableau de bord admin
│   │   ├── ManageTrainings.jsx # Gestion des formations
│   │   ├── ManageSessions.jsx  # Gestion des sessions
│   │   └── ...
│   ├── utils/             # Utilitaires et helpers
│   │   ├── theme.js       # Variables de thème
│   │   └── data.jsx       # Données statiques
│   ├── App.jsx            # Configuration des routes
│   ├── main.jsx           # Point d'entrée
│   └── index.css          # Styles globaux
├── package.json
└── vite.config.js         # Configuration Vite
```

## Fonctionnalités Clés

### Interface Utilisateur

- **Catalogue de formations dynamique** : Affichage des formations disponibles avec filtres et recherche
- **Détails de formation** : Page détaillée avec description, prix, durée, sessions disponibles
- **Inscription en temps réel** : Système d'inscription aux sessions de formation avec validation
- **Tableau de bord utilisateur** : Suivi des inscriptions, formations suivies, attestations
- **Salle 3D immersive** : Expérience interactive en 3D pour la présentation de la plateforme

### Interface Administration

- **Tableau de bord admin** : Vue d'ensemble avec statistiques et indicateurs clés
- **Gestion des formations** : CRUD complet (Créer, Lire, Modifier, Supprimer)
- **Gestion des sessions** : Création et modification des sessions de formation
- **Gestion des formateurs** : Ajout et gestion des profils formateurs
- **Gestion des inscriptions** : Validation, modification et suivi des inscriptions
- **Gestion des attestations** : Génération et téléchargement de PDF
- **Système de notifications** : Alertes en temps réel pour les nouveaux événements
- **Paramètres de la plateforme** : Configuration générale de l'application

### Authentification & Sécurité

- **Connexion/Déconnexion** : Système d'authentification avec gestion des rôles
- **Protection des routes** : Routes admin protégées (`AdminRoute.jsx`)
- **Gestion des rôles** : Distinction entre utilisateurs standards (`ROLE_USER`) et administrateurs (`ROLE_ADMIN`)

## Scripts Disponibles

- `npm run dev` : Lance le serveur de développement Vite
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise le build de production
- `npm run lint` : Exécute ESLint pour vérifier le code

## Technologies & Concepts Utilisés

- **Hooks React** : `useState`, `useEffect`, `useRef`, `useNavigate`, `useLocation`
- **React Router** : Navigation et routage côté client
- **Context API** : Gestion de l'état global (si applicable)
- **LocalStorage** : Persistance de l'authentification et des préférences
- **Responsive Design** : Interface adaptative pour mobile, tablette et desktop
- **Polling** : Mise à jour périodique des notifications (toutes les 60 secondes)

## Notes de Développement

- Le projet utilise **Vite** comme build tool pour des performances optimales
- Les styles sont organisés en fichiers CSS séparés par composant
- Les appels API utilisent l'API `fetch` native de JavaScript
- La scène 3D est rendue avec React Three Fiber pour une intégration React native

## Support & Contribution

Pour toute question ou contribution, veuillez consulter la documentation du projet ou contacter l'équipe de développement.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2024
