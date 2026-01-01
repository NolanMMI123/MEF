import React from 'react';
import {
    FaNetworkWired, FaServer, FaCode, FaDatabase, FaFileAlt,
    FaShieldAlt, FaTasks, FaChalkboardTeacher, FaClock,
    FaCertificate, FaMapMarkerAlt, FaUserCheck, FaHeadset
} from 'react-icons/fa';
import { theme } from './theme';

// 1. DONNÉES POUR L'ACCUEIL (LES CARTES CATÉGORIES)
export const formationsData = [
    { id: 1, title: "Réseaux et Télécoms", desc: "VLAN, adressage, routage...", icon: <FaNetworkWired />, color: theme.colors.blue },
    { id: 2, title: "Administration Système", desc: "Windows Server, Linux...", icon: <FaServer />, color: theme.colors.success },
    { id: 3, title: "Développement Front-End", desc: "Angular, React, VueJS...", icon: <FaCode />, color: theme.colors.purple },
    { id: 4, title: "Développement Back-End", desc: "Symfony, Spring Boot...", icon: <FaDatabase />, color: theme.colors.red },
    { id: 5, title: "Bureautique", desc: "Pack Office, Access...", icon: <FaFileAlt />, color: theme.colors.teal },
    { id: 6, title: "Cybersécurité", desc: "IPS, IDS, sécurité BDD...", icon: <FaShieldAlt />, color: theme.colors.red },
    { id: 7, title: "Conduite de Projets", desc: "Jira, Trello, Agile...", icon: <FaTasks />, color: theme.colors.accent, highlight: true },
];

// 2. DONNÉES POUR L'ACCUEIL (POURQUOI NOUS CHOISIR)
export const featuresData = [
    { title: "Formateurs Experts", desc: "Des professionnels qualifiés...", icon: <FaChalkboardTeacher /> },
    { title: "Flexibilité", desc: "Des sessions adaptées...", icon: <FaClock /> },
    { title: "Certification", desc: "Obtenez des certifications...", icon: <FaCertificate /> },
    { title: "Lieux Pratiques", desc: "Des centres de formation...", icon: <FaMapMarkerAlt /> },
    { title: "Suivi Personnalisé", desc: "Un accompagnement...", icon: <FaUserCheck /> },
    { title: "Support Continu", desc: "Une équipe disponible...", icon: <FaHeadset /> },
];

