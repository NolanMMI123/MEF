import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Users, Clock, BookOpen, Eye, X, Edit,
  ArrowLeft, User as UserIcon
} from 'lucide-react';
import './TrainerDashboard.css';

/**
 * Dashboard du formateur
 * Affiche les statistiques, les formations assignées et les inscrits
 */
const TrainerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [showInscritsModal, setShowInscritsModal] = useState(false);
  const [trainingData, setTrainingData] = useState(null);
  const [pedagogicalFormData, setPedagogicalFormData] = useState({
    objectifs: [],
    prerequis: [],
    programme: ''
  });
  const [editingObjective, setEditingObjective] = useState('');
  const [editingPrerequis, setEditingPrerequis] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          navigate('/connexion');
          return;
        }

        if (id) {
          // Mode édition : charger les données de la formation
          const response = await fetch(`http://localhost:8080/api/trainings/${id}`);
          if (!response.ok) {
            throw new Error('Erreur lors du chargement de la formation');
          }
          const training = await response.json();
          setTrainingData(training);
          
          // Vérifier que le formateur est bien assigné à cette formation
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (training.trainerId !== user.id) {
            setError('Vous n\'êtes pas autorisé à modifier cette formation');
            return;
          }

          setPedagogicalFormData({
            objectifs: training.objectifs || [],
            prerequis: training.prerequis || [],
            programme: training.programme || ''
          });
        } else {
          // Mode dashboard : charger les données du dashboard
          const response = await fetch(`http://localhost:8080/api/dashboard/trainer/${userEmail}`);
          if (!response.ok) {
            throw new Error('Erreur lors du chargement des données');
          }
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, id]);

  const handleViewInscrits = (formation) => {
    setSelectedFormation(formation);
    setShowInscritsModal(true);
  };

  const handleCloseModal = () => {
    setShowInscritsModal(false);
    setSelectedFormation(null);
  };

  const handleEditFormation = (formationId) => {
    navigate(`/trainer/formations/${formationId}`);
  };

  const handleAddObjective = () => {
    if (editingObjective.trim()) {
      setPedagogicalFormData(prev => ({
        ...prev,
        objectifs: [...prev.objectifs, editingObjective.trim()]
      }));
      setEditingObjective('');
    }
  };

  const handleRemoveObjective = (index) => {
    setPedagogicalFormData(prev => ({
      ...prev,
      objectifs: prev.objectifs.filter((_, i) => i !== index)
    }));
  };

  const handleAddPrerequis = () => {
    if (editingPrerequis.trim()) {
      setPedagogicalFormData(prev => ({
        ...prev,
        prerequis: [...prev.prerequis, editingPrerequis.trim()]
      }));
      setEditingPrerequis('');
    }
  };

  const handleRemovePrerequis = (index) => {
    setPedagogicalFormData(prev => ({
      ...prev,
      prerequis: prev.prerequis.filter((_, i) => i !== index)
    }));
  };

  const handleSavePedagogicalContent = async () => {
    if (!id) return;

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/api/trainings/${id}/pedagogical-content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedagogicalFormData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      alert('Contenu pédagogique sauvegardé avec succès !');
      navigate('/trainer/dashboard');
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la sauvegarde : ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/connexion');
  };

  if (loading) {
    return (
      <div className="trainer-dashboard-wrapper">
        <div className="trainer-loading">
          <div className="trainer-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trainer-dashboard-wrapper">
        <div className="trainer-error">
          <p>Erreur : {error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="trainer-dashboard-wrapper">
        <div className="trainer-error">
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  // Mode édition du contenu pédagogique
  if (id && trainingData) {
    return (
      <div className="trainer-dashboard-wrapper">
        <header className="trainer-header">
          <div className="trainer-header-content">
            <div className="trainer-header-left">
              <h1 className="trainer-title">Édition du contenu pédagogique</h1>
              <p className="trainer-subtitle">{trainingData.title}</p>
            </div>
            <div className="trainer-header-right">
              <button 
                className="trainer-header-btn" 
                onClick={() => navigate('/trainer/dashboard')}
              >
                <ArrowLeft size={16} /> Retour
              </button>
            </div>
          </div>
        </header>

        <main className="trainer-main">
          <div className="trainer-edit-section">
            <h2 className="trainer-section-title">Objectifs de la formation</h2>
            <div className="trainer-form-group">
              <div className="trainer-objectives-list">
                {pedagogicalFormData.objectifs.map((obj, index) => (
                  <div key={index} className="trainer-list-item">
                    <span>{obj}</span>
                    <button 
                      className="trainer-remove-btn"
                      onClick={() => handleRemoveObjective(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="trainer-add-input">
                <input
                  type="text"
                  value={editingObjective}
                  onChange={(e) => setEditingObjective(e.target.value)}
                  placeholder="Ajouter un objectif"
                  className="trainer-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
                />
                <button 
                  className="trainer-btn trainer-btn-primary"
                  onClick={handleAddObjective}
                >
                  Ajouter
                </button>
              </div>
            </div>

            <h2 className="trainer-section-title">Prérequis</h2>
            <div className="trainer-form-group">
              <div className="trainer-prerequis-list">
                {pedagogicalFormData.prerequis.map((prereq, index) => (
                  <div key={index} className="trainer-list-item">
                    <span>{prereq}</span>
                    <button 
                      className="trainer-remove-btn"
                      onClick={() => handleRemovePrerequis(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="trainer-add-input">
                <input
                  type="text"
                  value={editingPrerequis}
                  onChange={(e) => setEditingPrerequis(e.target.value)}
                  placeholder="Ajouter un prérequis"
                  className="trainer-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPrerequis()}
                />
                <button 
                  className="trainer-btn trainer-btn-primary"
                  onClick={handleAddPrerequis}
                >
                  Ajouter
                </button>
              </div>
            </div>

            <h2 className="trainer-section-title">Programme détaillé</h2>
            <div className="trainer-form-group">
              <textarea
                value={pedagogicalFormData.programme}
                onChange={(e) => setPedagogicalFormData(prev => ({
                  ...prev,
                  programme: e.target.value
                }))}
                placeholder="Décrivez le programme détaillé de la formation..."
                className="trainer-textarea"
                rows={10}
              />
            </div>

            <div className="trainer-edit-actions">
              <button 
                className="trainer-btn trainer-btn-secondary"
                onClick={() => navigate('/trainer/dashboard')}
              >
                Annuler
              </button>
              <button 
                className="trainer-btn trainer-btn-primary"
                onClick={handleSavePedagogicalContent}
                disabled={submitting}
              >
                {submitting ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Mode dashboard
  if (!dashboardData) {
    return null;
  }

  const { trainer, formations, stats } = dashboardData;
  const trainerName = trainer ? `${trainer.prenom || ''} ${trainer.nom || ''}`.trim() || trainer.email : 'Formateur';

  return (
    <div className="trainer-dashboard-wrapper">
      {/* Header */}
      <header className="trainer-header">
        <div className="trainer-header-content">
          <div className="trainer-header-left">
            <h1 className="trainer-title">Mon Espace Formateur</h1>
            <p className="trainer-subtitle">Bienvenue, {trainerName}</p>
          </div>
          <div className="trainer-header-right">
            <button 
              className="trainer-header-btn" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} /> Voir le site
            </button>
            <button className="trainer-header-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="trainer-main">
        {/* Statistiques */}
        <div className="trainer-stats-grid">
          <div className="trainer-stat-card">
            <div className="trainer-stat-icon" style={{ backgroundColor: '#e3f2fd' }}>
              <BookOpen size={24} color="#1976d2" />
            </div>
            <div className="trainer-stat-content">
              <div className="trainer-stat-value">{stats.nombreFormations}</div>
              <div className="trainer-stat-label">Formations assignées</div>
            </div>
          </div>

          <div className="trainer-stat-card">
            <div className="trainer-stat-icon" style={{ backgroundColor: '#f3e5f5' }}>
              <Users size={24} color="#7b1fa2" />
            </div>
            <div className="trainer-stat-content">
              <div className="trainer-stat-value">{stats.totalEleves}</div>
              <div className="trainer-stat-label">Élèves suivis</div>
            </div>
          </div>

          <div className="trainer-stat-card">
            <div className="trainer-stat-icon" style={{ backgroundColor: '#fff3e0' }}>
              <Clock size={24} color="#e65100" />
            </div>
            <div className="trainer-stat-content">
              <div className="trainer-stat-value">{stats.heuresCoursPrevues}h</div>
              <div className="trainer-stat-label">Heures de cours prévues</div>
            </div>
          </div>
        </div>

        {/* Liste des formations */}
        <div className="trainer-formations-section">
          <h2 className="trainer-section-title">Mes formations</h2>
          
          {formations && formations.length > 0 ? (
            <div className="trainer-formations-grid">
              {formations.map((formationWithInscrits) => {
                const training = formationWithInscrits.training;
                const inscrits = formationWithInscrits.inscrits || [];
                
                return (
                  <div key={training.id} className="trainer-formation-card">
                    <div className="trainer-formation-header">
                      <h3 className="trainer-formation-title">{training.title || 'Sans titre'}</h3>
                      <span className={`trainer-formation-status ${training.status === 'En cours' ? 'active' : ''}`}>
                        {training.status || 'A Venir'}
                      </span>
                    </div>
                    
                    <div className="trainer-formation-info">
                      <div className="trainer-formation-detail">
                        <strong>Référence:</strong> {training.reference || 'N/A'}
                      </div>
                      <div className="trainer-formation-detail">
                        <strong>Durée:</strong> {training.duration || 'N/A'}
                      </div>
                      <div className="trainer-formation-detail">
                        <strong>Lieu:</strong> {training.location || 'N/A'}
                      </div>
                      <div className="trainer-formation-detail">
                        <strong>Dates:</strong> {training.startDate || 'N/A'} - {training.endDate || 'N/A'}
                      </div>
                      <div className="trainer-formation-detail">
                        <strong>Inscrits:</strong> {inscrits.length} élève(s)
                      </div>
                    </div>

                    <div className="trainer-formation-actions">
                      <button
                        className="trainer-btn trainer-btn-primary"
                        onClick={() => handleViewInscrits(formationWithInscrits)}
                      >
                        <Eye size={16} /> Voir les inscrits ({inscrits.length})
                      </button>
                      <button
                        className="trainer-btn trainer-btn-secondary"
                        onClick={() => handleEditFormation(training.id)}
                      >
                        <Edit size={16} /> Éditer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="trainer-empty-state">
              <BookOpen size={48} color="#ccc" />
              <p>Aucune formation assignée pour le moment</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal des inscrits */}
      {showInscritsModal && selectedFormation && (
        <div className="trainer-modal-overlay" onClick={handleCloseModal}>
          <div className="trainer-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="trainer-modal-header">
              <h3>Inscrits - {selectedFormation.training.title}</h3>
              <button className="trainer-modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="trainer-modal-body">
              {selectedFormation.inscrits && selectedFormation.inscrits.length > 0 ? (
                <div className="trainer-inscrits-list">
                  {selectedFormation.inscrits.map((inscrit, index) => (
                    <div key={index} className="trainer-inscrit-item">
                      <div className="trainer-inscrit-icon">
                        <UserIcon size={20} />
                      </div>
                      <div className="trainer-inscrit-info">
                        <div className="trainer-inscrit-name">{inscrit.userName}</div>
                        <div className="trainer-inscrit-email">{inscrit.userEmail}</div>
                        <div className="trainer-inscrit-date">
                          Inscrit le: {inscrit.inscriptionDate || 'N/A'}
                        </div>
                      </div>
                      <span className={`trainer-inscrit-status ${inscrit.status === 'VALIDÉ' ? 'validated' : ''}`}>
                        {inscrit.status || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="trainer-empty-state">
                  <Users size={48} color="#ccc" />
                  <p>Aucun inscrit pour cette formation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;

