import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaNetworkWired, FaServer, FaCode, FaDatabase, FaFileWord, FaShieldAlt, FaTasks, FaEnvelope, FaRegEnvelope  } from 'react-icons/fa';
import { LiaMapMarkerAltSolid } from "react-icons/lia";
import { MdOutlinePhone } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";

import { MdTaskAlt } from "react-icons/md";
import { theme } from '../utils/theme';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const About = () => {
    return (
        <div>
            <section style={{ backgroundColor: theme.colors.primary, color: 'white', padding: '100px 0 80px 0' }}> {/* Section d'introduction */}   
                <Container>
                    <div className="align-items-center justify-content-center text-center">
                        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                            <motion.span variants={fadeInUp} className="badge mb-3 px-3 py-2 rounded-pill text-dark fw-bold" style={{ backgroundColor: theme.colors.accent }}>
                                Nouvelle entreprise de formation
                            </motion.span>
                            <motion.h1 variants={fadeInUp} className="display-4 fw-bold mb-4" style={{ lineHeight: 1.15 }}>
                                A propos de <span style={{ color: theme.colors.accent }}>TXLFORMA</span>
                            </motion.h1>
                            <motion.p variants={fadeInUp} className="lead mb-5 opacity-75" style={{ fontSize: '1.1rem' }}>
                                Votre partenaire de confiance pour la formation professionnelle dans le numérique et les nouvelles technologies                                </motion.p>
                            <motion.div variants={fadeInUp} className="d-flex flex-wrap gap-3">
                            </motion.div>
                        </motion.div>
                    </div>
                </Container>
            </section>
            <section style={{ padding: '40px 0', borderBottom: '1px solid #e9ecef' }}> {/* Section des chiffres clés */}
                <Container>
                    <motion.div className="chiffres">
                        <Row className="text-center">
                            {[
                                { num: "7", label: "Domaines de formations" },
                                { num: "13+", label: "Formations Disponibles" },
                                { num: "100%", label: "Présentiel" },
                                { num: "3", label: "Fondateurs Experts" }
                            ].map((stat, i) => (
                                <Col xs={6} sm={6} md={3} key={i} className="mb-4 mb-md-0" style={{ borderTop: i === 0 || i === 1 ? '1px solid rgba(255,255,255,0.25)' : 'none', paddingTop: '15px' }}>
                                    <motion.div variants={fadeInUp}>
                                        <h3 className="fw-bold mb-2 text-warning">{stat.num}</h3>
                                        <small className="opacity-75" style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>{stat.label}</small>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </motion.div>
                </Container>
            </section>
            <section style={{ padding: '80px 0', backgroundColor: theme.colors.lightGrey }}> {/* Section Notre Histoire */}
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={7}>
                            <motion.h2 initial="hidden" animate="visible" variants={fadeInUp} className="fw-bold text-start mb-3"> Notre Histoire </motion.h2>
                            <motion.p initial="hidden" animate="visible" variants={fadeInUp} className="text-start">
                                <motion.div className='mb-3'>
                                    <span><strong>TXLFORMA</strong> est née de la volonté de trois professionnels passionnés par le numérique et la transmission des savoirs. Roger DURAND, Alice ROMAINVILLE et Lionel PRIGENT ont uni leurs expertises complémentaires pour créer un organisme de formation d'excellence.</span>
                                </motion.div>
                                <motion.div className='mb-3'>
                                    <span>Convaincus que la formation en présentiel offre la meilleure expérience d'apprentissage, nous avons fait le choix de proposer <strong>uniquement des formations en face-à-face</strong>, dans des conditions optimales.</span>
                                </motion.div>
                                <motion.div className='mb-3'>
                                    <span>Notre engagement : fournir à chaque participant le <strong>matériel professionnel nécessaire</strong></span>
                                    <span>(PC portables haute performance) pour garantir une expérience de formation de qualité, sans contrainte technique.</span>
                                </motion.div>
                                <motion.div>
                                    <span>Nous avons développé une plateforme complète "Mon Espace Formation" qui permet un suivi rigoureux des parcours, de l'inscription au paiement en ligne sécurisé via Stripe, en passant par l'émargement numérique et la délivrance d'attestations.</span>
                                </motion.div>
                            </motion.p>
                        </Col>
                        <Col lg={5} className='mt-5 pt-3'>
                            <Card className="p-4 shadow-sm border-0">
                            </Card>
                        </Col>
                        <motion.p className='border-1 border-rounded background'>"Former les talents de demain avec les technologies d'aujourd'hui"</motion.p>
                    </Row>
                </Container>
            </section>
            <section style={{ padding: '40px 0' }}> {/* Section Les Fondateurs */}
                <Container>
                    <motion.h1 initial="hidden" animate="visible" variants={fadeInUp} className='text-center'>Les Fondateurs</motion.h1>
                    <motion.p initial="hidden" animate="visible" variants={fadeInUp} className='text-center mb-5'>Trois experts passionnés au service de votre montée en compétences</motion.p>
                    <Row className="justify-content-center">
                        <Col lg={4}>
                            <div class="card shadow-sm">
                                <img src="" alt="" class="card-img-top rounded-circle mx-auto mt-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                                <div class="card-body text-center">
                                    <h5 class="card-title">Roger DURAND</h5>
                                    <h6 class="card-subtitle mb-2" style={{ color: theme.colors.accent }}>Co-fondateur & Directeur Pédagogique</h6>
                                    <p class="card-text">Expert en pédagogie digitale avec plus de 15 ans d'expérience dans la formation professionnelle.</p>
                                </div>
                            </div> 
                        </Col>
                        <Col lg={4}>
                            <div class="card shadow-sm">
                                <img src="" alt="" class="card-img-top rounded-circle mx-auto mt-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                                <div class="card-body text-center">
                                    <h5 class="card-title">Alice ROMAINVILLE</h5>
                                    <h6 class="card-subtitle mb-2" style={{ color: theme.colors.accent }}>Co-fondatrice & Directrice Technique</h6>
                                    <p class="card-text">Ingénieure système et réseau certifiée, passionnée par la transmission des savoirs techniques.</p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div class="card shadow-sm">
                                <img src="" alt="" class="card-img-top rounded-circle mx-auto mt-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                                <div class="card-body text-center">
                                    <h5 class="card-title">Lionel PRIGENT</h5>
                                    <h6 class="card-subtitle mb-2" style={{ color: theme.colors.accent }}>Co-fondateur & Directeur Développement</h6>
                                    <p class="card-text">Développeur full-stack senior et formateur certifié, spécialiste des technologies web modernes.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section style={{ padding: '40px 0' }}> {/* Section Nos Valeurs */}
                <Container>
                    <motion.h1 initial="hidden" animate="visible" variants={fadeInUp} className='text-center'>Nos Valeurs</motion.h1>
                    <motion.p initial="hidden" animate="visible" variants={fadeInUp} className='text-center mb-5'>Les pilliers qui guident notre action au quotidien</motion.p>
                    <Row className="justify-content-center">
                        <Col lg={3}>
                            <div class="card shadow-sm border-2 rounded h-100 d-flex flex-column" style={{ borderColor: '#e9ecef' }}>
                                <img src="" alt="" class="card-img-top rounded-circle mx-auto mt-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                                <div class="card-body text-center">
                                    <h5 class="card-title">Excellence Pédagique</h5>
                                    <p class="card-text">Des formations de qualité conçues par des experts métiers avec une approche pratique et opérationnelle.</p>
                                </div>
                            </div> 
                        </Col>
                        <Col lg={3}>
                            <div class="card shadow-sm border-2 rounded h-100 d-flex flex-column" style={{ borderColor: '#e9ecef' }}>
                                <img src="" alt="" class="card-img-top rounded-circle mx-auto mt-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                                <div class="card-body text-center">
                                    <h5 class="card-title">Accompagnement Personnalisé</h5>
                                    <p class="card-text">Un suivi individualisé de chaque participant pour garantir l’acquisition des compétences.</p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div class="card shadow-sm border-2 rounded h-100 d-flex flex-column" style={{ borderColor: '#e9ecef' }}>
                                <img src="" alt="" class="card-img-top rounded-circle mx-auto mt-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                                <div class="card-body text-center">
                                    <h5 class="card-title">Matériel Professionnel</h5>
                                    <p class="card-text">Tous nos participants bénéficient de PC portables performants fournis par TCLFORMA pendant la formation</p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div class="card shadow-sm border-2 rounded h-100 d-flex flex-column" style={{ borderColor: '#e9ecef' }}>
                                <img src="" alt="" class="card-img-top rounded-circle mx-auto mt-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                                <div class="card-body text-center">
                                    <h5 class="card-title">Certifications Reconnues</h5>
                                    <p class="card-text">Des attestations de formation conformes et reconnues par les organismes professionnels.</p>
                                </div>
                            </div> 
                        </Col>
                    </Row>
                </Container>
            </section>
            <section style={{ padding: '80px 0', backgroundColor: theme.colors.lightGrey }}> {/* Section Pourquoi */}
                <Container>
                    <Row className="justify-content-center text-start mb-5">
                        <Col lg={6}>
                            <Card className="p-4 shadow-sm border-0">
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <motion.div>
                                <motion.h2>Pourquoi choisir TXLFORMA ?</motion.h2>
                                <motion.p>Nous avons pensé chaque détail pour vous offrir la meilleure expérience de formation possible :</motion.p>
                                <motion.ul className="list-unstyled">
                                    <motion.li className="mb-3"><span><MdTaskAlt className="me-2" style={{ color: theme.colors.accent }} />Formations 100% en présentiel pour une meilleure interaction</span></motion.li>
                                    <motion.li className="mb-3"><span><MdTaskAlt className="me-2" style={{ color: theme.colors.accent }} />Groupes à effectif réduit pour un apprentissage optimal</span></motion.li>
                                    <motion.li className="mb-3"><span><MdTaskAlt className="me-2" style={{ color: theme.colors.accent }} />Matériel professionnel fourni (PC portables haute performance)</span></motion.li>
                                    <motion.li className="mb-3"><span><MdTaskAlt className="me-2" style={{ color: theme.colors.accent }} />Formateurs experts certifiés et issus du terrain</span></motion.li>
                                    <motion.li className="mb-3"><span><MdTaskAlt className="me-2" style={{ color: theme.colors.accent }} />Suivi pédagogique personnalisé tout au long de la formation</span></motion.li>
                                    <motion.li className="mb-3"><span><MdTaskAlt className="me-2" style={{ color: theme.colors.accent }} />Émargement numérique pour un suivi précis des présences</span></motion.li>
                                    <motion.li className="mb-3"><span><MdTaskAlt className="me-2" style={{ color: theme.colors.accent }} />Attestation de formation délivrée en fin de parcours</span></motion.li>
                                    <motion.li className="mb-3"><span><MdTaskAlt className="me-2" style={{ color: theme.colors.accent }} />Support de cours et ressources pédagogiques inclus</span></motion.li>
                                </motion.ul>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section>
                <Container>
                    <motion.h2 initial="hidden" animate="visible" variants={fadeInUp} className='text-center mb-4'>Nos Domaines d'Expertise</motion.h2>
                    <motion.p initial="hidden" animate="visible" variants={fadeInUp} className='text-center mb-5'>7 Catégories de formations pour couvrir tous vos besoins en compétences numériques</motion.p>
                    <Row className="justify-content-center">
                        {[
                            { title: "Réseaux et Télécoms", icon: <FaNetworkWired size={40} color={theme.colors.accent} /> },
                            { title: "Administration Système", icon: <FaServer size={40} color={theme.colors.accent} /> },
                            { title: "Développement Front-End", icon: <FaCode size={40} color={theme.colors.accent} /> },
                            { title: "Développement Back-End", icon: <FaDatabase size={40} color={theme.colors.accent} /> },
                            { title: "Bureautique", icon: <FaFileWord size={40} color={theme.colors.accent} /> },
                            { title: "Cybersécurité", icon: <FaShieldAlt size={40} color={theme.colors.accent} /> },
                            { title: "Conduite de Projets", icon: <FaTasks size={40} color={theme.colors.accent} /> }
                        ].map((domain, i) => (
                            <Col key={i} lg={4} md={6} className="mb-4">
                                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                                    <Card className="h-100 shadow-sm border-0 text-center p-4">
                                        <div style={{ marginBottom: '15px' }}>
                                            {domain.icon}
                                        </div>
                                        <h5 className="fw-bold">{domain.title}</h5>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
            <section style={{ backgroundColor: theme.colors.bgFooter, color: 'white', padding: '100px 0 80px 0' }}>
                <Container style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <motion.h1>Prêt à commencer votre formation ?</motion.h1>
                    <motion.p>Rejoignez TXLFORMA et donnez un nouvel élan à votre carrière dans le numérique</motion.p>
                    <motion.div>
                        <Row className="gap-3 gap-lg-0">
                            <Col xs={12} sm={12} lg={6} className="d-flex justify-content-lg-end justify-content-center"><Link to="/formations" className='btn rounded px-4 py-2' style={{ backgroundColor: theme.colors.accent, color: theme.colors.primary, textDecoration: 'none' }}><span><IoBookOutline size={20} color={theme.colors.primary} /></span> Découvrir nos formations</Link></Col>
                            <Col xs={12} sm={12} lg={6} className="d-flex justify-content-lg-start justify-content-center"><Link to="/contact" type="button" className='btn text-white rounded px-4 py-2 bg-transparent border-1  border-white'><span><FaEnvelope size={20} color={theme.colors.white} /></span> Nous contacter</Link></Col>
                        </Row>
                    </motion.div>
                    <div style={{ margin: '40px auto 0', width: '90%', maxWidth: '50%', borderBottom: '1px solid rgba(255,255,255,0.3)' }}></div>
                    <motion.div className="d-flex flex-column flex-sm-row flex-lg-row align-items-center gap-3 gap-lg-4 mt-5 text-center justify-content-center flex-wrap">
                        <motion.p>
                            <span><FaEnvelope size={20} color={theme.colors.accent} /></span>
                            contact@txlforma.fr
                        </motion.p>
                        <motion.p>
                            <span><MdOutlinePhone  size={20} color={theme.colors.accent} /></span>
                            06 12 34 56 78
                        </motion.p>
                        <motion.p>
                            <span><LiaMapMarkerAltSolid  size={20} color={theme.colors.accent} /></span>
                            123 Rue de la Formation, 75000 Paris
                        </motion.p>
                    </motion.div>
                </Container>
            </section>
        </div>
    );
};

export default About;