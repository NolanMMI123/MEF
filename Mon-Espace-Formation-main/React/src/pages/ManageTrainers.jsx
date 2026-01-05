import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Toast from '../components/Toast';
import { FaEye, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { X } from 'lucide-react';
import './ManageTrainers.css';

/**
 * Page de gestion des formateurs
 * Affiche la liste des formateurs avec leurs statistiques
 */
const ManageTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    poste: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users?role=TRAINER');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des formateurs');
      }
      const data = await response.json();
      setTrainers(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gérer l'ouverture du modal
  const handleOpenModal = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      poste: ''
    });
    setShowModal(true);
  };

  // Gérer la fermeture du modal
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      poste: ''
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
    if (!formData.nom || !formData.prenom || !formData.email || !formData.poste) {
      setToast({ message: 'Veuillez remplir tous les champs obligatoires', type: 'error' });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setToast({ message: 'Veuillez entrer une adresse email valide', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          password: formData.password || 'trainer123' // Mot de passe par défaut si non fourni
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Cet email est déjà utilisé');
        }
        throw new Error('Erreur lors de la création du formateur');
      }

      setToast({ message: 'Formateur créé avec succès !', type: 'success' });
      handleCloseModal();
      await fetchTrainers(); // Rafraîchir la liste
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ message: err.message || 'Erreur lors de la création du formateur', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Générer les initiales pour l'avatar
  const getInitials = (fullname) => {
    if (!fullname) return '??';
    const parts = fullname.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullname.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Chargement des formateurs...</p>
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
      <div className="manage-trainers">
        <div className="manage-header">
          <div>
            <h2 className="admin-page-title">Gestion des formateurs</h2>
            <p className="admin-page-subtitle">Suivi des formateurs et de leurs sessions</p>
          </div>
          <button className="admin-btn-primary" onClick={handleOpenModal}>
            <FaPlus />
            Ajouter un formateur
          </button>
        </div>

        {/* Liste des formateurs */}
        {trainers.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">👨‍🏫</div>
            <p>Aucun formateur trouvé</p>
            <p className="admin-empty-hint">Assurez-vous que les utilisateurs ont le rôle "TRAINER" dans la base de données</p>
          </div>
        ) : (
          <div className="trainers-grid">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="trainer-card">
                <div className="trainer-avatar">
                  {getInitials(trainer.fullname)}
                </div>
                <div className="trainer-name">{trainer.fullname || 'N/A'}</div>
                <div className="trainer-rating">
                  ⭐ 4.8
                </div>
                <div className="trainer-speciality">
                  <span className="trainer-tag">{trainer.speciality || 'N/A'}</span>
                </div>
                <div className="trainer-stats">
                  <div className="trainer-stat">
                    <span className="trainer-stat-label">Sessions en cours</span>
                    <span className="trainer-stat-value">{trainer.activeSessions || 0}</span>
                  </div>
                </div>
                <div className="trainer-contact">
                  <div className="trainer-email">📧 {trainer.email || 'N/A'}</div>
                </div>
                <div className="trainer-actions">
                  <button className="trainer-action-btn">
                    <FaEye />
                    Profil
                  </button>
                  <button className="trainer-action-btn">
                    <FaCalendarAlt />
                    Planning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'ajout de formateur */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Ajouter un formateur</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Jean"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Dupont"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="jean.dupont@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Spécialité/Poste *</label>
                <input
                  type="text"
                  name="poste"
                  value={formData.poste}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Expert React & TypeScript"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe (optionnel)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Laissez vide pour utiliser 'trainer123' par défaut"
                />
                <p className="form-hint">Si non renseigné, le mot de passe par défaut sera "trainer123"</p>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Création...' : 'Ajouter le formateur'}
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

export default ManageTrainers;

