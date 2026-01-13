import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Users, Clock, BookOpen, Eye, X, Edit, Plus, Trash2,
  ArrowLeft, User as UserIcon, Save, Euro, Calendar
} from 'lucide-react';
import Toast from '../components/Toast';
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [trainingData, setTrainingData] = useState(null);
  const [pedagogicalFormData, setPedagogicalFormData] = useState({
    objectifs: [],
    prerequis: [],
    programme: ''
  });
  const [fullTrainingFormData, setFullTrainingFormData] = useState({
    title: '',
    duration: '',
    location: '',
    price: '',
    startDate: '',
    endDate: '',
    status: 'A Venir',
    objectifs: [],
    prerequis: [],
    programme: ''
  });
  const [editingObjective, setEditingObjective] = useState('');
  const [editingPrerequis, setEditingPrerequis] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedTrainingForSession, setSelectedTrainingForSession] = useState(null);
  const [sessionFormData, setSessionFormData] = useState({
    title: '',
    dates: '',
    lieu: '',
    placesTotales: '',
    price: '',
    level: '',
    category: '',
    desc: ''
  });
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
    // Charger les données de la formation pour l'édition complète
    fetch(`http://localhost:8080/api/trainings/${formationId}`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement');
        return res.json();
      })
      .then(training => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (training.trainerId !== user.id) {
          setToast({ message: 'Vous n\'êtes pas autorisé à modifier cette formation', type: 'error' });
          return;
        }
        setTrainingData(training);
        setFullTrainingFormData({
          title: training.title || '',
          duration: training.duration || '',
          location: training.location || '',
          price: training.price || '',
          startDate: training.startDate || '',
          endDate: training.endDate || '',
          status: training.status || 'A Venir',
          objectifs: training.objectifs || [],
          prerequis: training.prerequis || [],
          programme: training.programme || ''
        });
        setShowEditModal(true);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setToast({ message: 'Erreur lors du chargement de la formation : ' + err.message, type: 'error' });
      });
  };

  const handleCreateFormation = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setFullTrainingFormData({
      title: '',
      duration: '',
      location: '',
      price: '',
      startDate: '',
      endDate: '',
      status: 'A Venir',
      objectifs: [],
      prerequis: [],
      programme: ''
    });
    setTrainingData({ trainerId: user.id, trainerName: `${user.prenom || ''} ${user.nom || ''}`.trim(), trainerEmail: user.email });
    setShowCreateModal(true);
  };

  const handleDeleteFormation = async (formationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.')) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`http://localhost:8080/api/trainings/${formationId}`, {
        method: 'DELETE',
        headers: {
          'X-Trainer-Id': user.id
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Vous n\'êtes pas autorisé à supprimer cette formation');
        }
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors de la suppression');
      }

      setToast({ message: 'Formation supprimée avec succès !', type: 'success' });
      // Recharger les données
      const userEmail = localStorage.getItem('userEmail');
      const dashboardResponse = await fetch(`http://localhost:8080/api/dashboard/trainer/${userEmail}`);
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ message: 'Erreur lors de la suppression : ' + err.message, type: 'error' });
    }
  };

  const handleCreateSession = (training) => {
    setSelectedTrainingForSession(training);
    setSessionFormData({
      title: training.title || '',
      dates: training.startDate && training.endDate ? `${training.startDate} - ${training.endDate}` : '',
      lieu: training.location || '',
      placesTotales: '20',
      price: training.price || '',
      level: '',
      category: '',
      desc: ''
    });
    setShowSessionModal(true);
  };

  const handleSaveSession = async () => {
    if (!sessionFormData.title || !sessionFormData.dates || !sessionFormData.lieu || !sessionFormData.placesTotales) {
      setToast({ message: 'Veuillez remplir tous les champs obligatoires', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const sessionData = {
        ...sessionFormData,
        placesTotales: parseInt(sessionFormData.placesTotales),
        placesReservees: 0,
        price: sessionFormData.price ? parseFloat(sessionFormData.price) : null
      };

      const response = await fetch('http://localhost:8080/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session');
      }

      setToast({ message: 'Session créée avec succès !', type: 'success' });
      setShowSessionModal(false);
      setSelectedTrainingForSession(null);
      
      // Recharger les données
      const userEmail = localStorage.getItem('userEmail');
      const dashboardResponse = await fetch(`http://localhost:8080/api/dashboard/trainer/${userEmail}`);
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ message: 'Erreur lors de la création de la session : ' + err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveFullTraining = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!fullTrainingFormData.title || !fullTrainingFormData.duration || !fullTrainingFormData.location) {
      setToast({ message: 'Veuillez remplir au moins le titre, la durée et le lieu', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const trainingDataToSend = {
        ...fullTrainingFormData,
        price: fullTrainingFormData.price ? parseFloat(fullTrainingFormData.price) : null,
        trainerId: user.id,
        trainerName: `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email,
        trainerEmail: user.email
      };

      const url = trainingData?.id 
        ? `http://localhost:8080/api/trainings/${trainingData.id}`
        : 'http://localhost:8080/api/trainings';
      
      const method = trainingData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Trainer-Id': user.id
        },
        body: JSON.stringify(trainingDataToSend)
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Vous n\'êtes pas autorisé à modifier cette formation');
        }
        throw new Error('Erreur lors de la sauvegarde');
      }

      setToast({ 
        message: trainingData?.id ? 'Formation modifiée avec succès !' : 'Formation créée avec succès !', 
        type: 'success' 
      });
      setShowCreateModal(false);
      setShowEditModal(false);
      setTrainingData(null);
      
      // Recharger les données
      const userEmail = localStorage.getItem('userEmail');
      const dashboardResponse = await fetch(`http://localhost:8080/api/dashboard/trainer/${userEmail}`);
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ message: 'Erreur lors de la sauvegarde : ' + err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
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
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`http://localhost:8080/api/trainings/${id}/pedagogical-content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Trainer-Id': user.id || ''
        },
        body: JSON.stringify(pedagogicalFormData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      setToast({ message: 'Contenu pédagogique sauvegardé avec succès !', type: 'success' });
      setTimeout(() => {
        navigate('/trainer/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ message: 'Erreur lors de la sauvegarde : ' + err.message, type: 'error' });
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

          <div className="trainer-stat-card">
            <div className="trainer-stat-icon" style={{ backgroundColor: '#e8f5e9' }}>
              <Euro size={24} color="#2e7d32" />
            </div>
            <div className="trainer-stat-content">
              <div className="trainer-stat-value">
                {stats.revenuTotal ? stats.revenuTotal.toFixed(2) : '0.00'}€
              </div>
              <div className="trainer-stat-label">Revenu total</div>
            </div>
          </div>
        </div>

        {/* Liste des formations */}
        <div className="trainer-formations-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="trainer-section-title" style={{ margin: 0 }}>Mes formations</h2>
            <button
              className="trainer-btn trainer-btn-primary"
              onClick={handleCreateFormation}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} /> Créer une formation
            </button>
          </div>
          
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
                        <Edit size={16} /> Modifier
                      </button>
                      <button
                        className="trainer-btn trainer-btn-secondary"
                        onClick={() => handleCreateSession(training)}
                        style={{ backgroundColor: '#1976d2', color: 'white' }}
                      >
                        <Calendar size={16} /> Créer session
                      </button>
                      <button
                        className="trainer-btn"
                        onClick={() => handleDeleteFormation(training.id)}
                        style={{ backgroundColor: '#dc3545', color: 'white' }}
                      >
                        <Trash2 size={16} /> Supprimer
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

      {/* Modal de création/édition complète de formation */}
      {(showCreateModal || showEditModal) && (
        <div className="trainer-modal-overlay" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>
          <div className="trainer-modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="trainer-modal-header">
              <h3>{showEditModal ? 'Modifier la formation' : 'Créer une nouvelle formation'}</h3>
              <button className="trainer-modal-close" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="trainer-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="trainer-form-group">
                <label className="trainer-form-label">Titre de la formation *</label>
                <input
                  type="text"
                  value={fullTrainingFormData.title}
                  onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="trainer-input"
                  placeholder="Ex: Développement Front-End avec React"
                  required
                />
              </div>

              <div className="trainer-form-group">
                <label className="trainer-form-label">Durée *</label>
                <input
                  type="text"
                  value={fullTrainingFormData.duration}
                  onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="trainer-input"
                  placeholder="Ex: 5 Jours ou 30 heures"
                  required
                />
              </div>

              <div className="trainer-form-group">
                <label className="trainer-form-label">Lieu *</label>
                <input
                  type="text"
                  value={fullTrainingFormData.location}
                  onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="trainer-input"
                  placeholder="Ex: Paris / Distanciel"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="trainer-form-group">
                  <label className="trainer-form-label">Date de début</label>
                  <input
                    type="text"
                    value={fullTrainingFormData.startDate}
                    onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="trainer-input"
                    placeholder="Ex: 15 Janvier 2025"
                  />
                </div>

                <div className="trainer-form-group">
                  <label className="trainer-form-label">Date de fin</label>
                  <input
                    type="text"
                    value={fullTrainingFormData.endDate}
                    onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="trainer-input"
                    placeholder="Ex: 19 Janvier 2025"
                  />
                </div>
              </div>

              <div className="trainer-form-group">
                <label className="trainer-form-label">Prix (€)</label>
                <input
                  type="number"
                  value={fullTrainingFormData.price}
                  onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="trainer-input"
                  placeholder="Ex: 2490"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="trainer-form-group">
                <label className="trainer-form-label">Statut</label>
                <select
                  value={fullTrainingFormData.status}
                  onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="trainer-input"
                >
                  <option value="A Venir">A Venir</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminée">Terminée</option>
                </select>
              </div>

              <h3 className="trainer-section-title" style={{ marginTop: '24px', marginBottom: '16px' }}>Objectifs</h3>
              <div className="trainer-form-group">
                <div className="trainer-objectives-list">
                  {fullTrainingFormData.objectifs.map((obj, index) => (
                    <div key={index} className="trainer-list-item">
                      <span>{obj}</span>
                      <button 
                        className="trainer-remove-btn"
                        onClick={() => setFullTrainingFormData(prev => ({
                          ...prev,
                          objectifs: prev.objectifs.filter((_, i) => i !== index)
                        }))}
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
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setFullTrainingFormData(prev => ({ ...prev, objectifs: [...prev.objectifs, editingObjective.trim()] })), setEditingObjective(''))}
                  />
                  <button 
                    className="trainer-btn trainer-btn-primary"
                    onClick={() => {
                      if (editingObjective.trim()) {
                        setFullTrainingFormData(prev => ({ ...prev, objectifs: [...prev.objectifs, editingObjective.trim()] }));
                        setEditingObjective('');
                      }
                    }}
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              <h3 className="trainer-section-title" style={{ marginTop: '24px', marginBottom: '16px' }}>Prérequis</h3>
              <div className="trainer-form-group">
                <div className="trainer-prerequis-list">
                  {fullTrainingFormData.prerequis.map((prereq, index) => (
                    <div key={index} className="trainer-list-item">
                      <span>{prereq}</span>
                      <button 
                        className="trainer-remove-btn"
                        onClick={() => setFullTrainingFormData(prev => ({
                          ...prev,
                          prerequis: prev.prerequis.filter((_, i) => i !== index)
                        }))}
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
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setFullTrainingFormData(prev => ({ ...prev, prerequis: [...prev.prerequis, editingPrerequis.trim()] })), setEditingPrerequis(''))}
                  />
                  <button 
                    className="trainer-btn trainer-btn-primary"
                    onClick={() => {
                      if (editingPrerequis.trim()) {
                        setFullTrainingFormData(prev => ({ ...prev, prerequis: [...prev.prerequis, editingPrerequis.trim()] }));
                        setEditingPrerequis('');
                      }
                    }}
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              <h3 className="trainer-section-title" style={{ marginTop: '24px', marginBottom: '16px' }}>Programme détaillé</h3>
              <div className="trainer-form-group">
                <textarea
                  value={fullTrainingFormData.programme}
                  onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, programme: e.target.value }))}
                  placeholder="Décrivez le programme détaillé de la formation..."
                  className="trainer-textarea"
                  rows={6}
                />
              </div>
            </div>

            <div className="trainer-edit-actions" style={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
              <button 
                className="trainer-btn trainer-btn-secondary"
                onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}
              >
                Annuler
              </button>
              <button 
                className="trainer-btn trainer-btn-primary"
                onClick={handleSaveFullTraining}
                disabled={submitting}
              >
                <Save size={16} /> {submitting ? 'Sauvegarde...' : (showEditModal ? 'Modifier' : 'Créer')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de session */}
      {showSessionModal && selectedTrainingForSession && (
        <div className="trainer-modal-overlay" onClick={() => { setShowSessionModal(false); setSelectedTrainingForSession(null); }}>
          <div className="trainer-modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="trainer-modal-header">
              <h3>Créer une session pour "{selectedTrainingForSession.title}"</h3>
              <button className="trainer-modal-close" onClick={() => { setShowSessionModal(false); setSelectedTrainingForSession(null); }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="trainer-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="trainer-form-group">
                <label className="trainer-form-label">Titre de la session *</label>
                <input
                  type="text"
                  value={sessionFormData.title}
                  onChange={(e) => setSessionFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="trainer-input"
                  placeholder="Ex: Session Janvier 2025"
                  required
                />
              </div>

              <div className="trainer-form-group">
                <label className="trainer-form-label">Dates *</label>
                <input
                  type="text"
                  value={sessionFormData.dates}
                  onChange={(e) => setSessionFormData(prev => ({ ...prev, dates: e.target.value }))}
                  className="trainer-input"
                  placeholder="Ex: 15 Janvier 2025 - 19 Janvier 2025"
                  required
                />
              </div>

              <div className="trainer-form-group">
                <label className="trainer-form-label">Lieu *</label>
                <input
                  type="text"
                  value={sessionFormData.lieu}
                  onChange={(e) => setSessionFormData(prev => ({ ...prev, lieu: e.target.value }))}
                  className="trainer-input"
                  placeholder="Ex: Paris / Distanciel"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="trainer-form-group">
                  <label className="trainer-form-label">Nombre de places *</label>
                  <input
                    type="number"
                    value={sessionFormData.placesTotales}
                    onChange={(e) => setSessionFormData(prev => ({ ...prev, placesTotales: e.target.value }))}
                    className="trainer-input"
                    placeholder="Ex: 20"
                    min="1"
                    required
                  />
                </div>

                <div className="trainer-form-group">
                  <label className="trainer-form-label">Prix (€)</label>
                  <input
                    type="number"
                    value={sessionFormData.price}
                    onChange={(e) => setSessionFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="trainer-input"
                    placeholder="Ex: 2490"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="trainer-form-group">
                  <label className="trainer-form-label">Niveau</label>
                  <select
                    value={sessionFormData.level}
                    onChange={(e) => setSessionFormData(prev => ({ ...prev, level: e.target.value }))}
                    className="trainer-input"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>

                <div className="trainer-form-group">
                  <label className="trainer-form-label">Catégorie</label>
                  <input
                    type="text"
                    value={sessionFormData.category}
                    onChange={(e) => setSessionFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="trainer-input"
                    placeholder="Ex: Développement"
                  />
                </div>
              </div>

              <div className="trainer-form-group">
                <label className="trainer-form-label">Description</label>
                <textarea
                  value={sessionFormData.desc}
                  onChange={(e) => setSessionFormData(prev => ({ ...prev, desc: e.target.value }))}
                  className="trainer-textarea"
                  rows={4}
                  placeholder="Description de la session..."
                />
              </div>
            </div>

            <div className="trainer-edit-actions" style={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
              <button 
                className="trainer-btn trainer-btn-secondary"
                onClick={() => { setShowSessionModal(false); setSelectedTrainingForSession(null); }}
              >
                Annuler
              </button>
              <button 
                className="trainer-btn trainer-btn-primary"
                onClick={handleSaveSession}
                disabled={submitting}
              >
                <Save size={16} /> {submitting ? 'Création...' : 'Créer la session'}
              </button>
            </div>
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
    </div>
  );
};

export default TrainerDashboard;

