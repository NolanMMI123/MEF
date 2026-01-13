import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaUsers, FaPaperPlane } from 'react-icons/fa';
import { theme } from '../utils/theme';

const Contact = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        objet: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulaire soumis:', formData);
        // Ici vous pouvez ajouter la logique d'envoi du formulaire
        alert('Message envoyé avec succès !');
    };

    return (
        <div style={{ fontFamily: theme.fonts.main }}>
            {/* HERO SECTION */}
            <section style={{ backgroundColor: theme.colors.primary, color: 'white', padding: '100px 0 80px 0' }}>
                <Container>
                    <div className="align-items-center justify-content-center text-center">
                        <div>
                            <span 
                                className="badge mb-3 px-3 py-2 rounded-pill text-dark fw-bold" 
                                style={{ backgroundColor: theme.colors.accent }}
                            >
                                Contact & Support
                            </span>
                            <h1 className="display-4 fw-bold mb-4" style={{ lineHeight: 1.15 }}>
                                Contactez-<span style={{ color: theme.colors.accent }}>nous</span>
                            </h1>
                            <p className="lead mb-5 opacity-75" style={{ fontSize: '1.1rem' }}>
                                Une question sur nos formations ? Notre équipe est à votre écoute pour vous accompagner dans votre projet de formation.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* SECTION CONTACT */}
            <section style={{ padding: '80px 0', backgroundColor: theme.colors.bgLight }}>
                <Container>
                    <Row className="g-5">
                        {/* PARTIE GAUCHE - Coordonnées */}
                        <Col lg={5}>
                            <div>
                                <h2 className="fw-bold mb-4">
                                    Nos Coordonnées
                                </h2>

                                {/* Adresse */}
                                <div className="mb-4">
                                    <Card className="border-0 shadow-sm">
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-start gap-3">
                                                <div 
                                                    style={{ 
                                                        width: 50, 
                                                        height: 50, 
                                                        backgroundColor: theme.colors.primary, 
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <FaMapMarkerAlt size={20} color="white" />
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold mb-2">Adresse</h5>
                                                    <p className="mb-0 text-muted">
                                                        123 Rue de la Formation<br />
                                                        75001 Paris, France
                                                    </p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>

                                {/* Téléphone */}
                                <div className="mb-4">
                                    <Card className="border-0 shadow-sm">
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-start gap-3">
                                                <div 
                                                    style={{ 
                                                        width: 50, 
                                                        height: 50, 
                                                        backgroundColor: theme.colors.primary, 
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <FaPhoneAlt size={20} color="white" />
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold mb-2">Téléphone</h5>
                                                    <p className="mb-0 text-muted">+33 1 23 45 67 89</p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>

                                {/* Email */}
                                <div className="mb-4">
                                    <Card className="border-0 shadow-sm">
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-start gap-3">
                                                <div 
                                                    style={{ 
                                                        width: 50, 
                                                        height: 50, 
                                                        backgroundColor: theme.colors.primary, 
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <FaEnvelope size={20} color="white" />
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold mb-2">Email</h5>
                                                    <p className="mb-0 text-muted">contact@txlforma.fr</p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>

                                {/* Horaires */}
                                <div className="mb-4">
                                    <Card className="border-0 shadow-sm">
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-start gap-3">
                                                <div 
                                                    style={{ 
                                                        width: 50, 
                                                        height: 50, 
                                                        backgroundColor: theme.colors.primary, 
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <FaClock size={20} color="white" />
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold mb-2">Horaires</h5>
                                                    <p className="mb-0 text-muted">
                                                        Lundi - Vendredi : 9h - 18h<br />
                                                        Samedi - Dimanche : Fermé
                                                    </p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>

                                {/* Notre équipe dirigeante */}
                                <div className="mb-4">
                                    <Card className="border-0 shadow-sm" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-start gap-3">
                                                <div 
                                                    style={{ 
                                                        width: 50, 
                                                        height: 50, 
                                                        backgroundColor: theme.colors.accent, 
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <FaUsers size={20} color={theme.colors.primary} />
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold mb-3">Notre équipe dirigeante</h5>
                                                    <ul className="list-unstyled mb-0">
                                                        <li className="mb-2">• Roger DURAND</li>
                                                        <li className="mb-2">• Alice ROMAINVILLE</li>
                                                        <li className="mb-0">• Lionel PRIGENT</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        </Col>

                        {/* PARTIE DROITE - Formulaire */}
                        <Col lg={7}>
                            <div>
                                <Card className="border-0 shadow-sm">
                                    <Card.Body className="p-5">
                                        <h2 className="fw-bold mb-3">Envoyez-nous un message</h2>
                                        <p className="text-muted mb-4">
                                            Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                                        </p>

                                        <Form onSubmit={handleSubmit}>
                                            <Row className="g-3">
                                                {/* Nom */}
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Nom <span className="text-danger">*</span></Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="nom"
                                                            value={formData.nom}
                                                            onChange={handleChange}
                                                            placeholder="Votre nom" 
                                                            required
                                                            className="border-2"
                                                            style={{ padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                {/* Prénom */}
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Prénom <span className="text-danger">*</span></Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="prenom"
                                                            value={formData.prenom}
                                                            onChange={handleChange}
                                                            placeholder="Votre prénom" 
                                                            required
                                                            className="border-2"
                                                            style={{ padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                {/* Email */}
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Email <span className="text-danger">*</span></Form.Label>
                                                        <Form.Control 
                                                            type="email" 
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder="votre.email@exemple.fr" 
                                                            required
                                                            className="border-2"
                                                            style={{ padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                {/* Téléphone */}
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Téléphone</Form.Label>
                                                        <Form.Control 
                                                            type="tel" 
                                                            name="telephone"
                                                            value={formData.telephone}
                                                            onChange={handleChange}
                                                            placeholder="06 12 34 56 78" 
                                                            className="border-2"
                                                            style={{ padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                {/* Objet */}
                                                <Col xs={12}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Objet <span className="text-danger">*</span></Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="objet"
                                                            value={formData.objet}
                                                            onChange={handleChange}
                                                            placeholder="Objet de votre message" 
                                                            required
                                                            className="border-2"
                                                            style={{ padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                {/* Message */}
                                                <Col xs={12}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">Message <span className="text-danger">*</span></Form.Label>
                                                        <Form.Control 
                                                            as="textarea" 
                                                            rows={6}
                                                            name="message"
                                                            value={formData.message}
                                                            onChange={handleChange}
                                                            placeholder="Décrivez votre demande..." 
                                                            required
                                                            className="border-2"
                                                            style={{ padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                {/* Bouton d'envoi */}
                                                <Col xs={12}>
                                                    <div>
                                                        <Button 
                                                            type="submit" 
                                                            size="lg" 
                                                            className="w-100 fw-bold border-0 d-flex align-items-center justify-content-center gap-2 text-dark"
                                                            style={{ 
                                                                backgroundColor: theme.colors.accent,
                                                                padding: '15px',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 193, 7, 0.4)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
                                                        >
                                                            <FaPaperPlane /> Envoyer le message
                                                        </Button>
                                                    </div>
                                                </Col>

                                                {/* Légende champs obligatoires */}
                                                <Col xs={12}>
                                                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                                        <span className="text-danger">*</span> Champs obligatoires
                                                    </p>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* SECTION LOCALISATION */}
            <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
                <Container>
                    <div
                        className="text-center mb-5"
                    >
                        <h2 className="fw-bold mb-3">Notre Localisation</h2>
                        <p className="text-muted">Retrouvez-nous facilement grâce à notre carte interactive</p>
                    </div>

                    <div>
                        <Card className="border-0 shadow-lg overflow-hidden">
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991441481575!2d2.3290467!3d48.8606111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sLouvre%20Museum!5e0!3m2!1sen!2sfr!4v1234567890"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        border: 0
                                    }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Localisation TXLFORMA"
                                />
                            </div>
                        </Card>

                        <Row className="mt-4 g-3">
                            <Col md={4}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body className="text-center p-4">
                                        <div 
                                            className="mb-3"
                                            style={{ 
                                                width: 60, 
                                                height: 60, 
                                                backgroundColor: theme.colors.primary, 
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto'
                                            }}
                                        >
                                            <FaMapMarkerAlt size={24} color="white" />
                                        </div>
                                        <h5 className="fw-bold mb-2">Adresse</h5>
                                        <p className="text-muted mb-0">123 Rue de la Formation<br />75001 Paris</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body className="text-center p-4">
                                        <div 
                                            className="mb-3"
                                            style={{ 
                                                width: 60, 
                                                height: 60, 
                                                backgroundColor: theme.colors.primary, 
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto'
                                            }}
                                        >
                                            <FaPhoneAlt size={24} color="white" />
                                        </div>
                                        <h5 className="fw-bold mb-2">Téléphone</h5>
                                        <p className="text-muted mb-0">+33 1 23 45 67 89</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body className="text-center p-4">
                                        <div 
                                            className="mb-3"
                                            style={{ 
                                                width: 60, 
                                                height: 60, 
                                                backgroundColor: theme.colors.primary, 
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto'
                                            }}
                                        >
                                            <FaClock size={24} color="white" />
                                        </div>
                                        <h5 className="fw-bold mb-2">Horaires</h5>
                                        <p className="text-muted mb-0">Lun - Ven : 9h - 18h</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default Contact;