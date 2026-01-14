import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Button, Card, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSearch, FaClock, FaUser, FaArrowRight, FaFilter, FaChalkboardTeacher } from 'react-icons/fa';
import { theme } from '../utils/theme';
import { catalogueData } from '../utils/data';

// animations
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Catalogue = () => {
    // --- ETAT POUR LES DONNÉES ---
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- RECUPERATION DU BACK-END AVEC FILTRE ---
    useEffect(() => {
        const fetchFormations = async () => {
            try {
                // 1. Récupérer TOUTES les sessions depuis le Back-end
                const sessionsRes = await fetch('/api/sessions');
                
                if (!sessionsRes.ok) throw new Error("Erreur API Sessions");
                
                const sessionsData = await sessionsRes.json();
                
                // 2. Vérifier si un utilisateur est connecté
                const storedUser = localStorage.getItem('user');

                if (storedUser) {
                    const currentUser = JSON.parse(storedUser);
                    
                    // 3. Récupérer SES inscriptions
                    // On utilise l'ID trouvé (id, _id ou userId)
                    const userId = currentUser.id || currentUser._id || currentUser.userId;

                    if (userId) {
                        const inscriptionsRes = await fetch(`/api/inscriptions/user/${userId}`);
                        
                        if (inscriptionsRes.ok) {
                            const inscriptionsData = await inscriptionsRes.json();
                            
                            // 4. FILTRAGE : On enlève les sessions où il est déjà inscrit
                            const sessionIdsInscrites = inscriptionsData.map(insc => insc.sessionId);
                            
                            const formationsNonInscrites = sessionsData.filter(session => 
                                !sessionIdsInscrites.includes(session.id)
                            );
                            
                            setFormations(formationsNonInscrites);
                        } else {
                            // Si erreur inscriptions, on montre tout par sécurité
                            setFormations(sessionsData);
                        }
                    } else {
                        // ID introuvable dans le localStorage -> on montre tout
                        setFormations(sessionsData);
                    }
                } else {
                    // Si pas connecté, on montre tout le catalogue
                    setFormations(sessionsData);
                }

            } catch (error) {
                console.error("Erreur API, utilisation des données statiques :", error);
                // Fallback données statiques si le serveur est éteint
                setFormations(catalogueData);
            } finally {
                setLoading(false);
            }
        };

        fetchFormations();
    }, []);

    return (
        <div style={{ fontFamily: theme.fonts.main, backgroundColor: theme.colors.bgLight, minHeight: '100vh' }}>

            <section style={{ backgroundColor: theme.colors.primary, padding: '80px 0 100px 0', color: 'white' }}>
                <Container className="text-center">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="fw-bold display-5 mb-3">Catalogue de Formations</h1>
                        <p className="lead opacity-75 mb-5 mx-auto" style={{ maxWidth: '600px' }}>
                            Découvrez nos {formations.length} formations dans le domaine du numérique et des nouvelles technologies
                        </p>

                        <div className="bg-white p-2 rounded-3 mx-auto shadow-lg" style={{ maxWidth: '700px' }}>
                            <InputGroup size="lg" className="border-0">
                                <InputGroup.Text className="bg-white border-0 text-muted"><FaSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Rechercher une formation..."
                                    className="border-0 shadow-none"
                                    style={{ fontSize: '0.95rem' }}
                                />
                            </InputGroup>
                        </div>
                    </motion.div>
                </Container>
            </section>

            <div className="bg-white border-bottom sticky-top shadow-sm" style={{ top: '70px', zIndex: 900 }}>
                <Container className="py-3">
                    <Row className="g-2 align-items-center">
                        <Col xs="auto">
                            <Button variant="outline-dark" size="sm" className="d-flex align-items-center gap-2 fw-medium rounded-1 px-3">
                                <FaFilter size={12} /> Filtres avancés
                            </Button>
                        </Col>
                        <Col>
                            <Row className="g-2">
                                {['Domaine', 'Durée', 'Difficulté', 'Tarification', 'Disponibilité'].map((filter, i) => (
                                    <Col key={i} xs="auto" className="d-none d-lg-block">
                                        <Form.Select size="sm" className="bg-light border-0 rounded-1" style={{ cursor: 'pointer', minWidth: '130px' }}>
                                            <option>Tous les {filter.toLowerCase()}s</option>
                                        </Form.Select>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="py-5">
                <div className="mb-4 text-muted">
                    {loading ? "Chargement des données..." : `${formations.length} formations trouvées`}
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                        <Row className="g-4 align-items-stretch">
                            {/* BOUCLE SUR LES FORMATIONS FILTRÉES */}
                            {formations.map((formation) => (
                                <Col lg={4} md={6} key={formation.id}>
                                    <motion.div
                                        variants={fadeInUp}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                        className="h-100"
                                    >
                                        <Card className="h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>

                                            <div className="position-relative" style={{ height: '140px', backgroundColor: '#e9ecef', overflow: 'hidden' }}>
                                                {formation.imageUrl ? (
                                                    <img 
                                                        src={formation.imageUrl} 
                                                        alt={formation.title || 'Formation'} 
                                                        style={{ 
                                                            width: '100%', 
                                                            height: '100%', 
                                                            objectFit: 'cover' 
                                                        }}
                                                    />
                                                ) : null}
                                                <span
                                                    className="position-absolute top-0 end-0 m-3 px-2 py-1 rounded-1 fw-bold text-dark"
                                                    style={{ backgroundColor: theme.colors.accent, fontSize: '0.7rem', zIndex: 1 }}
                                                >
                                                    {formation.category || "Informatique"}
                                                </span>

                                                <span className="position-absolute bottom-0 start-0 m-3 px-2 py-1 bg-white rounded-pill shadow-sm small fw-bold" style={{ fontSize: '0.7rem', zIndex: 1 }}>
                                                    {formation.sessions || formation.placesTotales || 10} places disponibles
                                                </span>
                                            </div>

                                            <Card.Body className="d-flex flex-column p-4">
                                                <Card.Title className="fw-bold mb-3 h6" style={{ color: theme.colors.primary, lineHeight: '1.4' }}>
                                                    {formation.title}
                                                </Card.Title>

                                                <Card.Text className="text-muted small mb-4 flex-grow-1" style={{ fontSize: '0.85rem' }}>
                                                    {formation.desc ? formation.desc.substring(0, 100) + '...' : "Description non disponible"}
                                                </Card.Text>

                                                <div className="d-flex gap-3 mb-4 small text-muted">
                                                    <div className="d-flex align-items-center gap-1">
                                                        <FaClock className="text-primary" /> {formation.time || formation.duration || "N/C"}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-1">
                                                        <FaUser className="text-primary" /> {formation.level || "Tous niveaux"}
                                                    </div>
                                                </div>
                                                
                                                {formation.trainerName && (
                                                    <div className="mb-3 small">
                                                        <div className="d-flex align-items-center gap-2 text-muted">
                                                            <FaChalkboardTeacher className="text-primary" style={{ fontSize: '0.9rem' }} />
                                                            <span><strong>Formateur:</strong> {formation.trainerName}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                                                    <span className="fw-bold fs-5" style={{ color: theme.colors.accentText || '#0d6efd' }}>
                                                        {formation.price}€ <span className="fs-6 text-muted fw-normal">TTC</span>
                                                    </span>
                                                </div>
                                            </Card.Body>

                                            <Button
                                                as={Link}
                                                to={`/formations/${formation.id}`}
                                                variant="primary"
                                                className="w-100 rounded-0 py-2 d-flex justify-content-center align-items-center gap-2 fw-medium"
                                                style={{ backgroundColor: theme.colors.primary, border: 'none' }}
                                            >
                                                Voir les détails <FaArrowRight size={12} />
                                            </Button>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </motion.div>
                )}
            </Container>
        </div>
    );
};

export default Catalogue;