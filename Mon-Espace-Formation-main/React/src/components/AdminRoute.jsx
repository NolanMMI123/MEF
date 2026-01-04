import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Composant pour protéger les routes d'administration
 * Redirige vers /connexion si l'utilisateur n'est pas connecté
 * Redirige vers / (accueil) si l'utilisateur n'est pas admin
 */
const AdminRoute = ({ children }) => {
  // Récupérer les informations de l'utilisateur depuis localStorage
  const userStr = localStorage.getItem('user');
  const userRole = localStorage.getItem('userRole');

  // Si pas d'utilisateur connecté, rediriger vers la page de connexion
  if (!userStr) {
    return <Navigate to="/connexion" replace />;
  }

  // Si l'utilisateur n'est pas admin, rediriger vers l'accueil (et non vers la connexion)
  if (userRole !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  // Si tout est OK, afficher le composant enfant
  return children;
};

export default AdminRoute;

