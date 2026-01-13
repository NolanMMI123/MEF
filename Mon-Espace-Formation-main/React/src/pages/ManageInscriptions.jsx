import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import './ManageInscriptions.css';

/**
 * Page de gestion des inscriptions
 * Affiche la liste complète des inscriptions avec filtres et actions
 */
const ManageInscriptions = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [filteredInscriptions, setFilteredInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [trainingFilter, setTrainingFilter] = useState('ALL');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const fetchInscriptions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/inscriptions');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des inscriptions');
      }
      const data = await response.json();
      setInscriptions(data);
      setFilteredInscriptions(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les inscriptions
  useEffect(() => {
    let filtered = [...inscriptions];

    // Filtre par recherche (nom, email, formation)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(insc =>
        insc.userName?.toLowerCase().includes(term) ||
        insc.userEmail?.toLowerCase().includes(term) ||
        insc.trainingTitle?.toLowerCase().includes(term) ||
        insc.id?.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(insc => insc.status === statusFilter);
    }

    // Filtre par formation
    if (trainingFilter !== 'ALL') {
      filtered = filtered.filter(insc => insc.trainingTitle === trainingFilter);
    }

    setFilteredInscriptions(filtered);
  }, [inscriptions, searchTerm, statusFilter, trainingFilter]);

  // Récupérer les formations uniques pour le filtre
  const uniqueTrainings = Array.from(new Set(inscriptions.map(insc => insc.trainingTitle).filter(Boolean))).sort();

  // Récupérer les statuts uniques pour le filtre
  const uniqueStatuses = Array.from(new Set(inscriptions.map(insc => insc.status).filter(Boolean))).sort();

  // Générer les initiales pour l'avatar
  const getInitials = (name) => {
    if (!name || name === 'N/A') return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Valider une inscription (mettre le statut à "CONFIRMED" ou "VALIDÉ")
  const handleValidate = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/inscriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'CONFIRMED' })
      });

      if (response.ok) {
        // Recharger les inscriptions
        await fetchInscriptions();
        setActionMenuOpen(null);
      } else {
        throw new Error('Erreur lors de la validation');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    }
  };

  // Supprimer une inscription
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/inscriptions/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Recharger les inscriptions
        await fetchInscriptions();
        setActionMenuOpen(null);
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    }
  };

  // Fermer le menu d'action si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuOpen && !event.target.closest('.action-menu-container')) {
        setActionMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [actionMenuOpen]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Chargement des inscriptions...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-error">
          <p>Erreur: {error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="manage-inscriptions-page">
        {/* En-tête avec titre et recherche */}
        <div className="manage-inscriptions-header">
          <div className="manage-title-section">
            <h2 className="manage-page-title">
              Gestion des inscriptions
              <span className="manage-count-badge">{inscriptions.length}</span>
            </h2>
            <p className="manage-page-subtitle">Liste complète des inscriptions</p>
          </div>
          
          <div className="manage-toolbar">
            <div className="manage-search-box">
              <Search size={18} className="manage-search-icon" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="manage-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="manage-filter-btn">
              <Filter size={18} />
              Filtres
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="manage-filters-bar">
          <select
            className="manage-filter-select"
            value={trainingFilter}
            onChange={(e) => setTrainingFilter(e.target.value)}
          >
            <option value="ALL">Toutes les formations</option>
            {uniqueTrainings.map(training => (
              <option key={training} value={training}>{training}</option>
            ))}
          </select>
          <select
            className="manage-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tous les statuts</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Tableau des inscriptions */}
        {filteredInscriptions.length === 0 ? (
          <div className="manage-empty-state">
            <div className="manage-empty-icon">👥</div>
            <p className="manage-empty-title">Aucune inscription trouvée</p>
            <p className="manage-empty-hint">
              Liste détaillée des inscriptions avec filtres avancés
            </p>
            <p className="manage-empty-hint-small">
              Recherche par nom, email, formation, statut, dates ...
            </p>
          </div>
        ) : (
          <div className="manage-table-wrapper">
            <table className="manage-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Formation</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th className="manage-table-actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInscriptions.map((insc) => (
                  <tr key={insc.id}>
                    <td>
                      <div className="manage-user-cell">
                        <div className="manage-user-avatar">
                          {getInitials(insc.userName)}
                        </div>
                        <div className="manage-user-info">
                          <div className="manage-user-name">{insc.userName || 'N/A'}</div>
                          <div className="manage-user-email">{insc.userEmail || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="manage-training-cell">
                        {insc.trainingTitle || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="manage-date-cell">
                        {formatDate(insc.registrationDate)}
                      </div>
                    </td>
                    <td>
                      <span className={`manage-status-badge status-${(insc.status || '').toLowerCase().replace(/\s/g, '-')}`}>
                        {insc.status || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="action-menu-container">
                        <button
                          className="manage-action-btn"
                          onClick={() => setActionMenuOpen(actionMenuOpen === insc.id ? null : insc.id)}
                        >
                          <MoreVertical size={18} />
                        </button>
                        {actionMenuOpen === insc.id && (
                          <div className="manage-action-menu">
                            <button
                              className="manage-action-menu-item"
                              onClick={() => handleValidate(insc.id)}
                            >
                              <CheckCircle size={16} />
                              <span>Valider</span>
                            </button>
                            <button
                              className="manage-action-menu-item danger"
                              onClick={() => handleDelete(insc.id)}
                            >
                              <Trash2 size={16} />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageInscriptions;
