import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { theme } from '../utils/theme';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Shield } from 'lucide-react';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Vérifie si l'utilisateur est connecté et son rôle à chaque changement de page
    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const role = localStorage.getItem('userRole');
        setIsLoggedIn(!!userEmail); // Devient "true" si l'email existe, "false" sinon
        setUserRole(role); // Stocke le rôle de l'utilisateur
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('userEmail'); // On supprime la session
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        navigate('/connexion');
    };

    return (
        <Navbar expand="lg" className="py-3 bg-white sticky-top shadow-sm">
            <Container>
                {/* LOGO MODIFIÉ ICI */}
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    
                    {/* 👇 C'est ici que j'ai mis ton image du dossier public 👇 */}
                    <img 
                        src="/vignette_MEF.png" 
                        alt="Logo MEF" 
                        height="50" 
                        className="d-inline-block align-top me-2" 
                    />

                    <span style={{ fontSize: '14px', color: theme.colors.textGrey, borderLeft: '1px solid #dee2e6', paddingLeft: '12px', lineHeight: '1.2' }}>
                        Mon Espace<br />Formation
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center gap-lg-4 gap-2 mt-3 mt-lg-0">
                        <Nav.Link as={Link} to="/" className="fw-medium text-dark">Accueil</Nav.Link>
                        <Nav.Link as={Link} to="/formations" className="fw-medium text-dark">Formations</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="fw-medium text-dark">A Propos</Nav.Link>
                        <Nav.Link as={Link} to="/contact" className="fw-medium text-dark">Contact</Nav.Link>

                        {/* --- ZONE INTELLIGENTE --- */}
                        {isLoggedIn ? (
                            // CAS CONNECTÉ
                            <div className="d-flex gap-2">
                                {/* Bouton Admin - visible uniquement pour les admins */}
                                {userRole === 'ROLE_ADMIN' && (
                                    <Button
                                        as={Link}
                                        to="/admin"
                                        className="fw-bold px-3 py-2 border-0 rounded-1 d-flex align-items-center gap-2"
                                        style={{ backgroundColor: '#10b981', color: 'white' }}
                                    >
                                        <Shield size={16} /> Admin
                                    </Button>
                                )}
                                <Button
                                    as={Link}
                                    to="/dashboard"
                                    className="fw-bold px-3 py-2 border-0 rounded-1 d-flex align-items-center gap-2"
                                    style={{ backgroundColor: theme.colors.primary, color: 'white' }}
                                >
                                    <User size={16} /> Mon Espace
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    className="fw-bold px-3 py-2 border-0 rounded-1 d-flex align-items-center"
                                    style={{ backgroundColor: '#f3f4f6', color: '#dc3545' }}
                                >
                                    <LogOut size={16} />
                                </Button>
                            </div>
                        ) : (
                            // CAS NON CONNECTÉ
                            <Button
                                as={Link}
                                to="/connexion"
                                className="fw-bold px-4 py-2 border-0 rounded-1"
                                style={{ backgroundColor: theme.colors.accent, color: theme.colors.white }}
                            >
                                Mon Compte
                            </Button>
                        )}
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;