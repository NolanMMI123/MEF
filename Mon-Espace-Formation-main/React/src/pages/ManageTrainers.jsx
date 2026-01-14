import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Toast from '../components/Toast';
import { FaEye, FaCalendarAlt, FaPlus, FaEdit } from 'react-icons/fa';
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
    poste: '',
    typeContrat: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingTrainerId, setEditingTrainerId] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/users?role=TRAINER');
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
  const handleOpenModal = (trainer = null) => {
    console.log('handleOpenModal appelé avec:', trainer);
    try {
      if (trainer) {
        // Mode édition - récupérer les données complètes du formateur
        console.log('Mode édition pour le formateur:', trainer.id);
        fetch(`/api/users/trainer/${trainer.id}`)
          .then(res => {
            if (!res.ok) throw new Error('Erreur lors du chargement');
            return res.json();
          })
          .then(fullTrainer => {
            console.log('Données complètes du formateur:', fullTrainer);
            // Extraire nom et prénom du fullname
            const nameParts = (trainer.fullname || '').split(' ');
            const prenom = nameParts.length > 0 ? nameParts[0] : '';
            const nom = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
            
            setFormData({
              nom: fullTrainer.nom || nom || '',
              prenom: fullTrainer.prenom || prenom || '',
              email: fullTrainer.email || '',
              password: '', // Ne pas pré-remplir le mot de passe
              poste: fullTrainer.poste || trainer.speciality || '',
              typeContrat: fullTrainer.typeContrat || ''
            });
            setEditingTrainerId(trainer.id);
            setShowModal(true);
            console.log('Modal ouvert en mode édition');
          })
          .catch(err => {
            console.error('Erreur lors du chargement du formateur:', err);
            setToast({ message: 'Erreur lors du chargement des données: ' + err.message, type: 'error' });
          });
      } else {
        // Mode création
        console.log('Mode création - ouverture du modal');
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          password: '',
          poste: '',
          typeContrat: ''
        });
        setEditingTrainerId(null);
        setShowModal(true);
        console.log('Modal ouvert en mode création, showModal:', true);
      }
    } catch (error) {
      console.error('Erreur dans handleOpenModal:', error);
      setToast({ message: 'Erreur lors de l\'ouverture du formulaire: ' + error.message, type: 'error' });
    }
  };

  // Gérer la fermeture du modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTrainerId(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      poste: '',
      typeContrat: ''
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
      const url = editingTrainerId 
        ? `/api/users/trainer/${editingTrainerId}`
        : '/api/users/trainer';
      
      const method = editingTrainerId ? 'PUT' : 'POST';
      
      const bodyData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        poste: formData.poste
      };
      
      // Ajouter typeContrat seulement s'il est renseigné
      if (formData.typeContrat && formData.typeContrat.trim() !== '') {
        bodyData.typeContrat = formData.typeContrat;
      }
      
      // Ajouter le mot de passe seulement s'il est fourni (pour la création ou la modification)
      if (formData.password && formData.password.trim() !== '') {
        bodyData.password = formData.password;
      } else if (!editingTrainerId) {
        // Mot de passe par défaut seulement pour la création
        bodyData.password = 'trainer123';
      }

      console.log('Envoi de la requête:', { url, method, bodyData });

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      // Vérifier le Content-Type de la réponse
      const contentType = response.headers.get('content-type');
      let responseData = null;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const responseText = await response.text();
        console.log('Réponse du serveur (texte):', response.status, responseText);
      }

      if (!response.ok) {
        let errorMessage = editingTrainerId 
          ? 'Erreur lors de la modification du formateur' 
          : 'Erreur lors de la création du formateur';
        
        if (response.status === 400) {
          errorMessage = 'Cet email est déjà utilisé ou données invalides. Vérifiez que tous les champs sont correctement remplis.';
        } else if (response.status === 404) {
          errorMessage = 'Formateur non trouvé';
        } else if (response.status === 500) {
          errorMessage = 'Erreur serveur. Vérifiez les logs du backend et que le serveur est bien démarré.';
        }
        
        // Essayer d'extraire un message d'erreur plus détaillé si disponible
        if (responseData && responseData.message) {
          errorMessage = responseData.message;
        }
        
        throw new Error(errorMessage);
      }

      // Vérifier que la réponse contient bien des données
      if (responseData) {
        console.log('Formateur créé/modifié avec succès:', responseData);
      }

      setToast({ 
        message: editingTrainerId 
          ? 'Formateur modifié avec succès !' 
          : 'Formateur créé avec succès !', 
        type: 'success' 
      });
      handleCloseModal();
      await fetchTrainers(); // Rafraîchir la liste
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ 
        message: err.message || (editingTrainerId 
          ? 'Erreur lors de la modification du formateur' 
          : 'Erreur lors de la création du formateur'), 
        type: 'error' 
      });
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
          <button 
            className="admin-btn-primary" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Bouton cliqué - ouverture du modal');
              handleOpenModal();
            }}
            type="button"
          >
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
                <div className="trainer-contract-info">
                  {trainer.typeContrat ? (
                    <div className="trainer-contract-badge-card">
                      <span className="trainer-contract-label">Type de contrat:</span>
                      <span 
                        className="trainer-contract-badge-value"
                        style={{
                          backgroundColor: 
                            trainer.typeContrat === 'Freelance' ? '#4285F4' :
                            trainer.typeContrat === 'CDD' ? '#34A853' :
                            trainer.typeContrat === 'Vacataire' ? '#FFC107' : '#6c757d',
                          color: trainer.typeContrat === 'Vacataire' ? '#212529' : 'white'
                        }}
                      >
                        {trainer.typeContrat}
                      </span>
                    </div>
                  ) : (
                    <div className="trainer-contract-badge-card">
                      <span className="trainer-contract-label">Type de contrat:</span>
                      <span className="trainer-contract-badge-value" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                        Non défini
                      </span>
                    </div>
                  )}
                  {trainer.tarif && (
                    <div className="trainer-tarif-card">
                      <span className="trainer-tarif-label">Tarif:</span>
                      <span className="trainer-tarif-value">{trainer.tarif}€/h</span>
                    </div>
                  )}
                </div>
                <div className="trainer-actions">
                  <button 
                    className="trainer-action-btn"
                    onClick={() => handleOpenModal(trainer)}
                  >
                    <FaEdit />
                    Modifier
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
              <h3 className="modal-title">
                {editingTrainerId ? 'Modifier le formateur' : 'Ajouter un formateur'}
              </h3>
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
                <label className="form-label">Type de contrat</label>
                <select
                  name="typeContrat"
                  value={formData.typeContrat}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Freelance">Freelance</option>
                  <option value="CDD">CDD</option>
                  <option value="Vacataire">Vacataire</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Mot de passe {editingTrainerId ? '(laisser vide pour ne pas modifier)' : '(optionnel)'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder={editingTrainerId ? "Laisser vide pour ne pas modifier" : "Laissez vide pour utiliser 'trainer123' par défaut"}
                />
                {!editingTrainerId && (
                  <p className="form-hint">Si non renseigné, le mot de passe par défaut sera "trainer123"</p>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting 
                    ? (editingTrainerId ? 'Modification...' : 'Création...') 
                    : (editingTrainerId ? 'Modifier le formateur' : 'Ajouter le formateur')}
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

