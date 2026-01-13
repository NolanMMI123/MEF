import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Users, Clock, BookOpen, Eye, X, Edit, Plus, Trash2,
  ArrowLeft, User as UserIcon, Save, Calendar
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
    description: '',  // Description générale
    imageUrl: '',     // URL ou base64 de l'image d'aperçu
    objectifs: [],
    programme: [], // Liste pour le programme
    prerequis: []
  });
  const [imagePreview, setImagePreview] = useState(null); // Pour prévisualiser l'image
  const [editingObjective, setEditingObjective] = useState('');
  const [editingProgramme, setEditingProgramme] = useState(''); // Pour le programme
  const [editingPrerequis, setEditingPrerequis] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedTrainingForSession, setSelectedTrainingForSession] = useState(null);
  const [sessionFormData, setSessionFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
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
          // Log pour déboguer les inscrits
          if (data.formations) {
            console.log('📊 Formations chargées:', data.formations.length);
            data.formations.forEach((formationWithInscrits, index) => {
              const training = formationWithInscrits.training;
              const inscrits = formationWithInscrits.inscrits || [];
              console.log(`Formation ${index + 1} (${training?.title}):`, {
                id: training?.id,
                inscritsCount: inscrits.length,
                inscrits: inscrits
              });
            });
          }
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
    console.log('👁️ Affichage des inscrits pour la formation:', formation);
    console.log('📋 Données de la formation:', {
      training: formation.training,
      inscrits: formation.inscrits,
      nombreInscrits: formation.inscrits ? formation.inscrits.length : 0
    });
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
        // Convertir les dates au format YYYY-MM-DD si elles sont au format texte
        const convertToDateInput = (dateString) => {
          if (!dateString) return '';
          // Si c'est déjà au format YYYY-MM-DD, le retourner tel quel
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
          }
          // Sinon, essayer de parser la date
          try {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
              return date.toISOString().split('T')[0];
            }
          } catch (e) {
            console.error('Erreur de conversion de date:', e);
          }
          return '';
        };

        // Convertir le programme String en liste si nécessaire
        const programmeList = training.programme 
          ? (typeof training.programme === 'string' 
              ? training.programme.split('\n').filter(line => line.trim() !== '') 
              : (Array.isArray(training.programme) ? training.programme : []))
          : [];

        // S'assurer que objectifs et prerequis sont des tableaux
        const objectifsArray = Array.isArray(training.objectifs) 
          ? training.objectifs 
          : (training.objectifs ? [training.objectifs] : []);
        const prerequisArray = Array.isArray(training.prerequis) 
          ? training.prerequis 
          : (training.prerequis ? [training.prerequis] : []);

        console.log('📋 Données de formation chargées pour édition:', {
          objectifs: objectifsArray,
          programme: programmeList,
          prerequis: prerequisArray
        });

        setFullTrainingFormData({
          title: training.title || '',
          duration: training.duration || '',
          location: training.location || '',
          price: training.price || '',
          startDate: convertToDateInput(training.startDate),
          endDate: convertToDateInput(training.endDate),
          status: training.status || 'A Venir',
          description: training.description || '',
          imageUrl: training.imageUrl || '',
          objectifs: objectifsArray,
          programme: programmeList,
          prerequis: prerequisArray
        });
        // Charger l'image pour la prévisualisation
        if (training.imageUrl) {
          setImagePreview(training.imageUrl);
        } else {
          setImagePreview(null);
        }
        // Réinitialiser les champs d'édition
        setEditingProgramme('');
        setShowEditModal(true);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setToast({ message: 'Erreur lors du chargement de la formation : ' + err.message, type: 'error' });
      });
  };

  const handleCreateFormation = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Réinitialiser tous les champs, y compris le contenu pédagogique
    setFullTrainingFormData({
      title: '',
      duration: '',
      location: '',
      price: '',
      startDate: '',
      endDate: '',
      status: 'A Venir',
      description: '', // Description vide pour commencer
      imageUrl: '',
      objectifs: [], // Liste vide pour commencer
      programme: [], // Liste vide pour commencer
      prerequis: [] // Liste vide pour commencer
    });
    // Réinitialiser aussi les champs d'édition
    setEditingObjective('');
    setEditingProgramme('');
    setEditingPrerequis('');
    setImagePreview(null);
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
      startDate: training.startDate || '',
      endDate: training.endDate || '',
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
    if (!sessionFormData.title || !sessionFormData.startDate || !sessionFormData.endDate || !sessionFormData.lieu || !sessionFormData.placesTotales) {
      setToast({ message: 'Veuillez remplir tous les champs obligatoires', type: 'error' });
      return;
    }

    // Vérifier que la date de fin est après la date de début
    if (sessionFormData.startDate && sessionFormData.endDate && sessionFormData.endDate < sessionFormData.startDate) {
      setToast({ message: 'La date de fin doit être postérieure à la date de début', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      // Formater les dates pour l'affichage
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('fr-FR', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      };

      const datesFormatted = sessionFormData.startDate && sessionFormData.endDate 
        ? `${formatDate(sessionFormData.startDate)} - ${formatDate(sessionFormData.endDate)}`
        : '';

      const sessionData = {
        ...sessionFormData,
        dates: datesFormatted,
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
      // Formater les dates pour l'affichage (format français)
      const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        // Si c'est déjà au format YYYY-MM-DD, le convertir
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          const date = new Date(dateString + 'T00:00:00');
          const day = date.getDate();
          const month = date.toLocaleString('fr-FR', { month: 'long' });
          const year = date.getFullYear();
          return `${day} ${month} ${year}`;
        }
        // Sinon, retourner tel quel (déjà formaté)
        return dateString;
      };

        // Préparer les données à envoyer - IMPORTANT : inclure explicitement tous les champs
      // S'assurer que les listes sont bien des tableaux
      const objectifsArray = Array.isArray(fullTrainingFormData.objectifs) 
        ? fullTrainingFormData.objectifs.filter(obj => obj && obj.trim() !== '')
        : [];
      const prerequisArray = Array.isArray(fullTrainingFormData.prerequis) 
        ? fullTrainingFormData.prerequis.filter(prereq => prereq && prereq.trim() !== '')
        : [];
      const programmeArray = Array.isArray(fullTrainingFormData.programme) 
        ? fullTrainingFormData.programme.filter(prog => prog && prog.trim() !== '')
        : [];
      
      const trainingDataToSend = {
        title: fullTrainingFormData.title || '',
        duration: fullTrainingFormData.duration || '',
        location: fullTrainingFormData.location || '',
        price: fullTrainingFormData.price ? parseFloat(fullTrainingFormData.price) : null,
        startDate: fullTrainingFormData.startDate ? formatDateForDisplay(fullTrainingFormData.startDate) : '',
        endDate: fullTrainingFormData.endDate ? formatDateForDisplay(fullTrainingFormData.endDate) : '',
        status: fullTrainingFormData.status || 'A Venir',
        // Description et contenu pédagogique - CRUCIAL : s'assurer que ces champs sont bien inclus
        description: fullTrainingFormData.description || '',
        imageUrl: fullTrainingFormData.imageUrl || '',
        objectifs: objectifsArray,
        // Convertir la liste programme en String (jointure avec \n) pour le backend
        programme: programmeArray.length > 0 
          ? programmeArray.join('\n') 
          : '',
        prerequis: prerequisArray,
        // Informations du formateur
        trainerId: user.id,
        trainerName: `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email,
        trainerEmail: user.email
      };

      console.log('📤 Données envoyées au backend:', JSON.stringify(trainingDataToSend, null, 2));
      console.log('📋 État complet de fullTrainingFormData avant envoi:', {
        imageUrl: fullTrainingFormData.imageUrl ? (fullTrainingFormData.imageUrl.substring(0, 50) + '...') : 'vide',
        objectifs: fullTrainingFormData.objectifs,
        programme: fullTrainingFormData.programme,
        prerequis: fullTrainingFormData.prerequis
      });
      console.log('🖼️ ImageUrl envoyée:', trainingDataToSend.imageUrl ? (trainingDataToSend.imageUrl.substring(0, 50) + '...') : 'vide');

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
        const errorText = await response.text();
        console.error('Erreur serveur:', response.status, errorText);
        if (response.status === 403) {
          throw new Error('Vous n\'êtes pas autorisé à modifier cette formation');
        }
        if (response.status === 400) {
          throw new Error('Données invalides. Vérifiez que tous les champs sont correctement remplis.');
        }
        throw new Error('Erreur lors de la sauvegarde : ' + (errorText || 'Erreur serveur'));
      }

      const savedTraining = await response.json();
      console.log('✅ Formation sauvegardée avec succès:', savedTraining);
      console.log('📋 Contenu pédagogique sauvegardé:', {
        description: savedTraining.description,
        imageUrl: savedTraining.imageUrl ? (savedTraining.imageUrl.substring(0, 50) + '...') : 'vide',
        objectifs: savedTraining.objectifs,
        prerequis: savedTraining.prerequis,
        programme: savedTraining.programme
      });
      console.log('🖼️ ImageUrl sauvegardée:', savedTraining.imageUrl ? (savedTraining.imageUrl.substring(0, 50) + '...') : 'vide');

      // Vérifier que les données pédagogiques ont bien été sauvegardées
      if (savedTraining.objectifs && savedTraining.objectifs.length > 0) {
        console.log('✅ Objectifs sauvegardés:', savedTraining.objectifs);
      } else {
        console.warn('⚠️ Aucun objectif sauvegardé');
      }
      if (savedTraining.prerequis && savedTraining.prerequis.length > 0) {
        console.log('✅ Prérequis sauvegardés:', savedTraining.prerequis);
      } else {
        console.warn('⚠️ Aucun prérequis sauvegardé');
      }
      if (savedTraining.programme && savedTraining.programme.trim() !== '') {
        console.log('✅ Programme sauvegardé:', savedTraining.programme);
      } else {
        console.warn('⚠️ Aucun programme sauvegardé');
      }
      if (savedTraining.description && savedTraining.description.trim() !== '') {
        console.log('✅ Description sauvegardée');
      }

      setToast({ 
        message: trainingData?.id ? 'Formation modifiée avec succès !' : 'Formation créée avec succès !', 
        type: 'success' 
      });
      setShowCreateModal(false);
      setShowEditModal(false);
      setTrainingData(null);
      
      // Réinitialiser les champs d'édition
      setEditingObjective('');
      setEditingProgramme('');
      setEditingPrerequis('');
      setImagePreview(null);
      
      // Recharger les données
      const userEmail = localStorage.getItem('userEmail');
      const dashboardResponse = await fetch(`http://localhost:8080/api/dashboard/trainer/${userEmail}`);
      if (dashboardResponse.ok) {
        const data = await dashboardResponse.json();
        console.log('✅ Dashboard rechargé après sauvegarde');
        if (data.formations) {
          // Vérifier que les données pédagogiques sont bien présentes
          data.formations.forEach((formationWithInscrits) => {
            const training = formationWithInscrits.training;
            console.log(`📋 Formation rechargée (${training?.title}):`, {
              objectifs: training?.objectifs,
              prerequis: training?.prerequis,
              programme: training?.programme
            });
          });
        }
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

  // Générer les initiales pour l'avatar
  const getInitials = (name) => {
    if (!name) return 'F';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="trainer-dashboard-wrapper">
      {/* Header Moderne */}
      <header className="trainer-header">
        <div className="trainer-header-content">
          <div className="trainer-header-left">
            <div className="trainer-avatar-large">
              {getInitials(trainerName)}
            </div>
            <div className="trainer-header-info">
              <h1>Mon Espace Formateur</h1>
              <p>Bienvenue, {trainerName}</p>
              {trainer?.typeContrat && (
                <div className="trainer-contract-badge" style={{ marginTop: '8px' }}>
                  <span 
                    className="trainer-contract-badge-text"
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
                  {trainer?.tarif && (
                    <span className="trainer-tarif-badge">
                      {trainer.tarif}€/h
                    </span>
                  )}
                </div>
              )}
            </div>
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
        {/* Statistiques Modernes */}
        <div className="trainer-stats-grid">
          <div className="trainer-stat-card">
            <div className="trainer-stat-header">
              <div className="trainer-stat-icon primary">
                <BookOpen size={28} color="white" />
              </div>
            </div>
            <div className="trainer-stat-content">
              <div className="trainer-stat-value">{stats.nombreFormations}</div>
              <div className="trainer-stat-label">Formations assignées</div>
            </div>
          </div>

          <div className="trainer-stat-card">
            <div className="trainer-stat-header">
              <div className="trainer-stat-icon success">
                <Users size={28} color="white" />
              </div>
            </div>
            <div className="trainer-stat-content">
              <div className="trainer-stat-value">{stats.totalEleves}</div>
              <div className="trainer-stat-label">Élèves suivis</div>
            </div>
          </div>

          <div className="trainer-stat-card">
            <div className="trainer-stat-header">
              <div className="trainer-stat-icon warning">
                <Clock size={28} color="white" />
              </div>
            </div>
            <div className="trainer-stat-content">
              <div className="trainer-stat-value">{stats.heuresCoursPrevues}h</div>
              <div className="trainer-stat-label">Heures de cours prévues</div>
            </div>
          </div>
        </div>

        {/* Liste des formations */}
        <div className="trainer-formations-section">
          <div className="trainer-section-header">
            <h2 className="trainer-section-title">Mes formations</h2>
            <button
              className="trainer-create-btn"
              onClick={handleCreateFormation}
            >
              <Plus size={20} /> Créer une formation
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
                      <span className={`trainer-formation-status ${
                        training.status === 'En cours' ? 'encours' : 
                        training.status === 'Terminée' ? 'terminee' : 
                        'avenir'
                      }`}>
                        {training.status || 'A Venir'}
                      </span>
                      <div className="trainer-formation-meta">
                        <div className="trainer-formation-meta-item">
                          <Clock size={14} /> {training.duration || 'N/A'}
                        </div>
                        <div className="trainer-formation-meta-item">
                          <Users size={14} /> {inscrits.length} inscrit{inscrits.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="trainer-formation-body">
                      <div className="trainer-formation-info">
                        <div className="trainer-formation-info-item">
                          <div className="trainer-formation-info-label">Référence</div>
                          <div className="trainer-formation-info-value">{training.reference || 'N/A'}</div>
                        </div>
                        <div className="trainer-formation-info-item">
                          <div className="trainer-formation-info-label">Lieu</div>
                          <div className="trainer-formation-info-value">{training.location || 'N/A'}</div>
                        </div>
                        <div className="trainer-formation-info-item">
                          <div className="trainer-formation-info-label">Formateur</div>
                          <div className="trainer-formation-info-value">{training.trainerName || 'Non assigné'}</div>
                        </div>
                        <div className="trainer-formation-info-item">
                          <div className="trainer-formation-info-label">Date de début</div>
                          <div className="trainer-formation-info-value">{training.startDate || 'N/A'}</div>
                        </div>
                        <div className="trainer-formation-info-item">
                          <div className="trainer-formation-info-label">Date de fin</div>
                          <div className="trainer-formation-info-value">{training.endDate || 'N/A'}</div>
                        </div>
                      </div>

                      <div className="trainer-formation-actions">
                        <button
                          className="trainer-btn trainer-btn-primary"
                          onClick={() => handleViewInscrits(formationWithInscrits)}
                        >
                          <Eye size={16} /> Inscrits ({inscrits.length})
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
                        >
                          <Calendar size={16} /> Session
                        </button>
                        <button
                          className="trainer-btn trainer-btn-danger"
                          onClick={() => handleDeleteFormation(training.id)}
                        >
                          <Trash2 size={16} /> Supprimer
                        </button>
                      </div>
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
                    type="date"
                    value={fullTrainingFormData.startDate}
                    onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="trainer-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="trainer-form-hint">Sélectionnez la date de début de la formation</p>
                </div>

                <div className="trainer-form-group">
                  <label className="trainer-form-label">Date de fin</label>
                  <input
                    type="date"
                    value={fullTrainingFormData.endDate}
                    onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="trainer-input"
                    min={fullTrainingFormData.startDate || new Date().toISOString().split('T')[0]}
                  />
                  <p className="trainer-form-hint">Sélectionnez la date de fin de la formation</p>
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

              <div className="trainer-form-group">
                <label className="trainer-form-label">Description de la formation</label>
                <textarea
                  value={fullTrainingFormData.description || ''}
                  onChange={(e) => setFullTrainingFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez la formation, son contenu, ses objectifs généraux. Cette description sera visible dans le catalogue."
                  className="trainer-textarea"
                  rows={4}
                />
                <p className="trainer-form-hint">Description générale de la formation (visible dans le catalogue)</p>
              </div>

              {/* Image d'aperçu */}
              <div className="trainer-form-group">
                <label className="trainer-form-label">Image d'aperçu de la formation</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Prévisualisation de l'image */}
                  {(imagePreview || fullTrainingFormData.imageUrl) && (
                    <div style={{ 
                      width: '100%', 
                      maxWidth: '400px', 
                      height: '250px', 
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid #e0e0e0',
                      backgroundColor: '#f5f5f5'
                    }}>
                      <img 
                        src={imagePreview || fullTrainingFormData.imageUrl} 
                        alt="Aperçu" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Option 1: Upload de fichier */}
                  <div>
                    <label 
                      htmlFor="image-upload" 
                      className="trainer-btn trainer-btn-secondary"
                      style={{ 
                        display: 'inline-block', 
                        cursor: 'pointer',
                        padding: '10px 20px',
                        textAlign: 'center'
                      }}
                    >
                      📁 {fullTrainingFormData.imageUrl ? 'Modifier l\'image' : 'Choisir une image'}
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Vérifier la taille du fichier (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            setToast({ message: 'L\'image est trop volumineuse (max 5MB)', type: 'error' });
                            return;
                          }
                          
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64String = reader.result;
                            setFullTrainingFormData(prev => ({ ...prev, imageUrl: base64String }));
                            setImagePreview(base64String);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  {/* Option 2: Saisir une URL */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#666', fontSize: '14px' }}>OU</span>
                  </div>
                  
                  <input
                    type="text"
                    value={fullTrainingFormData.imageUrl && !fullTrainingFormData.imageUrl.startsWith('data:') 
                      ? fullTrainingFormData.imageUrl 
                      : ''}
                    onChange={(e) => {
                      const url = e.target.value;
                      setFullTrainingFormData(prev => ({ ...prev, imageUrl: url }));
                      if (url && !url.startsWith('data:')) {
                        setImagePreview(url);
                      }
                    }}
                    className="trainer-input"
                    placeholder="Coller une URL d'image (ex: https://example.com/image.jpg)"
                  />

                  {/* Bouton pour supprimer l'image */}
                  {(imagePreview || fullTrainingFormData.imageUrl) && (
                    <button
                      type="button"
                      className="trainer-btn"
                      style={{ 
                        backgroundColor: '#dc3545', 
                        color: 'white',
                        maxWidth: '200px'
                      }}
                      onClick={() => {
                        setFullTrainingFormData(prev => ({ ...prev, imageUrl: '' }));
                        setImagePreview(null);
                      }}
                    >
                      <X size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Supprimer l'image
                    </button>
                  )}
                </div>
                <p className="trainer-form-hint">Ajoutez une image d'aperçu pour votre formation. Vous pouvez uploader un fichier (max 5MB) ou saisir une URL d'image.</p>
              </div>

              {/* 1. OBJECTIFS */}
              <h3 className="trainer-section-title" style={{ marginTop: '24px', marginBottom: '16px' }}>Objectifs pédagogiques</h3>
              <p className="trainer-form-hint" style={{ marginTop: '-12px', marginBottom: '12px' }}>
                Définissez les objectifs d'apprentissage que les participants atteindront à la fin de la formation
              </p>
              <div className="trainer-form-group">
                {fullTrainingFormData.objectifs.length === 0 && (
                  <p className="trainer-form-hint" style={{ fontStyle: 'italic', color: '#999', marginBottom: '12px' }}>
                    Aucun objectif ajouté. Cliquez sur "Ajouter" après avoir saisi un objectif.
                  </p>
                )}
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
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (editingObjective.trim()) {
                          setFullTrainingFormData(prev => ({ ...prev, objectifs: [...prev.objectifs, editingObjective.trim()] }));
                          setEditingObjective('');
                        }
                      }
                    }}
                  />
                  <button 
                    type="button"
                    className="trainer-btn trainer-btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const trimmedValue = editingObjective.trim();
                      console.log('🔘 Bouton Ajouter objectif cliqué');
                      console.log('📝 Valeur editingObjective:', editingObjective);
                      console.log('📝 Valeur trimmed:', trimmedValue);
                      console.log('📋 fullTrainingFormData.objectifs avant:', fullTrainingFormData.objectifs);
                      
                      if (trimmedValue) {
                        setFullTrainingFormData(prev => {
                          const newObjectifs = Array.isArray(prev.objectifs) 
                            ? [...prev.objectifs, trimmedValue]
                            : [trimmedValue];
                          console.log('✅ Nouveaux objectifs:', newObjectifs);
                          return { ...prev, objectifs: newObjectifs };
                        });
                        setEditingObjective('');
                      } else {
                        console.warn('⚠️ editingObjective est vide ou ne contient que des espaces');
                        setToast({ message: 'Veuillez saisir un objectif avant de cliquer sur Ajouter', type: 'warning' });
                      }
                    }}
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              {/* 2. PROGRAMME */}
              <h3 className="trainer-section-title" style={{ marginTop: '24px', marginBottom: '16px' }}>Programme détaillé</h3>
              <p className="trainer-form-hint" style={{ marginTop: '-12px', marginBottom: '12px' }}>
                Ajoutez les modules du programme un par un. Chaque élément sera affiché comme un module distinct.
              </p>
              <div className="trainer-form-group">
                {fullTrainingFormData.programme.length === 0 && (
                  <p className="trainer-form-hint" style={{ fontStyle: 'italic', color: '#999', marginBottom: '12px' }}>
                    Aucun module de programme ajouté. Cliquez sur "Ajouter" après avoir saisi un module.
                  </p>
                )}
                <div className="trainer-prerequis-list">
                  {fullTrainingFormData.programme.map((prog, index) => (
                    <div key={index} className="trainer-list-item">
                      <span>{prog}</span>
                      <button 
                        className="trainer-remove-btn"
                        onClick={() => setFullTrainingFormData(prev => ({
                          ...prev,
                          programme: prev.programme.filter((_, i) => i !== index)
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
                    value={editingProgramme}
                    onChange={(e) => setEditingProgramme(e.target.value)}
                    placeholder="Ajouter un module (ex: Module 1 : Introduction - 2h)"
                    className="trainer-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (editingProgramme.trim()) {
                          setFullTrainingFormData(prev => ({ ...prev, programme: [...prev.programme, editingProgramme.trim()] }));
                          setEditingProgramme('');
                        }
                      }
                    }}
                  />
                  <button 
                    type="button"
                    className="trainer-btn trainer-btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const trimmedValue = editingProgramme.trim();
                      console.log('🔘 Bouton Ajouter programme cliqué');
                      console.log('📝 Valeur editingProgramme:', editingProgramme);
                      console.log('📝 Valeur trimmed:', trimmedValue);
                      console.log('📋 fullTrainingFormData.programme avant:', fullTrainingFormData.programme);
                      
                      if (trimmedValue) {
                        setFullTrainingFormData(prev => {
                          const newProgramme = Array.isArray(prev.programme) 
                            ? [...prev.programme, trimmedValue]
                            : [trimmedValue];
                          console.log('✅ Nouveau programme:', newProgramme);
                          return { ...prev, programme: newProgramme };
                        });
                        setEditingProgramme('');
                      } else {
                        console.warn('⚠️ editingProgramme est vide ou ne contient que des espaces');
                        setToast({ message: 'Veuillez saisir un module avant de cliquer sur Ajouter', type: 'warning' });
                      }
                    }}
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              {/* 3. PRÉREQUIS */}
              <h3 className="trainer-section-title" style={{ marginTop: '24px', marginBottom: '16px' }}>Prérequis</h3>
              <p className="trainer-form-hint" style={{ marginTop: '-12px', marginBottom: '12px' }}>
                Liste les compétences ou connaissances nécessaires pour suivre cette formation
              </p>
              <div className="trainer-form-group">
                {fullTrainingFormData.prerequis.length === 0 && (
                  <p className="trainer-form-hint" style={{ fontStyle: 'italic', color: '#999', marginBottom: '12px' }}>
                    Aucun prérequis ajouté. Cliquez sur "Ajouter" après avoir saisi un prérequis.
                  </p>
                )}
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
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (editingPrerequis.trim()) {
                          setFullTrainingFormData(prev => ({ ...prev, prerequis: [...prev.prerequis, editingPrerequis.trim()] }));
                          setEditingPrerequis('');
                        }
                      }
                    }}
                  />
                  <button 
                    type="button"
                    className="trainer-btn trainer-btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const trimmedValue = editingPrerequis.trim();
                      console.log('🔘 Bouton Ajouter prérequis cliqué');
                      console.log('📝 Valeur editingPrerequis:', editingPrerequis);
                      console.log('📝 Valeur trimmed:', trimmedValue);
                      console.log('📋 fullTrainingFormData.prerequis avant:', fullTrainingFormData.prerequis);
                      
                      if (trimmedValue) {
                        setFullTrainingFormData(prev => {
                          const newPrerequis = Array.isArray(prev.prerequis) 
                            ? [...prev.prerequis, trimmedValue]
                            : [trimmedValue];
                          console.log('✅ Nouveaux prérequis:', newPrerequis);
                          return { ...prev, prerequis: newPrerequis };
                        });
                        setEditingPrerequis('');
                      } else {
                        console.warn('⚠️ editingPrerequis est vide ou ne contient que des espaces');
                        setToast({ message: 'Veuillez saisir un prérequis avant de cliquer sur Ajouter', type: 'warning' });
                      }
                    }}
                  >
                    Ajouter
                  </button>
                </div>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="trainer-form-group">
                  <label className="trainer-form-label">Date de début *</label>
                  <input
                    type="date"
                    value={sessionFormData.startDate}
                    onChange={(e) => setSessionFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="trainer-input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <p className="trainer-form-hint">Sélectionnez la date de début</p>
                </div>

                <div className="trainer-form-group">
                  <label className="trainer-form-label">Date de fin *</label>
                  <input
                    type="date"
                    value={sessionFormData.endDate}
                    onChange={(e) => setSessionFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="trainer-input"
                    min={sessionFormData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                  <p className="trainer-form-hint">Sélectionnez la date de fin</p>
                </div>
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

