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

// 👇 1. IMPORT DE LA PAGE DE PAIEMENT
import InscriptionPage from './pages/InscriptionPage'; 

function App() {
  const location = useLocation();
  
  // On cache le header/footer sur les pages de connexion/inscription compte
  const isAuthPage = location.pathname === '/connexion' || location.pathname === '/inscription-compte';

  // Scroll en haut de page à chaque changement de route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="d-flex flex-column min-vh-100">

      {!isAuthPage && <Header />}

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Catalogue des formations */}
          <Route path="/formations" element={<Catalogue />} />
          
          {/* Détail d'une formation */}
          <Route path="/formations/:id" element={<CourseDetails />} />
          
          {/* 👇 2. LA ROUTE POUR LE PAIEMENT (Lien depuis CourseDetails) */}
          <Route path="/inscription/:id" element={<InscriptionPage />} />

          {/* Connexion / Inscription au site */}
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          
          {/* Espace membre */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;