import React, { useState, useEffect } from 'react';
import './Inscription.css';
import { 
    ChevronLeft, Calendar, MapPin, Users, ArrowRight, Check, AlertCircle, 
    User, BookOpen, CreditCard, ShieldCheck 
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const InscriptionPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // --- ÉTATS ---
  const [step, setStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
      typeInscription: 'individuel',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      cp: '',
      ville: '',
      entreprise: '', 
      poste: ''
  });

  useEffect(() => {
    // 1. Vérif connexion
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        navigate('/connexion');
        return;
    }

    const currentUser = JSON.parse(storedUser);
    setFormData(prev => ({
        ...prev,
        nom: currentUser.nom || '',
        prenom: currentUser.prenom || '',
        email: currentUser.email || ''
    }));

    setIsLoading(true);
    fetch('http://localhost:8080/api/sessions')
        .then(res => res.json())
        .then(data => {
            setSessions(data);
            setIsLoading(false);
        })
        .catch(err => {
            console.error("Erreur chargement sessions", err);
            setIsLoading(false);
        });
  }, [navigate]);

  const handleInputChange = (e) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: type === 'radio' ? (e.target.checked ? value : prev[name]) : value
      }));
  };

  // --- FONCTION DE PAIEMENT MODIFIÉE ---
  const handlePayment = async () => {
    if (!selectedSession) return;

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        alert("Session expirée. Reconnectez-vous.");
        navigate('/connexion');
        return;
    }
    const currentUser = JSON.parse(storedUser);

    // On cherche l'ID partout
    const realUserId = currentUser.id || currentUser._id || currentUser.userId;

    if (!realUserId) {
        alert("ERREUR : Impossible de trouver votre ID utilisateur. Essayez de vous déconnecter et reconnecter.");
        return;
    }

    const dataToSend = {
        userId: realUserId,
        formationId: id ? String(id) : "1", 
        sessionId: selectedSession,
        status: "VALIDÉ",
        participant: { ...formData },
        amount: 2490.0
    };

    try {
        const response = await fetch('http://localhost:8080/api/inscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
            // === C'EST ICI QUE TOUT CHANGE ===
            
            // 1. On retrouve les infos de la session pour l'affichage
            const sessionDetails = sessions.find(s => s.id === selectedSession);
            
            // 2. On génère un numéro de commande bidon
            const refCommande = "INS-" + Date.now().toString().slice(-8);

            // 3. On redirige vers la page de succès avec les données
            navigate('/succes-inscription', {
                state: {
                    course: {
                        id: id,
                        // On essaie de prendre le titre de la session, sinon "Formation"
                        title: sessionDetails.title || "Formation Complète", 
                        price: "2490€",
                        dates: sessionDetails.dates,
                        lieu: sessionDetails.lieu,
                        duration: sessionDetails.duration || "5 jours",
                        category: "Formation"
                    },
                    user: {
                        nom: formData.nom,
                        prenom: formData.prenom,
                        email: formData.email,
                        entreprise: formData.entreprise
                    },
                    reference: refCommande
                }
            });

        } else {
            const msg = await response.text();
            alert("❌ Erreur serveur : " + msg);
        }
    } catch (error) {
        console.error("Erreur connexion:", error);
        alert("❌ Erreur de connexion au serveur.");
    }
  };

  // --- RENDU (TON DESIGN EXACT) ---
  const renderStep1 = () => (
    <div className="bg-white p-4 rounded border mb-4">
        <h5 className="mb-3 fw-bold text-dark">Choisissez une session</h5>
        <p className="text-muted mb-4 small">Sélectionnez la session qui vous convient (Places en temps réel)</p>
        {isLoading ? (
            <div className="text-center py-4 text-muted">Chargement...</div>
        ) : sessions.length === 0 ? (
            <div className="alert alert-warning">Aucune session disponible.</div>
        ) : (
            sessions.map((session) => {
                const placesRestantes = session.placesTotales - (session.placesReservees || 0);
                const isFull = placesRestantes <= 0;
                let status = "Disponible"; let color = "green";
                if (isFull) { status = "Complet"; color = "red"; } 
                else if (placesRestantes <= 2) { status = "Bientôt Complet"; color = "yellow"; }

                return (
                    <div key={session.id}
                        className={`session-card ${selectedSession === session.id ? 'selected' : ''} ${isFull ? 'disabled-card' : ''}`}
                        onClick={() => !isFull && setSelectedSession(session.id)}
                        style={{ opacity: isFull ? 0.6 : 1, cursor: isFull ? 'not-allowed' : 'pointer' }}
                    >
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-2 fw-semibold text-dark">
                                <Calendar size={18} className="text-muted"/> {session.dates}
                            </div>
                            <div className="d-flex gap-4 small text-muted">
                                <span className="d-flex align-items-center gap-1"><MapPin size={14}/> {session.lieu}</span>
                                <span className="d-flex align-items-center gap-1"><Users size={14}/> {isFull ? "Complet" : `${placesRestantes} places`}</span>
                            </div>
                        </div>
                        <span className={`session-badge badge-${color}`}>{selectedSession === session.id ? <Check size={14}/> : null} {status}</span>
                    </div>
                );
            })
        )}
        <button className="btn-continue" disabled={!selectedSession} onClick={() => setStep(2)}>Continuer <ArrowRight size={18} /></button>
    </div>
  );

  const renderStep2 = () => {
    const isFormValid = formData.nom && formData.prenom && formData.email && formData.telephone;
    return (
        <div className="bg-white p-4 rounded border mb-4">
            <h5 className="form-section-title">Vos informations</h5>
            <div className="mb-4">
                <label className="form-label">Type d'inscription</label>
                <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="typeInscription" value="individuel" checked={formData.typeInscription === 'individuel'} onChange={handleInputChange} /> Individuelle</label>
                    <label className="radio-label"><input type="radio" name="typeInscription" value="entreprise" checked={formData.typeInscription === 'entreprise'} onChange={handleInputChange} /> Entreprise</label>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6"><label className="form-label">Nom *</label><input type="text" name="nom" className="form-control-custom" value={formData.nom} onChange={handleInputChange} required /></div>
                <div className="col-md-6"><label className="form-label">Prénom *</label><input type="text" name="prenom" className="form-control-custom" value={formData.prenom} onChange={handleInputChange} required /></div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6"><label className="form-label">Email *</label><input type="email" name="email" className="form-control-custom" value={formData.email} onChange={handleInputChange} required /></div>
                <div className="col-md-6"><label className="form-label">Téléphone *</label><input type="tel" name="telephone" className="form-control-custom" value={formData.telephone} onChange={handleInputChange} required /></div>
            </div>
            {formData.typeInscription === 'entreprise' && (
                <div className="row mb-3">
                     <div className="col-md-6"><label className="form-label">Entreprise</label><input type="text" name="entreprise" className="form-control-custom" value={formData.entreprise} onChange={handleInputChange} /></div>
                     <div className="col-md-6"><label className="form-label">Poste</label><input type="text" name="poste" className="form-control-custom" value={formData.poste} onChange={handleInputChange} /></div>
                </div>
            )}
            <div className="mb-3"><label className="form-label">Adresse</label><input type="text" name="adresse" className="form-control-custom" value={formData.adresse} onChange={handleInputChange} /></div>
            <div className="row mb-4">
                <div className="col-md-6"><label className="form-label">Code Postal</label><input type="text" name="cp" className="form-control-custom" value={formData.cp} onChange={handleInputChange} /></div>
                <div className="col-md-6"><label className="form-label">Ville</label><input type="text" name="ville" className="form-control-custom" value={formData.ville} onChange={handleInputChange} /></div>
            </div>
            <div className="action-buttons">
                <button className="btn-back" onClick={() => setStep(1)}><ChevronLeft size={16} /> Annuler</button>
                <button className="btn-continue w-auto px-5" disabled={!isFormValid} onClick={() => setStep(3)}>Continuer <ArrowRight size={18} /></button>
            </div>
        </div>
    );
  };

  const renderStep3 = () => {
    const sessionDetails = sessions.find(s => s.id === selectedSession);
    return (
        <div className="bg-white p-4 rounded border mb-4">
            <h5 className="form-section-title">Récapitulatif</h5>
            <div className="recap-section-title"><User size={18}/> Participant</div>
            <div className="recap-box">
                <div className="recap-row"><strong>Nom :</strong> {formData.nom} {formData.prenom}</div>
                <div className="recap-row"><strong>Email :</strong> {formData.email}</div>
            </div>
            <div className="recap-section-title"><Calendar size={18}/> Session</div>
            <div className="recap-box">
                {sessionDetails ? (
                    <>
                        <div className="recap-row"><strong>Date :</strong> {sessionDetails.dates}</div>
                        <div className="recap-row"><strong>Lieu :</strong> {sessionDetails.lieu}</div>
                    </>
                ) : <div className="text-danger">Erreur session</div>}
            </div>
            <div className="payment-block">
                <div className="payment-title"><CreditCard size={20}/> Paiement sécurisé</div>
                <button className="btn-pay" onClick={handlePayment}>Payer 2490€</button>
                <button className="btn-modify-outline" onClick={() => setStep(2)}><ChevronLeft size={14}/> Modifier</button>
            </div>
        </div>
    );
  };

  return (
    <div className="inscription-wrapper">
      <div className="inscription-header">
        <div className="container">
          <Link to="/formations" className="back-link"><ChevronLeft size={16} /> Retour</Link>
          <h1 className="inscription-title">Inscription à la formation</h1>
        </div>
      </div>
      <div className="steps-bar">
        <div className="steps-container">
            <div className={`step-item ${step >= 1 ? 'active' : ''}`}><span className="step-number">1</span> Session</div>
            <div className={`step-item ${step >= 2 ? 'active' : ''}`}><span className="step-number">2</span> Infos</div>
            <div className={`step-item ${step >= 3 ? 'active' : ''}`}><span className="step-number">3</span> Paiement</div>
        </div>
      </div>
      <div className="container">
        <div className="row">
            <div className="col-lg-8">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>
            <div className="col-lg-4">
                <div className="summary-card">
                    <div className="summary-header">Résumé</div>
                    <div className="summary-body">
                        <div className="small text-primary fw-bold mb-1">Total TTC</div>
                        <div className="fw-semibold mb-4">2490€</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionPage;