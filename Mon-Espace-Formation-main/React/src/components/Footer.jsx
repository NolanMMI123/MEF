import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { theme } from '../utils/theme';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="pt-5 pb-3" style={{ backgroundColor: theme.colors.bgFooter, color: 'white', fontSize: '0.9rem' }}>
            <Container>
                <Row className="gy-4 mb-5">
                    <Col lg={4}>
                        <div className="mb-4">
                            {/* Logo qui ramène à l'accueil et remonte en haut */}
                            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                                <img 
                                    src="/logo-blanc.svg" 
                                    alt="Logo MEF Blanc" 
                                    height="40" 
                                />
                            </Link>
                        </div>
                        <p className="opacity-75 lh-lg">
                            TXLFORMA - Votre partenaire pour des formations de qualité dans le numérique et les nouvelles technologies.
                        </p>
                    </Col>
                    <Col lg={2}>
                        <h6 className="fw-bold text-warning mb-4">Liens Rapides</h6>
                        <ul className="list-unstyled opacity-75 d-flex flex-column gap-2">
                            <li>
                                <Link to="/contact" className="text-white text-decoration-none" onClick={() => window.scrollTo(0, 0)}>
                                    Nous contacter
                                </Link>
                            </li>
                            <li>
                                <Link to="/formations" className="text-white text-decoration-none" onClick={() => window.scrollTo(0, 0)}>
                                    Nos Formations
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-white text-decoration-none" onClick={() => window.scrollTo(0, 0)}>
                                    A Propos
                                </Link>
                            </li>
                        </ul>
                    </Col>
                    <Col lg={3}>
                        <h6 className="fw-bold text-warning mb-4">Nos Formations</h6>
                        <ul className="list-unstyled opacity-75 d-flex flex-column gap-2">
                            <li>Réseaux et Télécoms</li>
                            <li>Administration Système</li>
                            <li>Développement Front-End</li>
                            <li>Cybersécurité</li>
                        </ul>
                    </Col>
                    <Col lg={3}>
                        <h6 className="fw-bold text-warning mb-4">Contact</h6>
                        <ul className="list-unstyled opacity-75 d-flex flex-column gap-3">
                            <li className="d-flex gap-2"><FaMapMarkerAlt className="mt-1" /> <div>123 Avenue des Formations<br />75000 Paris, France</div></li>
                            <li className="d-flex gap-2"><FaPhoneAlt className="mt-1" /> 01 23 45 67 89</li>
                            <li className="d-flex gap-2"><FaEnvelope className="mt-1" /> contact@mef.fr</li>
                        </ul>
                    </Col>
                </Row>
                <div className="border-top border-white border-opacity-10 pt-4">
                    <Row className="align-items-center opacity-50 small">
                        <Col md={6}>
                            © 2025 Mon Espace Formation - TXLFORMA. Tous droits réservés.
                        </Col>
                        <Col md={6} className="text-md-end mt-2 mt-md-0">
                            <span className="mx-2">Mentions légales</span>
                            <span className="mx-2">Politique de confidentialité</span>
                            <span className="mx-2">CGV</span>
                        </Col>
                    </Row>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;