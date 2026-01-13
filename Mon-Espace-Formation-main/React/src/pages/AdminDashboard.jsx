import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { 
  Users, Euro, Calendar, FileText, Download, 
  Plus, UserPlus, ArrowRight, TrendingUp, X
} from 'lucide-react';
import Toast from '../components/Toast';
import './AdminDashboard.css';

/**
 * Page principale du dashboard d'administration
 * Affiche les statistiques globales et un aperçu des données
 */
const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [trainingFormData, setTrainingFormData] = useState({
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les statistiques globales
        const summaryRes = await fetch('http://localhost:8080/api/dashboard/summary');
        if (!summaryRes.ok) throw new Error('Erreur lors du chargement des statistiques');
        const summaryData = await summaryRes.json();
        setSummary(summaryData);

        // Récupérer les inscriptions récentes
        const inscriptionsRes = await fetch('http://localhost:8080/api/inscriptions');
        if (!inscriptionsRes.ok) throw new Error('Erreur lors du chargement des inscriptions');
        const inscriptionsData = await inscriptionsRes.json();
        // Trier par date et prendre les 4 plus récentes
        const sorted = inscriptionsData
          .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
          .slice(0, 4);
        setInscriptions(sorted);

        // Récupérer les sessions pour les catégories
        const sessionsRes = await fetch('http://localhost:8080/api/sessions');
        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          setSessions(sessionsData);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gérer l'ouverture du modal de formation
  const handleOpenTrainingModal = (training = null) => {
    if (training) {
      // Mode édition
      setEditingTrainingId(training.id);
      setTrainingFormData({
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
      setTrainingFormData({
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
    setShowTrainingModal(true);
  };

  // Gérer la fermeture du modal
  const handleCloseTrainingModal = () => {
    setShowTrainingModal(false);
    setEditingTrainingId(null);
    setTrainingFormData({
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
  const handleTrainingInputChange = (e) => {
    const { name, value } = e.target;
    setTrainingFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire de formation
  const handleTrainingSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!trainingFormData.title || !trainingFormData.duration || !trainingFormData.location || !trainingFormData.price) {
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
          ...trainingFormData,
          price: trainingFormData.price ? parseFloat(trainingFormData.price) : null,
          startDate: '',
          endDate: '',
          sessionRef: ''
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
      handleCloseTrainingModal();
    } catch (err) {
      console.error('Erreur:', err);
      setToast({ message: err.message || 'Erreur lors de la sauvegarde de la formation', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculer le CA total (somme des montants des inscriptions)
  const calculateRevenue = () => {
    // Pour l'instant, on ne peut pas calculer le CA car les inscriptions n'ont pas de montant dans le DTO
    // On retourne 0 ou on peut le calculer côté backend si nécessaire
    return 0;
  };

  // Calculer la répartition par catégorie
  const getCategoryBreakdown = () => {
    const categoryMap = {};
    
    inscriptions.forEach(insc => {
      // Trouver la session correspondante par titre de formation
      const session = sessions.find(s => s.title === insc.trainingTitle);
      const category = session?.category || 'Autre';
      
      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, revenue: 0 };
      }
      categoryMap[category].count++;
      // Revenue basé sur le prix de la session si disponible
      if (session?.price) {
        categoryMap[category].revenue += session.price;
      }
    });

    const total = inscriptions.length || 1;
    return Object.entries(categoryMap).map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
      percentage: Math.round((data.count / total) * 100 * 10) / 10
    }));
  };

  // Générer les initiales pour l'avatar
  const getInitials = (name) => {
    if (!name) return '??';
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

  // Formater le prix
  const formatPrice = (price) => {
    if (!price) return '0 €';
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
          <p>Chargement des données...</p>
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

  const categoryBreakdown = getCategoryBreakdown();
  const totalRevenue = calculateRevenue();

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        {/* 4 Cartes KPI en haut */}
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">
              <Users size={24} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value">{summary?.totalInscriptions || 0}</div>
              <div className="admin-kpi-label">Inscriptions en cours</div>
              <div className="admin-kpi-trend positive">
                <TrendingUp size={14} />
                <span>En attente</span>
              </div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">
              <Euro size={24} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value">{formatPrice(totalRevenue)}</div>
              <div className="admin-kpi-label">CA Trimestre</div>
              <div className="admin-kpi-trend positive">
                <TrendingUp size={14} />
                <span>En attente</span>
              </div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">
              <Calendar size={24} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value">{summary?.totalSessions || 0}</div>
              <div className="admin-kpi-label">Prochaines sessions</div>
              <div className="admin-kpi-detail">En attente</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon">
              <FileText size={24} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value">{summary?.totalUsers || 0}</div>
              <div className="admin-kpi-label">Attestations 2024</div>
              <div className="admin-kpi-trend positive">
                <TrendingUp size={14} />
                <span>En attente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section principale : Stats à gauche, Actions à droite */}
        <div className="admin-main-section">
          {/* Section gauche : Statistiques */}
          <div className="admin-stats-section">
            {/* Statistiques Trimestrielles */}
            <div className="admin-stats-card">
              <div className="admin-stats-header">
                <div>
                  <h3 className="admin-stats-title">Statistiques Trimestrielles</h3>
                  <p className="admin-stats-subtitle">T4 2025 (Oct - Nov - Déc)</p>
                </div>
                <button className="admin-export-btn">
                  <Download size={16} />
                  Exporter
                </button>
              </div>

              <div className="admin-stats-grid-small">
                <div className="admin-stat-item">
                  <div className="admin-stat-item-label">Total Inscriptions</div>
                  <div className="admin-stat-item-value">{summary?.totalInscriptions || 0}</div>
                  <div className="admin-stat-item-detail">En attente</div>
                </div>
                <div className="admin-stat-item">
                  <div className="admin-stat-item-label">Revenu Total</div>
                  <div className="admin-stat-item-value">{formatPrice(totalRevenue)}</div>
                  <div className="admin-stat-item-detail">En attente</div>
                </div>
                <div className="admin-stat-item">
                  <div className="admin-stat-item-label">Taux de présence moyen</div>
                  <div className="admin-stat-item-value">En attente</div>
                  <div className="admin-stat-item-detail">En attente</div>
                </div>
              </div>

              {/* Répartition par catégorie */}
              <div className="admin-category-section">
                <h4 className="admin-section-title">Répartition par catégorie</h4>
                {categoryBreakdown.length > 0 ? (
                  <div className="admin-category-list">
                    {categoryBreakdown.map((cat, index) => (
                      <div key={index} className="admin-category-item">
                        <div className="admin-category-header">
                          <span className="admin-category-name">{cat.name}</span>
                          <span className="admin-category-stats">
                            {cat.count} inscriptions, {formatPrice(cat.revenue)}, {cat.percentage}%
                          </span>
                        </div>
                        <div className="admin-category-bar">
                          <div 
                            className="admin-category-bar-fill"
                            style={{ width: `${cat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="admin-empty-text">Aucune catégorie disponible</p>
                )}
              </div>
            </div>
          </div>

          {/* Section droite : Actions Rapides */}
          <div className="admin-actions-section">
            <div className="admin-actions-card">
              <h3 className="admin-section-title">Actions Rapides</h3>
              <div className="admin-actions-list">
                <button 
                  className="admin-action-btn primary"
                  onClick={() => navigate('/admin/sessions')}
                >
                  <Calendar size={20} />
                  <span>Créer une session</span>
                </button>
                <button className="admin-action-btn" onClick={handleOpenTrainingModal}>
                  <FileText size={20} />
                  <span>Nouvelle formation</span>
                </button>
                <button 
                  className="admin-action-btn"
                  onClick={() => navigate('/admin/formateurs')}
                >
                  <UserPlus size={20} />
                  <span>Ajouter un formateur</span>
                </button>
                <button className="admin-action-btn">
                  <Download size={20} />
                  <span>Export trimestre</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Inscriptions Récentes */}
        <div className="admin-recent-section">
          <div className="admin-recent-card">
            <div className="admin-recent-header">
              <div>
                <h3 className="admin-section-title">Inscriptions récentes</h3>
                <p className="admin-section-subtitle">Dernières inscriptions validées</p>
              </div>
              <Link to="/admin/inscriptions" className="admin-see-all-btn">
                Voir tout <ArrowRight size={16} />
              </Link>
            </div>

            {inscriptions.length > 0 ? (
              <div className="admin-recent-list">
                {inscriptions.map((insc) => (
                  <div key={insc.id} className="admin-recent-item">
                    <div className="admin-recent-avatar">
                      {getInitials(insc.userName)}
                    </div>
                    <div className="admin-recent-info">
                      <div className="admin-recent-name">{insc.userName || 'N/A'}</div>
                      <div className="admin-recent-id">{insc.id}</div>
                      <div className="admin-recent-email">{insc.userEmail || 'N/A'}</div>
                    </div>
                    <div className="admin-recent-training">
                      <div className="admin-recent-training-title">{insc.trainingTitle || 'N/A'}</div>
                      <div className="admin-recent-session">Session: {insc.sessionDate || 'N/A'}</div>
                    </div>
                    <div className="admin-recent-price">
                      {(() => {
                        const session = sessions.find(s => s.title === insc.trainingTitle);
                        return formatPrice(session?.price || 0);
                      })()}
                    </div>
                    <div className="admin-recent-status">
                      <span className="admin-status-badge paid">{insc.status || 'N/A'}</span>
                    </div>
                    <div className="admin-recent-date">{formatDate(insc.registrationDate)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty-state">
                <p>Aucune inscription récente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de création de formation */}
      {showTrainingModal && (
        <div className="modal-overlay" onClick={handleCloseTrainingModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Nouvelle formation</h3>
              <button className="modal-close" onClick={handleCloseTrainingModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleTrainingSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Titre de la formation *</label>
                <input
                  type="text"
                  name="title"
                  value={trainingFormData.title}
                  onChange={handleTrainingInputChange}
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
                  value={trainingFormData.duration}
                  onChange={handleTrainingInputChange}
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
                  value={trainingFormData.location}
                  onChange={handleTrainingInputChange}
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
                  value={trainingFormData.price}
                  onChange={handleTrainingInputChange}
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
                  value={trainingFormData.trainerName}
                  onChange={handleTrainingInputChange}
                  className="form-input"
                  placeholder="Ex: Jean-Pierre Martin"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rôle/Expertise du formateur</label>
                <input
                  type="text"
                  name="trainerRole"
                  value={trainingFormData.trainerRole}
                  onChange={handleTrainingInputChange}
                  className="form-input"
                  placeholder="Ex: Expert React & TypeScript"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email du formateur</label>
                <input
                  type="email"
                  name="trainerEmail"
                  value={trainingFormData.trainerEmail}
                  onChange={handleTrainingInputChange}
                  className="form-input"
                  placeholder="exemple@email.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Statut</label>
                <select
                  name="status"
                  value={trainingFormData.status}
                  onChange={handleTrainingInputChange}
                  className="form-input"
                >
                  <option value="A Venir">A Venir</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseTrainingModal}>
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

export default AdminDashboard;
