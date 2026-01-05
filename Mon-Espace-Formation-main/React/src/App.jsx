import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useLocation } from 'react-router-dom';

// --- IMPORTS DES PAGES ---
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Login from './pages/Login';
import Register from './pages/Register'; // Inscription au site (Compte)
import CourseDetails from './pages/FormationDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard'; 
import Salle3D from "./pages/Salle3D";

// 👇 1. IMPORT DE LA PAGE DE PAIEMENT
import InscriptionPage from './pages/InscriptionPage'; 
// 👇 AJOUT : IMPORT DE LA PAGE DE SUCCÈS
import RegistrationSuccess from './pages/RegistrationSuccess';
// 👇 IMPORTS ADMIN
import AdminDashboard from './pages/AdminDashboard';
import ManageInscriptions from './pages/ManageInscriptions';
import ManageSessions from './pages/ManageSessions';
import ManageTrainers from './pages/ManageTrainers';
import ManageTrainings from './pages/ManageTrainings';
import AdminAttestations from './pages/AdminAttestations';
import AdminSettings from './pages/AdminSettings';
import AdminRoute from './components/AdminRoute';

function App() {
  const location = useLocation();
  
  // CORRECTION ICI : Remplacement de '/inscription-compte' par '/inscription'
  const isAuthPage = location.pathname === '/connexion' || location.pathname === '/inscription';
  
  // On cache le header/footer sur toutes les pages d'administration
  const isAdminPage = location.pathname.startsWith('/admin');

  // Scroll en haut de page à chaque changement de route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="d-flex flex-column min-vh-100">

      {!isAuthPage && !isAdminPage && <Header />}

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Salle 3D */}
          <Route path="/salle" element={<Salle3D />} />

          {/* Catalogue des formations */}
          <Route path="/formations" element={<Catalogue />} />
          
          {/* Détail d'une formation */}
          <Route path="/formations/:id" element={<CourseDetails />} />
          
          {/* 👇 2. LA ROUTE POUR LE PAIEMENT (Lien depuis CourseDetails) */}
          <Route path="/inscription/:id" element={<InscriptionPage />} />

          {/* 👇 AJOUT : LA ROUTE DE CONFIRMATION D'INSCRIPTION */}
          <Route path="/succes-inscription" element={<RegistrationSuccess />} />

          {/* Connexion / Inscription au site */}
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          
          {/* Espace membre */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Administration - Routes protégées */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/inscriptions" element={<AdminRoute><ManageInscriptions /></AdminRoute>} />
          <Route path="/admin/sessions" element={<AdminRoute><ManageSessions /></AdminRoute>} />
          <Route path="/admin/formateurs" element={<AdminRoute><ManageTrainers /></AdminRoute>} />
          <Route path="/admin/formations" element={<AdminRoute><ManageTrainings /></AdminRoute>} />
          <Route path="/admin/attestations" element={<AdminRoute><AdminAttestations /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
}

export default App;