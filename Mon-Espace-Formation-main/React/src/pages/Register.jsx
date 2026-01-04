import React, { useState } from 'react';
import { Form, Button, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import AuthLayout from '../components/AuthLayout';
import { theme } from '../utils/theme';

const Register = () => {
    const navigate = useNavigate();

    // --- VARIABLES VISUELLES (TON DESIGN) ---
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // --- VARIABLES LOGIQUES (DONNÉES) ---
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    // --- FONCTION POUR SAUVEGARDER CE QUE TU TAPES ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- FONCTION D'INSCRIPTION (ENVOI AU BACKEND) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 1. Vérification simple : les mots de passe correspondent-ils ?
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas !");
            return;
        }

        // 2. Envoi des données au serveur Java
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom: formData.nom,
                    prenom: formData.prenom,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Succès !
                alert("Compte créé avec succès ! Connectez-vous maintenant.");
                navigate('/connexion');
            } else {
                // Erreur venant du serveur (ex: Email déjà pris)
                setError(data.message || "Une erreur est survenue.");
            }
        } catch (err) {
            console.error(err);
            setError("Impossible de contacter le serveur. Vérifiez qu'il est lancé.");
        }
    };

    return (
        <AuthLayout title="Inscription" subtitle="Créez votre compte en quelques étapes">
            
            {/* Zone d'affichage des erreurs (ajoutée discrètement) */}
            {error && (
                <Alert variant="danger" className="py-2 small mb-4 border-0 shadow-sm">
                    {error}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="regPrenom">
                            <Form.Label className="fw-bold small text-secondary">Prénom</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Votre prénom" 
                                className="py-2 bg-light border-0"
                                /* LOGIQUE AJOUTÉE */
                                name="prenom"
                                required
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mt-3 mt-md-0">
                        <Form.Group controlId="regNom">
                            <Form.Label className="fw-bold small text-secondary">Nom</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Votre nom" 
                                className="py-2 bg-light border-0"
                                /* LOGIQUE AJOUTÉE */
                                name="nom"
                                required
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="regEmail">
                    <Form.Label className="fw-bold small text-secondary">Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="votre.email@exemple.com" 
                        className="py-2 bg-light border-0"
                        /* LOGIQUE AJOUTÉE */
                        name="email"
                        required
                        onChange={handleChange}
                    />
                </Form.Group>

                {/* Mot de passe */}
                <Form.Group className="mb-3" controlId="regPassword">
                    <Form.Label className="fw-bold small text-secondary">Mot de passe</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="py-2 bg-light border-0 shadow-none"
                            /* LOGIQUE AJOUTÉE */
                            name="password"
                            required
                            onChange={handleChange}
                        />
                        <InputGroup.Text
                            className="bg-light border-0"
                            style={{ cursor: 'pointer', color: '#6c757d' }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>

                {/* Confirmer le mot de passe */}
                <Form.Group className="mb-4" controlId="regConfirmPassword">
                    <Form.Label className="fw-bold small text-secondary">Confirmer le mot de passe</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="py-2 bg-light border-0 shadow-none"
                            /* LOGIQUE AJOUTÉE */
                            name="confirmPassword"
                            required
                            onChange={handleChange}
                        />
                        <InputGroup.Text
                            className="bg-light border-0"
                            style={{ cursor: 'pointer', color: '#6c757d' }}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>

                {/* Checkbox Conditions */}
                <Form.Group className="mb-4" controlId="regTerms">
                    <Form.Check type="checkbox" id="terms-check">
                        <Form.Check.Input type="checkbox" required /> {/* required ajouté pour obliger à cocher */}
                        <Form.Check.Label className="small text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                            J'accepte les <a href="#" style={{ color: theme.colors.primary }}>conditions d'utilisation</a> et la <a href="#" style={{ color: theme.colors.primary }}>politique de confidentialité</a>
                        </Form.Check.Label>
                    </Form.Check>
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 fw-bold border-0 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                >
                    Créer mon compte <FaArrowRight size={12} />
                </Button>
            </Form>

            <div className="text-center mt-4 pt-3 border-top small text-muted">
                Vous avez déjà un compte ?{' '}
                <Link to="/connexion" className="fw-bold text-decoration-none" style={{ color: theme.colors.accentText || theme.colors.primary }}>
                    Se connecter
                </Link>
            </div>
            <div className="text-center mt-3 small text-muted">
                Ou s'inscrire avec
            </div>
            {/* Vous pourrez ajouter des boutons de réseaux sociaux ici plus tard */}
        </AuthLayout>
    );
};

export default Register;