import React, { useState, useEffect } from 'react';
import './Inscription.css';
import { 
    ChevronLeft, Calendar, MapPin, Users, ArrowRight, Check, AlertCircle, 
    User, BookOpen, CreditCard, ShieldCheck 
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

// --- 1. IMPORTS STRIPE ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Ta clé publique (Mode Test)
const stripePromise = loadStripe('pk_test_51SpFTID5WWksLHsg7do8u5HhYaEfc1LHgDHiPEYH6QNRwQdgKX43BAMmqg5qEbwpTWmzUYVUuD1f6kEDBKjd61gv00aeevginT');

// --- 2. LE COMPOSANT DU FORMULAIRE DE PAIEMENT ---
const CheckoutForm = ({ onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        // On demande à Stripe de valider le paiement
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required", // Important pour ne pas recharger la page
        });

        if (error) {
            setErrorMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Si Stripe dit "C'est bon", on lance l'inscription Backend
            onPaymentSuccess();
        } else {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {/* L'élément sécurisé de Stripe qui affiche le champ Carte Bancaire */}
            <div className="mb-3">
                <PaymentElement />
            </div>
            
            {errorMessage && <div className="alert alert-danger small mt-2">{errorMessage}</div>}
            
            <button 
                disabled={!stripe || isProcessing} 
                className="btn-pay w-100" // On garde ta classe CSS "btn-pay"
                style={{ marginTop: '1rem' }}
            >
                {isProcessing ? "Validation bancaire..." : "Payer 2490€"}
            </button>
        </form>
    );
};

// --- 3. TON COMPOSANT PRINCIPAL ---
const InscriptionPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // --- ÉTATS ---
  const [step, setStep] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour le paiement
  const [clientSecret, setClientSecret] = useState(""); 
  const [backendError, setBackendError] = useState(false); // Pour gérer l'erreur de chargement

  const [formData, setFormData] = useState({
      typeInscription: 'individuel',
      nom: '', prenom: '', email: '', telephone: '',
      adresse: '', cp: '', ville: '', entreprise: '', poste: ''
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

  // --- NOUVEAU : On prépare le paiement quand on arrive à l'étape 3 ---
  useEffect(() => {
      if (step === 3) {
          setBackendError(false); // On remet l'erreur à zéro
          
          // On demande au Backend de préparer la transaction
          fetch("http://localhost:8080/api/payment/create-intent", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: 2490 }) 
          })
          .then((res) => {
              if(!res.ok) throw new Error("Erreur Backend"); // Si le serveur répond mal
              return res.json();
          })
          .then((data) => setClientSecret(data.clientSecret))
          .catch((err) => {
              console.error("Erreur Stripe Init:", err);
              setBackendError(true); // Active le message d'erreur à l'écran
          });
      }
  }, [step]);

  const handleInputChange = (e) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: type === 'radio' ? (e.target.checked ? value : prev[name]) : value
      }));
  };

  // --- ANCIENNE FONCTION "handlePayment" RENOMMÉE EN "finaliserInscription" ---
  // Elle ne se lance que si Stripe a validé le paiement
  const finaliserInscription = async () => {
    const storedUser = localStorage.getItem('user');
    const currentUser = JSON.parse(storedUser);
    const realUserId = currentUser.id || currentUser._id || currentUser.userId;
    const sessionDetails = sessions.find(s => s.id === selectedSession);

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
            const refCommande = "INS-" + Date.now().toString().slice(-8);

            // --- EMAIL JS ---
            const templateParams = {
                order_id: refCommande,
                email: formData.email,
                orders: [
                    {
                        name: "Formation Complète", 
                        price: "2490€",
                        units: "1"
                    }
                ],
                "cost.shipping": "0€",
                "cost.tax": "0€"
            };

            emailjs.send(
                'service_aindt9t',
                'template_4ontamh',
                templateParams,
                'i7HdabS5N1pWaFesk'
            )
            .then((result) => {
                console.log('Email envoyé !');
            }, (error) => {
                console.error('Erreur Email', error);
            });

            // Redirection Succès
            navigate('/succes-inscription', {
                state: {
                    course: {
                        id: id,
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
            alert("❌ Erreur serveur lors de l'inscription : " + msg);
        }
    } catch (error) {
        console.error("Erreur connexion:", error);
        alert("❌ Erreur de connexion au serveur.");
    }
  };

  // --- RENDU ---
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
            
            {/* --- BLOC PAIEMENT MODIFIÉ (SANS BANDEAU BLEU) --- */}
            <div className="payment-block">
                <div className="payment-title mb-3"><CreditCard size={20}/> Paiement sécurisé</div>

                {/* GESTION D'ERREUR DU BACKEND */}
                {backendError ? (
                    <div className="alert alert-danger">
                        ❌ Impossible de contacter le serveur de paiement.<br/>
                        Veuillez vérifier que le Backend est bien lancé.
                    </div>
                ) : clientSecret ? (
                     // Affichage du formulaire Stripe si tout va bien
                     <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                         <CheckoutForm onPaymentSuccess={finaliserInscription} />
                     </Elements>
                ) : (
                    <div className="text-center py-3 text-muted">Chargement du module de paiement...</div>
                )}
                
                <button className="btn-modify-outline mt-3" onClick={() => setStep(2)}><ChevronLeft size={14}/> Modifier mes infos</button>
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