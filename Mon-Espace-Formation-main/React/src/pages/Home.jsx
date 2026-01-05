import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaBullseye, FaLightbulb, FaUsers, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { theme } from '../utils/theme';
import { formationsData, featuresData } from '../utils/data';


const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardHover = {
    hover: { y: -8, transition: { type: "spring", stiffness: 300 } }
};

const Home = () => {
    return (
        <div style={{ fontFamily: theme.fonts.main, overflowX: 'hidden' }}>

            
            <section style={{ backgroundColor: theme.colors.primary, color: 'white', padding: '100px 0 80px 0' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-5 mb-lg-0">
                            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                                <motion.span variants={fadeInUp} className="badge mb-3 px-3 py-2 rounded-pill text-dark fw-bold" style={{ backgroundColor: theme.colors.accent }}>
                                    Formations Professionnelles
                                </motion.span>
                                <motion.h1 variants={fadeInUp} className="display-4 fw-bold mb-4" style={{ lineHeight: 1.15 }}>
                                    Développez vos compétences dans le <span style={{ color: theme.colors.accent }}>numérique</span>
                                </motion.h1>
                                <motion.p variants={fadeInUp} className="lead mb-5 opacity-75" style={{ fontSize: '1.1rem' }}>
                                    TXLFORMA vous propose une large gamme de formations dans les nouvelles technologies. Boostez votre carrière avec nos experts.
                                </motion.p>
                                <motion.div variants={fadeInUp} className="d-flex flex-wrap gap-3">
                                   <Button 
    as={Link}              
    to="/formations"        
    size="lg" 
    className="fw-bold rounded-1 px-4 border-0 text-white text-decoration-none" 
    style={{ backgroundColor: theme.colors.accent }}
>
    Découvrir les formations →
</Button>
                                    <Link to="/salle" style={{ textDecoration: "none" }}>
                                        <Button variant="light" size="lg" className="fw-bold rounded-1 px-4" style={{ color: theme.colors.primary }}>
                                            Découvrir nos salles
                                        </Button>
                                    </Link>
                                </motion.div>

                                
                                <motion.div variants={fadeInUp} className="d-flex gap-5 mt-5 pt-4 border-top border-white border-opacity-25">
                                    {[
                                        { num: "7+", label: "Catégories de formations" },
                                        { num: "100+", label: "Étudiants formés" },
                                        { num: "95%", label: "Taux de satisfaction" }
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <h3 className="fw-bold mb-0 text-warning">{stat.num}</h3>
                                            <small className="opacity-75" style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>{stat.label}</small>
                                        </div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </Col>

                        
                        <Col lg={6} className="d-none d-lg-block">
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    borderRadius: '24px',
                                    padding: '40px',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="d-flex align-items-center gap-3 mb-4 last-mb-0">
                                        <div style={{ width: 45, height: 45, background: theme.colors.accent, borderRadius: 10 }}></div>
                                        <div className="flex-grow-1">
                                            <div style={{ height: 12, background: 'rgba(255,255,255,0.3)', borderRadius: 6, marginBottom: 8, width: '70%' }}></div>
                                            <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, width: '40%' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

           
            <section className="py-5" style={{ backgroundColor: theme.colors.bgLight }} id="formations">
                <Container className="py-5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-5">
                        <h2 className="display-6 fw-bold" style={{ color: theme.colors.primary }}>Nos Formations</h2>
                        <p className="text-muted">Découvrez notre large gamme de formations technologiques</p>
                    </motion.div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <Row className="g-4">
                            {formationsData.map((f) => (
                                <Col md={6} lg={4} key={f.id}>
                                    <motion.div variants={fadeInUp} whileHover="hover">
                                        <motion.div variants={cardHover}>
                                            <Card className={`h-100 border-0 shadow-sm ${f.highlight ? 'border-2 border-warning' : ''}`} style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                                <Card.Body className="p-4 d-flex flex-column align-items-start">
                                                    <div className="d-flex align-items-center justify-content-center mb-4 text-white rounded-3 shadow-sm"
                                                        style={{ width: '56px', height: '56px', backgroundColor: f.color, fontSize: '1.6rem' }}>
                                                        {f.icon}
                                                    </div>
                                                    <Card.Title className="fw-bold mb-3 h5" style={{ color: theme.colors.primary }}>{f.title}</Card.Title>
                                                    <Card.Text className="text-muted small mb-4 flex-grow-1">{f.desc}</Card.Text>
                                                    <span className="fw-bold small text-decoration-underline" style={{ color: theme.colors.primary, cursor: 'pointer' }}>En savoir plus</span>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                        <div className="text-center mt-5">
                            <Button
                                as={Link}
                                to="/formations"
                                size="lg"
                                className="px-5 py-2 border-0 rounded-1"
                                style={{ backgroundColor: theme.colors.primary, textDecoration: 'none' }}
                            >
                                Voir toutes les formations
                            </Button>
                        </div>
                    </motion.div>
                </Container>
            </section>

            
            <section className="py-5 bg-white" id="apropos">
                <Container className="py-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold display-6" style={{ color: theme.colors.primary }}>À propos de TXLFORMA</h2>
                        <p className="text-muted">Une équipe d'experts passionnés au service de votre réussite</p>
                    </div>
                    <Row className="gy-5">
                        <Col lg={6}>
                            {[
                                { t: "Notre Mission", i: <FaBullseye />, d: "TXLFORMA est une entreprise fraîchement arrivée sur le marché..." },
                                { t: "Notre Vision", i: <FaLightbulb />, d: "Rendre la formation professionnelle accessible à tous..." },
                                { t: "Notre Équipe", i: <FaUsers />, d: "Un effectif de 10 personnes réparties sur différents services..." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="d-flex gap-4 mb-4"
                                >
                                    <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{ width: 64, height: 64, background: theme.colors.accent, color: theme.colors.primary, fontSize: '1.75rem' }}>
                                        {item.i}
                                    </div>
                                    <div>
                                        <h4 className="fw-bold h5" style={{ color: theme.colors.primary }}>{item.t}</h4>
                                        <p className="text-muted small mb-0">{item.d}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </Col>
                        <Col lg={6}>
                            <h3 className="h4 mb-4 fw-bold" style={{ color: theme.colors.primary }}>Les Fondateurs</h3>
                            <div className="d-flex flex-column gap-3">
                                {[
                                    { n: "Mr Roger DURAND", r: "Co-Fondateur", d: "Informaticien et spécialiste..." },
                                    { n: "Mme Alice ROMAINVILLE", r: "Co-Fondatrice", d: "Diplômée d'une école de commerce" },
                                    { n: "Mr Lionel PRIGENT", r: "Co-Fondateur", d: "Master MEEF (Métiers de l'enseignement)" }
                                ].map((p, i) => (
                                    <motion.div key={i} whileHover={{ x: 5 }} className="p-3 rounded-3 bg-light" style={{ borderLeft: `4px solid ${theme.colors.accent}` }}>
                                        <h5 className="fw-bold mb-1" style={{ color: theme.colors.primary }}>{p.n}</h5>
                                        <small className="text-warning fw-bold d-block mb-1">{p.r}</small>
                                        <p className="small text-muted mb-0">{p.d}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            
            <section className="py-5" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
                <Container className="py-4">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-5">
                        <h2 className="fw-bold display-6">Pourquoi choisir Mon Espace Formation ?</h2>
                        <p className="opacity-75">Nous mettons tout en œuvre pour garantir votre réussite professionnelle</p>
                    </motion.div>

                    <Row className="g-4">
                        {featuresData.map((f, i) => (
                            <Col md={6} lg={4} key={i}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center p-4 rounded-3 h-100 d-flex flex-column align-items-center justify-content-center"
                                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    <div className="mb-4 d-flex align-items-center justify-content-center rounded-circle"
                                        style={{ width: 60, height: 60, background: theme.colors.accent, color: theme.colors.primary, fontSize: '1.5rem' }}>
                                        {f.icon}
                                    </div>
                                    <h5 className="fw-bold">{f.title}</h5>
                                    <p className="small opacity-75 mb-0">{f.desc}</p>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            
            <section className="py-5 text-center" style={{ backgroundColor: theme.colors.accent }}>
                <Container className="py-3">
                    <h2 className="fw-bold text-dark mb-3">Prêt à développer vos compétences ?</h2>
                    <p className="text-dark mb-4 mx-auto" style={{ maxWidth: '700px' }}>
                        Contactez-nous dès maintenant pour échanger sur vos besoins en formation et trouver la solution adaptée à votre projet professionnel.
                    </p>
                    <div className="d-flex justify-content-center gap-3 mb-5">
                        <Button size="lg" className="border-0 px-4 rounded-1" style={{ backgroundColor: theme.colors.primary }}>Demander un devis →</Button>
                        <Button size="lg" variant="light" className="px-4 rounded-1">Télécharger notre catalogue</Button>
                    </div>
                    <div className="fw-bold text-dark fs-5 d-flex flex-wrap justify-content-center gap-4">
                        <span><FaPhoneAlt className="me-2" /> 01 23 45 67 89</span>
                        <span><FaEnvelope className="me-2" /> contact@monespaceformation.fr</span>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default Home;