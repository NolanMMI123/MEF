import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Calendar, Clock, MapPin, Download, FileText, CheckCircle, Mail, AlertCircle, BookOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Animation de la barre (état)
  const [progressWidth, setProgressWidth] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Récupération user
    const userEmail = localStorage.getItem('userEmail') || (JSON.parse(localStorage.getItem('user'))?.email);

    if (!userEmail) { 
        navigate('/connexion'); 
        return; 
    }

    // Appel Back-end
    fetch(`http://localhost:8080/api/dashboard/${userEmail}`)
      .then((res) => {
          if(!res.ok) throw new Error("Erreur serveur");
          return res.json();
      })
      .then((dashboardData) => { 
          console.log("Données reçues :", dashboardData);
          setData(dashboardData);
          setLoading(false);
          
          setTimeout(() => {
              if(dashboardData.currentTraining || (dashboardData.inscriptions && dashboardData.inscriptions.length > 0)) {
                  setProgressWidth(10); 
              }
          }, 500);
      })
      .catch((err) => { 
          console.error(err); 
          setLoading(false); 
      });
  }, [navigate]);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!data) return <div className="text-center mt-5">Erreur de chargement des données.</div>;

  const { user, stats } = data;
  
  // --- LOGIQUE LISTE (Sans toucher au design) ---
  // On gère les deux cas : soit le back envoie une liste 'inscriptions', soit un seul 'currentTraining'
  let trainingsList = [];
  if (data.inscriptions && Array.isArray(data.inscriptions)) {
      trainingsList = data.inscriptions;
  } else if (data.currentTraining) {
      trainingsList = [data.currentTraining];
  }

  const hasTraining = trainingsList.length > 0;
  // Pour l'alerte, on prend juste la première formation pour ne pas casser le design du haut
  const firstTraining = hasTraining ? trainingsList[0] : null;

  return (
    <div className="dashboard-wrapper">
      
      {/* HEADER BLEU (Intact) */}
      <div className="dashboard-header animate-enter delay-1">
        <div className="container d-flex align-items-center gap-3">
            <div className="avatar-circle">
                {user.prenom ? user.prenom.charAt(0).toUpperCase() : "U"}
                {user.nom ? user.nom.charAt(0).toUpperCase() : "N"}
            </div>
            <div>
                <h1>Bonjour {user.prenom} {user.nom}</h1>
                <p className="subtitle">
                    {user.entreprise || "Entreprise non renseignée"} • {user.poste || "Poste non renseigné"}
                </p>
            </div>
        </div>
      </div>

      <div className="container">
        
        {/* ALERTE (Design conservé : une seule alerte en haut) */}
        {hasTraining && firstTraining && (
            <div className="card-custom p-3 mb-4 d-flex align-items-center gap-3 animate-enter delay-2" style={{background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e'}}>
                <AlertCircle size={20} />
                <div>
                    <strong>Formation à venir</strong>
                    <div className="small">
                        Votre formation "{firstTraining.title}" commence le {firstTraining.dates || "bientôt"}.
                    </div>
                </div>
            </div>
        )}

        <div className="row g-4">
            
            {/* === COLONNE GAUCHE === */}
            <div className="col-lg-8 animate-enter delay-3">

                {hasTraining ? (
                    // On utilise map pour afficher TOUTES les formations
                    trainingsList.map((training, index) => (
                        // React.Fragment est invisible dans le HTML final => Design préservé à 100%
                        <React.Fragment key={training.id || index}>
                            
                            {/* CARTE PRINCIPALE (Ton code exact) */}
                            <div className="card-custom mb-5">
                                <div className="card-header-blue">
                                    <div>
                                        <h2>{training.title}</h2>
                                        <span className="ref-text">
                                            Réf: {training.id ? training.id.substring(0,8).toUpperCase() : "DOSSIER"}
                                        </span>
                                    </div>
                                    <span className="badge-gold">Inscrit</span>
                                </div>

                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="d-flex gap-3 mb-3">
                                                <Calendar className="text-muted" size={20}/>
                                                <div>
                                                    <div className="small text-muted fw-bold">Dates de formation</div>
                                                    <div className="fw-semibold">{training.dates || "À confirmer"}</div>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-3 mb-3">
                                                <Clock className="text-muted" size={20}/>
                                                <div>
                                                    <div className="small text-muted fw-bold">Horaires</div>
                                                    <div className="fw-semibold">9h00 - 17h00</div>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-3">
                                                <MapPin className="text-muted" size={20}/>
                                                <div>
                                                    <div className="small text-muted fw-bold">Lieu</div>
                                                    <div className="fw-semibold">{training.lieu || "Distanciel"}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-5">
                                            <div className="text-center p-4 border rounded bg-white shadow-sm" style={{border: '1px solid #fbbf24'}}>
                                                <div className="small text-muted mb-1">Formation dans</div>
                                                <div className="display-4 fw-bold text-primary">--</div> 
                                                <div className="fw-bold text-primary">Jours</div>
                                                <hr className="my-2"/>
                                                <div className="small text-muted">Début le {training.dates ? training.dates.split(' ')[0] : "..."}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Formateur */}
                                    <div className="trainer-box">
                                        <div className="trainer-avatar">EX</div>
                                        <div className="flex-grow-1">
                                            <div className="trainer-label">Votre formateur</div>
                                            <h5 className="trainer-name">Expert TXLForma</h5>
                                            <div className="trainer-role">Formateur Certifié</div>
                                            <div className="trainer-email">
                                                <Mail size={14}/> contact@txlforma.fr
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progression */}
                                    <div className="progress-section">
                                        <div className="progress-header">
                                            <span>Progression</span>
                                            <span>0 / {training.time || "5 Jours"}</span>
                                        </div>
                                        <div className="progress-track">
                                            <div className="progress-fill" style={{width: `${progressWidth}%`}}></div>
                                        </div>
                                        <div className="progress-footer">
                                            <span>0h effectuées</span>
                                            <span>Taux de présence : 0%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DOCUMENTS (Ton code exact, répété pour chaque formation) */}
                            <div className="animate-enter delay-4">
                                <div className="tabs-container">
                                    <button className="tab-btn active">
                                        <FileText size={16} className="me-2 mb-1"/>Documents de formation
                                    </button>
                                    <button className="tab-btn">
                                        <CheckCircle size={16} className="me-2 mb-1"/>Émargement
                                    </button>
                                    <button className="tab-btn">
                                        <FileText size={16} className="me-2 mb-1"/>Attestation
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <h5 className="fw-bold" style={{color: '#0f2d5c', fontSize: '1.1rem'}}>Documents et ressources</h5>
                                    <p className="text-muted small">Accédez aux supports de cours et ressources pédagogiques</p>
                                </div>

                                <div className="resource-list">
                                    <div className="resource-item">
                                        <div className="resource-icon blue"><FileText size={24}/></div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-bold">Programme détaillé</h6>
                                            <div className="d-flex align-items-center gap-2 mt-1">
                                                <span className="badge-pill" style={{background:'#f3f4f6', border:'none'}}>Programme</span>
                                                <small className="text-muted">PDF</small>
                                            </div>
                                        </div>
                                        <button className="btn-download-yellow">
                                            <Download size={16}/> Télécharger
                                        </button>
                                    </div>
                                    
                                    <div className="resource-item">
                                        <div className="resource-icon gray"><FileText size={24}/></div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 text-muted">Supports de cours</h6>
                                            <div className="d-flex align-items-center gap-2 mt-1">
                                                <span className="badge-pill" style={{background:'#f3f4f6', border:'none'}}>Supports</span>
                                                <small className="text-muted">Bientôt</small>
                                            </div>
                                        </div>
                                        <span className="badge-soon">Bientôt disponible</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Séparateur visuel si plusieurs formations (optionnel, pour aérer) */}
                            {index < trainingsList.length - 1 && <div className="my-5 py-3 border-bottom"></div>}

                        </React.Fragment>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <BookOpen size={48} className="text-muted mb-3 opacity-50"/>
                        <h4 className="fw-bold">Aucune formation en cours</h4>
                        <p className="text-muted mb-4">Inscrivez-vous via le catalogue.</p>
                        <Link to="/formations" className="btn-catalogue text-decoration-none d-inline-block px-4 py-2">Voir le catalogue</Link>
                    </div>
                )}

            </div>

            {/* === COLONNE DROITE / SIDEBAR (Identique) === */}
            <div className="col-lg-4 animate-enter delay-4">
                
                <div className="card-custom mb-4">
                    <div className="card-body">
                        <h5 className="sidebar-title border-bottom pb-2 mb-3">Mes documents</h5>
                        {hasTraining ? (
                            <div className="doc-list">
                                <div className="doc-item">
                                    <h6 className="fw-bold">Facture acquittée</h6>
                                    <small className="text-muted d-block mb-2">FAC-{new Date().getFullYear()}-001</small>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="badge-pill gray">Facture</span>
                                        <button className="btn btn-link text-decoration-none text-muted p-0"><Download size={16}/> PDF</button>
                                    </div>
                                </div>
                            </div>
                        ) : <p className="small text-muted">Aucun document.</p>}
                    </div>
                </div>

                <div className="card-custom mb-4 p-0 overflow-hidden">
                    <div className="sidebar-header-dark">Actions Rapides</div>
                    <div className="card-body d-grid gap-2">
                        {hasTraining ? (
                            <>
                                <button className="btn-action"><Calendar size={18}/> Ajouter au calendrier</button>
                                <button className="btn-action"><MapPin size={18}/> Itinéraire</button>
                                <button className="btn-action"><Mail size={18}/> Contacter formateur</button>
                            </>
                        ) : (
                             <Link to="/formations" className="btn-action justify-content-center text-decoration-none">
                                <BookOpen size={18}/> Consulter le catalogue
                            </Link>
                        )}
                    </div>
                </div>

                <div className="card-custom mb-4">
                    <div className="card-body">
                        <h5 className="sidebar-title mb-3">Mes statistiques</h5>
                        <div className="d-flex justify-content-between py-2 border-bottom border-light">
                            <span className="small text-muted">Formations suivies</span>
                            {/* Mise à jour auto du nombre */}
                            <strong>{trainingsList.length}</strong>
                        </div>
                        <div className="d-flex justify-content-between py-2">
                            <span className="small text-muted">Heures de formation</span>
                            <strong>{stats ? stats.heuresFormation : 0}h</strong>
                        </div>
                    </div>
                </div>

                 <div className="help-box">
                    <h5 className="mb-3 text-warning-dark border-bottom border-warning pb-2 d-inline-block">Besoin d'aide ?</h5>
                    <div className="mb-3">
                        <div className="help-label">Email</div>
                        <a href="mailto:contact@txlforma.fr" className="help-link">contact@txlforma.fr</a>
                    </div>
                    <div>
                        <div className="help-label">Téléphone</div>
                        <div className="help-link">+33 1 23 45 67 89</div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;