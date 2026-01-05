import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBell, FaCog, FaSignOutAlt, FaChartBar, FaUsers, 
  FaCalendarAlt, FaChalkboardTeacher, FaCertificate, FaHome
} from 'react-icons/fa';
import { X } from 'lucide-react';
import './AdminLayout.css';

/**
 * Layout d'administration réutilisable
 * Affiche le header, la navigation et le contenu des pages admin
 */
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  // Récupérer les notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        // Compter les non lues
        const unread = data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des notifications:', err);
    }
  };

  // Polling toutes les 60 secondes
  useEffect(() => {
    fetchNotifications(); // Charger immédiatement
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000); // 60 secondes

    return () => clearInterval(interval);
  }, []);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notifications/mark-all-read', {
        method: 'PUT'
      });
      if (response.ok) {
        await fetchNotifications(); // Rafraîchir la liste
      }
    } catch (err) {
      console.error('Erreur lors du marquage des notifications:', err);
    }
  };

  // Calculer le temps écoulé
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'À l\'instant';
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      if (diffDays < 7) return `Il y a ${diffDays}j`;
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    } catch (e) {
      return 'N/A';
    }
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/connexion');
  };

  // Gestion du retour au site public
  const handleBackToSite = () => {
    navigate('/');
  };

  const tabs = [
    { path: '/admin', label: 'Vue d\'ensemble', icon: FaChartBar },
    { path: '/admin/inscriptions', label: 'Inscriptions', icon: FaUsers },
    { path: '/admin/sessions', label: 'Sessions', icon: FaCalendarAlt },
    { path: '/admin/formateurs', label: 'Formateurs', icon: FaChalkboardTeacher },
    { path: '/admin/attestations', label: 'Attestations', icon: FaCertificate },
  ];

  return (
    <div className="admin-wrapper">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <div className="admin-logo">
              <div className="admin-logo-icon"> <img src="/adminlogo.png" alt="Logo" className="admin-logo-icon" /> </div>
              <div>
                <h1 className="admin-title">TXLFORMA - Gestion Administration</h1>
                <p className="admin-subtitle">Tableau de bord de Gestion</p>
              </div>
            </div>
          </div>
          <div className="admin-header-right">
            <button 
              className="admin-header-btn-text" 
              onClick={handleBackToSite}
              title="Voir le site"
            >
              <FaHome />
              <span>Voir le site</span>
            </button>
            <div className="admin-notifications-wrapper" ref={notificationsRef}>
              <button 
                className="admin-header-icon" 
                title="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="admin-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </button>
              
              {/* Dropdown des notifications */}
              {showNotifications && (
                <div className="admin-notifications-dropdown">
                  <div className="admin-notifications-header">
                    <h3 className="admin-notifications-title">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        className="admin-mark-all-read-btn"
                        onClick={handleMarkAllAsRead}
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="admin-notifications-empty">
                      <p>Aucune notification</p>
                    </div>
                  ) : (
                    <div className="admin-notifications-list">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`admin-notification-item ${!notification.isRead ? 'unread' : ''}`}
                        >
                          <div className="admin-notification-content">
                            <div className="admin-notification-message">{notification.message}</div>
                            <div className="admin-notification-time">{getTimeAgo(notification.createdAt)}</div>
                          </div>
                          {!notification.isRead && (
                            <div className="admin-notification-dot"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link 
              to="/admin/settings" 
              className="admin-header-icon" 
              title="Paramètres"
            >
              <FaCog />
            </Link>
            <div className="admin-user">
              <span className="admin-user-icon">👤</span>
              <div>
                <div className="admin-user-name">Admin</div>
                <div className="admin-user-role">Administrateur</div>
              </div>
            </div>
            <button className="admin-header-icon" onClick={handleLogout} title="Déconnexion">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        <div className="admin-nav-content">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`admin-nav-tab ${isActive ? 'active' : ''}`}
              >
                <Icon className="admin-nav-icon" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

