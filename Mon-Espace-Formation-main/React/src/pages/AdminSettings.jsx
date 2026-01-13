import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { 
  Save, Shield, CreditCard, Euro, ArrowLeft, 
  Info, AlertCircle
} from 'lucide-react';
import './AdminSettings.css';

/**
 * Page de paramètres de la plateforme
 * Permet de configurer Stripe, les politiques de paiement et de remboursement
 */
const AdminSettings = () => {
  const [settings, setSettings] = useState({
    stripePublicKey: '',
    stripeSecretKey: '',
    fullPaymentRequired: true,
    cancellationDelayDays: 7,
    refundRatePercentage: 80,
    platformName: '',
    contactEmail: '',
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/settings');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des paramètres');
        }
        const data = await response.json();
        setSettings({
          stripePublicKey: data.stripePublicKey || '',
          stripeSecretKey: data.stripeSecretKey || '',
          fullPaymentRequired: data.fullPaymentRequired !== null ? data.fullPaymentRequired : true,
          cancellationDelayDays: data.cancellationDelayDays || 7,
          refundRatePercentage: data.refundRatePercentage || 80,
          platformName: data.platformName || '',
          contactEmail: data.contactEmail || '',
          maintenanceMode: data.maintenanceMode || false
        });
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8080/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde des paramètres');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Chargement des paramètres...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-settings-page">
        {/* En-tête avec retour */}
        <div className="admin-settings-header">
          <Link to="/admin" className="admin-back-link">
            <ArrowLeft size={16} />
            Retour au tableau de bord
          </Link>
          <button 
            className="admin-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>

        {/* Titre principal */}
        <div className="admin-settings-title-section">
          <h2 className="admin-settings-main-title">Paramètres de la plateforme</h2>
          <p className="admin-settings-subtitle">Configuration globale de Mon Espace Formation</p>
        </div>

        {/* Navigation latérale (simulée) */}
        <div className="admin-settings-layout">
          <div className="admin-settings-sidebar">
            <div className="admin-settings-nav-item active">
              <CreditCard size={20} />
              <span>Paiement</span>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="admin-settings-content">
            {error && (
              <div className="admin-alert admin-alert-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="admin-alert admin-alert-success">
                <Info size={20} />
                <span>Paramètres enregistrés avec succès</span>
              </div>
            )}

            {/* Configuration Stripe */}
            <div className="admin-settings-section">
              <div className="admin-settings-section-header">
                <div className="admin-settings-section-icon">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="admin-settings-section-title">Configuration Stripe</h3>
                  <p className="admin-settings-section-desc">Paramètres du système de paiement en ligne</p>
                </div>
              </div>

              <div className="admin-settings-warning-box">
                <Shield size={18} />
                <span>Les clés API Stripe sont sensibles. Ne les partagez jamais publiquement.</span>
              </div>

              <div className="admin-settings-form-group">
                <label className="admin-settings-label">Clé publique Stripe</label>
                <input
                  type="text"
                  name="stripePublicKey"
                  value={settings.stripePublicKey}
                  onChange={handleInputChange}
                  className="admin-settings-input"
                  placeholder="pk_test_..."
                />
              </div>

              <div className="admin-settings-form-group">
                <label className="admin-settings-label">Clé secrète Stripe</label>
                <input
                  type="password"
                  name="stripeSecretKey"
                  value={settings.stripeSecretKey}
                  onChange={handleInputChange}
                  className="admin-settings-input"
                  placeholder="sk_test_..."
                />
              </div>
            </div>

            {/* Paiement intégral obligatoire */}
            <div className="admin-settings-section">
              <div className="admin-settings-section-header">
                <div className="admin-settings-section-icon">
                  <Euro size={20} />
                </div>
                <div>
                  <h3 className="admin-settings-section-title">Paiement intégral obligatoire</h3>
                </div>
              </div>

              <div className="admin-settings-toggle-group">
                <div className="admin-settings-toggle-wrapper">
                  <label className="admin-settings-toggle">
                    <input
                      type="checkbox"
                      name="fullPaymentRequired"
                      checked={settings.fullPaymentRequired}
                      onChange={handleInputChange}
                      disabled={true} // Ne peut pas être désactivé selon l'image
                    />
                    <span className="admin-settings-toggle-slider"></span>
                  </label>
                </div>
                <div className="admin-settings-info-box">
                  <Info size={18} />
                  <div>
                    <p className="admin-settings-info-title">Paiement intégral obligatoire</p>
                    <p className="admin-settings-info-text">
                      Le paiement intégral est obligatoire pour valider toute inscription. 
                      Cette option ne peut pas être désactivée.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Politique d'annulation et remboursement */}
            <div className="admin-settings-section">
              <div className="admin-settings-section-header">
                <div className="admin-settings-section-icon">
                  <Euro size={20} />
                </div>
                <div>
                  <h3 className="admin-settings-section-title">Politique d'annulation et remboursement</h3>
                </div>
              </div>

              <div className="admin-settings-form-group">
                <label className="admin-settings-label">Délai d'annulation (jours)</label>
                <input
                  type="number"
                  name="cancellationDelayDays"
                  value={settings.cancellationDelayDays}
                  onChange={handleInputChange}
                  className="admin-settings-input"
                  min="0"
                />
                <p className="admin-settings-helper">Nombre de jours avant la formation pour annuler</p>
              </div>

              <div className="admin-settings-form-group">
                <label className="admin-settings-label">Taux de remboursement (%)</label>
                <input
                  type="number"
                  name="refundRatePercentage"
                  value={settings.refundRatePercentage}
                  onChange={handleInputChange}
                  className="admin-settings-input"
                  min="0"
                  max="100"
                />
                <p className="admin-settings-helper">
                  Pourcentage remboursé en cas d'annulation dans les délais
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

