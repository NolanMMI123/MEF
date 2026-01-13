import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Toast from '../components/Toast';
import { FaEye, FaFileAlt, FaPlus } from 'react-icons/fa';
import { X, Calendar, Edit, Trash2 } from 'lucide-react';
import './ManageSessions.css';

/**
 * Page de gestion des sessions
 * Affiche la liste des sessions de formation
 */
const ManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    dates: '',
    lieu: '',
    placesTotales: 15,
    placesReservees: 0
  });
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchSessions();
    fetchTrainings();
    fetchTrainers();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des sessions');
      }
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/trainings');
      if (response.ok) {
        const data = await response.json();
        setTrainings(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des formations:', err);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users?role=TRAINER');
      if (response.ok) {
        const data = await response.json();
        setTrainers(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des formateurs:', err);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString;
  };

  // Calculer le taux de remplissage
  const getFillRate = (session) => {
    if (!session.placesTotales) return 0;
    const reserved = session.placesReservees || 0;
    return Math.round((reserved / session.placesTotales) * 100);
  };

  // Obtenir le statut de la session
  const getSessionStatus = (session) => {
    const fillRate = getFillRate(session);
    if (fillRate >= 100) return { label: 'Complet', class: 'full' };
    if (fillRate >= 75) return { label: 'Confirmé', class: 'confirmed' };
    if (fillRate >= 50) return { label: 'En cours', class: 'in-progress' };
    if (fillRate > 0) return { label: 'Peu d\'inscrits', class: 'low' };
    return { label: 'Vide', class: 'empty' };
  };

  // Gérer l'ouverture du modal (création)
  const handleOpenModal = () => {
    setEditingSessionId(null);
    setFormData({
      title: '',
      dates: '',
      lieu: '',
      placesTotales: 15,
      placesReservees: 0
    });
    setShowModal(true);
  };

  // Gérer l'ouverture du modal (modification)
  const handleEditSession = (session) => {
    setEditingSessionId(session.id);
    setFormData({
      title: session.title || '',
      dates: session.dates || '',
      lieu: session.lieu || session.location || '',
      placesTotales: session.placesTotales || 15,
      placesReservees: session.placesReservees || 0
    });
    setShowModal(true);
  };

  // Gérer la fermeture du modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSessionId(null);
    setFormData({
      title: '',
      dates: '',
      lieu: '',
      placesTotales: 15,
      placesReservees: 0
    });
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'placesTotales' || name === 'placesReservees' ? parseInt(value) || 0 : value
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.dates || !formData.lieu) {
      setToast({ message: 'Veuillez remplir tous les champs obligatoires', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const url = editingSessionId 
        ? `http://localhost:8080/api/sessions/${editingSessionId}`
        : 'http://localhost:8080/api/sessions';
      const method = editingSessionId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors de la sauvegarde de la session');
      }

      setToast({ 
        message: editingSessionId 
          ? 'Session modifiée avec succès !' 
          : 'Session créée avec succès !', 
        type: 'success' 
      });
      handleCloseModal();
      await fetchSessions(); // Rafraîchir la liste
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ message: err.message || 'Erreur lors de la sauvegarde de la session', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Supprimer une session
  const handleDeleteSession = async (id) => {
    if (!deleteConfirm || deleteConfirm !== id) {
      setDeleteConfirm(id);
      setToast({ 
        message: 'Cliquez à nouveau sur Supprimer pour confirmer', 
        type: 'info' 
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/sessions/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors de la suppression');
      }

      setToast({ message: 'Session supprimée avec succès !', type: 'success' });
      setDeleteConfirm(null);
      await fetchSessions(); // Rafraîchir la liste
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ message: err.message || 'Erreur lors de la suppression de la session', type: 'error' });
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Chargement des sessions...</p>
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
      <div className="manage-sessions">
        <div className="manage-header">
          <div>
            <h2 className="admin-page-title">Gestion des sessions</h2>
            <p className="admin-page-subtitle">Planification et suivi des sessions de formation</p>
          </div>
          <button className="admin-btn-primary" onClick={handleOpenModal}>
            <FaPlus />
            Créer une session
          </button>
        </div>

        {/* Liste des sessions */}
        {sessions.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">📅</div>
            <p>Aucune session disponible</p>
          </div>
        ) : (
          <div className="sessions-grid">
            {sessions.map((session) => {
              const status = getSessionStatus(session);
              const fillRate = getFillRate(session);
              return (
                <div key={session.id} className="session-card">
                  <div className="session-card-header">
                    <div className="session-id">{session.id}</div>
                    <span className={`session-status status-${status.class}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="session-title">{session.title || 'Session sans titre'}</div>
                  <div className="session-dates">{formatDate(session.dates)}</div>
                  <div className="session-location">
                    📍 {session.lieu || session.location || 'Lieu non spécifié'}
                  </div>
                  {session.trainerName && (
                    <div className="session-trainer">
                      👤 {session.trainerName}
                    </div>
                  )}
                  <div className="session-fill">
                    <div className="session-fill-label">
                      Taux de remplissage: {session.placesReservees || 0}/{session.placesTotales || 0}
                    </div>
                    <div className="session-fill-bar">
                      <div
                        className="session-fill-progress"
                        style={{ width: `${fillRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="session-actions">
                    <button 
                      className="session-action-btn edit"
                      onClick={() => handleEditSession(session)}
                      title="Modifier"
                    >
                      <Edit size={16} />
                      Modifier
                    </button>
                    {deleteConfirm === session.id ? (
                      <button 
                        className="session-action-btn delete confirm"
                        onClick={() => handleDeleteSession(session.id)}
                        title="Confirmer la suppression"
                      >
                        <Trash2 size={16} />
                        Confirmer
                      </button>
                    ) : (
                      <button 
                        className="session-action-btn delete"
                        onClick={() => handleDeleteSession(session.id)}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de création de session */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Créer une nouvelle session</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Formation *</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Sélectionner une formation</option>
                  {trainings.map(training => (
                    <option key={training.id} value={training.title}>
                      {training.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Dates (ex: 15-19 Janvier 2025) *</label>
                <input
                  type="text"
                  name="dates"
                  value={formData.dates}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="15-19 Janvier 2025"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lieu *</label>
                <input
                  type="text"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Paris / Distanciel"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nombre de places *</label>
                <input
                  type="number"
                  name="placesTotales"
                  value={formData.placesTotales}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting 
                    ? (editingSessionId ? 'Modification...' : 'Création...') 
                    : (editingSessionId ? 'Modifier la session' : 'Créer la session')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
};

export default ManageSessions;

