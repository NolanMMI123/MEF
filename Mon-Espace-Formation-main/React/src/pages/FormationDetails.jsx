import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Tab, Nav, Accordion, Spinner, Alert } from 'react-bootstrap';
import {
    FaClock, FaUser, FaCheckCircle, FaCreditCard,
    FaCalendarAlt, FaMapMarkerAlt, FaChalkboardTeacher,
    FaExclamationTriangle, FaArrowLeft
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { theme } from '../utils/theme';
import { catalogueData } from '../utils/data';

const FormationDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('objectifs');

    // --- LOGIQUE DE RÉCUPÉRATION DES DONNÉES (AJOUTÉE) ---
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // 1. Tenter de récupérer depuis l'API Back-end
                const response = await fetch(`http://localhost:8080/api/sessions/${id}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("Détails reçus du Back-end :", data);
                    setCourse(data);
                } else {
                    // Fallback sur les données statiques si l'API échoue ou ID introuvable
                    console.warn("API erreur, recherche locale...");
                    const localCourse = catalogueData.find(c => String(c.id) === String(id));
                    setCourse(localCourse);
                }
            } catch (error) {
                console.error("Erreur connexion API :", error);
                const localCourse = catalogueData.find(c => String(c.id) === String(id));
                setCourse(localCourse);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (loading) {
        return (
            <Container className="text-center py-5" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Chargement des détails...</p>
            </Container>
        );
    }

    if (!course) {
        return (
            <Container className="py-5 text-center" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h2 className="mb-3">Formation non trouvée</h2>
                <p className="text-muted mb-4">La formation demandée n'existe pas ou a été retirée.</p>
                {/* CORRECTION ICI : /catalogue -> /formations */}
                <Link to="/formations" className="btn btn-primary px-4 py-2 rounded-pill">
                    <FaArrowLeft className="me-2" /> Retour au catalogue
                </Link>
            </Container>
        );
    }

    return (
        <div style={{ fontFamily: theme.fonts.main, backgroundColor: theme.colors.bgLight, minHeight: '100vh' }}>
            {/* Header Section */}
            <section style={{ backgroundColor: theme.colors.primary, color: 'white', padding: '80px 0' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={8}>
                            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                                <div className="mb-3">
                                     {/* CORRECTION ICI : /catalogue -> /formations */}
                                     <Link to="/formations" className="text-white-50 text-decoration-none small mb-3 d-inline-block">
                                        <FaArrowLeft className="me-1" /> Retour
                                     </Link>
                                </div>
                                
                                <Badge bg="warning" text="dark" className="mb-3 px-3 py-2 fw-bold rounded-pill">
                                    {course.category || "Informatique"}
                                </Badge>
                                <h1 className="display-5 fw-bold mb-4">{course.title}</h1>
                                <p className="lead mb-4 opacity-75" style={{ maxWidth: '90%' }}>
                                    {course.desc || course.description || "Description complète de la formation à venir."}
                                </p>
                                <div className="d-flex flex-wrap gap-4 text-white-50">
                                    <div className="d-flex align-items-center gap-2">
                                        <FaClock className="text-warning" />
                                        <span>{course.time || course.duration || "N/C"}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <FaUser className="text-warning" />
                                        <span>{course.level || "Tous niveaux"}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-warning fw-bold">€</span>
                                        <span>{course.price} TTC</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Col>
                        <Col lg={4} className="d-none d-lg-block">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-3 shadow-lg p-1"
                                style={{ height: '250px' }}
                            >
                                {/* Placeholder for Video/Image */}
                                <div className="w-100 h-100 bg-light rounded-2 d-flex align-items-center justify-content-center text-muted">
                                    <span>Aperçu de la formation</span>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="py-5" style={{ marginTop: '-40px' }}>
                <Row className="g-4">
                    {/* Main Content */}
                    <Col lg={8}>
                        <div className="bg-white rounded-3 shadow-sm p-4 h-100">
                            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                <Nav variant="pills" className="nav-fill mb-4 bg-light rounded-pill p-1 gap-1">
                                    <Nav.Item>
                                        <Nav.Link eventKey="objectifs" className="rounded-pill border-0" style={{ cursor: 'pointer', color: activeTab === 'objectifs' ? 'white' : theme.colors.textDark, backgroundColor: activeTab === 'objectifs' ? theme.colors.primary : 'transparent' }}>
                                            Objectifs
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="programme" className="rounded-pill border-0" style={{ cursor: 'pointer', color: activeTab === 'programme' ? 'white' : theme.colors.textDark, backgroundColor: activeTab === 'programme' ? theme.colors.primary : 'transparent' }}>
                                            Programme
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="prerequis" className="rounded-pill border-0" style={{ cursor: 'pointer', color: activeTab === 'prerequis' ? 'white' : theme.colors.textDark, backgroundColor: activeTab === 'prerequis' ? theme.colors.primary : 'transparent' }}>
                                            Prérequis
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Tab.Content className="p-2">
                                    <Tab.Pane eventKey="objectifs">
                                        <h3 className="fw-bold mb-4" style={{ color: theme.colors.primary }}>Objectifs de la formation</h3>
                                        <p className="text-muted mb-4">Ce que vous serez capable de faire à l'issue de cette formation</p>

                                        <div className="d-flex flex-column gap-3 mb-5">
                                            {/* Si les objectifs ne viennent pas de l'API, on met du texte générique */}
                                            {(course.objectives || ["Maîtriser les concepts clés", "Mettre en pratique via des ateliers", "Réussir la certification finale"]).map((obj, idx) => (
                                                <div key={idx} className="d-flex gap-3 align-items-start">
                                                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                                                    <span>{obj}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <h4 className="fw-bold mb-3" style={{ color: theme.colors.primary }}>Matériel fourni par TXLFORMA</h4>
                                        <div className="d-flex flex-column gap-2 text-muted small">
                                            <div className="d-flex gap-2 align-items-center">
                                                <FaCheckCircle className="text-warning" /> PC portable avec environnement pré-configuré
                                            </div>
                                            <div className="d-flex gap-2 align-items-center">
                                                <FaCheckCircle className="text-warning" /> Supports de cours numériques
                                            </div>
                                            <div className="d-flex gap-2 align-items-center">
                                                <FaCheckCircle className="text-warning" /> Exercices pratiques et corrections
                                            </div>
                                            <div className="d-flex gap-2 align-items-center">
                                                <FaCheckCircle className="text-warning" /> Accès à une plateforme de ressources en ligne pendant 6 mois
                                            </div>
                                        </div>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="programme">
                                        <div className="mb-4">
                                            <h4 className="fw-bold mb-2" style={{ color: theme.colors.primary }}>Programme détaillé</h4>
                                            <p className="text-muted small">Modules pour une maîtrise complète du sujet</p>
                                        </div>

                                        {course.program ? (
                                            <div className="d-flex flex-column gap-4">
                                                {course.program.map((module, idx) => (
                                                    <div key={idx} className="border-start border-4 ps-4 position-relative" style={{ borderColor: theme.colors.primary }}>
                                                        <div className="d-flex justify-content-between align-items-baseline mb-2">
                                                            <h5 className="fw-bold mb-0" style={{ color: theme.colors.primary }}>{module.title}</h5>
                                                            <Badge bg="light" text="dark" className="border">{module.time}</Badge>
                                                        </div>
                                                        <ul className="list-unstyled text-muted small mb-0">
                                                            {module.content.map((item, i) => (
                                                                <li key={i} className="mb-1 d-flex gap-2">
                                                                    <span className="text-warning">•</span> {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Accordion defaultActiveKey="0" flush>
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header>Module 1 : Introduction et Fondamentaux</Accordion.Header>
                                                    <Accordion.Body>
                                                        Découverte de l'écosystème, installation des outils et premiers pas pratiques.
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                                <Accordion.Item eventKey="1">
                                                    <Accordion.Header>Module 2 : Concepts Avancés</Accordion.Header>
                                                    <Accordion.Body>
                                                        Approfondissement des notions, architecture logicielle et bonnes pratiques.
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                                <Accordion.Item eventKey="2">
                                                    <Accordion.Header>Module 3 : Projet Pratique</Accordion.Header>
                                                    <Accordion.Body>
                                                        Réalisation d'un projet complet de A à Z encadré par le formateur.
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        )}
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="prerequis">
                                        <h4 className="fw-bold mb-4" style={{ color: theme.colors.primary }}>Prérequis</h4>
                                        <p className="text-muted mb-4">Compétences nécessaires pour suivre cette formation</p>

                                        <div className="d-flex flex-column gap-3 mb-5">
                                            {(course.prerequisites || ["Aisance avec l'outil informatique", "Motivation d'apprendre"]).map((req, idx) => (
                                                <div key={idx} className="d-flex gap-3 align-items-center text-muted">
                                                    <span className="fw-bold text-muted border rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px' }}>{idx + 1}</span>
                                                    <span>{req}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="alert alert-warning border-0 d-flex gap-3 align-items-start" role="alert" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                                            <FaExclamationTriangle className="mt-1 flex-shrink-0" />
                                            <div>
                                                <h6 className="fw-bold mb-1">Important</h6>
                                                <p className="mb-0 small">Les formations se déroulent exclusivement en présentiel dans nos salles équipées (ou en distanciel selon la session). Tout le matériel informatique est fourni par TXLFORMA.</p>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </div>
                    </Col>

                    {/* Sidebar */}
                    <Col lg={4}>
                        <div className="d-flex flex-column gap-4">
                            {/* Pricing Card */}
                            <Card className="border-2 border-warning shadow-sm text-center p-3" style={{ borderColor: theme.colors.accent }}>
                                <Card.Body>
                                    <h5 className="fw-bold text-primary mb-3">Tarif de la formation</h5>
                                    <div className="display-6 fw-bold mb-1">
                                        {course.price ? String(course.price).replace('€', '') : '---'}€
                                    </div>
                                    <p className="text-muted small mb-4">TTC - Paiement intégral requis</p>
                                    
                                    <Link 
                                        to={`/inscription/${course.id}`}
                                        className="btn btn-light btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                                        style={{ color: theme.colors.accent, backgroundColor: '#fff8e1' }}
                                    >
                                        <FaCreditCard /> M'inscrire maintenant
                                    </Link>

                                </Card.Body>
                            </Card>

                            {/* Sessions Card */}
                            <Card className="border-0 shadow-sm p-3">
                                <Card.Body>
                                    <h5 className="fw-bold text-primary mb-3">Prochaine session</h5>
                                    <p className="text-muted small mb-4">Date et lieu de la formation</p>

                                    <div className="d-flex flex-column gap-3">
                                        {/* On affiche les infos dynamiques de la session en cours */}
                                        <div className="border rounded-3 p-3 position-relative hover-shadow" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                                            <Badge bg="dark" className="position-absolute top-0 end-0 m-2 rounded-pill">
                                                {course.placesTotales ? `${course.placesTotales} places` : "Ouvert"}
                                            </Badge>
                                            <div className="d-flex gap-2 align-items-center fw-bold mb-2 text-dark">
                                                <FaCalendarAlt className="text-primary" /> {course.dates || course.startDate || "Dates à confirmer"}
                                            </div>
                                            <div className="small text-muted d-flex flex-column gap-1">
                                                <div className="d-flex gap-2 align-items-center"><FaMapMarkerAlt /> {course.lieu || course.location || "Distanciel"}</div>
                                                <div className="d-flex gap-2 align-items-center"><FaChalkboardTeacher /> Formateur : {course.trainerName || "Expert certifié"}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Help Card */}
                            <div className="rounded-3 p-4 text-white text-center" style={{ backgroundColor: '#0d2345' }}>
                                <h5 className="fw-bold mb-3">Besoin d'aide ?</h5>
                                <p className="small opacity-75 mb-4">Notre équipe est disponible pour répondre à vos questions sur cette formation.</p>
                                <Button variant="light" className="w-100 rounded-pill fw-medium text-dark">Nous contacter</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default FormationDetails;