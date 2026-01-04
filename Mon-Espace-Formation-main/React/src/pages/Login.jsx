import React, { useState } from 'react';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import AuthLayout from '../components/AuthLayout';
import { theme } from '../utils/theme';

const Login = () => {
    const navigate = useNavigate();
    
    // --- VARIABLES D'ÉTAT (LOGIQUE) ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // --- FONCTION DE CONNEXION ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // On efface les erreurs précédentes

        try {
            // Appel au serveur Java sur le port 8080
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Si la connexion réussit :
                console.log("Connecté :", data);
                // On sauvegarde la session (pour le dashboard)
                localStorage.setItem('user', JSON.stringify(data)); 
                // On sauvegarde aussi l'email spécifiquement pour ton dashboard actuel
                localStorage.setItem('userEmail', email);

                navigate('/dashboard'); // On redirige vers l'accueil
            } else {
                // Si le serveur refuse (mauvais mot de passe, etc.)
                setError(data.message || "Email ou mot de passe incorrect");
            }
        } catch (err) {
            console.error(err);
            setError("Impossible de contacter le serveur. Vérifiez qu'il est lancé.");
        }
    };

    // --- RENDU VISUEL (TON DESIGN INCHANGÉ) ---
    return (
        <AuthLayout title="Connexion" subtitle="Accédez à votre compte">
            
            {/* Petit message d'erreur discret si besoin */}
            {error && (
                <Alert variant="danger" className="py-2 small mb-4 border-0 shadow-sm">
                    {error}
                </Alert>
            )}

            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold small text-secondary">Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="exemple@email.com" 
                        className="py-2 bg-light border-0"
                        /* LIAISON AVEC LA LOGIQUE */
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold small text-secondary">Mot de passe</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="py-2 bg-light border-0"
                            /* LIAISON AVEC LA LOGIQUE */
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check type="checkbox" label="Se souvenir de moi" className="small text-muted" id="remember" />
                    <a href="#" className="small fw-bold text-decoration-none" style={{ color: theme.colors.primary }}>Mdp oublié ?</a>
                </div>

                <Button
                    type="submit" /* IMPORTANT: type submit pour déclencher le formulaire */
                    className="w-100 py-2 fw-bold border-0 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                >
                    Se connecter <FaArrowRight size={12} />
                </Button>
            </Form>

            <div className="text-center mt-5 pt-3 border-top small text-muted">
                Pas encore de compte ?{' '}
                <Link to="/inscription" className="fw-bold text-decoration-none" style={{ color: theme.colors.accentText || '#0d6efd' }}>
                    S'inscrire
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Login;