import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Toast from '../components/Toast';
import { Search, Filter, Edit, Trash2, Plus, X } from 'lucide-react';
import './ManageTrainings.css';

/**
 * Page de gestion des formations
 * Permet de créer, modifier et supprimer des formations
 */
const ManageTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    location: '',
    price: '',
    trainerName: '',
    trainerRole: '',
    trainerEmail: '',
    status: 'A Venir'
  });
  const [editingTrainingId, setEditingTrainingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/trainings');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des formations');
      }
      const data = await response.json();
      setTrainings(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gérer l'ouverture du modal
  const handleOpenModal = (training = null) => {
    if (training) {
      // Mode édition
      setEditingTrainingId(training.id);
      setFormData({
        title: training.title || '',
        duration: training.duration || '',
        location: training.location || '',
        price: training.price || '',
        trainerName: training.trainerName || '',
        trainerRole: training.trainerRole || '',
        trainerEmail: training.trainerEmail || '',
        status: training.status || 'A Venir'
      });
    } else {
      // Mode création
      setEditingTrainingId(null);
      setFormData({
        title: '',
        duration: '',
        location: '',
        price: '',
        trainerName: '',
        trainerRole: '',
        trainerEmail: '',
        status: 'A Venir'
      });
    }
    setShowModal(true);
  };

  // Gérer la fermeture du modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTrainingId(null);
    setFormData({
      title: '',
      duration: '',
      location: '',
      price: '',
      trainerName: '',
      trainerRole: '',
      trainerEmail: '',
      status: 'A Venir'
    });
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.duration || !formData.location || !formData.price) {
      setToast({ message: 'Veuillez remplir tous les champs obligatoires', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const url = editingTrainingId 
        ? `http://localhost:8080/api/trainings/${editingTrainingId}`
        : 'http://localhost:8080/api/trainings';
      const method = editingTrainingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors de la sauvegarde de la formation');
      }

      setToast({ 
        message: editingTrainingId 
          ? 'Formation modifiée avec succès !' 
          : 'Formation créée avec succès !', 
        type: 'success' 
      });
      handleCloseModal();
      await fetchTrainings(); // Rafraîchir la liste
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ message: err.message || 'Erreur lors de la sauvegarde de la formation', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Supprimer une formation
  const handleDelete = async (id) => {
    if (!deleteConfirm || deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/trainings/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors de la suppression');
      }

      setToast({ message: 'Formation supprimée avec succès !', type: 'success' });
      setDeleteConfirm(null);
      await fetchTrainings(); // Rafraîchir la liste
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ message: err.message || 'Erreur lors de la suppression de la formation', type: 'error' });
      setDeleteConfirm(null);
    }
  };

  // Formater le prix
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Chargement des formations...</p>
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
      <div className="manage-trainings-page">
        {/* En-tête */}
        <div className="manage-trainings-header">
          <div className="manage-title-section">
            <h2 className="manage-page-title">
              Gestion des formations
              <span className="manage-count-badge">{trainings.length}</span>
            </h2>
            <p className="manage-page-subtitle">Liste complète des formations</p>
          </div>
          <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Nouvelle formation
          </button>
        </div>

        {/* Liste des formations */}
        {trainings.length === 0 ? (
          <div className="manage-empty-state">
            <div className="manage-empty-icon">📚</div>
            <p className="manage-empty-title">Aucune formation trouvée</p>
            <p className="manage-empty-hint">Cliquez sur "Nouvelle formation" pour en créer une</p>
          </div>
        ) : (
          <div className="manage-trainings-grid">
            {trainings.map((training) => (
              <div key={training.id} className="training-card">
                <div className="training-card-header">
                  <div className="training-reference">{training.reference || training.id}</div>
                  <span className={`training-status status-${(training.status || '').toLowerCase().replace(/\s/g, '-')}`}>
                    {training.status || 'A Venir'}
                  </span>
                </div>
                <div className="training-title">{training.title || 'Sans titre'}</div>
                <div className="training-details">
                  <div className="training-detail-item">
                    <span className="training-detail-label">Durée:</span>
                    <span className="training-detail-value">{training.duration || 'N/A'}</span>
                  </div>
                  <div className="training-detail-item">
                    <span className="training-detail-label">Lieu:</span>
                    <span className="training-detail-value">{training.location || 'N/A'}</span>
                  </div>
                  <div className="training-detail-item">
                    <span className="training-detail-label">Prix:</span>
                    <span className="training-detail-value price">{formatPrice(training.price)}</span>
                  </div>
                    <div className="training-detail-item">
                      <span className="training-detail-label">Formateur:</span>
                    <span className="training-detail-value">{training.trainerName || 'Non assigné'}</span>
                    </div>
                </div>
                <div className="training-actions">
                  <button 
                    className="training-action-btn edit"
                    onClick={() => handleOpenModal(training)}
                    title="Modifier"
                  >
                    <Edit size={16} />
                    Modifier
                  </button>
                  {deleteConfirm === training.id ? (
                    <button 
                      className="training-action-btn delete confirm"
                      onClick={() => handleDelete(training.id)}
                      title="Confirmer la suppression"
                    >
                      <Trash2 size={16} />
                      Confirmer
                    </button>
                  ) : (
                    <button 
                      className="training-action-btn delete"
                      onClick={() => handleDelete(training.id)}
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de création/modification */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingTrainingId ? 'Modifier la formation' : 'Nouvelle formation'}
              </h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Titre de la formation *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ex: Développement Front-End avec React et TypeScript"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Durée *</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ex: 5 Jours ou 30 heures"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lieu *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ex: Paris / Distanciel"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prix (€) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ex: 2490"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nom du formateur</label>
                <input
                  type="text"
                  name="trainerName"
                  value={formData.trainerName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ex: Jean-Pierre Martin"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rôle/Expertise du formateur</label>
                <input
                  type="text"
                  name="trainerRole"
                  value={formData.trainerRole}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ex: Expert React & TypeScript"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email du formateur</label>
                <input
                  type="email"
                  name="trainerEmail"
                  value={formData.trainerEmail}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="exemple@email.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="A Venir">A Venir</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting 
                    ? (editingTrainingId ? 'Modification...' : 'Création...') 
                    : (editingTrainingId ? 'Modifier la formation' : 'Créer la formation')
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

export default ManageTrainings;