// 3. DONNÉES POUR LE CATALOGUE (DÉTAILLÉES)
export const catalogueData = [
    {
        id: 1,
        category: "Développement Front-End",
        title: "Développement Front-End avec React et TypeScript",
        desc: "Maîtrisez les fondamentaux et les concepts avancés du développement web moderne avec React.",
        time: "5 jours (35h)",
        level: "Intermédiaire",
        price: "2490€",
        sessions: 3,
        color: theme.colors.accent,
        objectives: [
            "Comprendre l'écosystème React et ses concepts fondamentaux",
            "Maîtriser TypeScript pour un code robuste et maintenable",
            "Créer des composants réutilisables et performants",
            "Gérer l'état d'application avec les hooks React",
            "Implémenter le routage et la navigation",
            "Consommer des APIs REST et gérer les données asynchrones",
            "Appliquer les bonnes pratiques de développement"
        ],
        program: [
            {
                title: "Module 1 : Introduction à React et TypeScript",
                time: "7h",
                content: [
                    "Installation et configuration de l'environnement",
                    "JSX et TSX : syntaxe et bonnes pratiques",
                    "Composants fonctionnels et props typées",
                    "Structure d'un projet React/TypeScript"
                ]
            },
            {
                title: "Module 2 : Gestion de l'état et hooks",
                time: "7h",
                content: [
                    "useState et useEffect",
                    "useContext pour le state management global",
                    "useReducer pour les états complexes",
                    "Custom hooks et réutilisabilité"
                ]
            },
            {
                title: "Module 3 : Routage et navigation",
                time: "7h",
                content: [
                    "React Router : configuration et utilisation",
                    "Routes dynamiques et paramètres",
                    "Navigation programmatique",
                    "Protection des routes"
                ]
            },
            {
                title: "Module 4 : Requêtes API et données asynchrones",
                time: "7h",
                content: [
                    "Fetch API et Axios",
                    "Gestion des erreurs et loading states",
                    "Optimisation des requêtes",
                    "Introduction à React Query"
                ]
            },
            {
                title: "Module 5 : Bonnes pratiques et déploiement",
                time: "7h",
                content: [
                    "Tests unitaires avec Jest et React Testing Library",
                    "Optimisation des performances",
                    "Build et déploiement",
                    "Projet final et mise en pratique"
                ]
            }
        ],
        prerequisites: [
            "Bonnes connaissances en HTML, CSS et JavaScript",
            "Bases de la programmation orientée objet",
            "Expérience avec un éditeur de code (VS Code recommandé)"
        ]
    },
    {
        id: 2,
        category: "Développement Front-End",
        title: "Angular Avancé et Architecture Moderne",
        desc: "Développez des applications Angular robustes avec les meilleures pratiques et une architecture scalable.",
        time: "4 jours (28h)",
        level: "Avancé",
        price: "2190€",
        sessions: 2,
        color: theme.colors.accent
    },
    {
        id: 3,
        category: "Développement Front-End",
        title: "Vue.js 3 - Composition API et Ecosystème",
        desc: "Créez des applications Vue.js performantes avec la Composition API et découvrez l'écosystème.",
        time: "4 jours (28h)",
        level: "Intermédiaire",
        price: "2190€",
        sessions: 2,
        color: theme.colors.accent
    },
    {
        id: 4,
        category: "Développement Back-End",
        title: "Symfony 6 - Développement Web Professionnel",
        desc: "Maîtrisez le framework PHP le plus utilisé en entreprise pour créer des applications web robustes.",
        time: "5 jours (35h)",
        level: "Intermédiaire",
        price: "2490€",
        sessions: 3,
        color: theme.colors.accent
    },
    {
        id: 5,
        category: "Développement Back-End",
        title: "Spring Boot - Microservices et API REST",
        desc: "Développez des microservices Java avec Spring Boot et créez des API REST performantes.",
        time: "5 jours (35h)",
        level: "Avancé",
        price: "2690€",
        sessions: 2,
        color: theme.colors.accent
    },
    {
        id: 6,
        category: "Réseaux et Télécoms",
        title: "CCNA - Certification Cisco Réseau",
        desc: "Préparez-vous à la certification CCNA et maîtrisez les fondamentaux des réseaux Cisco.",
        time: "10 jours (70h)",
        level: "Débutant",
        price: "3990€",
        sessions: 2,
        color: theme.colors.accent
    },
    {
        id: 7,
        category: "Réseaux et Télécoms",
        title: "Configuration VLAN et Routage Avancé",
        desc: "Configurez des VLAN complexes et maîtrisez le routage inter-VLAN et les protocoles de routage.",
        time: "3 jours (21h)",
        level: "Intermédiaire",
        price: "1790€",
        sessions: 3,
        color: theme.colors.accent
    },
    {
        id: 8,
        category: "Administration Système",
        title: "Administration Windows Server 2022",
        desc: "Installez, configurez et administrez Windows Server 2022 en environnement professionnel.",
        time: "5 jours (35h)",
        level: "Intermédiaire",
        price: "2390€",
        sessions: 4,
        color: theme.colors.accent
    },
    {
        id: 9,
        category: "Administration Système",
        title: "Linux - Administration Système et Services",
        desc: "Administrez des serveurs Linux, gérez les utilisateurs, les services et la sécurité du système.",
        time: "5 jours (35h)",
        level: "Intermédiaire",
        price: "2390€",
        sessions: 3,
        color: theme.colors.accent
    },
    {
        id: 10,
        category: "Cybersécurité",
        title: "Cybersécurité - Fondamentaux et Bonnes Pratiques",
        desc: "Comprenez les menaces cyber actuelles et apprenez à sécuriser vos infrastructures.",
        time: "4 jours (28h)",
        level: "Débutant",
        price: "2590€",
        sessions: 3,
        color: theme.colors.accent
    },
    {
        id: 11,
        category: "Cybersécurité",
        title: "Ethical Hacking et Tests d'Intrusion",
        desc: "Apprenez les techniques de hacking éthique pour identifier et corriger les vulnérabilités.",
        time: "5 jours (35h)",
        level: "Avancé",
        price: "2990€",
        sessions: 2,
        color: theme.colors.accent
    },
    {
        id: 12,
        category: "Bureautique",
        title: "Excel Avancé - Tableaux Croisés et Macros",
        desc: "Maîtrisez les fonctionnalités avancées d'Excel pour optimiser votre productivité.",
        time: "2 jours (14h)",
        level: "Intermédiaire",
        price: "890€",
        sessions: 5,
        color: theme.colors.accent
    },
    {
        id: 13,
        category: "Conduite de Projets",
        title: "Gestion de Projet Agile avec Scrum",
        desc: "Pilotez vos projets avec la méthode Scrum et les outils collaboratifs (Jira, Trello).",
        time: "3 jours (21h)",
        level: "Débutant",
        price: "1690€",
        sessions: 4,
        color: theme.colors.accent
    },
];