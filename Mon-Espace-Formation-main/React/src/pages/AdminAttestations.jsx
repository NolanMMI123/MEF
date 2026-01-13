import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Toast from '../components/Toast';
import { Search, Download, FileText, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import './AdminAttestations.css';

/**
 * Page de gestion des attestations
 * Affiche les inscriptions terminées/validées pour générer des attestations
 */
const AdminAttestations = () => {
  const [attestations, setAttestations] = useState([]);
  const [filteredAttestations, setFilteredAttestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAttestations();
  }, []);

  // Filtrer les attestations par recherche
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAttestations(attestations);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = attestations.filter(att =>
        att.userName?.toLowerCase().includes(term) ||
        att.userEmail?.toLowerCase().includes(term) ||
        att.trainingTitle?.toLowerCase().includes(term) ||
        att.id?.toLowerCase().includes(term)
      );
      setFilteredAttestations(filtered);
    }
  }, [attestations, searchTerm]);

  const fetchAttestations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/attestations');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des attestations');
      }
      const data = await response.json();
      setAttestations(data);
      setFilteredAttestations(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      if (typeof dateString === 'string') {
        return dateString;
      }
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Générer un PDF d'attestation
  const generatePDF = (attestation) => {
    try {
      const doc = new jsPDF();
      
      // Couleurs
      const primaryColor = [15, 45, 92]; // Bleu marine
      
      // En-tête avec fond bleu
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 50, 'F');
      
      // Logo/Titre
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('TXLFORMA', 105, 25, { align: 'center' });
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Organisme de Formation', 105, 35, { align: 'center' });
      
      // Titre principal
      doc.setTextColor(...primaryColor);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('ATTESTATION DE FORMATION', 105, 70, { align: 'center' });
      
      // Ligne de séparation
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, 75, 190, 75);
      
      // Corps du document
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      let yPos = 90;
      
      // Texte d'introduction
      doc.text('Je soussigné(e), représentant(e) de TXLFORMA, certifie que :', 20, yPos);
      yPos += 15;
      
      // Nom du participant
      doc.setFont('helvetica', 'bold');
      doc.text(attestation.userName || 'N/A', 20, yPos);
      yPos += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.text('a suivi avec assiduité la formation :', 20, yPos);
      yPos += 10;
      
      // Titre de la formation
      doc.setFont('helvetica', 'bold');
      doc.text(attestation.trainingTitle || 'N/A', 20, yPos);
      yPos += 15;
      
      doc.setFont('helvetica', 'normal');
      if (attestation.sessionDate) {
        doc.text(`Session du ${formatDate(attestation.sessionDate)}`, 20, yPos);
        yPos += 10;
      }
      
      // Présence
      yPos += 5;
      doc.text('Taux de présence : 100%', 20, yPos);
      yPos += 15;
      
      // Date de délivrance
      const today = new Date();
      const dateStr = today.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
      doc.text(`Fait à Paris, le ${dateStr}`, 20, yPos);
      yPos += 20;
      
      // Signature
      doc.text('La Direction', 160, yPos, { align: 'right' });
      yPos += 5;
      doc.setDrawColor(0, 0, 0);
      doc.line(160, yPos, 190, yPos);
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Référence : ${attestation.id}`, 105, 280, { align: 'center' });
      
      // Sauvegarder le PDF
      const fileName = `Attestation_${attestation.userName?.replace(/\s+/g, '_') || 'N/A'}_${attestation.id}.pdf`;
      doc.save(fileName);
      
      setToast({ message: 'Attestation générée avec succès !', type: 'success' });
    } catch (err) {
      console.error('Erreur lors de la génération du PDF:', err);
      setToast({ message: 'Erreur lors de la génération du PDF', type: 'error' });
    }
  };

  // Calculer les statistiques
  const getStatistics = () => {
    const total = attestations.length;
    const currentYear = new Date().getFullYear();
    
    // Compter par trimestre (basé sur la date d'inscription)
    const quarters = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    attestations.forEach(att => {
      if (att.registrationDate) {
        const date = new Date(att.registrationDate);
        if (date.getFullYear() === currentYear) {
          const month = date.getMonth();
          if (month >= 0 && month < 3) quarters.Q1++;
          else if (month >= 3 && month < 6) quarters.Q2++;
          else if (month >= 6 && month < 9) quarters.Q3++;
          else quarters.Q4++;
        }
      }
    });
    
    return {
      total,
      quarters,
      currentYear
    };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Chargement des attestations...</p>
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
      <div className="admin-attestations-page">
        {/* En-tête */}
        <div className="attestations-header">
          <div>
            <h2 className="admin-page-title">
              Gestion des attestations
              <span className="manage-count-badge">{attestations.length}</span>
            </h2>
            <p className="admin-page-subtitle">Attestations à générer pour les formations terminées</p>
          </div>
        </div>

        {/* Section principale : Liste à gauche, Stats à droite */}
        <div className="attestations-main-section">
          {/* Section gauche : Liste des attestations */}
          <div className="attestations-list-section">
            <div className="attestations-list-card">
              <div className="attestations-list-header">
                <div>
                  <h3 className="admin-section-title">Attestations à générer</h3>
                  <p className="admin-section-subtitle">Formations terminées avec émargement complet</p>
                </div>
                <div className="attestations-search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email, formation..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredAttestations.length === 0 ? (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon">📜</div>
                  <p className="admin-empty-title">Aucune attestation disponible</p>
                  <p className="admin-empty-hint">
                    {searchTerm ? 'Aucun résultat pour votre recherche' : 'Aucune formation terminée pour le moment'}
                  </p>
                </div>
              ) : (
                <div className="attestations-list">
                  {filteredAttestations.map((att) => (
                    <div key={att.id} className="attestation-item">
                      <div className="attestation-user">
                        <div className="attestation-avatar">
                          {att.userName ? att.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??'}
                        </div>
                        <div className="attestation-user-info">
                          <div className="attestation-name">{att.userName || 'N/A'}</div>
                          <div className="attestation-email">{att.userEmail || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="attestation-training">
                        <div className="attestation-training-title">{att.trainingTitle || 'N/A'}</div>
                        <div className="attestation-session">Session: {formatDate(att.sessionDate) || 'N/A'}</div>
                      </div>
                      <div className="attestation-presence">
                        <span className="presence-badge">100%</span>
                      </div>
                      <div className="attestation-id">
                        <span className="id-tag">{att.id}</span>
                      </div>
                      <div className="attestation-action">
                        <button 
                          className="generate-pdf-btn"
                          onClick={() => generatePDF(att)}
                          title="Générer PDF"
                        >
                          <Download size={16} />
                          Générer PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section droite : Statistiques */}
          <div className="attestations-stats-section">
            <div className="attestations-stats-card">
              <h3 className="admin-section-title">Statistiques {stats.currentYear}</h3>
              <p className="admin-section-subtitle">Attestations générées cette année</p>
              
              {/* Total généré */}
              <div className="stats-total">
                <div className="stats-total-icon">📜</div>
                <div className="stats-total-value">{stats.total}</div>
                <div className="stats-total-label">Attestations générées</div>
              </div>

              {/* Répartition par trimestre */}
              <div className="stats-quarter-section">
                <h4 className="stats-quarter-title">Répartition par trimestre</h4>
                <div className="stats-quarter-list">
                  <div className="stats-quarter-item">
                    <div className="quarter-label">T1 {stats.currentYear}</div>
                    <div className="quarter-bar">
                      <div 
                        className="quarter-bar-fill" 
                        style={{ width: `${stats.total > 0 ? (stats.quarters.Q1 / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="quarter-value">{stats.quarters.Q1}</div>
                  </div>
                  <div className="stats-quarter-item">
                    <div className="quarter-label">T2 {stats.currentYear}</div>
                    <div className="quarter-bar">
                      <div 
                        className="quarter-bar-fill" 
                        style={{ width: `${stats.total > 0 ? (stats.quarters.Q2 / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="quarter-value">{stats.quarters.Q2}</div>
                  </div>
                  <div className="stats-quarter-item">
                    <div className="quarter-label">T3 {stats.currentYear}</div>
                    <div className="quarter-bar">
                      <div 
                        className="quarter-bar-fill" 
                        style={{ width: `${stats.total > 0 ? (stats.quarters.Q3 / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="quarter-value">{stats.quarters.Q3}</div>
                  </div>
                  <div className="stats-quarter-item">
                    <div className="quarter-label">T4 {stats.currentYear}</div>
                    <div className="quarter-bar">
                      <div 
                        className="quarter-bar-fill" 
                        style={{ width: `${stats.total > 0 ? (stats.quarters.Q4 / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="quarter-value">{stats.quarters.Q4}</div>
                  </div>
                </div>
              </div>

              {/* Bouton export */}
              <button className="export-btn">
                <Download size={16} />
                Exporter le rapport annuel
              </button>
            </div>
          </div>
        </div>
      </div>

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

export default AdminAttestations;

