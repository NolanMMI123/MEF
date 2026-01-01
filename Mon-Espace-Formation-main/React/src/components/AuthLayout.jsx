import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { theme } from '../utils/theme';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',       // Force la hauteur de l'écran
            overflow: 'hidden',    // Empêche le scroll inutile
            fontFamily: theme.fonts.main,
            backgroundColor: '#fff'
        }}>
            <Row className="h-100 g-0"> {/* h-100 pour prendre toute la hauteur, g-0 pour virer les marges */}

                {/* --- COLONNE GAUCHE (Bleue - 5/12 ème de l'écran) --- */}
                <Col lg={5} className="d-none d-lg-flex flex-column align-items-center justify-content-center text-white position-relative"
                    style={{
                        backgroundColor: theme.colors.primary, // Le bleu foncé
                        zIndex: 1
                    }}>

                    {/* Cercles décoratifs en fond (Copie de ton design) */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-10%',
                        left: '-10%',
                        width: '60vh',
                        height: '60vh',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}></div>

                    <div style={{
                        position: 'absolute',
                        top: '-5%',
                        right: '-10%',
                        width: '40vh',
                        height: '40vh',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}></div>

                    {/* Contenu centré */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-center d-flex flex-column align-items-center z-2 p-5"
                    >
                        {/* Icône Utilisateur Jaune */}
                        <div className="mb-4">
                            <FaUserPlus size={80} color={theme.colors.accent} />
                        </div>

                        <h1 className="fw-bold display-5 mb-3">Rejoignez-nous</h1>
                        <p className="lead opacity-75 mb-5" style={{ maxWidth: '400px', fontSize: '1.1rem' }}>
                            Créez votre compte et découvrez toutes nos fonctionnalités
                        </p>

                        {/* Pagination dots */}
                        <div className="d-flex gap-2">
                            <span style={{ width: 10, height: 10, backgroundColor: 'white', borderRadius: '50%', opacity: 1 }}></span>
                            <span style={{ width: 10, height: 10, backgroundColor: 'white', borderRadius: '50%', opacity: 0.5 }}></span>
                            <span style={{ width: 10, height: 10, backgroundColor: 'white', borderRadius: '50%', opacity: 0.5 }}></span>
                        </div>
                    </motion.div>
                </Col>

                {/* --- COLONNE DROITE (Blanche - Formulaire - 7/12 ème) --- */}
                <Col lg={7} xs={12} className="bg-white d-flex flex-column justify-content-center align-items-center position-relative p-4">

                    {/* Lien Retour Accueil (Absolu en haut à gauche de la zone blanche) */}
                    <div className="position-absolute top-0 start-0 m-4">
                        <Link to="/" className="text-decoration-none fw-medium text-muted small">
                            ← Retour au site
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-100"
                        style={{ maxWidth: '480px' }} // Limite la largeur du formulaire pour qu'il reste beau
                    >
                        <div className="text-center mb-5">
                            <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '2rem' }}>{title}</h2>
                            <p className="text-muted">{subtitle}</p>
                        </div>

                        {children}

                    </motion.div>
                </Col>
            </Row>
        </div>
    );
};

export default AuthLayout;